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
              <th>
                <div className="dr-colhead idxh">
                  <div className="dr-colhead-top">
                    <span className="nm" style={{ color: 'var(--muted-foreground)' }}>
                      #
                    </span>
                  </div>
                </div>
              </th>
              {columns.map((c, idx) => {
                const key = c.key || c.name || `col_${idx}`
                const label = c.label || c.name || c.key || `Col ${idx + 1}`
                const kind = c.kind || c.type
                const typeText =
                  kind === 'number'
                    ? t('dataset.viewer.numeric')
                    : kind === 'datetime'
                    ? t('dataset.viewer.datetime')
                    : (kind || t('dataset.viewer.category'))
                const isHot = hot === key
                const isSort = sortCol === idx

                return (
                  <th key={key} className={isHot ? 'col-hot' : ''}>
                    <div
                      className={'dr-colhead' + (isSort ? ' sorted' : '')}
                      onClick={() => clickSort(idx)}
                      onMouseEnter={() => onHot(key)}
                      onMouseLeave={() => onHot(null)}
                    >
                      <div className="dr-colhead-top">
                        <span className="nm">{label}</span>
                        {c.unit && <span className="un">{c.unit}</span>}
                        <span className="srt">
                          {isSort ? (
                            sortDir === 'asc' ? (
                              <Ic.Up size={13} />
                            ) : (
                              <Ic.Up size={13} style={{ transform: 'rotate(180deg)' }} />
                            )
                          ) : (
                            <Ic.Sort size={13} />
                          )}
                        </span>
                      </div>
                      <div className="dr-colhead-ty">{typeText}</div>
                      <MiniHist hist={c.hist || [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]} />
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {slice.map(({ r, i }) => (
              <tr key={i}>
                <td className="idx">{i + 1}</td>
                {r.map((val, ci) => {
                  const colKey = columns[ci]?.key || columns[ci]?.name || `col_${ci}`
                  return (
                    <td
                      key={ci}
                      className={
                        (ci === 0 ? 'dt' : 'num') + (hot === colKey ? ' col-hot' : '')
                      }
                    >
                      {val !== undefined && val !== null ? String(val) : '—'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="dr-viewer-foot">
        <span>
          {t('dataset.viewer.showing')}{' '}
          <b style={{ color: 'var(--foreground)' }}>
            {page * PAGE + 1}–{Math.min((page + 1) * PAGE, sorted.length)}
          </b>{' '}
          {t('dataset.viewer.of')} <b style={{ color: 'var(--foreground)' }}>{sorted.length}</b> {t('dataset.viewer.rows_label')}{' '}
          <span style={{ opacity: 0.7 }}>· {t('dataset.viewer.sample')}</span>
        </span>
        <span className="spacer"></span>
        <div className="dr-pager">
          <button onClick={() => setPage(0)} disabled={page === 0} title={t('dataset.viewer.first')}>
            <Ic.Chevr size={15} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            title={t('dataset.viewer.previous')}
          >
            <Ic.Chevd size={15} style={{ transform: 'rotate(90deg)' }} />
          </button>
          <span className="pg">
            {page + 1} / {pages}
          </span>
          <button
            onClick={() => setPage(Math.min(pages - 1, page + 1))}
            disabled={page === pages - 1}
            title={t('dataset.viewer.next')}
          >
            <Ic.Chevd size={15} style={{ transform: 'rotate(-90deg)' }} />
          </button>
          <button onClick={() => setPage(pages - 1)} disabled={page === pages - 1} title={t('dataset.viewer.last')}>
            <Ic.Chevr size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ViewerTab({
  ds,
  datasetId,
  selectedVersionId: propsSelectedVersionId,
  selectedFileId: propsSelectedFileId,
  columns = [],
  rows = [],
  filename,
  sizeStr,
  filesList = [],
  files = [],
}: {
  ds?: any
  datasetId?: number
  selectedVersionId?: number
  selectedFileId?: number | null
  columns?: any[]
  rows?: any[][]
  filename?: string
  sizeStr?: string
  filesList?: any[]
  files?: any[]
}) {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'table' | 'columns'>('table')
  const [hot, setHot] = useState<string | null>(null)
  const [selectedFileId, setSelectedFileId] = useState<number | null>(propsSelectedFileId ?? null)

  const availableFiles = filesList.length > 0 ? filesList : files
  const currentFile = availableFiles.find((f) => f.id === selectedFileId || f.id === propsSelectedFileId) || availableFiles[0]

  const finalColumns = currentFile && currentFile.schema ? currentFile.schema : columns
  const finalRows = currentFile && currentFile.sampleRows ? currentFile.sampleRows : rows
  const finalFilename = filename || (currentFile ? currentFile.name : (ds?.fileName || `${ds?.title || 'dados'}.csv`))
  const finalSize = sizeStr || (currentFile ? currentFile.size : (ds?.size || '0 B'))
  const targetDatasetId = datasetId || ds?.id
  const targetVersionId = propsSelectedVersionId || ds?.selectedVersionId

  const handleSelectFile = (fileIdVal: string) => {
    const numericId = Number(fileIdVal)
    setSelectedFileId(numericId)
    if (targetDatasetId) {
      router.visit(`/datasets/${targetDatasetId}?` + (targetVersionId ? `versionId=${targetVersionId}&` : '') + `fileId=${numericId}`, {
        preserveState: true,
        preserveScroll: true,
      })
    }
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
