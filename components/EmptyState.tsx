"use client";

import Image from "next/image";
import { SITE, SUGGESTIONS } from "@/lib/config";

export function EmptyState({
  onPick,
  onPreset,
}: {
  onPick: (prompt: string) => void;
  onPreset: (id: string) => void;
}) {
  return (
    <div className="flex flex-col items-center px-4 pb-6 pt-8 text-center sm:pt-14">
      <div className="wag relative size-20 overflow-hidden rounded-full ring-1 ring-[var(--border)] sm:size-24">
        <Image
          src="/logo.png"
          alt={SITE.name}
          fill
          sizes="96px"
          className="object-cover"
          priority
        />
      </div>

      <h1 className="mt-5 text-[26px] font-semibold tracking-tight sm:text-[32px]">
        What can I fetch for you?
      </h1>
      <p className="mt-2 max-w-md text-sm text-[var(--text-muted)]">
        {SITE.name} is the Shiba Inu powered AI on Solana — paired to{" "}
        <span className="font-medium text-[var(--text)]">OpenAI stock</span> on
        stonkfun.
      </p>

      <div className="mt-7 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.title}
            onClick={() =>
              s.presetId ? onPreset(s.presetId) : onPick(s.prompt)
            }
            className="group rounded-2xl border border-[var(--border)] px-4 py-3 text-left transition hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)]"
          >
            <div className="text-sm font-medium">{s.title}</div>
            <div className="mt-0.5 text-xs text-[var(--text-muted)]">
              {s.subtitle}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
