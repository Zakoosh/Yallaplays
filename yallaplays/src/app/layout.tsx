import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'YallaPlays - يلا بلاي | Free Browser Games',
  description: '20 free browser games in Arabic and English with lightweight play, comments, posts, and sharing.',
  keywords: 'games, browser games, free games, Arabic games, العاب, يلا بلاي, العاب متصفح',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen star-bg" style={{ backgroundColor: '#0a0a14' }}>
        <LanguageProvider>
          <Header />
          <main className="relative z-10">
            {children}
          </main>
          <footer className="relative z-10 border-t border-white/10 mt-16 py-8 text-center text-text-muted">
            <div className="container mx-auto px-4">
              <p className="text-sm opacity-70 mb-1">© 2026 YallaPlays | يلا بلاي</p>
              <p className="text-xs opacity-50">Made with ❤️ for gamers everywhere • صُنع بـ ❤️ للاعبين في كل مكان</p>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  )
}
