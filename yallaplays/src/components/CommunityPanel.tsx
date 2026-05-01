'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'

interface CommunityItem {
  id: string
  name: string
  text: string
  likes: number
  createdAt: number
}

interface CommunityPanelProps {
  scope: string
  mode?: 'comments' | 'posts'
  className?: string
}

const fallbackName = {
  ar: 'لاعب',
  en: 'Player',
}

export default function CommunityPanel({ scope, mode = 'comments', className = '' }: CommunityPanelProps) {
  const { t, lang } = useLang()
  const [items, setItems] = useState<CommunityItem[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)
  const [ready, setReady] = useState(false)

  const storageKey = useMemo(() => `yallaplays-community-${scope}`, [scope])
  const isPosts = mode === 'posts'

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) setItems(JSON.parse(saved))
    } catch {
      setItems([])
    }
    setReady(true)
  }, [storageKey])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(storageKey, JSON.stringify(items.slice(0, 30)))
  }, [items, ready, storageKey])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanText = text.trim()
    if (!cleanText) return

    const item: CommunityItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: name.trim() || fallbackName[lang],
      text: cleanText,
      likes: 0,
      createdAt: Date.now(),
    }

    setItems(prev => [item, ...prev].slice(0, 30))
    setText('')
  }

  const like = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, likes: item.likes + 1 } : item))
  }

  const share = async () => {
    if (typeof window === 'undefined') return
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const formatDate = (value: number) => {
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : 'en', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  }

  return (
    <section id={isPosts ? 'community' : undefined} className={`rounded-xl border border-white/10 bg-white/[0.03] p-4 ${className}`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-black text-white">
            {isPosts ? t.community.postsTitle : t.community.commentsTitle}
          </h2>
        </div>
        <button
          onClick={share}
          className="shrink-0 px-3 py-2 rounded-lg border border-accent-cyan/40 text-accent-cyan text-sm font-semibold hover:bg-accent-cyan/10 transition-colors"
        >
          {copied ? t.community.copied : t.community.share}
        </button>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3 mb-4">
        <input
          value={name}
          onChange={event => setName(event.target.value)}
          maxLength={24}
          placeholder={t.community.namePlaceholder}
          className="w-full rounded-lg border border-white/10 bg-bg-elevated px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
        />
        <textarea
          value={text}
          onChange={event => setText(event.target.value)}
          maxLength={220}
          rows={3}
          placeholder={isPosts ? t.community.postPlaceholder : t.community.commentPlaceholder}
          className="w-full resize-none rounded-lg border border-white/10 bg-bg-elevated px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="rounded-lg px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
        >
          {isPosts ? t.community.submitPost : t.community.submitComment}
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {items.length === 0 && (
          <p className="rounded-lg border border-white/10 bg-bg-elevated px-3 py-4 text-center text-sm text-text-muted">
            {isPosts ? t.community.emptyPosts : t.community.emptyComments}
          </p>
        )}

        {items.map(item => (
          <article key={item.id} className="rounded-lg border border-white/10 bg-bg-elevated p-3">
            <div className="flex items-center justify-between gap-3 mb-2">
              <strong className="text-sm text-white">{item.name}</strong>
              <time className="text-[11px] text-text-muted">{formatDate(item.createdAt)}</time>
            </div>
            <p className="text-sm leading-relaxed text-text-primary whitespace-pre-wrap">{item.text}</p>
            <button
              onClick={() => like(item.id)}
              className="mt-3 text-xs font-semibold text-accent-cyan hover:text-white transition-colors"
            >
              {t.community.like} · {item.likes}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
