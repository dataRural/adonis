import * as Ic from '#common/ui/components/datarural/icons'
import { COLUMNS } from './detail-data'

interface ColumnStatsProps {
  hot: string | null
  onHot: (key: string | null) => void
}

export default function ColumnStats({ hot, onHot }: ColumnStatsProps) {
  return (
    <div className="dr-coldict">
      {COLUMNS.map((c) => {
        const iconKey = c.icon.charAt(0).toUpperCase() + c.icon.slice(1)
        const CIcon = (Ic as any)[iconKey] || Ic.Sigma
        const isHot = hot === c.key

        return (
          <div
            className={`dr-coldict-row ${isHot ? 'col-hot' : ''}`}
            key={c.key}
            onMouseEnter={() => onHot(c.key)}
            onMouseLeave={() => onHot(null)}
          >
            <div className="dr-col-name">
              <span className="tic">
                <CIcon size={15} />
              </span>
              <span style={{ minWidth: 0 }}>
                <span className="nm" title={c.label}>
                  {c.label}
                </span>
                <br />
                <span className="ty">
                  {c.kind === 'number'
                    ? 'numérico'
                    : c.kind === 'datetime'
                    ? 'data/hora'
                    : 'categoria'}
                  {c.unit ? ' · ' + c.unit : ''}
                </span>
              </span>
            </div>
            <div className="dr-col-desc">
              {c.desc}
              {c.kind === 'number' && (
                <div
                  style={{
                    marginTop: 6,
                    display: 'flex',
                    gap: 14,
                    flexWrap: 'wrap',
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--muted-foreground)',
                  }}
                >
                  <span>
                    mín <b style={{ color: 'var(--foreground)' }}>{c.min}</b>
                  </span>
                  <span>
                    média <b style={{ color: 'var(--foreground)' }}>{c.mean}</b>
                  </span>
                  <span>
                    máx <b style={{ color: 'var(--foreground)' }}>{c.max}</b>
                  </span>
                  <span>
                    σ <b style={{ color: 'var(--foreground)' }}>{c.std}</b>
                  </span>
                </div>
              )}
              {c.kind === 'datetime' && (
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--muted-foreground)',
                  }}
                >
                  intervalo <b style={{ color: 'var(--foreground)' }}>{c.range}</b>
                </div>
              )}
            </div>
            <div className="dr-col-stats">
              <div className="dr-col-bars">
                {c.hist.map((h, i) => (
                  <i key={i} style={{ height: Math.max(2, h * 34) + 'px' }} />
                ))}
              </div>
              <div className="meta">
                <span className="ok">{c.valid}% válidos</span>
                <span>{c.distinct} únicos</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
