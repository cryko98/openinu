"use client";

import { useEffect, useRef, useState } from "react";
import { PawIcon, SendIcon, StopIcon } from "./Icons";

export function Composer({
  onSend,
  onStop,
  busy,
  autoFocus = true,
}: {
  onSend: (text: string) => void;
  onStop: () => void;
  busy: boolean;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && window.innerWidth > 768) ref.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [value]);

  const submit = () => {
    const text = value.trim();
    if (!text || busy) return;
    setValue("");
    onSend(text);
  };

  return (
    <div className="rounded-[26px] border border-[var(--border)] bg-[var(--bg-elevated)] p-2 shadow-lg transition focus-within:border-[var(--border-strong)]">
      <div className="flex items-end gap-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-full text-[var(--text-faint)]">
          <PawIcon className="size-4.5" />
        </span>

        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Ask OpenINU anything…"
          className="max-h-[220px] min-h-[36px] flex-1 resize-none bg-transparent py-2 text-[15px] leading-6 outline-none placeholder:text-[var(--text-faint)]"
        />

        {busy ? (
          <button
            onClick={onStop}
            aria-label="Stop generating"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--text)] text-[var(--bg)] transition hover:opacity-80"
          >
            <StopIcon className="size-4" />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={!value.trim()}
            aria-label="Send"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--text)] text-[var(--bg)] transition enabled:hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-25"
          >
            <SendIcon className="size-4.5" />
          </button>
        )}
      </div>
    </div>
  );
}
