import { useState, useMemo, useEffect } from 'react'
import { Head, Link } from '@inertiajs/react'
import Navbar from '#common/ui/components/datarural/navbar'
import Categories, { CategoryItem } from '#common/ui/components/datarural/categories'
import DatasetCard, { DatasetItem } from '#common/ui/components/datarural/dataset-card'
import Footer from '#common/ui/components/datarural/footer'
import * as Ic from '#common/ui/components/datarural/icons'
import { useTranslation } from '#common/ui/hooks/use_translation'
import type { InertiaProps } from '#core/ui/types'

type PageProps = InertiaProps<{
  datasets?: DatasetItem[]
  categories?: CategoryItem[]
  initialSearch?: string
  initialArea?: string
}>

export default function DatasetsExplorePage({
  datasets = [],
  categories,
  initialSearch = '',
  initialArea = '',
}: PageProps) {
  const { t } = useTranslation()
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dr-theme') || (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    }
    return 'light'
  })
  const [search, setSearch] = useState(initialSearch)
  const [activeCat, setActiveCat] = useState<string | null>(initialArea || null)
  const [areasOpen, setAreasOpen] = useState(Boolean(initialArea))
  const [tab, setTab] = useState<'recent' | 'featured' | 'popular'>('recent')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('dr-theme', theme)
  }, [theme])

  useEffect(() => {
    if (initialSearch !== undefined) setSearch(initialSearch)
  }, [initialSearch])

  useEffect(() => {
    if (initialArea !== undefined) {
      setActiveCat(initialArea || null)
      if (initialArea) setAreasOpen(true)
    }
  }, [initialArea])

  const normalize = (str: string) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const filteredList = useMemo(() => {
    let arr = datasets.slice()

    if (activeCat) {
      const catLower = activeCat.toLowerCase().trim()
      arr = arr.filter((d) => (d as any).cat && (d as any).cat.toLowerCase().trim() === catLower)
    }

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
              // Boost if found in title
              if (title.includes(token)) score += 3
              // Boost if found in tags
              else if (tagText.includes(token)) score += 2
              // Found in description or unit
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
  }, [datasets, search, activeCat, tab])

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handleClearFilters = () => {
    setSearch('')
    setActiveCat(null)
  }

  return (
    <div className="dr-app dr-panel-wrap" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Head title={`${t('dataset.explore.title')} — DataRural`} />
      <Navbar theme={theme} onToggleTheme={handleToggleTheme} activePage="datasets" />

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
                <span>{t('common.nav.datasets')}</span>
              </div>
              <h1 style={{ margin: 0 }}>{t('dataset.explore.title')}</h1>
              <p className="page-sub">
                {t('dataset.explore.sub')}
              </p>
            </div>
            <div className="dr-page-head-actions">
              <Link className="dr-btn dr-btn-primary dr-btn-lg" href="/dashboard/publish">
                <Ic.Plus size={18} /> {t('common.nav.publish_dataset')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main style={{ flex: 1 }}>
        <div className="dr-container" style={{ paddingTop: 28, paddingBottom: 56 }}>
          {/* Expansible Areas / Categories Filter */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: areasOpen ? 12 : 0 }}>
              <button
                onClick={() => setAreasOpen((prev) => !prev)}
                className="dr-btn dr-btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontWeight: 600,
                  fontSize: '13.5px',
                  padding: '8px 14px',
                }}
              >
                <Ic.Grid size={16} />
                <span>{t('dataset.explore.filter_by_area')}</span>
                {activeCat && (
                  <span
                    style={{
                      background: 'var(--brand-green)',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 12,
                      marginLeft: 4,
                    }}
                  >
                    {activeCat}
                  </span>
                )}
                <Ic.Chevd
                  size={16}
                  style={{
                    transform: areasOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    marginLeft: 4,
                  }}
                />
              </button>

              {activeCat && (
                <button
                  onClick={() => setActiveCat(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted-foreground)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Ic.X size={14} /> {t('dataset.explore.clear_area_filter', { area: activeCat })}
                </button>
              )}
            </div>

            {areasOpen && (
              <div
                style={{
                  paddingTop: 12,
                  paddingBottom: 4,
                  borderTop: '1px solid var(--border)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Categories active={activeCat} onPick={setActiveCat} categories={categories} />
              </div>
            )}
          </div>

          {/* Main Search Bar (positioned BELOW Areas) */}
          <div style={{ marginBottom: 28 }}>
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
                placeholder={t('dataset.explore.search_placeholder')}
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
                  title={t('dataset.explore.clear_search')}
                >
                  <Ic.X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Controls Bar: Results count, Tab sorting, Grid/List View */}
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
                ? t('dataset.explore.showing_count_one', { count: filteredList.length })
                : t('dataset.explore.showing_count', { count: filteredList.length })}
              {(search || activeCat) && (
                <button
                  onClick={handleClearFilters}
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
                  {t('dataset.explore.clear_filters')}
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
              <Ic.Database size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px', color: 'var(--foreground)' }}>
                {t('dataset.explore.no_datasets_found')}
              </h3>
              <p style={{ fontSize: '14px', margin: '0 0 20px', maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
                {search || activeCat
                  ? t('dataset.explore.no_matching_filters')
                  : t('dataset.explore.no_datasets_in_catalog')}
              </p>
              {(search || activeCat) && (
                <button className="dr-btn dr-btn-primary" onClick={handleClearFilters}>
                  {t('dataset.explore.clear_search_and_filters')}
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
