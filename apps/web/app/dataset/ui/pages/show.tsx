import { useState, useEffect } from 'react'
import { Head } from '@inertiajs/react'
import Navbar from '#common/ui/components/datarural/navbar'
import DatasetHeader from '../components/dataset-header'
import TabBar from '../components/tab-bar'
import OverviewTab from '../components/overview-tab'
import ViewerTab from '../components/viewer-tab'
import FilesTab from '../components/files-tab'
import VersionsTab from '../components/versions-tab'
import Rail from '../components/rail'
import RelatedSection from '../components/related-section'
import Footer from '#common/ui/components/datarural/footer'
import { DatasetDetail } from '../components/detail-data'

import type { InertiaProps } from '#core/ui/types'

type PageProps = InertiaProps<{
  dataset: DatasetDetail
  previewColumns?: any[]
  previewRows?: any[][]
  versions?: any[]
  related?: any[]
}>

export default function DatasetShowPage({ dataset, previewColumns, previewRows, versions, related }: PageProps) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dr-theme') || 'light'
    }
    return 'light'
  })
  const [tab, setTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dr-detail-tab')
      if (stored === 'overview' || stored === 'viewer' || stored === 'files' || stored === 'versions') return stored
    }
    return 'overview'
  })

  const ds = dataset

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

  const currentVersionObj = versions?.find((v) => v.isSelected) || versions?.[0]
  const versionFiles = currentVersionObj?.files || []

  return (
    <div className="dr-app">
      <Head title={ds.title || "Dataset"} />
      <Navbar theme={theme} onToggleTheme={handleToggleTheme} activePage="datasets" />
      <DatasetHeader ds={ds} latestVersionId={versions && versions[0]?.id} />
      <TabBar tab={tab} onTab={setTab} filesCount={(ds as any).filesCount || versionFiles.length} versionsCount={versions?.length} />

      <main className="dr-ds-page">
        <div className="dr-container">
          <div className="dr-ds-layout">
            <div className="dr-ds-main">
              {tab === 'overview' && <OverviewTab ds={ds} columns={previewColumns} />}
              {tab === 'viewer' && (
                <ViewerTab
                  ds={ds}
                  datasetId={ds.id}
                  selectedVersionId={(ds as any).selectedVersionId}
                  selectedFileId={(ds as any).selectedFileId}
                  columns={previewColumns}
                  rows={previewRows}
                  filename={(ds as any).selectedFileName || (ds.title + '.' + (ds.format || 'csv').toLowerCase())}
                  sizeStr={(ds as any).selectedFileSizeStr || ds.size}
                  filesList={versionFiles}
                />
              )}
              {tab === 'files' && <FilesTab ds={ds} versions={versions} />}
              {tab === 'versions' && <VersionsTab ds={ds} versions={versions} />}
            </div>
            <Rail ds={ds} />
          </div>
        </div>
      </main>

      <RelatedSection items={related} />
      <Footer />
    </div>
  )
}
