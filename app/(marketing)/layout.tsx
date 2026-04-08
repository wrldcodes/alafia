import type { Metadata } from 'next'
import { metadataBase } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase,
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
