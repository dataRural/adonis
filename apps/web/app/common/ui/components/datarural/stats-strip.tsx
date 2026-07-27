export interface StatItem {
  val: string
  label: string
  color: string
}

interface StatsStripProps {
  stats?: StatItem[]
}

const DEFAULT_STATS: StatItem[] = [
  { val: '0', label: 'Datasets públicos', color: 'var(--brand-blue)' },
  { val: '10', label: 'Áreas do conhecimento', color: 'var(--brand-green)' },
  { val: '0', label: 'Grupos de pesquisa', color: 'var(--brand-yellow)' },
  { val: '0', label: 'Pesquisadores', color: 'var(--brand-orange)' },
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
