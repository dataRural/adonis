import { useState, useMemo, useEffect } from 'react'
import Navbar from '#common/ui/components/datarural/navbar'
import Hero from '#common/ui/components/datarural/hero'
import StatsStrip from '#common/ui/components/datarural/stats-strip'
import Categories from '#common/ui/components/datarural/categories'
import DatasetsSection from '#common/ui/components/datarural/datasets-section'
import PublishCTA from '#common/ui/components/datarural/publish-cta'
import Footer from '#common/ui/components/datarural/footer'
import { MOCK_DATASETS } from '#common/ui/utils/mock-data'

export default function Page() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dr-theme') || 'light'
    }
    return 'light'
  })
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [tab, setTab] = useState('featured')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('dr-theme', theme)
  }, [theme])

  const list = useMemo(() => {
    let arr = MOCK_DATASETS.slice()
    if (activeCat) {
      arr = arr.filter((d) => d.cat === activeCat)
    }
    const q = query.trim().toLowerCase()
    if (q) {
      arr = arr.filter((d) =>
        (d.title + ' ' + d.unit + ' ' + d.desc + ' ' + d.tags.join(' ')).toLowerCase().includes(q)
      )
    }
    if (tab === 'downloads') {
      arr.sort((a, b) => b.downloads - a.downloads)
    } else if (tab === 'recent') {
      arr = arr.filter((d) => d.recent).concat(arr.filter((d) => !d.recent))
    } else {
      arr.sort((a, b) => {
        if (b.featured === a.featured) {
          return a.order - b.order
        }
        return b.featured ? 1 : -1
      })
    }
    return arr
  }, [query, activeCat, tab])

  const handleChip = (t: string) => {
    setQuery(t)
    const el = document.getElementById('datasets')
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth',
      })
    }
  }

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="dr-app">
      <Navbar theme={theme} onToggleTheme={handleToggleTheme} />
      <Hero
        query={query}
        onQuery={setQuery}
        onChip={handleChip}
      />
      <StatsStrip />
      <Categories active={activeCat} onPick={setActiveCat} />
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
