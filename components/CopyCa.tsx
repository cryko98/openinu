"use client";

import { useEffect, useState } from "react";
import { COMING_SOON, SITE } from "@/lib/config";
import { shortCa } from "@/lib/format";
import { CheckIcon, CopyIcon } from "./Icons";

export function CopyCa({
  compact = false,
  full = false,
}: {
  compact?: boolean;
  full?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const contract = SITE.contract;

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(id);
  }, [copied]);

  // Pre-launch there is nothing to copy — a static label, not a dead button.
  if (contract === null) {
    return (
      <span
        title="The contract address is announced at launch"
        className={[
          "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-dashed border-[var(--border-strong)] text-[var(--text-muted)]",
          compact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs",
        ].join(" ")}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-faint)]">
          CA
        </span>
        <span className="font-medium">{COMING_SOON}</span>
      </span>
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contract);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      onClick={copy}
      title={contract}
      aria-label="Copy contract address"
      className={[
        "group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--border)] font-mono transition",
        "hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)]",
        compact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs",
      ].join(" ")}
      style={
        copied
          ? { color: "var(--up)", borderColor: "var(--up)" }
          : { color: "var(--text-muted)" }
      }
    >
      {!compact && (
        <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-faint)]">
          CA
        </span>
      )}
      <span>{copied ? "Copied" : full ? contract : shortCa(contract, compact ? 4 : 6)}</span>
      {copied ? (
        <CheckIcon className="size-3.5" />
      ) : (
        <CopyIcon className="size-3.5 opacity-60 group-hover:opacity-100" />
      )}
    </button>
  );
}
