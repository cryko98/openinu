"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SITE } from "@/lib/config";
import { PRESET_MAP } from "@/lib/presets";
import { Composer } from "./Composer";
import { EmptyState } from "./EmptyState";
import { MessageRow, type ChatMessage } from "./Message";
import { Sidebar, type ChatSummary } from "./Sidebar";
import { TokenStats } from "./TokenStats";
import { TopBar } from "./TopBar";

type Chat = { id: string; title: string; messages: ChatMessage[] };

const STORAGE_KEY = "openinu-chats-v1";
const uid = () => Math.random().toString(36).slice(2, 10);

function newChat(): Chat {
  return { id: uid(), title: "New chat", messages: [] };
}

function titleFrom(text: string) {
  const t = text.trim().replace(/\s+/g, " ");
  return t.length > 38 ? `${t.slice(0, 38)}…` : t;
}

export function ChatApp() {
  const [chats, setChats] = useState<Chat[]>([newChat()]);
  const [activeId, setActiveId] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const localTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  /* ---------- persistence ---------- */
  useEffect(() => {
    let restored: Chat[] | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Chat[];
        if (Array.isArray(parsed) && parsed.length) restored = parsed;
      }
    } catch {
      /* ignore */
    }
    const list = restored ?? [newChat()];
    setChats(list);
    setActiveId(list[0].id);
    setSidebarOpen(window.innerWidth >= 768);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const trimmed = chats
        .filter((c) => c.messages.length)
        .slice(0, 30);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      /* ignore */
    }
  }, [chats, hydrated]);

  const active = useMemo(
    () => chats.find((c) => c.id === activeId) ?? chats[0],
    [chats, activeId]
  );

  const summaries: ChatSummary[] = useMemo(
    () =>
      chats
        .filter((c) => c.messages.length > 0)
        .map((c) => ({ id: c.id, title: c.title })),
    [chats]
  );

  /* ---------- scrolling ---------- */
  const scrollToBottom = useCallback((smooth = false) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      stickToBottom.current =
        el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (stickToBottom.current) scrollToBottom();
  }, [active?.messages, scrollToBottom]);

  /* ---------- mutation helpers ---------- */
  const patchActive = useCallback(
    (fn: (c: Chat) => Chat) => {
      setChats((prev) =>
        prev.map((c) => (c.id === activeId ? fn(c) : c))
      );
    },
    [activeId]
  );

  const appendDelta = useCallback(
    (msgId: string, delta: string) => {
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === msgId ? { ...m, content: m.content + delta } : m
                ),
              }
            : c
        )
      );
    },
    [activeId]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    if (localTimer.current) {
      clearTimeout(localTimer.current);
      localTimer.current = null;
    }
    setBusy(false);
  }, []);

  /* ---------- typing out a canned answer ---------- */
  const typeOut = useCallback(
    (msgId: string, text: string) => {
      const chunks = text.match(/[\s\S]{1,6}/g) ?? [text];
      let i = 0;
      setBusy(true);
      const tick = () => {
        if (i >= chunks.length) {
          localTimer.current = null;
          setBusy(false);
          return;
        }
        appendDelta(msgId, chunks[i++]);
        localTimer.current = setTimeout(tick, 12);
      };
      tick();
    },
    [appendDelta]
  );

  /* ---------- the real request ---------- */
  const runRequest = useCallback(
    async (history: ChatMessage[], msgId: string) => {
      const controller = new AbortController();
      abortRef.current = controller;
      setBusy(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            messages: history.map(({ role, content }) => ({ role, content })),
          }),
        });

        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (chunk) appendDelta(msgId, chunk);
        }
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          appendDelta(
            msgId,
            "\n\n*Whimper.* Something went wrong fetching that. Try again? 🐕"
          );
        }
      } finally {
        abortRef.current = null;
        setBusy(false);
      }
    },
    [appendDelta]
  );

  /* ---------- actions ---------- */
  const send = useCallback(
    (text: string) => {
      if (busy) return;
      const userMsg: ChatMessage = { id: uid(), role: "user", content: text };
      const botMsg: ChatMessage = { id: uid(), role: "assistant", content: "" };

      let history: ChatMessage[] = [];
      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== activeId) return c;
          history = [...c.messages, userMsg];
          return {
            ...c,
            title: c.messages.length ? c.title : titleFrom(text),
            messages: [...history, botMsg],
          };
        })
      );

      stickToBottom.current = true;
      void runRequest(history, botMsg.id);
    },
    [activeId, busy, runRequest]
  );

  const runPreset = useCallback(
    (presetId: string) => {
      const preset = PRESET_MAP[presetId];
      if (!preset || busy) return;

      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        content: preset.question,
      };
      const botMsg: ChatMessage = { id: uid(), role: "assistant", content: "" };

      setChats((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? {
                ...c,
                title: c.messages.length ? c.title : preset.label,
                messages: [...c.messages, userMsg, botMsg],
              }
            : c
        )
      );

      stickToBottom.current = true;
      if (window.innerWidth < 768) setSidebarOpen(false);
      typeOut(botMsg.id, preset.answer);
    },
    [activeId, busy, typeOut]
  );

  const regenerate = useCallback(() => {
    if (busy || !active) return;
    const msgs = active.messages;
    const lastIdx = msgs.length - 1;
    if (lastIdx < 1 || msgs[lastIdx].role !== "assistant") return;

    const history = msgs.slice(0, lastIdx);
    const botId = msgs[lastIdx].id;
    patchActive((c) => ({
      ...c,
      messages: c.messages.map((m) =>
        m.id === botId ? { ...m, content: "" } : m
      ),
    }));
    void runRequest(history, botId);
  }, [active, busy, patchActive, runRequest]);

  const startNewChat = useCallback(() => {
    stop();
    setChats((prev) => {
      const empty = prev.find((c) => c.messages.length === 0);
      if (empty) {
        setActiveId(empty.id);
        return prev;
      }
      const chat = newChat();
      setActiveId(chat.id);
      return [chat, ...prev];
    });
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, [stop]);

  const selectChat = useCallback(
    (id: string) => {
      stop();
      setActiveId(id);
      if (window.innerWidth < 768) setSidebarOpen(false);
    },
    [stop]
  );

  const messages = active?.messages ?? [];
  const empty = messages.length === 0;

  return (
    <div className="flex h-dvh overflow-hidden bg-[var(--bg)]">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen((v) => !v)}
        chats={summaries}
        activeId={activeId}
        onNewChat={startNewChat}
        onSelectChat={selectChat}
        onPreset={runPreset}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <TopBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          onNewChat={startNewChat}
        />
        <TokenStats />

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            {empty ? (
              <EmptyState onPick={send} onPreset={runPreset} />
            ) : (
              <div className="flex flex-col gap-7 py-6">
                {messages.map((m, i) => (
                  <MessageRow
                    key={m.id}
                    message={m}
                    streaming={busy && i === messages.length - 1}
                    onRegenerate={
                      m.role === "assistant" && i === messages.length - 1
                        ? regenerate
                        : undefined
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto w-full max-w-3xl shrink-0 px-4 pb-3 sm:px-6">
          <Composer onSend={send} onStop={stop} busy={busy} />
          <p className="pt-2 text-center text-[11px] leading-4 text-[var(--text-faint)]">
            {SITE.name} can make mistakes, and so can the market. {SITE.ticker} is
            a parody memecoin — not affiliated with OpenAI, not financial advice.
          </p>
        </div>
      </main>
    </div>
  );
}
