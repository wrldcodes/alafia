import { cn } from '@/lib/utils'

export type BadgeVariant =
  | 'confirmed'
  | 'pending'
  | 'cancelled'
  | 'completed'
  | 'active'
  | 'info'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  confirmed: 'bg-teal-50 text-teal-700 before:bg-teal-400',
  active:    'bg-teal-50 text-teal-700 before:bg-teal-400',
  pending:   'bg-amber-50 text-amber-700 before:bg-amber-400',
  cancelled: 'bg-red-50  text-red-600  before:bg-red-400',
  completed: 'bg-sand-100 text-slate-600 before:bg-slate-300',
  info:      'bg-blue-50  text-blue-600  before:bg-blue-400',
}

/**
 * Badge — status indicator pill used in tables and lists.
 * Renders a coloured dot alongside the label text.
 */
export function Badge({ variant = 'info', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        "before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:flex-shrink-0",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
