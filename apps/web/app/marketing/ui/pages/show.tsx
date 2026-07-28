import { useState, useMemo, useEffect } from 'react'
import { Head, router } from '@inertiajs/react'
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
  const [activeCat] = useState<string | null>(null)
  const [tab, setTab] = useState('recent')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('dr-theme', theme)
  }, [theme])

  const normalize = (str: string) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const list = useMemo(() => {
    let arr = datasets.slice()
    if (activeCat) {
      const catLower = activeCat.toLowerCase().trim()
      arr = arr.filter((d) => d.cat && d.cat.toLowerCase().trim() === catLower)
    }

    const raw = query.trim()
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

  const handleSearch = () => {
    if (query.trim()) {
      router.visit(`/datasets?search=${encodeURIComponent(query.trim())}`)
    } else {
      router.visit('/datasets')
    }
  }

  const handleChip = (t: string) => {
    router.visit(`/datasets?search=${encodeURIComponent(t)}`)
  }

  const handlePickCategory = (catId: string | null) => {
    if (catId) {
      router.visit(`/datasets?area=${encodeURIComponent(catId)}`)
    } else {
      router.visit('/datasets')
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
        onSearch={handleSearch}
      />
      <StatsStrip stats={stats} />
      <Categories active={activeCat} onPick={handlePickCategory} categories={categories} />
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
