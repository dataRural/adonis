import { useState, useMemo, useEffect } from 'react'
import { router } from '@inertiajs/react'
import PanelNav from '#common/ui/components/datarural/navbar-auth'
import PanelFooter from '#common/ui/components/datarural/footer-simple'
import DashboardStats from '../components/dashboard/dashboard-stats'
import Toolbar from '../components/dashboard/toolbar'
import DatasetTable from '../components/dashboard/dataset-table'
import { UserDatasetItem } from '../components/dashboard/panel-data'
import * as Ic from '#common/ui/components/datarural/icons'

import type { InertiaProps } from '#core/ui/types'

type PageProps = InertiaProps<{
  datasets?: UserDatasetItem[]
}>

export default function Dashboard({ datasets = [] }: PageProps) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dr-theme') || 'light'
    }
    return 'light'
  })
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('dr-theme', theme)
  }, [theme])

  const counts = useMemo(() => ({
    all: datasets.length,
    published: datasets.filter((d) => d.status === 'published').length,
    review: datasets.filter((d) => d.status === 'review').length,
    draft: datasets.filter((d) => d.status === 'draft').length,
    unpublished: datasets.filter((d) => d.status === 'unpublished').length,
  }), [datasets])

  const list = useMemo(() => {
    let arr = datasets.slice()
    if (filter !== 'all') {
      arr = arr.filter((d) => d.status === filter)
    }
    const q = query.trim().toLowerCase()
    if (q) {
      arr = arr.filter((d) => d.title.toLowerCase().includes(q))
    }
    return arr
  }, [datasets, filter, query])

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handlePublish = () => {
    router.visit('/dashboard/publish')
  }

  const handleEdit = (d: UserDatasetItem) => {
    router.visit(`/dashboard/publish?id=${d.id}`)
  }

  return (
    <div className="dr-app dr-panel-wrap">
      <PanelNav
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onPublish={handlePublish}
        active="dashboard"
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
                <span>Meus datasets</span>
              </div>
              <h1 style={{ margin: 0 }}>Meus datasets</h1>
              <p className="page-sub">
                Gerencie o que você publica, acompanhe o uso e envie novas versões.
              </p>
            </div>
            <div className="dr-page-head-actions">
              <button className="dr-btn dr-btn-outline dr-btn-lg" onClick={() => alert('Gerar Relatório')}>
                <Ic.Chart size={18} /> Relatório
              </button>
              <button className="dr-btn dr-btn-primary dr-btn-lg" onClick={handlePublish}>
                <Ic.Plus size={18} /> Publicar dataset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dr-container">
        <DashboardStats stats={{ publishedCount: counts.published, reviewCount: counts.review }} />
        <Toolbar
          filter={filter}
          onFilterChange={setFilter}
          query={query}
          onQueryChange={setQuery}
          counts={counts}
        />
        <DatasetTable list={list} onEdit={handleEdit} onPublish={handlePublish} />
        <div style={{ height: 56 }}></div>
      </div>

      <PanelFooter />
    </div>
  )
}
