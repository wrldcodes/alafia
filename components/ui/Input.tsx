import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  optional?: boolean
}

/**
 * Input — styled text input with optional label, hint, and error states.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, optional, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-slate-600">
            {label}
            {optional && (
              <span className="ml-1 text-xs font-light text-slate-400">(optional)</span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 text-sm font-body text-slate-800',
            'bg-sand-50 border border-sand-200 rounded-xl',
            'transition-all duration-200 outline-none',
            'placeholder:text-slate-300 placeholder:font-light',
            'focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs font-light text-slate-400">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
