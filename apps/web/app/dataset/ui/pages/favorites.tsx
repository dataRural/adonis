import { useState, useMemo, useEffect } from 'react'
import { Head, Link } from '@inertiajs/react'
import Navbar from '#common/ui/components/datarural/navbar'
import DatasetCard, { DatasetItem } from '#common/ui/components/datarural/dataset-card'
import Footer from '#common/ui/components/datarural/footer'
import * as Ic from '#common/ui/components/datarural/icons'
import { useTranslation } from '#common/ui/hooks/use_translation'
import type { InertiaProps } from '#core/ui/types'

type PageProps = InertiaProps<{
  datasets?: DatasetItem[]
}>

export default function FavoritesPage({ datasets = [] }: PageProps) {
  const { t } = useTranslation()
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dr-theme') || 'light'
    }
    return 'light'
  })
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'recent' | 'featured' | 'popular'>('recent')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('dr-theme', theme)
  }, [theme])

  const normalize = (str: string) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const filteredList = useMemo(() => {
    let arr = datasets.slice()

    const raw = search.trim()
    if (raw) {
      const tokens = normalize(raw).split(/\s+/).filter(Boolean)

      const scored = arr
        .map((d) => {
          const title = normalize(d.title || d.name || '')
          const unit = normalize(d.unit || '')
          const desc = normalize(d.desc || d.description || '')
          const tagText = normalize(d.tags ? d.tags.join(' ') : '')
          const all = `${title} ${unit} ${desc} ${tagText}`

          let score = 0
          let allMatch = true

          for (const token of tokens) {
            if (all.includes(token)) {
              if (title.includes(token)) score += 3
              else if (tagText.includes(token)) score += 2
              else score += 1
            } else {
              allMatch = false
            }
          }

          return { d, score, allMatch }
        })
        .filter((item) => item.allMatch || (tokens.length > 1 && item.score > 0))
        .sort((a, b) => b.score - a.score)

      arr = scored.map((item) => item.d)
    }

    if (tab === 'recent') {
      if (!raw) arr.sort((a, b) => b.id - a.id)
    } else if (tab === 'featured') {
      arr.sort((a, b) => (Number(b.usability) || 0) - (Number(a.usability) || 0))
    } else if (tab === 'popular') {
      arr.sort((a, b) => (Number(b.votes || b.downloads) || 0) - (Number(a.votes || a.downloads) || 0))
    }

    return arr
  }, [datasets, search, tab])

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="dr-app dr-panel-wrap" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Head title={`${t('dataset.favorites.title')} — DataRural`} />
      <Navbar theme={theme} onToggleTheme={handleToggleTheme} activePage="favorites" />

      {/* Page Header */}
      <div className="dr-page-head">
        <div className="dr-container">
          <div className="dr-page-head-inner">
            <div>
              <div className="dr-page-breadcrumb">
                <a href="/">{t('dataset.dashboard.breadcrumb_home')}</a>
                <span className="sep">
                  <Ic.Chevr size={13} style={{ display: 'inline', margin: '0 4px' }} />
                </span>
                <span>{t('common.nav.favorites')}</span>
              </div>
              <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Ic.Bookmark size={28} style={{ color: 'var(--brand-green)', fill: 'var(--brand-green)' }} />
                {t('dataset.favorites.title')}
              </h1>
              <p className="page-sub">
                {t('dataset.favorites.sub')}
              </p>
            </div>
            <div className="dr-page-head-actions">
              <Link className="dr-btn dr-btn-outline dr-btn-lg" href="/datasets">
                <Ic.Search size={18} /> {t('common.footer.explore_datasets')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main style={{ flex: 1 }}>
        <div className="dr-container" style={{ paddingTop: 28, paddingBottom: 56 }}>
          {/* Main Search Bar */}
          {datasets.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ position: 'relative', maxWidth: 640 }}>
                <Ic.Search
                  size={18}
                  style={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--muted-foreground)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('dataset.favorites.search_placeholder')}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 44px',
                    borderRadius: 'var(--radius)',
                    border: '1.5px solid var(--input)',
                    background: 'var(--card)',
                    color: 'var(--foreground)',
                    fontSize: '15px',
                    outline: 'none',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--muted-foreground)',
                      padding: 4,
                    }}
                    title={t('dataset.favorites.clear_search')}
                  >
                    <Ic.X size={16} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Controls Bar */}
          {datasets.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: '14px', color: 'var(--muted-foreground)', fontWeight: 500 }}>
                {filteredList.length === 1
                  ? t('dataset.favorites.saved_count_one', { count: filteredList.length })
                  : t('dataset.favorites.saved_count', { count: filteredList.length })}
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    style={{
                      marginLeft: 12,
                      background: 'none',
                      border: 'none',
                      color: 'var(--brand-green)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    {t('dataset.favorites.clear_search')}
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Sorting Tabs */}
                <div
                  style={{
                    display: 'flex',
                    background: 'var(--muted)',
                    padding: 3,
                    borderRadius: 'calc(var(--radius) - 2px)',
                    gap: 2,
                  }}
                >
                  <button
                    onClick={() => setTab('recent')}
                    style={{
                      padding: '5px 12px',
                      fontSize: '13px',
                      fontWeight: tab === 'recent' ? 700 : 500,
                      borderRadius: 'calc(var(--radius) - 4px)',
                      border: 'none',
                      background: tab === 'recent' ? 'var(--card)' : 'transparent',
                      color: tab === 'recent' ? 'var(--foreground)' : 'var(--muted-foreground)',
                      cursor: 'pointer',
                      boxShadow: tab === 'recent' ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    {t('dataset.explore.sort_recent')}
                  </button>
                  <button
                    onClick={() => setTab('featured')}
                    style={{
                      padding: '5px 12px',
                      fontSize: '13px',
                      fontWeight: tab === 'featured' ? 700 : 500,
                      borderRadius: 'calc(var(--radius) - 4px)',
                      border: 'none',
                      background: tab === 'featured' ? 'var(--card)' : 'transparent',
                      color: tab === 'featured' ? 'var(--foreground)' : 'var(--muted-foreground)',
                      cursor: 'pointer',
                      boxShadow: tab === 'featured' ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    {t('dataset.explore.sort_featured')}
                  </button>
                  <button
                    onClick={() => setTab('popular')}
                    style={{
                      padding: '5px 12px',
                      fontSize: '13px',
                      fontWeight: tab === 'popular' ? 700 : 500,
                      borderRadius: 'calc(var(--radius) - 4px)',
                      border: 'none',
                      background: tab === 'popular' ? 'var(--card)' : 'transparent',
                      color: tab === 'popular' ? 'var(--foreground)' : 'var(--muted-foreground)',
                      cursor: 'pointer',
                      boxShadow: tab === 'popular' ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    {t('dataset.explore.sort_popular')}
                  </button>
                </div>

                {/* Grid / List Toggle */}
                <div
                  style={{
                    display: 'flex',
                    background: 'var(--muted)',
                    padding: 3,
                    borderRadius: 'calc(var(--radius) - 2px)',
                    gap: 2,
                  }}
                >
                  <button
                    onClick={() => setView('grid')}
                    style={{
                      padding: '5px 8px',
                      borderRadius: 'calc(var(--radius) - 4px)',
                      border: 'none',
                      background: view === 'grid' ? 'var(--card)' : 'transparent',
                      color: view === 'grid' ? 'var(--foreground)' : 'var(--muted-foreground)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title={t('dataset.explore.view_grid')}
                  >
                    <Ic.Grid size={15} />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    style={{
                      padding: '5px 8px',
                      borderRadius: 'calc(var(--radius) - 4px)',
                      border: 'none',
                      background: view === 'list' ? 'var(--card)' : 'transparent',
                      color: view === 'list' ? 'var(--foreground)' : 'var(--muted-foreground)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title={t('dataset.explore.view_list')}
                  >
                    <Ic.Table size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Datasets Grid / List */}
          {filteredList.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill, minmax(360px, 1fr))' : '1fr',
                gap: 16,
              }}
            >
              {filteredList.map((d) => (
                <DatasetCard key={d.id} d={d} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '64px 24px',
                color: 'var(--muted-foreground)',
                background: 'var(--card)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
              }}
            >
              <Ic.Bookmark size={48} style={{ margin: '0 auto 16px', opacity: 0.3, color: 'var(--brand-green)' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px', color: 'var(--foreground)' }}>
                {search ? t('dataset.favorites.no_favorites_found') : t('dataset.favorites.no_saved_yet')}
              </h3>
              <p style={{ fontSize: '14px', margin: '0 0 20px', maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
                {search
                  ? t('dataset.favorites.no_matching_search')
                  : t('dataset.favorites.empty_hint')}
              </p>
              {search ? (
                <button className="dr-btn dr-btn-primary" onClick={() => setSearch('')}>
                  {t('dataset.favorites.clear_search')}
                </button>
              ) : (
                <Link className="dr-btn dr-btn-primary" href="/datasets">
                  {t('dataset.favorites.explore_catalog')}
                </Link>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
