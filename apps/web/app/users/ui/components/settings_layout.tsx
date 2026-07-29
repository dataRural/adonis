import { ReactNode, useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import PanelNav from '#common/ui/components/datarural/navbar-auth'
import PanelFooter from '#common/ui/components/datarural/footer-simple'
import * as Ic from '#common/ui/components/datarural/icons'
import { useTranslation } from '#common/ui/hooks/use_translation'
import AbilityProvider from '#users/ui/context/abilities_context'
import { Toaster } from '@workspace/ui/components/sonner'

export default function SettingsLayout({
  children,
  currentPath,
}: {
  children: ReactNode
  currentPath: string
}) {
  const { t } = useTranslation()

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

  const sidebarNavItems = [
    {
      title: t('users.layout.profile'),
      icon: <Ic.User size={18} />,
      href: '/settings/profile',
    },
    {
      title: t('users.layout.password'),
      icon: <Ic.Lock size={18} />,
      href: '/settings/password',
    },
    /*
    {
      title: t('users.layout.tokens'),
      icon: <Ic.Code size={18} />,
      href: '/settings/tokens',
    },
    */
  ]

  return (
    <AbilityProvider>
      <div className="dr-app dr-panel-wrap">
        <Toaster />
        <PanelNav
          theme={theme}
          onToggleTheme={handleToggleTheme}
          active=""
          hidePublishButton={true}
        />

        <div className="dr-page-head">
          <div className="dr-container">
            <div className="dr-page-head-inner">
              <div>
                <div className="dr-page-breadcrumb">
                  <a href="/">Início</a>
                  <span className="sep">
                    <Ic.Chevr size={13} style={{ display: 'inline', margin: '0 4px' }} />
                  </span>
                  <span>Configurações</span>
                </div>
                <h1 style={{ margin: 0 }}>Minha Conta</h1>
                <p className="page-sub">
                  Gerencie seus dados pessoais, senha de acesso e chaves de API.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="dr-container">
          <div 
            style={{ 
              display: 'flex', 
              gap: 32, 
              marginTop: 24, 
              marginBottom: 56,
              flexDirection: 'row',
            }}
            className="dr-settings-container"
          >
            <aside style={{ width: 220, flexShrink: 0 }} className="dr-settings-aside">
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {sidebarNavItems.map((item) => {
                  const isActive = currentPath === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius)',
                        textDecoration: 'none',
                        color: isActive ? 'var(--brand-green)' : 'var(--muted-foreground)',
                        background: isActive ? 'color-mix(in srgb, var(--brand-green) 12%, transparent)' : 'transparent',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '14px',
                        transition: 'all 0.15s ease',
                      }}
                      className={`dr-settings-link ${isActive ? 'active' : ''}`}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  )
                })}
              </nav>
            </aside>

            <main style={{ flex: 1, minWidth: 0 }}>
              <div className="dr-panel" style={{ padding: '32px 36px' }}>
                {children}
              </div>
            </main>
          </div>
        </div>

        <PanelFooter />
      </div>
    </AbilityProvider>
  )
}
