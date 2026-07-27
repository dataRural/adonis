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
  userGroups?: { id: number; name: string }[]
}>

export default function Dashboard({ datasets = [], userGroups = [] }: PageProps) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dr-theme') || 'light'
    }
    return 'light'
  })
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('all')

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('dr-theme', theme)
  }, [theme])

  const filteredDatasets = useMemo(() => {
    if (selectedGroup === 'all') return datasets
    if (selectedGroup === 'none') return datasets.filter((d) => !d.groupId)
    return datasets.filter((d) => d.groupId === Number(selectedGroup))
  }, [datasets, selectedGroup])

  const counts = useMemo(() => ({
    all: filteredDatasets.length,
    published: filteredDatasets.filter((d) => d.status === 'published').length,
    review: filteredDatasets.filter((d) => d.status === 'review').length,
    draft: filteredDatasets.filter((d) => d.status === 'draft').length,
    unpublished: filteredDatasets.filter((d) => d.status === 'unpublished').length,
  }), [filteredDatasets])

  const list = useMemo(() => {
    let arr = filteredDatasets.slice()
    if (filter !== 'all') {
      arr = arr.filter((d) => d.status === filter)
    }
    const q = query.trim().toLowerCase()
    if (q) {
      arr = arr.filter((d) => d.title.toLowerCase().includes(q))
    }
    return arr
  }, [filteredDatasets, filter, query])

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
              {userGroups.length > 0 && (
                <select
                  className="dr-select"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  style={{
                    height: '40px',
                    padding: '0 12px',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--input)',
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    marginRight: '8px',
                  }}
                >
                  <option value="all">Todos os grupos / Pessoal</option>
                  <option value="none">Somente Pessoal (Sem grupo)</option>
                  {userGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      Grupo: {g.name}
                    </option>
                  ))}
                </select>
              )}
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
