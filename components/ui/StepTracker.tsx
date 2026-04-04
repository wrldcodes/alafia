import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface Step {
  title: string
  subtitle: string
}

interface StepTrackerProps {
  steps: Step[]
  currentStep: number
  /** dark = white text (for dark backgrounds), light = dark text */
  theme?: 'dark' | 'light'
}

/**
 * StepTracker — vertical left-panel progress tracker for multi-step flows.
 */
export function StepTracker({ steps, currentStep, theme = 'dark' }: StepTrackerProps) {
  const isDark = theme === 'dark'

  return (
    <div className="flex flex-col">
      {steps.map((step, i) => {
        const stepNum = i + 1
        const isDone = stepNum < currentStep
        const isActive = stepNum === currentStep
        const isPending = stepNum > currentStep

        return (
          <div key={step.title} className="flex items-start gap-3.5 py-3 relative">
            {i < steps.length - 1 && (
              <div
                className={cn(
                  'absolute left-[13px] top-11 w-px h-[calc(100%-18px)]',
                  isDark ? 'bg-white/10' : 'bg-sand-200'
                )}
              />
            )}

            {/* Dot */}
            <div
              className={cn(
                'w-6.5 h-6.5 rounded-full flex-shrink-0 flex items-center justify-center',
                'text-xs font-semibold mt-0.5 transition-all duration-300',
                isDone && (isDark
                  ? 'bg-teal-400 text-teal-900'
                  : 'bg-teal-600 text-white'),
                isActive && (isDark
                  ? 'bg-white text-teal-800 shadow-[0_0_0_4px_rgba(255,255,255,0.15)]'
                  : 'bg-teal-800 text-white shadow-[0_0_0_4px_rgba(14,78,62,0.15)]'),
                isPending && (isDark
                  ? 'bg-white/8 border border-white/18 text-white/30'
                  : 'bg-sand-200 text-slate-400')
              )}
            >
              {isDone ? <Check size={11} strokeWidth={3} /> : stepNum}
            </div>

            {/* Label */}
            <div className="pt-0.5">
              <p
                className={cn(
                  'text-[13px] font-medium transition-colors duration-200',
                  isActive && (isDark ? 'text-white' : 'text-teal-800'),
                  isDone && (isDark ? 'text-teal-200' : 'text-teal-600'),
                  isPending && (isDark ? 'text-white/30' : 'text-slate-400')
                )}
              >
                {step.title}
              </p>
              <p
                className={cn(
                  'text-[11px] font-light mt-0.5',
                  isDark ? 'text-white/30' : 'text-slate-300'
                )}
              >
                {step.subtitle}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
