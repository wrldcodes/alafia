import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TestimonialCardProps {
	name: string
	quote: string
	avatar?: string
	title?: string
	className?: string
}

function getInitials(name: string) {
	return name
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join('')
}

export function TestimonialCard({
	name,
	quote,
	avatar,
	title = 'Verified patient',
	className,
}: TestimonialCardProps) {
	const initials = getInitials(name)

	return (
		<article
			className={cn(
				'w-full max-w-sm rounded-[1.75rem] border border-white/70 p-5',
				'shadow-[0_18px_40px_rgba(30,125,99,0.10)] backdrop-blur-[12px]',
				'bg-[linear-gradient(180deg,rgba(213,196,246,0.22)_0%,rgba(237,247,243,0.88)_100%)]',
				className,
			)}
		>
			<div className="flex items-start gap-4">
				<div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/80 bg-white/80 shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
					{avatar ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img src={avatar} alt={name} className="h-full w-full object-cover" />
					) : (
						<span className="font-display text-[15px] font-semibold text-teal-800">
							{initials}
						</span>
					)}
				</div>

				<div className="min-w-0 flex-1">
					<div className="flex items-center justify-between gap-3">
						<div>
							<p className="font-display text-[16px] leading-none text-teal-900">
								{name}
							</p>
							<p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-teal-700/75">
								{title}
							</p>
						</div>

						<div className="flex items-center gap-0.5 text-[#c9a44b]">
							{Array.from({ length: 5 }).map((_, index) => (
								<Star key={index} size={13} fill="currentColor" />
							))}
						</div>
					</div>

					<p className="mt-4 whitespace-pre-line text-[13px] leading-[1.7] text-slate-600">
						{quote}
					</p>
				</div>
			</div>
		</article>
	)
}
