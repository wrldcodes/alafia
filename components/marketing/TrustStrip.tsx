import { Shield, Clock, Users, Smartphone, Wifi } from 'lucide-react'

const items = [
  { icon: Shield,    label: 'Secure patient data' },
  { icon: Clock,     label: 'Setup in under 10 minutes' },
  { icon: Users,     label: '200+ clinics onboarded' },
  { icon: Wifi,      label: 'Low-data friendly' },
  { icon: Smartphone,label: 'Works on any device' },
]

/**
 * TrustStrip — horizontal band of trust signals shown between Hero and Audiences.
 */
export function TrustStrip() {
  return (
    <div className="flex items-center justify-center flex-wrap gap-10 px-13 py-5 bg-white border-y border-sand-200">
      {items.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-2.5 text-[13px] font-light text-slate-400">
          <Icon size={16} className="text-teal-400 flex-shrink-0" />
          {label}
        </div>
      ))}
    </div>
  )
}
