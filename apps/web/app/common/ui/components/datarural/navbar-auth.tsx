import { useState, useEffect, useRef } from 'react'
import { Link, router } from '@inertiajs/react'
import useUser from '#auth/ui/hooks/use_user'
import { BrandMark } from './brand'
import * as Ic from './icons'

interface UserProps {
  name: string
  email?: string
  short?: string
  unit?: string
  avatarUrl?: string
}

interface PanelNavProps {
  theme: string
  onToggleTheme: () => void
  onPublish?: () => void
  active?: string
  user?: UserProps | null
  hidePublishButton?: boolean
}

const DEFAULT_ME = {
  name: 'Dra. Helena Vasconcelos',
  short: 'HV',
  email: 'h.vasconcelos@ufrrj.br',
  unit: 'Instituto de Ciências Exatas',
  avatarUrl: undefined as string | undefined,
}

export function NavUser({ user }: { user?: UserProps | null }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const loggedInUser = useUser()
  const me = loggedInUser
    ? {
      name: loggedInUser.fullName || 'Usuário UFRRJ',
      email: loggedInUser.email,
      short: (loggedInUser.fullName || 'U').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase(),
      unit: 'Instituto de Ciências Exatas',
      avatarUrl: loggedInUser.avatarUrl,
    }
    : (user || DEFAULT_ME)

  const shortName = me.short || (me.name || 'U').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
  const displayFirstName = (me.name || 'Usuário').split(' ').slice(0, 2).join(' ')

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('click', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('click', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const handleLogout = () => {
    router.post('/logout')
  }

  return (
    <div className="dr-nav-user-wrap" ref={ref}>
      <button
        className={'dr-nav-user' + (open ? ' open' : '')}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        title="Conta"
      >
        {me.avatarUrl ? (
          <img src={me.avatarUrl} alt={me.name} className="dr-nav-avatar" style={{ objectFit: 'cover' }} />
        ) : (
          <span className="dr-nav-avatar">{shortName}</span>
        )}
        <span className="nu-text">
          <span className="nu-name">{displayFirstName.split(' ')[0]}</span>
        </span>
        <Ic.Chevd size={15} className="nu-chev" style={{ color: 'var(--muted-foreground)', marginRight: 2 }} />
      </button>

      {open && (
        <div className="dr-user-menu" role="menu">
          <div className="dr-user-menu-head">
            {me.avatarUrl ? (
              <img src={me.avatarUrl} alt={me.name} className="dr-nav-avatar lg" style={{ objectFit: 'cover' }} />
            ) : (
              <span className="dr-nav-avatar lg">{shortName}</span>
            )}
            <span className="umh-text">
              <span className="umh-name">{me.name}</span>
              <span className="umh-mail">{me.email || 'usuario@ufrrj.br'}</span>
              <span className="umh-unit">
                <Ic.Building size={12} style={{ display: 'inline', marginRight: 4 }} />
                {me.unit || 'UFRRJ'}
              </span>
            </span>
          </div>
          <div className="sep"></div>
          <Link role="menuitem" href="/profile">
            <Ic.User size={16} /> Meu perfil
          </Link>
          <Link role="menuitem" href="/dashboard">
            <Ic.Database size={16} /> Meus datasets
          </Link>
          <Link role="menuitem" href="/groups">
            <Ic.Users size={16} /> Meus grupos
          </Link>
          <Link role="menuitem" href="/favorites">
            <Ic.Bookmark size={16} /> Favoritos
          </Link>
          <Link role="menuitem" href="/settings/profile">
            <Ic.Settings size={16} /> Configurações da conta
          </Link>
          <div className="sep"></div>
          <button className="danger" role="menuitem" onClick={handleLogout}>
            <Ic.Logout size={16} /> Sair
          </button>
        </div>
      )}
    </div>
  )
}

export default function PanelNav({ theme, onToggleTheme, onPublish, active, user, hidePublishButton }: PanelNavProps) {
  const loggedInUser = useUser()
  return (
    <header className="dr-nav">
      <div className="dr-container dr-nav-inner">
        <Link className="dr-brand" href="/">
          <BrandMark />
          <span className="dr-brand-text">
            <span className="dr-brand-name">
              Data<span>Rural</span>
            </span>
            <span className="dr-brand-sub">UFRRJ · Datasets</span>
          </span>
        </Link>
        <nav className="dr-nav-links">
          <Link
            className={'dr-nav-link' + (active === 'datasets' ? ' active' : '')}
            href="/datasets"
          >
            Datasets
          </Link>
          <Link
            className={'dr-nav-link' + (active === 'dashboard' ? ' active' : '')}
            href="/dashboard"
          >
            Meus datasets
          </Link>
          <Link
            className={'dr-nav-link' + (active === 'favorites' ? ' active' : '')}
            href="/favorites"
          >
            Favoritos
          </Link>
          <Link
            className={'dr-nav-link' + (active === 'groups' ? ' active' : '')}
            href="/groups"
          >
            Grupos
          </Link>
          {loggedInUser && (loggedInUser.roleId === 2 || (loggedInUser as any).roleId === 2) && (
            <Link
              className={'dr-nav-link' + (active === 'users' ? ' active' : '')}
              href="/users"
            >
              Gestão
            </Link>
          )}
        </nav>
        <div className="dr-nav-right">
          <button
            className="dr-btn dr-btn-icon"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? <Ic.Sun size={18} /> : <Ic.Moon size={18} />}
          </button>
          {!hidePublishButton && onPublish && (
            <button className="dr-btn dr-btn-primary" onClick={onPublish}>
              <Ic.Plus size={17} /> Publicar dataset
            </button>
          )}
          <NavUser user={user} />
        </div>
      </div>
    </header>
  )
}
