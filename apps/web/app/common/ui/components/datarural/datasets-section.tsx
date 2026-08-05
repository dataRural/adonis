import DatasetCard, { DatasetItem } from './dataset-card'
import * as Ic from './icons'
import { useTranslation } from '#common/ui/hooks/use_translation'

interface DatasetsSectionProps {
  list: DatasetItem[]
  tab: string
  onTab: (tab: string) => void
  view: 'grid' | 'list'
  onView: (view: 'grid' | 'list') => void
  activeCat?: string | null
}

export default function DatasetsSection({
  list,
  tab,
  onTab,
  view,
  onView,
}: DatasetsSectionProps) {
  const { t } = useTranslation()

  const tabs = [
    { id: 'recent', label: t('marketing.datasets_section.tab_recent') },
    { id: 'featured', label: t('marketing.datasets_section.tab_featured') },
  ]

  return (
    <section className="dr-section" id="datasets" style={{ paddingTop: 8 }}>
      <div className="dr-container">
        <div className="dr-section-head">
          <div>
            <h2>{t('marketing.datasets_section.title')}</h2>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="dr-tabs">
              {tabs.map((tabItem) => (
                <button
                  key={tabItem.id}
                  className={`dr-tab ${tab === tabItem.id ? 'active' : ''}`}
                  onClick={() => onTab(tabItem.id)}
                >
                  {tabItem.label}
                </button>
              ))}
            </div>
            <div className="dr-tabs" role="group" aria-label={t('marketing.datasets_section.title')}>
              <button
                className={`dr-tab ${view === 'grid' ? 'active' : ''}`}
                onClick={() => onView('grid')}
                title={t('marketing.datasets_section.view_grid')}
                aria-label={t('marketing.datasets_section.view_grid')}
              >
                <Ic.Grid size={16} />
              </button>
              <button
                className={`dr-tab ${view === 'list' ? 'active' : ''}`}
                onClick={() => onView('list')}
                title={t('marketing.datasets_section.view_list')}
                aria-label={t('marketing.datasets_section.view_list')}
              >
                <Ic.Rows size={16} />
              </button>
            </div>
          </div>
        </div>

        <div
          className="dr-ds-grid"
          style={view === 'list' ? { gridTemplateColumns: '1fr' } : undefined}
        >
          {list.length === 0 ? (
            <div className="dr-no-results">
              <strong>Nenhum dataset encontrado</strong>
              Ajuste a busca ou remova os filtros para ver mais resultados.
            </div>
          ) : (
            list.map((d) => <DatasetCard key={d.id} d={d} />)
          )}
        </div>
      </div>
    </section>
  )
}
