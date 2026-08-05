import { useState, useEffect } from 'react'
import { Head } from '@inertiajs/react'
import PanelNav from '#common/ui/components/datarural/navbar-auth'
import PanelFooter from '#common/ui/components/datarural/footer-simple'
import GroupCard from '../components/group-card'
import CreateGroupDialog from '../components/create-group-dialog'
import * as Ic from '#common/ui/components/datarural/icons'
import { useTranslation } from '#common/ui/hooks/use_translation'

import type { InertiaProps } from '#core/ui/types'
import type { GroupCardItem } from '../components/group-card'

type PageProps = InertiaProps<{
  groups?: GroupCardItem[]
}>

export default function GroupsIndex({ groups = [] }: PageProps) {
  const { t } = useTranslation()
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dr-theme') || 'light'
    }
    return 'light'
  })
  const [showCreate, setShowCreate] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('dr-theme', theme)
  }, [theme])

  const filtered = query.trim()
    ? groups.filter((g) => g.name.toLowerCase().includes(query.trim().toLowerCase()))
    : groups

  return (
    <div className="dr-app dr-panel-wrap">
      <Head title={t('groups.index.title')} />
      <PanelNav
        theme={theme}
        onToggleTheme={() => setTheme((p) => (p === 'dark' ? 'light' : 'dark'))}
        active="groups"
        hidePublishButton={true}
      />

      <div className="dr-page-head">
        <div className="dr-container">
          <div className="dr-page-head-inner">
            <div>
              <div className="dr-page-breadcrumb">
                <a href="/">{t('groups.index.breadcrumb_home')}</a>
                <span className="sep">
                  <Ic.Chevr size={13} style={{ display: 'inline', margin: '0 4px' }} />
                </span>
                <span>{t('groups.index.breadcrumb_my')}</span>
              </div>
              <h1 style={{ margin: 0 }}>{t('groups.index.title')}</h1>
              <p className="page-sub">
                {t('groups.index.sub')}
              </p>
            </div>
            <div className="dr-page-head-actions">
              <button className="dr-btn dr-btn-primary dr-btn-lg" onClick={() => setShowCreate(true)}>
                <Ic.Plus size={18} /> {t('groups.index.create_btn')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dr-container">
        {/* Search bar */}
        <div style={{ margin: '24px 0 20px', maxWidth: 400 }}>
          <div style={{ position: 'relative' }}>
            <Ic.Search
              size={16}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--muted-foreground)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('groups.index.search_placeholder')}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--input)',
                background: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Groups grid */}
        {filtered.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
              gap: 16,
              marginBottom: 56,
            }}
          >
            {filtered.map((g) => (
              <GroupCard key={g.id} group={g} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '64px 24px',
              color: 'var(--muted-foreground)',
            }}
          >
            <Ic.Users size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px' }}>
              {query.trim() ? t('groups.index.empty_search') : t('groups.index.empty_no_groups')}
            </p>
            <p style={{ fontSize: '14px', margin: '0 0 20px' }}>
              {query.trim()
                ? t('groups.index.empty_search_sub')
                : t('groups.index.empty_no_groups_sub')}
            </p>
            {!query.trim() && (
              <button className="dr-btn dr-btn-primary" onClick={() => setShowCreate(true)}>
                <Ic.Plus size={16} /> {t('groups.index.create_btn')}
              </button>
            )}
          </div>
        )}
      </div>

      <CreateGroupDialog open={showCreate} onClose={() => setShowCreate(false)} />
      <PanelFooter />
    </div>
  )
}
