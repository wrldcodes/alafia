"use client";

// components/auth/OtpInput.tsx
// 6-digit OTP input with:
// - Auto-focus next box on entry
// - Backspace goes to previous box
// - Paste support (paste 6 digits fills all boxes)
// - Keyboard navigation
// - Error state
// - WCAG 2.2 AA accessible

import { useRef, KeyboardEvent, ClipboardEvent, useEffect } from "react";

type Props = {
  value: string[]; // array of 6 single chars
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
    // Only accept single digit
    const digit = char.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);

    // Auto-advance to next box
    if (digit && index < 5) {
      refs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (value[index]) {
        // Clear current box
        const next = [...value];
        next[index] = "";
        onChange(next);
      } else if (index > 0) {
        // Move to previous box
        refs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      refs.current[index + 1]?.focus();
    }
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

    // Focus the box after the last pasted digit
    const lastIndex = Math.min(pasted.length, 5);
    refs.current[lastIndex]?.focus();
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
              "flex-1 h-12 rounded-lg border text-center text-[20px] font-semibold outline-none",
              "transition-all duration-150 caret-[#0F6E56]",
              error
                ? "border-[#E24B4A] bg-[#fff5f5] text-[#E24B4A] focus:ring-2 focus:ring-[#E24B4A]/10"
                : filled
                  ? "border-[#0F6E56] bg-[#f0faf6] text-[#0F6E56]"
                  : active
                    ? "border-[#0F6E56] border-2 bg-white text-[#1a1a18] ring-2 ring-[#0F6E56]/8"
                    : "border-[#e8e6e0] bg-white text-[#1a1a18] focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/8",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}
