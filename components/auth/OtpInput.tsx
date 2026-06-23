"use client";

// components/auth/OtpInput.tsx

import { useRef, KeyboardEvent, ClipboardEvent, useEffect } from "react";

type Props = {
  value: string[];
  onChange: (val: string[]) => void;
  error?: boolean;
  autoFocusIndex?: number;
};

export default function OtpInput({
  value,
  onChange,
  error,
  autoFocusIndex = 0,
}: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[autoFocusIndex]?.focus();
  }, [autoFocusIndex]);

  function handleChange(index: number, char: string) {
    const digit = char.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);
    if (digit && index < 5) refs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (value[index]) {
        const next = [...value];
        next[index] = "";
        onChange(next);
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) refs.current[index + 1]?.focus();
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const next = [...value];
    pasted.split("").forEach((char, i) => {
      if (i < 6) next[i] = char;
    });
    onChange(next);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  }

  return (
    <div
      className="flex gap-2"
      role="group"
      aria-label="One-time password input"
    >
      {Array.from({ length: 6 }).map((_, i) => {
        const filled = !!value[i];
        const active = !filled && value.slice(0, i).every(Boolean);
        return (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value[i] ?? ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            aria-label={`Digit ${i + 1} of 6`}
            autoComplete={i === 0 ? "one-time-code" : "off"}
            className={[
              "flex-1 h-12 rounded-lg border text-center text-[20px] font-semibold outline-none transition-all duration-150",
              error
                ? "border-[#E24B4A] bg-[#fff5f5] dark:bg-[#2a1818] text-[#E24B4A] focus:ring-2 focus:ring-[#E24B4A]/10"
                : filled
                  ? "border-[#0F6E56] bg-[#f0faf6] dark:bg-[#0F3028] text-[#0F6E56]"
                  : active
                    ? "border-[#0F6E56] border-2 bg-white dark:bg-[#232320] text-[#1a1a18] dark:text-[#f0ede8] ring-2 ring-[#0F6E56]/8"
                    : "border-[#e8e6e0] dark:border-[#2c2c2a] bg-white dark:bg-[#232320] text-[#1a1a18] dark:text-[#f0ede8] focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/8",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}
