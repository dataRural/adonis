export interface StatItem {
  val: string
  label: string
  color: string
}

interface StatsStripProps {
  stats?: StatItem[]
}

const DEFAULT_STATS: StatItem[] = [
  { val: '1.247', label: 'Datasets publicados', color: 'var(--brand-blue)' },
  { val: '38,9 mil', label: 'Downloads realizados', color: 'var(--brand-green)' },
  { val: '12', label: 'Institutos contribuindo', color: 'var(--brand-yellow)' },
  { val: '540', label: 'Pesquisadores', color: 'var(--brand-orange)' },
]

export default function StatsStrip({ stats = DEFAULT_STATS }: StatsStripProps) {
  return (
    <div className="dr-container">
      <div className="dr-stats">
        {stats.map((s) => (
          <div className="dr-stat" key={s.label}>
            <span className="dr-stat-val">
              <span className="ic" style={{ background: s.color }}></span>
              {s.val}
            </span>
            <span className="dr-stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
