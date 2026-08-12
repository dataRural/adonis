import { useTranslation } from '#common/ui/hooks/use_translation'

export interface StatItem {
  val: string
  label: string
  color: string
}

interface StatsStripProps {
  stats?: StatItem[]
}

export default function StatsStrip({ stats }: StatsStripProps) {
  const { t } = useTranslation()

  const labelMap: Record<string, string> = {
    'Datasets públicos': t('marketing.stats.public_datasets'),
    'Áreas do conhecimento': t('marketing.stats.knowledge_areas'),
    'Grupos de pesquisa': t('marketing.stats.research_groups'),
    'Pesquisadores': t('marketing.stats.researchers'),
  }

  const defaultStats: StatItem[] = [
    { val: '0', label: t('marketing.stats.public_datasets'), color: 'var(--brand-blue)' },
    { val: '10', label: t('marketing.stats.knowledge_areas'), color: 'var(--brand-green)' },
    { val: '0', label: t('marketing.stats.research_groups'), color: 'var(--brand-yellow)' },
    { val: '0', label: t('marketing.stats.researchers'), color: 'var(--brand-orange)' },
  ]

  const rawItems = stats || defaultStats
  const items = rawItems.map((s) => ({
    ...s,
    label: labelMap[s.label] || s.label,
  }))

  return (
    <div className="dr-container">
      <div className="dr-stats">
        {items.map((s) => (
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
