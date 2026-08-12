import { Link } from '@inertiajs/react'
import { BrandMark } from './brand'
import * as Ic from './icons'
import useUser from '#auth/ui/hooks/use_user'
import { NavUser, NavLanguage } from './navbar-auth'
import { useTranslation } from '#common/ui/hooks/use_translation'

interface NavbarProps {
  theme: string
  onToggleTheme: () => void
  activePage?: string
}

export default function Navbar({ theme, onToggleTheme, activePage }: NavbarProps) {
  const { t } = useTranslation()

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
            {t('common.nav.datasets')}
          </Link>
          {useUser() && (
            <>
              <Link
                className={`dr-nav-link ${activePage === 'dashboard' ? 'active' : ''}`}
                href="/dashboard"
              >
                {t('common.nav.my_datasets')}
              </Link>
              <Link
                className={`dr-nav-link ${activePage === 'favorites' ? 'active' : ''}`}
                href="/favorites"
              >
                {t('common.nav.favorites')}
              </Link>
              <Link
                className={`dr-nav-link ${activePage === 'groups' ? 'active' : ''}`}
                href="/groups"
              >
                {t('common.nav.groups')}
              </Link>
              {useUser() && (useUser()!.roleId === 2 || (useUser() as any)!.roleId === 2) && (
                <Link
                  className={`dr-nav-link ${activePage === 'users' || activePage === 'admin' ? 'active' : ''}`}
                  href="/admin"
                >
                  {t('common.nav.management')}
                </Link>
              )}
            </>
          )}
        </nav>
        <div className="dr-nav-right">
          <NavLanguage />
          {useUser() ? (
            <>
              <Link className="dr-btn dr-btn-primary" style={{ color: 'white', display: 'inline-flex', alignItems: 'center', gap: '6px' }} href="/dashboard/publish">
                <Ic.Plus size={17} /> {t('common.nav.publish_dataset')}
              </Link>
              <NavUser user={null} theme={theme} onToggleTheme={onToggleTheme} />
            </>
          ) : (
            <>
              <Link className="dr-btn dr-btn-ghost" href="/login">
                {t('common.nav.sign_in')}
              </Link>
              <Link className="dr-btn dr-btn-primary" style={{ color: "white" }} href="/sign-up">
                {t('common.nav.sign_up')}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
