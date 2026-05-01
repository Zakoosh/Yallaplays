'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { ar } from '@/translations/ar'
import { en } from '@/translations/en'

type Lang = 'ar' | 'en'
type TranslationsType = typeof ar

interface LanguageContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: TranslationsType
  isRTL: boolean
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  setLang: () => {},
  t: ar,
  isRTL: true,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ar')

  useEffect(() => {
    const saved = localStorage.getItem('yallaplays_lang') as Lang
    if (saved === 'ar' || saved === 'en') {
      setLangState(saved)
    }
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('yallaplays_lang', l)
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = l
  }

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  const t = lang === 'ar' ? ar : en

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
