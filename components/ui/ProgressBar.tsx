import { cn } from '@/lib/utils'

interface ProgressBarProps {
  labels: string[]
  currentStep: number
  className?: string
}

/**
 * ProgressBar — multi-step form progress indicator.
 * Renders labelled steps with a filled track beneath.
 */
export function ProgressBar({ labels, currentStep, className }: ProgressBarProps) {
  const percent = Math.round((currentStep / labels.length) * 100)

  return (
    <div className={cn('mb-9', className)}>
      <div className="flex justify-between mb-2">
        {labels.map((label, i) => (
          <span
            key={label}
            className={cn(
              'text-xs font-medium transition-colors duration-200',
              i + 1 === currentStep ? 'text-teal-600' : 'text-slate-300'
            )}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="h-1 bg-sand-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-600 rounded-full transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
