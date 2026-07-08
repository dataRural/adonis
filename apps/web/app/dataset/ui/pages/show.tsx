import { useState, useEffect } from 'react'
import Navbar from '#common/ui/components/datarural/navbar'
import DatasetHeader from '../components/dataset-header'
import TabBar from '../components/tab-bar'
import OverviewTab from '../components/overview-tab'
import ViewerTab from '../components/viewer-tab'
import FilesTab from '../components/files-tab'
import NotebooksTab from '../components/notebooks-tab'
import DiscussionTab from '../components/discussion-tab'
import Rail from '../components/rail'
import RelatedSection from '../components/related-section'
import Footer from '#common/ui/components/datarural/footer'
import { DS, DatasetDetail } from '../components/detail-data'

import type { InertiaProps } from '#core/ui/types'

type PageProps = InertiaProps<{
  dataset?: DatasetDetail
}>

export default function DatasetShowPage({ dataset }: PageProps) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dr-theme') || 'light'
    }
    return 'light'
  })
  const [tab, setTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dr-detail-tab') || 'overview'
    }
    return 'overview'
  })

  const ds = dataset || DS

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('dr-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('dr-detail-tab', tab)
  }, [tab])

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="dr-app">
      <Navbar theme={theme} onToggleTheme={handleToggleTheme} activePage="datasets" />
      <DatasetHeader ds={ds} />
      <TabBar tab={tab} onTab={setTab} />

      <main className="dr-ds-page">
        <div className="dr-container">
          <div className="dr-ds-layout">
            <div className="dr-ds-main">
              {tab === 'overview' && <OverviewTab />}
              {tab === 'viewer' && <ViewerTab />}
              {tab === 'files' && <FilesTab />}
              {tab === 'notebooks' && <NotebooksTab />}
              {tab === 'discussion' && <DiscussionTab />}
            </div>
            <Rail ds={ds} />
          </div>
        </div>
      </main>

      <RelatedSection />
      <Footer />
    </div>
  )
}
