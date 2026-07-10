import { PropsWithChildren, useEffect, useState } from 'react'
import { Toaster } from '@workspace/ui/components/sonner'
import { BrandMark } from '#common/ui/components/datarural/brand'
import { LanguageSwitcher } from '#common/ui/components/language_switcher'
import * as Ic from '#common/ui/components/datarural/icons'
import Footer from '#common/ui/components/datarural/footer'

export interface AuthLayoutProps extends PropsWithChildren {}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dr-theme') || 'light'
    }
    return 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('dr-theme', theme)
  }, [theme])

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <>
      <Toaster />

      <div className="dr-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
        {/* Main Content Area: split grid */}
        <div style={{ flex: 1, display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
          {/* Left container: Login Form */}
          <div style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px' }}>
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '40px' }}>
            <a className="dr-brand" href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BrandMark />
              <span className="dr-brand-text">
                <span className="dr-brand-name">
                  Data<span>Rural</span>
                </span>
                <span className="dr-brand-sub">UFRRJ · Datasets</span>
              </span>
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                className="dr-btn dr-btn-icon"
                onClick={handleToggleTheme}
                title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
                aria-label="Alternar tema"
                style={{ background: 'var(--muted)', borderRadius: '8px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {theme === 'dark' ? <Ic.Sun size={18} /> : <Ic.Moon size={18} />}
              </button>
              <LanguageSwitcher />
            </div>
          </header>

          <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <div style={{ width: '100%', maxWidth: '360px', padding: '10px 0' }}>
              {children}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  </>
  )
}
