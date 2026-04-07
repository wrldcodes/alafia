'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

/**
 * Navbar — sticky top navigation with scroll-shadow effect.
 * Contains logo, page links, and dual sign-in / get-started CTAs.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-[200]',
        'flex items-center justify-between px-13 h-[70px]',
        'bg-sand-50/92 backdrop-blur-[16px]',
        'border-b border-sand-200 transition-shadow duration-300',
        scrolled && 'shadow-[0_2px_24px_rgba(0,0,0,0.07)]'
      )}
    >
      <Link href="/" className="flex items-center gap-2.5 font-display text-[22px] text-teal-800 no-underline">
        <div className="w-[34px] h-[34px] bg-teal-700 rounded-[10px] flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 21C12 21 4 15 4 9a8 8 0 0 1 16 0c0 6-8 12-8 12z"/>
            <circle cx="12" cy="9" r="2.5" fill="white" stroke="none"/>
          </svg>
        </div>
        Aláfíà
      </Link>

      <ul className="hidden md:flex items-center gap-8 list-none">
        {[
          { href: '#for-you',   label: 'For patients' },
          { href: '#for-clinics', label: 'For clinics' },
          { href: '#features',  label: 'Features' },
        ].map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              className="text-sm font-light text-slate-600 no-underline transition-colors hover:text-teal-700"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2.5">
        <Button variant="outline" size="sm" asChild>
          <Link href="/home">Sign in</Link>
        </Button>
        <Button variant="primary" size="sm" asChild>
          <Link href="/enroll">Get started</Link>
        </Button>
      </div>
    </nav>
  )
}
