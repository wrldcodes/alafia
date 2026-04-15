import {
  forwardRef,
  ButtonHTMLAttributes,
  isValidElement,
  cloneElement,
} from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "outline"
  | "ghost"
  | "white"
  | "danger"
  | "linear";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-teal-700 text-white hover:bg-teal-800 shadow-[0_4px_14px_rgba(30,125,99,0.25)] hover:shadow-[0_7px_20px_rgba(30,125,99,0.3)]",
  outline:
    "bg-transparent border border-sand-200 text-slate-600 hover:border-teal-200 hover:text-teal-700",
  ghost: "bg-transparent text-teal-700 hover:bg-teal-50",
  white: "bg-white text-teal-800 hover:bg-teal-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  linear:
    "bg-gradient-to-r from-[var(--button-linear-from)] to-[var(--button-linear-to)] text-white hover:from-[var(--button-linear-hover-from)] hover:to-[var(--button-linear-hover-to)]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-xs rounded-full gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-full gap-2",
  lg: "px-8 py-3.5 text-base rounded-full gap-2",
};

/**
 * Button — primary interactive element across Aláfíà.
 * Supports multiple variants, sizes, loading state, and full width.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      "inline-flex items-center justify-center font-body font-medium",
      "transition-all duration-200 cursor-pointer select-none",
      "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none",
      "-translate-y-0 hover:-translate-y-px active:translate-y-0",
      variants[variant],
      sizes[size],
      fullWidth && "w-full",
      className,
    );

    if (asChild && isValidElement(children)) {
      // Clone the child element (e.g., a Next `Link` or `a`) and apply button classes
      // Do not pass `asChild` down to DOM elements
      const child = children as any;
      return cloneElement(child, {
        className: cn(classes, child.props?.className),
        ref,
        disabled: disabled || loading,
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={classes}
        {...props}
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
