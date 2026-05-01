import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'يلا بلاي - أفضل موقع ألعاب عربية HTML5',
  description: 'العب ألعاب متصفح عربية مجانية بخيارات سريعة وتصميم حديث، مع صفحات ألعاب مفصلة ودعم RTL كامل.',
  keywords: 'ألعاب متصفح, ألعاب عربية, HTML5, يلا بلاي, ألعاب مجانية, ألعاب جيمينغ',
  metadataBase: new URL('https://yallaplays.com'),
  openGraph: {
    title: 'يلا بلاي - موقع ألعاب عربية',
    description: 'العب ألعاب متصفح عربية مجانية بخيارات سريعة وتصميم حديث.',
    type: 'website',
    url: 'https://yallaplays.com',
  },
  twitter: {
    card: 'summary_large_image',
  },
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
              <p className="text-sm opacity-70 mb-1">© 2026 يلا بلاي | YallaPlays</p>
              <p className="text-xs opacity-50">صُنع بـ ❤️ للاعبين في كل مكان</p>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  )
}
