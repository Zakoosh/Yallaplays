'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'

export default function Header() {
  const { t, lang, setLang, isRTL } = useLang()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10" style={{ backgroundColor: 'rgba(10,10,20,0.9)' }}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🎮</span>
          <span className="text-xl font-black gradient-text group-hover:opacity-80 transition-opacity">
            {t.siteName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-text-muted hover:text-white transition-colors text-sm font-medium">
            {t.nav.home}
          </Link>
          <Link href="/#games" className="text-text-muted hover:text-white transition-colors text-sm font-medium">
            {t.nav.games}
          </Link>
          <Link href="/#community" className="text-text-muted hover:text-white transition-colors text-sm font-medium">
            {t.nav.community}
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-white transition-all"
          >
            {t.langSwitch}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 py-4 px-4 flex flex-col gap-4" style={{ backgroundColor: 'rgba(10,10,20,0.98)' }}>
          <Link href="/" className="text-white font-medium" onClick={() => setMenuOpen(false)}>
            {t.nav.home}
          </Link>
          <Link href="/#games" className="text-white font-medium" onClick={() => setMenuOpen(false)}>
            {t.nav.games}
          </Link>
          <Link href="/#community" className="text-white font-medium" onClick={() => setMenuOpen(false)}>
            {t.nav.community}
          </Link>
        </div>
      )}
    </header>
  )
}
