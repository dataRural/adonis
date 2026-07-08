import { useState, useMemo } from 'react'
import * as Ic from '#common/ui/components/datarural/icons'
import ColumnStats from './column-stats'
import { COLUMNS, ROWS } from './detail-data'

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

function DataTable({ hot, onHot }: DataTableProps) {
  const PAGE = 6
  const [page, setPage] = useState(0)
  const [sortCol, setSortCol] = useState<number | null>(null) // index of the column
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const sorted = useMemo(() => {
    const arr = ROWS.map((r, i) => ({ r, i }))
    if (sortCol !== null) {
      arr.sort((a, b) => {
        let x = a.r[sortCol]
        let y = b.r[sortCol]
        if (sortCol === 0) {
          x = String(x)
          y = String(y)
          return sortDir === 'asc' ? x.localeCompare(y) : y.localeCompare(x)
        }
        return sortDir === 'asc' ? (x as number) - (y as number) : (y as number) - (x as number)
      })
    }
    return arr
  }, [sortCol, sortDir])

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
              {COLUMNS.map((c, idx) => (
                <th key={c.key} className={hot === c.key ? 'col-hot' : ''}>
                  <div
                    className={'dr-colhead' + (sortCol === idx ? ' sorted' : '')}
                    onClick={() => clickSort(idx)}
                    onMouseEnter={() => onHot(c.key)}
                    onMouseLeave={() => onHot(null)}
                  >
                    <div className="dr-colhead-top">
                      <span className="nm">{c.label}</span>
                      {c.unit && <span className="un">{c.unit}</span>}
                      <span className="srt">
                        {sortCol === idx ? (
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
                    <div className="dr-colhead-ty">
                      {c.kind === 'number'
                        ? 'numérico'
                        : c.kind === 'datetime'
                        ? 'data/hora'
                        : 'categoria'}
                    </div>
                    <MiniHist hist={c.hist} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map(({ r, i }) => (
              <tr key={i}>
                <td className="idx">{i + 1}</td>
                {r.map((val, ci) => (
                  <td
                    key={ci}
                    className={
                      (ci === 0 ? 'dt' : 'num') + (hot === COLUMNS[ci].key ? ' col-hot' : '')
                    }
                  >
                    {ci === 0
                      ? String(val)
                      : Number.isInteger(val)
                      ? String(val)
                      : (val as number).toFixed(1)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="dr-viewer-foot">
        <span>
          Mostrando{' '}
          <b style={{ color: 'var(--foreground)' }}>
            {page * PAGE + 1}–{Math.min((page + 1) * PAGE, sorted.length)}
          </b>{' '}
          de <b style={{ color: 'var(--foreground)' }}>84.216</b> linhas{' '}
          <span style={{ opacity: 0.7 }}>· amostra</span>
        </span>
        <span className="spacer"></span>
        <div className="dr-pager">
          <button onClick={() => setPage(0)} disabled={page === 0} title="Primeira">
            <Ic.Chevr size={15} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            title="Anterior"
          >
            <Ic.Chevd size={15} style={{ transform: 'rotate(90deg)' }} />
          </button>
          <span className="pg">
            {page + 1} / {pages}
          </span>
          <button
            onClick={() => setPage(Math.min(pages - 1, page + 1))}
            disabled={page === pages - 1}
            title="Próxima"
          >
            <Ic.Chevd size={15} style={{ transform: 'rotate(-90deg)' }} />
          </button>
          <button onClick={() => setPage(pages - 1)} disabled={page === pages - 1} title="Última">
            <Ic.Chevr size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ViewerTab() {
  const [mode, setMode] = useState<'table' | 'columns'>('table')
  const [hot, setHot] = useState<string | null>(null)

  return (
    <div className="dr-viewer">
      <div className="dr-viewer-toolbar">
        <button className="dr-file-select" onClick={(e) => e.preventDefault()}>
          <Ic.File size={15} className="ic" style={{ marginRight: 6 }} />
          seropedica_horario_2010_2026.csv
          <span className="sz" style={{ marginLeft: 6 }}>· 11,2 MB</span>
          <Ic.Chevd size={14} style={{ color: 'var(--muted-foreground)', marginLeft: 6 }} />
        </button>
        <span className="vt-info">
          <b>84.216</b> linhas · <b>8</b> colunas
        </span>
        <span className="spacer"></span>
        <div className="dr-viewer-toggle">
          <button className={mode === 'table' ? 'on' : ''} onClick={() => setMode('table')}>
            <Ic.Table size={14} style={{ marginRight: 4 }} /> Tabela
          </button>
          <button className={mode === 'columns' ? 'on' : ''} onClick={() => setMode('columns')}>
            <Ic.Columns size={14} style={{ marginRight: 4 }} /> Colunas
          </button>
        </div>
      </div>
      {mode === 'table' ? (
        <DataTable hot={hot} onHot={setHot} />
      ) : (
        <ColumnStats hot={hot} onHot={setHot} />
      )}
    </div>
  )
}
