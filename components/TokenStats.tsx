"use client";

import { useCallback, useEffect, useState } from "react";
import { IS_LAUNCHED, SITE } from "@/lib/config";
import { formatCompact, formatPrice, formatUsd } from "@/lib/format";
import { ExternalIcon } from "./Icons";
import { CopyCa } from "./CopyCa";

type Stats = {
  priceUsd: number | null;
  change24h: number | null;
  liquidityUsd: number | null;
  volume24h: number | null;
  marketCap: number | null;
  supply: number | null;
};

function Cell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "up" | "down";
}) {
  return (
    <div className="flex shrink-0 items-baseline gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--text-faint)]">
        {label}
      </span>
      <span
        className="text-xs font-semibold tabular-nums"
        style={{
          color:
            tone === "up"
              ? "var(--up)"
              : tone === "down"
                ? "var(--down)"
                : "var(--text)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

/** Pre-launch strip: no numbers to show, so it says what happens next instead. */
function PreLaunchStrip() {
  return (
    <div className="flex items-center gap-3 overflow-x-auto border-b border-[var(--border)] px-3 py-2 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="size-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
          Pre-launch
        </span>
      </div>

      <span className="shrink-0 text-xs text-[var(--text-muted)]">
        {SITE.ticker} hasn&apos;t launched — there is no contract address yet.
        <span className="hidden sm:inline">
          {" "}
          Anyone showing you one is lying.
        </span>
      </span>

      <div className="ml-auto flex shrink-0 items-center gap-2 pl-3">
        <CopyCa compact />
        <a
          href={SITE.links.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text)] sm:inline-flex"
        >
          Follow for the CA
          <ExternalIcon className="size-3" />
        </a>
      </div>
    </div>
  );
}

/** Split out so the pre-launch branch never mounts the polling hooks. */
function LiveStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [live, setLive] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/token", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as Stats;
      setStats(data);
      setLive(data.priceUsd != null);
    } catch {
      /* quiet — the strip just shows placeholders */
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 45_000);
    return () => clearInterval(id);
  }, [load]);

  const change = stats?.change24h ?? null;
  const tone = change == null ? undefined : change >= 0 ? "up" : "down";

  return (
    <div className="flex items-center gap-4 overflow-x-auto border-b border-[var(--border)] px-3 py-2 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex shrink-0 items-center gap-1.5">
        <span
          className="size-1.5 rounded-full"
          style={{
            background: live ? "var(--up)" : "var(--text-faint)",
            boxShadow: live ? "0 0 8px var(--up)" : "none",
          }}
        />
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-faint)]">
          {live ? "Live" : "Solana"}
        </span>
      </div>

      <Cell label="Price" value={formatPrice(stats?.priceUsd)} />
      <Cell
        label="24h"
        value={change == null ? "—" : `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`}
        tone={tone}
      />
      <Cell label="MCap" value={formatUsd(stats?.marketCap)} />
      <Cell label="Liq" value={formatUsd(stats?.liquidityUsd)} />
      <Cell label="Vol 24h" value={formatUsd(stats?.volume24h)} />
      <Cell label="Supply" value={formatCompact(stats?.supply)} />

      <div className="ml-auto flex shrink-0 items-center gap-2 pl-3">
        <CopyCa compact />
        <a
          href={SITE.links.stonkfun ?? SITE.links.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text)] sm:inline-flex"
        >
          stonkfun
          <ExternalIcon className="size-3" />
        </a>
      </div>
    </div>
  );
}

export function TokenStats() {
  return IS_LAUNCHED ? <LiveStats /> : <PreLaunchStrip />;
}
