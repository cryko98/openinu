"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/config";
import {
  ChevronIcon,
  MoonIcon,
  NewChatIcon,
  SidebarIcon,
  SunIcon,
} from "./Icons";

const MODELS = [
  {
    id: "4o",
    name: `${SITE.modelLabel}`,
    desc: "Great for barking, fetching and alpha",
  },
  {
    id: "mini",
    name: "OpenINU-mini",
    desc: "Smaller dog, faster zoomies",
  },
  {
    id: "o1",
    name: "OpenINU-o1 (pro)",
    desc: "Thinks for 20s, then licks the window",
  },
];

export function TopBar({
  sidebarOpen,
  onToggleSidebar,
  onNewChat,
}: {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onNewChat: () => void;
}) {
  const [menu, setMenu] = useState(false);
  const [model, setModel] = useState(MODELS[0]);
  const [light, setLight] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLight(document.documentElement.getAttribute("data-theme") === "light");
  }, []);

  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menu]);

  const toggleTheme = () => {
    const next = !light;
    setLight(next);
    const root = document.documentElement;
    if (next) root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    try {
      localStorage.setItem("openinu-theme", next ? "light" : "dark");
    } catch {
      /* ignore */
    }
  };

  return (
    <header className="flex items-center gap-1 px-2 py-2 sm:px-3">
      {!sidebarOpen && (
        <>
          <button
            onClick={onToggleSidebar}
            aria-label="Open sidebar"
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
        </>
      )}

      <div className="relative min-w-0" ref={ref}>
        <button
          onClick={() => setMenu((v) => !v)}
          className="flex min-w-0 items-center gap-1 rounded-xl px-2.5 py-1.5 text-[17px] font-medium transition hover:bg-[var(--bg-hover)]"
        >
          <span className="truncate text-[var(--text)]">
            {model.name.split("-")[0]}
          </span>
          <span className="truncate text-[var(--text-muted)]">
            {model.name.includes("-") ? model.name.slice(model.name.indexOf("-") + 1) : ""}
          </span>
          <ChevronIcon className="size-4 shrink-0 text-[var(--text-muted)]" />
        </button>

        {menu && (
          <div className="absolute left-0 top-full z-20 mt-1 w-[300px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-1.5 shadow-2xl">
            {MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setModel(m);
                  setMenu(false);
                }}
                className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[var(--bg-hover)]"
              >
                <span className="relative mt-0.5 size-6 shrink-0 overflow-hidden rounded-full ring-1 ring-[var(--border)]">
                  <Image src="/logo.png" alt="" fill sizes="24px" className="object-cover" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{m.name}</span>
                  <span className="block text-xs text-[var(--text-muted)]">
                    {m.desc}
                  </span>
                </span>
                {m.id === model.id && (
                  <span className="ml-auto mt-1 size-2 shrink-0 rounded-full bg-[var(--accent)]" />
                )}
              </button>
            ))}
            <div className="mt-1 border-t border-[var(--border)] px-3 py-2 text-[11px] text-[var(--text-faint)]">
              All three are the same dog.
            </div>
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text)]"
        >
          {light ? <MoonIcon className="size-5" /> : <SunIcon className="size-5" />}
        </button>

        <a
          href={SITE.links.stonkfun}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 whitespace-nowrap rounded-full bg-[var(--accent)] px-3.5 py-1.5 text-sm font-semibold text-white transition hover:opacity-90 sm:px-4"
        >
          Buy {SITE.ticker}
        </a>
      </div>
    </header>
  );
}
