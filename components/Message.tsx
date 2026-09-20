"use client";

import Image from "next/image";
import { useState } from "react";
import { Markdown } from "./Markdown";
import { CheckIcon, CopyIcon, RefreshIcon } from "./Icons";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function Avatar({ size = 32 }: { size?: number }) {
  return (
    <span
      className="relative block shrink-0 overflow-hidden rounded-full ring-1 ring-[var(--border)]"
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.png"
        alt="OpenINU"
        fill
        sizes={`${size}px`}
        className="object-cover"
        priority
      />
    </span>
  );
}

export function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-2">
      {["dot-1", "dot-2", "dot-3"].map((c) => (
        <span key={c} className={`size-1.5 rounded-full bg-[var(--text)] ${c}`} />
      ))}
    </span>
  );
}

export function MessageRow({
  message,
  streaming,
  onRegenerate,
}: {
  message: ChatMessage;
  streaming?: boolean;
  onRegenerate?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  if (message.role === "user") {
    return (
      <div className="animate-in-up flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-3xl bg-[var(--bg-elevated)] px-5 py-2.5 text-[15px] leading-7 sm:max-w-[75%]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in-up group flex gap-3 sm:gap-4">
      <Avatar />
      <div className="min-w-0 flex-1 pt-0.5">
        {message.content ? (
          <Markdown>{message.content}</Markdown>
        ) : streaming ? (
          <TypingDots />
        ) : null}

        {!streaming && message.content && (
          <div className="mt-2 flex items-center gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
            <button
              onClick={copy}
              aria-label="Copy"
              className="rounded-lg p-1.5 text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text)]"
            >
              {copied ? (
                <CheckIcon className="size-4" />
              ) : (
                <CopyIcon className="size-4" />
              )}
            </button>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                aria-label="Regenerate"
                className="rounded-lg p-1.5 text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text)]"
              >
                <RefreshIcon className="size-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
