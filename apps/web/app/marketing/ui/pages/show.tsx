import { useState, useMemo, useEffect } from 'react'
import { Head } from '@inertiajs/react'
import Navbar from '#common/ui/components/datarural/navbar'
import Hero from '#common/ui/components/datarural/hero'
import StatsStrip from '#common/ui/components/datarural/stats-strip'
import Categories from '#common/ui/components/datarural/categories'
import DatasetsSection from '#common/ui/components/datarural/datasets-section'
import PublishCTA from '#common/ui/components/datarural/publish-cta'
import Footer from '#common/ui/components/datarural/footer'
import { DatasetItem } from '#common/ui/utils/mock-data'
import { StatItem } from '#common/ui/components/datarural/stats-strip'
import { CategoryItem } from '#common/ui/components/datarural/categories'
import type { InertiaProps } from '#core/ui/types'

type PageProps = InertiaProps<{
  datasets?: DatasetItem[]
  stats?: StatItem[]
  categories?: CategoryItem[]
}>

export default function Page({ datasets = [], stats, categories }: PageProps) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dr-theme') || 'light'
    }
    return 'light'
  })
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [tab, setTab] = useState('recent')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('dr-theme', theme)
  }, [theme])

  const list = useMemo(() => {
    let arr = datasets.slice()
    if (activeCat) {
      const catLower = activeCat.toLowerCase().trim()
      arr = arr.filter((d) => d.cat && d.cat.toLowerCase().trim() === catLower)
    }

    const q = query.trim().toLowerCase()
    if (q) {
      arr = arr.filter((d) => {
        const titleText = (d.title || d.name || '').toLowerCase()
        const unitText = (d.unit || '').toLowerCase()
        const descText = (d.desc || d.description || '').toLowerCase()
        const tagText = d.tags ? d.tags.join(' ').toLowerCase() : ''
        return titleText.includes(q) || unitText.includes(q) || descText.includes(q) || tagText.includes(q)
      })
    }

    if (tab === 'recent') {
      arr.sort((a, b) => b.id - a.id)
    } else if (tab === 'featured') {
      arr.sort((a, b) => {
        const scoreA = Number(a.usability) || 0
        const scoreB = Number(b.usability) || 0
        if (scoreA !== scoreB) {
          return scoreB - scoreA
        }
        return b.id - a.id
      })
    }

    return arr
  }, [datasets, query, activeCat, tab])

  const handleChip = (t: string) => {
    setQuery(t)
    const el = document.getElementById('datasets')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="dr-app">
      <Head title="DataRural" />
      <Navbar theme={theme} onToggleTheme={handleToggleTheme} />
      <Hero
        query={query}
        onQuery={setQuery}
        onChip={handleChip}
      />
      <StatsStrip stats={stats} />
      <Categories active={activeCat} onPick={setActiveCat} categories={categories} />
      <DatasetsSection
        list={list}
        tab={tab}
        onTab={setTab}
        view={view}
        onView={setView}
        activeCat={activeCat}
      />
      <PublishCTA />
      <Footer />
    </div>
  )
}
