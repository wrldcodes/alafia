import { forwardRef, SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  error?: string
  optional?: boolean
  options: { value: string; label: string }[]
  placeholder?: string
}

/**
 * Select — styled dropdown with label, hint, and error support.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, hint, error, optional, options, placeholder, className, id, ...props },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-medium text-slate-600">
            {label}
            {optional && (
              <span className="ml-1 text-xs font-light text-slate-400">(optional)</span>
            )}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full px-4 py-3 text-sm font-body text-slate-800',
            'bg-sand-50 border border-sand-200 rounded-xl appearance-none cursor-pointer',
            'bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%238c8f96%27 stroke-width=%272%27 stroke-linecap=%27round%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E")] bg-no-repeat bg-[right_14px_center] pr-10',
            'transition-all duration-200 outline-none',
            'focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/10',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {hint && !error && <p className="text-xs font-light text-slate-400">{hint}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
