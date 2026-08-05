import { useState, useMemo } from 'react'
import { router } from '@inertiajs/react'
import * as Ic from '#common/ui/components/datarural/icons'
import ColumnStats from './column-stats'
import { useTranslation } from '#common/ui/hooks/use_translation'

function MiniHist({ hist }: { hist: number[] }) {
  return (
    <div className="dr-minihist">
      {hist.map((h, i) => (
        <i key={i} style={{ height: Math.max(2, h * 26) + 'px' }} />
      ))}
    </div>
  )
}

interface DataTableProps {
  hot: string | null
  onHot: (key: string | null) => void
}

function DataTable({ hot, onHot, columns, rows }: DataTableProps & { columns: any[]; rows: any[][] }) {
  const PAGE = 6
  const [page, setPage] = useState(0)
  const [sortCol, setSortCol] = useState<number | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const { t } = useTranslation()

  const sorted = useMemo(() => {
    const arr = rows.map((r, i) => ({ r, i }))
    if (sortCol !== null) {
      arr.sort((a, b) => {
        const x = a.r[sortCol] || ''
        const y = b.r[sortCol] || ''
        const nx = Number(x)
        const ny = Number(y)
        if (!isNaN(nx) && !isNaN(ny)) {
          return sortDir === 'asc' ? nx - ny : ny - nx
        }
        return sortDir === 'asc' ? String(x).localeCompare(String(y)) : String(y).localeCompare(String(x))
      })
    }
    return arr
  }, [rows, sortCol, sortDir])

  const pages = Math.ceil(sorted.length / PAGE)
  const slice = sorted.slice(page * PAGE, page * PAGE + PAGE)

  const clickSort = (idx: number) => {
    if (sortCol === idx) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(idx)
      setSortDir(idx === 0 ? 'asc' : 'desc')
    }
    setPage(0)
  }

  return (
    <div>
      <div className="dr-tbl-wrap">
        <table className="dr-tbl">
          <thead>
            <tr>
              <th style={{ width: 40, textAlign: 'center', color: 'var(--muted-foreground)' }}>#</th>
              {columns.map((c, idx) => {
                const isHot = hot === c.key
                const isSort = sortCol === idx
                return (
                  <th key={c.key} className={isHot ? 'hot' : ''}>
                    <div className="dr-th-inner">
                      <span className="dr-th-name" onClick={() => clickSort(idx)}>
                        {c.label || c.key}
                        <Ic.Sort size={12} style={{ opacity: isSort ? 1 : 0.4, marginLeft: 4 }} />
                      </span>
                      <span className="dr-th-type">{c.type || 'string'}</span>
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {slice.map((item, rowIdx) => (
              <tr key={rowIdx}>
                <td style={{ textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 12 }}>
                  {page * PAGE + rowIdx + 1}
                </td>
                {columns.map((c, colIdx) => {
                  const val = item.r[colIdx]
                  const isHot = hot === c.key
                  return (
                    <td key={c.key} className={isHot ? 'hot' : ''}>
                      {val !== undefined && val !== null ? String(val) : '—'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="dr-tbl-foot" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
            {t('dataset.viewer.page_info', { current: page + 1, total: pages })}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="dr-btn dr-btn-outline dr-btn-sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              style={page === 0 ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
            >
              {t('dataset.viewer.previous_page')}
            </button>
            <button
              className="dr-btn dr-btn-outline dr-btn-sm"
              disabled={page >= pages - 1}
              onClick={() => setPage((p) => p + 1)}
              style={page >= pages - 1 ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
            >
              {t('dataset.viewer.next_page')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ViewerTab({
  ds,
  columns = [],
  rows = [],
  files = [],
}: {
  ds: any
  columns?: any[]
  rows?: any[][]
  files?: any[]
}) {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'table' | 'columns'>('table')
  const [hot, setHot] = useState<string | null>(null)
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null)

  const availableFiles = files && files.length > 0 ? files : []
  const currentFile = availableFiles.find((f) => f.id === selectedFileId) || availableFiles[0]

  const finalColumns = currentFile && currentFile.schema ? currentFile.schema : columns
  const finalRows = currentFile && currentFile.sampleRows ? currentFile.sampleRows : rows
  const finalFilename = currentFile ? currentFile.name : ds.fileName || `${ds.title}.csv`
  const finalSize = currentFile ? currentFile.size : ds.size || '0 B'

  const handleSelectFile = (fileIdVal: string) => {
    const numericId = Number(fileIdVal)
    setSelectedFileId(numericId)
    router.visit(`/datasets/${ds.id}?versionId=${ds.selectedVersionId || ''}&fileId=${numericId}`, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  return (
    <div className="dr-viewer">
      <div className="dr-viewer-toolbar">
        {availableFiles.length > 1 ? (
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <Ic.File size={15} className="ic" style={{ position: 'absolute', left: 10, pointerEvents: 'none', color: 'var(--brand-green)' }} />
            <select
              className="dr-file-select"
              value={selectedFileId ?? availableFiles[0]?.id ?? ''}
              onChange={(e) => handleSelectFile(e.target.value)}
              style={{
                paddingLeft: 30,
                paddingRight: 28,
                appearance: 'none',
                WebkitAppearance: 'none',
                cursor: 'pointer',
                background: 'var(--card)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                height: 34,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {availableFiles.map((f, idx) => (
                <option key={f.id || idx} value={f.id ?? ''}>
                  {f.name} ({f.size}){f.isPrimary ? ` — ${t('dataset.viewer.main_dataset')}` : ''}
                </option>
              ))}
            </select>
            <Ic.Chevd size={14} style={{ position: 'absolute', right: 8, pointerEvents: 'none', color: 'var(--muted-foreground)' }} />
          </div>
        ) : (
          <button className="dr-file-select" onClick={(e) => e.preventDefault()}>
            <Ic.File size={15} className="ic" style={{ marginRight: 6 }} />
            {finalFilename}
            <span className="sz" style={{ marginLeft: 6 }}>
              · {finalSize}
            </span>
          </button>
        )}
        <span className="vt-info">
          <b>{finalRows.length}</b> {t('dataset.viewer.rows')} · <b>{finalColumns.length}</b> {t('dataset.viewer.columns')}
        </span>
        <span className="spacer"></span>
        <div className="dr-viewer-toggle">
          <button className={mode === 'table' ? 'on' : ''} onClick={() => setMode('table')}>
            <Ic.Table size={14} style={{ marginRight: 4 }} /> {t('dataset.viewer.mode_table')}
          </button>
          <button className={mode === 'columns' ? 'on' : ''} onClick={() => setMode('columns')}>
            <Ic.Columns size={14} style={{ marginRight: 4 }} /> {t('dataset.viewer.mode_columns')}
          </button>
        </div>
      </div>
      {mode === 'table' ? (
        <DataTable hot={hot} onHot={setHot} columns={finalColumns} rows={finalRows} />
      ) : (
        <ColumnStats hot={hot} onHot={setHot} />
      )}
    </div>
  )
}
