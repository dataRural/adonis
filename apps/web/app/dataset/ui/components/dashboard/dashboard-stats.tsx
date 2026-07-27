import * as Ic from '#common/ui/components/datarural/icons'

export interface DashboardStatsProps {
  publishedCount: number
  reviewCount: number
}

export default function DashboardStats({ stats }: { stats?: DashboardStatsProps }) {
  const finalStats = [
    { id: 'pub', val: String(stats?.publishedCount ?? 0), label: 'Datasets publicados', icon: 'Database', color: 'var(--brand-blue)', trend: 'Total' },
    { id: 'dl', val: '0', label: 'Downloads totais', icon: 'Download', color: 'var(--brand-green)', trend: '0%' },
    { id: 'views', val: '0', label: 'Visualizações', icon: 'Eye', color: 'var(--brand-sky)', trend: '0%' },
    { id: 'rev', val: String(stats?.reviewCount ?? 0), label: 'Em revisão', icon: 'History', color: 'var(--brand-orange)', trend: 'Curadoria' },
  ]

  return (
    <div className="dr-mstats">
      {finalStats.map((s) => {
        const Icon = (Ic as any)[s.icon] || Ic.Database
        return (
          <div className="dr-mstat" key={s.id}>
            <div className="dr-mstat-top">
              <span className="dr-mstat-ic" style={{ background: s.color }}>
                <Icon size={18} />
              </span>
              <span className="dr-mstat-trend">
                <Ic.Up size={12} style={{ marginRight: 4, display: 'inline' }} /> {s.trend}
              </span>
            </div>
            <span className="dr-mstat-val">{s.val}</span>
            <span className="dr-mstat-label">{s.label}</span>
          </div>
        )
      })}
    </div>
  )
}
