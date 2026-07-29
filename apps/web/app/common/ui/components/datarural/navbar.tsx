import { Link } from '@adonisjs/inertia/react'
import { BrandMark } from './brand'
import * as Ic from './icons'
import useUser from '#auth/ui/hooks/use_user'
import { NavUser } from './navbar-auth'

interface NavbarProps {
  theme: string
  onToggleTheme: () => void
  activePage?: string
}

export default function Navbar({ theme, onToggleTheme, activePage }: NavbarProps) {
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
            className={`dr-nav-link ${activePage === 'datasets' ? 'active' : ''}`}
            href="/datasets"
          >
            Datasets
          </Link>
          {useUser() && (
            <>
              <Link
                className={`dr-nav-link ${activePage === 'dashboard' ? 'active' : ''}`}
                href="/dashboard"
              >
                Meus datasets
              </Link>
              <Link
                className={`dr-nav-link ${activePage === 'favorites' ? 'active' : ''}`}
                href="/favorites"
              >
                Favoritos
              </Link>
              <Link
                className={`dr-nav-link ${activePage === 'groups' ? 'active' : ''}`}
                href="/groups"
              >
                Grupos
              </Link>
              {useUser() && (useUser()!.roleId === 2 || (useUser() as any)!.roleId === 2) && (
                <Link
                  className={`dr-nav-link ${activePage === 'users' ? 'active' : ''}`}
                  href="/users"
                >
                  Usuários
                </Link>
              )}
            </>
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
          {useUser() ? (
            <>
              <Link className="dr-btn dr-btn-primary" style={{ color: 'white', display: 'inline-flex', alignItems: 'center', gap: '6px' }} href="/dashboard/publish">
                <Ic.Plus size={17} /> Publicar dataset
              </Link>
              <NavUser user={null} />
            </>
          ) : (
            <>
              <Link className="dr-btn dr-btn-ghost" href="/login">
                Entrar
              </Link>
              <Link className="dr-btn dr-btn-primary" style={{ color: "white" }} href="/sign-up">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
