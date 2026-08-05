import * as Ic from '#common/ui/components/datarural/icons'
import { useTranslation } from '#common/ui/hooks/use_translation'

export interface DashboardStatsProps {
  publishedCount: number
  reviewCount?: number
  likesCount?: number
}

export default function DashboardStats({ stats }: { stats?: DashboardStatsProps }) {
  const { t } = useTranslation()

  const finalStats = [
    { id: 'pub', val: String(stats?.publishedCount ?? 0), label: t('dataset.dashboard.stats_published'), icon: 'Database', color: 'var(--brand-blue)', trend: t('dataset.dashboard.stats_trend') },
    { id: 'likes', val: String(stats?.likesCount ?? 0), label: t('dataset.dashboard.stats_likes'), icon: 'Heart', color: 'var(--brand-green)', trend: t('dataset.dashboard.stats_trend') },
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
