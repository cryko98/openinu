"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { SITE } from "@/lib/config";
import { PRESETS } from "@/lib/presets";
import {
  BookIcon,
  ChartIcon,
  CoinIcon,
  ExternalIcon,
  MapIcon,
  NewChatIcon,
  PawIcon,
  SearchIcon,
  SidebarIcon,
  TelegramIcon,
  XIcon,
} from "./Icons";

export type ChatSummary = { id: string; title: string };

const PRESET_ICONS: Record<string, (p: React.SVGProps<SVGSVGElement>) => React.ReactElement> = {
  buy: CoinIcon,
  tokenomics: ChartIcon,
  pairing: BookIcon,
  roadmap: MapIcon,
  about: PawIcon,
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-1 pt-4 text-[11px] font-medium text-[var(--text-faint)]">
      {children}
    </div>
  );
}

export function Sidebar({
  open,
  onClose,
  onToggle,
  chats,
  activeId,
  onNewChat,
  onSelectChat,
  onPreset,
}: {
  open: boolean;
  onClose: () => void;
  onToggle: () => void;
  chats: ChatSummary[];
  activeId: string;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onPreset: (id: string) => void;
}) {
  const [query, setQuery] = useState("");

  const filteredChats = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter((c) => c.title.toLowerCase().includes(q));
  }, [chats, query]);

  const filteredPresets = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRESETS;
    return PRESETS.filter((p) => p.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <>
      {/* mobile scrim */}
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-[260px] shrink-0 flex-col bg-[var(--bg-sidebar)]",
          "transition-transform duration-200 md:relative md:z-auto md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:w-0 md:overflow-hidden",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-2.5 pt-2.5">
          <button
            onClick={onToggle}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text)]"
          >
            <SidebarIcon className="size-5" />
          </button>
          <button
            onClick={onNewChat}
            aria-label="New chat"
            className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text)]"
          >
            <NewChatIcon className="size-5" />
          </button>
        </div>

        <div className="px-2.5 pt-2">
          <button
            onClick={onNewChat}
            className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left text-sm font-medium transition hover:bg-[var(--bg-hover)]"
          >
            <span className="relative size-6 shrink-0 overflow-hidden rounded-full ring-1 ring-[var(--border)]">
              <Image src="/logo.png" alt="" fill sizes="24px" className="object-cover" />
            </span>
            New chat
          </button>

          <div className="mt-1 flex items-center gap-2 rounded-xl px-2 py-2 transition focus-within:bg-[var(--bg-hover)] hover:bg-[var(--bg-hover)]">
            <SearchIcon className="size-4 shrink-0 text-[var(--text-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-faint)]"
            />
          </div>
        </div>

        <nav className="mt-1 flex-1 overflow-y-auto px-2.5 pb-3">
          {filteredPresets.length > 0 && (
            <>
              <SectionLabel>Ask the dog</SectionLabel>
              {filteredPresets.map((p) => {
                const Icon = PRESET_ICONS[p.id] ?? PawIcon;
                return (
                  <button
                    key={p.id}
                    onClick={() => onPreset(p.id)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left text-sm transition hover:bg-[var(--bg-hover)]"
                  >
                    <Icon className="size-4 shrink-0 text-[var(--text-muted)]" />
                    <span className="truncate">{p.label}</span>
                  </button>
                );
              })}
            </>
          )}

          {filteredChats.length > 0 && (
            <>
              <SectionLabel>Chats</SectionLabel>
              {filteredChats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectChat(c.id)}
                  className={[
                    "flex w-full items-center rounded-xl px-2 py-2 text-left text-sm transition",
                    c.id === activeId
                      ? "bg-[var(--bg-hover)]"
                      : "hover:bg-[var(--bg-hover)]",
                  ].join(" ")}
                >
                  <span className="truncate">{c.title}</span>
                </button>
              ))}
            </>
          )}
        </nav>

        <div className="border-t border-[var(--border)] p-2.5">
          <a
            href={SITE.links.stonkfun}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-xl px-2 py-2 text-sm transition hover:bg-[var(--bg-hover)]"
          >
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
              <CoinIcon className="size-3.5" />
            </span>
            <span className="flex-1 truncate font-medium">Buy {SITE.ticker}</span>
            <ExternalIcon className="size-3.5 text-[var(--text-faint)]" />
          </a>

          <div className="mt-1 flex items-center gap-1 px-1">
            {[
              { href: SITE.links.dexscreener, label: "Chart", Icon: ChartIcon },
              { href: SITE.links.solscan, label: "Solscan", Icon: BookIcon },
              { href: SITE.links.twitter, label: "X", Icon: XIcon },
              { href: SITE.links.telegram, label: "Telegram", Icon: TelegramIcon },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="grid size-8 place-items-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text)]"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
