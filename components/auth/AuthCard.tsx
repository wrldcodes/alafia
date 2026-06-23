"use client";

// components/auth/AuthCard.tsx
//
// Form card wrapper for auth pages. The split brand panel and page shell
// live in app/(auth)/layout.tsx — this component is only the card + footer links.

type Props = {
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthCard({ children, footer }: Props) {
  return (
    <div className="w-full">
      <div
        className={[
          "rounded-2xl border p-6 sm:p-8",
          "bg-white dark:bg-[#1a1a18]",
          "border-[#e8e6e0] dark:border-[#2c2c2a]",
          "shadow-[0_2px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_24px_rgba(0,0,0,0.3)]",
        ].join(" ")}
      >
        {children}
      </div>

      {footer && (
        <div className="mt-5 text-center text-[11px] text-[#aaa8a0] dark:text-[#555450]">
          {footer}
        </div>
      )}
    </div>
  );
}

// ── StepDots ───────────────────────────────────────────────────────────
export function StepDots({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  return (
    <div className="flex items-center gap-1.5 mb-5">
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current - 1;
        const active = i === current - 1;
        return (
          <div
            key={i}
            className={[
              "h-[3px] rounded-full transition-all duration-300",
              active ? "w-5 bg-[#0F6E56]" : "",
              done ? "w-2 bg-[#9FE1CB]" : "",
              !active && !done ? "w-2 bg-[#e8e6e0] dark:bg-[#2c2c2a]" : "",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}

// ── Field ──────────────────────────────────────────────────────────────
type FieldProps = {
  label: string;
  children: React.ReactNode;
  hint?: React.ReactNode;
};
export function Field({ label, children, hint }: FieldProps) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] font-medium text-[#5a5855] dark:text-[#888480] mb-1.5">
        {label}
      </label>
      {children}
      {hint && <div className="mt-1.5">{hint}</div>}
    </div>
  );
}

// ── AuthInput ──────────────────────────────────────────────────────────
type InputProps = {
  icon: React.ReactNode;
  trailing?: React.ReactNode;
  error?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function AuthInput({
  icon,
  trailing,
  error,
  className,
  ...props
}: InputProps) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c0bdb5] dark:text-[#555450]">
        {icon}
      </div>
      <input
        {...props}
        className={[
          "w-full pl-9 pr-9 py-2.5 rounded-lg border text-[12px] outline-none transition-all duration-150",
          "placeholder:text-[#c0bdb5] dark:placeholder:text-[#555450]",
          "text-[#1a1a18] dark:text-[#f0ede8]",
          error
            ? "border-[#E24B4A] bg-[#fff8f8] dark:bg-[#2a1818] focus:border-[#E24B4A] focus:ring-2 focus:ring-[#E24B4A]/10"
            : "border-[#e8e6e0] dark:border-[#2c2c2a] bg-white dark:bg-[#232320] focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/10",
          className ?? "",
        ].join(" ")}
      />
      {trailing && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c0bdb5] dark:text-[#555450]">
          {trailing}
        </div>
      )}
    </div>
  );
}

// ── AuthButton ─────────────────────────────────────────────────────────
type BtnProps = {
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
export function AuthButton({
  loading,
  disabled,
  children,
  className,
  ...props
}: BtnProps) {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={[
        "w-full py-2.5 rounded-lg text-[13px] font-medium flex items-center justify-center gap-2 transition-all duration-150",
        loading || disabled
          ? "bg-[#b0d4c8] text-white cursor-not-allowed"
          : "bg-[#0F6E56] text-white hover:bg-[#085041] active:scale-[.99]",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ── GhostButton ────────────────────────────────────────────────────────
export function GhostButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        "w-full py-2.5 rounded-lg text-[13px] font-medium flex items-center justify-center gap-2 transition-all duration-150",
        "border border-[#e8e6e0] dark:border-[#2c2c2a]",
        "text-[#5a5855] dark:text-[#888480] bg-transparent",
        "hover:bg-[#f5f4f0] dark:hover:bg-[#232320]",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ── ErrorBanner ────────────────────────────────────────────────────────
export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 bg-[#fff5f5] dark:bg-[#2a1818] border border-[#fecaca] dark:border-[#7a2828] rounded-lg text-[11px] text-[#b42318] dark:text-[#f08080] mb-3">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="flex-shrink-0"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {message}
    </div>
  );
}

// ── StrengthBar ────────────────────────────────────────────────────────
export function StrengthBar({ password }: { password: string }) {
  const score = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const labels = ["Too short", "Weak", "Fair", "Strong", "Very strong"];
  const colors = ["#e8e6e0", "#E24B4A", "#EF9F27", "#0F6E56", "#0a3d2e"];
  const widths = ["0%", "25%", "50%", "75%", "100%"];
  if (!password) return null;
  return (
    <div>
      <div className="h-[3px] rounded-full bg-[#e8e6e0] dark:bg-[#2c2c2a] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: widths[score], background: colors[score] }}
        />
      </div>
      <p className="text-[10px] mt-1" style={{ color: colors[score] }}>
        {labels[score]}
      </p>
    </div>
  );
}
