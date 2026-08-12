import * as Ic from '#common/ui/components/datarural/icons'
import { useTranslation } from '#common/ui/hooks/use_translation'

interface ColumnStatsProps {
  hot: string | null
  onHot: (key: string | null) => void
  columns?: any[]
}

export default function ColumnStats({ hot, onHot, columns }: ColumnStatsProps) {
  const { t } = useTranslation()
  const finalColumns = columns && columns.length > 0 ? columns : []

  return (
    <div className="dr-coldict">
      {finalColumns.map((c) => {
        const iconName = c.icon || 'sigma'
        const iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1)
        const CIcon = (Ic as any)[iconKey] || Ic.Sigma
        const isHot = hot === c.key

        const min = c.min ?? '0'
        const mean = c.mean ?? c.avg ?? '0'
        const max = c.max ?? '0'
        const std = c.std ?? '0'
        const range = c.range ?? '0'
        const valid = c.valid ?? '100'
        const distinct = c.distinct ?? '---'

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
                    ? t('dataset.column_stats.kind_numeric')
                    : c.kind === 'datetime'
                      ? t('dataset.column_stats.kind_datetime')
                      : t('dataset.column_stats.kind_category')}
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
                    {t('dataset.column_stats.min')} <b style={{ color: 'var(--foreground)' }}>{min}</b>
                  </span>
                  <span>
                    {t('dataset.column_stats.mean')} <b style={{ color: 'var(--foreground)' }}>{mean}</b>
                  </span>
                  <span>
                    {t('dataset.column_stats.max')} <b style={{ color: 'var(--foreground)' }}>{max}</b>
                  </span>
                  <span>
                    σ <b style={{ color: 'var(--foreground)' }}>{std}</b>
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
                  {t('dataset.column_stats.range')} <b style={{ color: 'var(--foreground)' }}>{range}</b>
                </div>
              )}
            </div>
            <div className="dr-col-stats">
              <div className="dr-col-bars">
                {(c.hist || [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]).map((h: number, i: number) => (
                  <i key={i} style={{ height: Math.max(2, h * 34) + 'px' }} />
                ))}
              </div>
              <div className="meta">
                <span className="ok">{t('dataset.column_stats.valid_pct', { valid })}</span>
                <span>{t('dataset.column_stats.unique_count', { count: distinct })}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
