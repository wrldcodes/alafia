import { cn } from '@/lib/utils'

type IconColor = 'teal' | 'amber' | 'blue' | 'earth' | 'red'

interface StatCardProps {
  label: string
  value: string | number
  delta?: string
  deltaType?: 'up' | 'neutral' | 'down'
  icon: React.ReactNode
  iconColor?: IconColor
  className?: string
}

const iconColors: Record<IconColor, string> = {
  teal:  'bg-teal-50 text-teal-600',
  amber: 'bg-amber-50 text-amber-700',
  blue:  'bg-blue-50  text-blue-600',
  earth: 'bg-earth-50 text-earth-600',
  red:   'bg-red-50   text-red-600',
}

const deltaColors = {
  up:      'bg-teal-50  text-teal-700',
  neutral: 'bg-sand-100 text-slate-600',
  down:    'bg-red-50   text-red-600',
}

/**
 * StatCard — dashboard metric tile with icon, value, label, and optional delta.
 */
export function StatCard({
  label,
  value,
  delta,
  deltaType = 'neutral',
  icon,
  iconColor = 'teal',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-sand-200 rounded-[18px] p-5 flex flex-col gap-3',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            'w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0',
            iconColors[iconColor]
          )}
        >
          {icon}
        </div>
        {delta && (
          <span
            className={cn(
              'text-[11px] font-medium px-2 py-0.5 rounded-full',
              deltaColors[deltaType]
            )}
          >
            {delta}
          </span>
        )}
      </div>
      <div>
        <div className="font-display text-[28px] text-teal-900 leading-none">
          {value}
        </div>
        <div className="text-xs font-light text-slate-400 mt-1">{label}</div>
      </div>
    </div>
  )
}
