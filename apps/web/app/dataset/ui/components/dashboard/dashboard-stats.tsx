import * as Ic from '#common/ui/components/datarural/icons'
import { MY_STATS } from './panel-data'

export default function DashboardStats() {
  return (
    <div className="dr-mstats">
      {MY_STATS.map((s) => {
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
