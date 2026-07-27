import DatasetCard, { DatasetItem } from './dataset-card'
import * as Ic from './icons'

interface DatasetsSectionProps {
  list: DatasetItem[]
  tab: string
  onTab: (tab: string) => void
  view: 'grid' | 'list'
  onView: (view: 'grid' | 'list') => void
  activeCat: string | null
}

export default function DatasetsSection({
  list,
  tab,
  onTab,
  view,
  onView,
  activeCat,
}: DatasetsSectionProps) {
  const tabs = [
    { id: 'featured', label: 'Em destaque' },
    { id: 'downloads', label: 'Mais baixados' },
    { id: 'recent', label: 'Recentes' },
  ]

  return (
    <section className="dr-section" id="datasets" style={{ paddingTop: 8 }}>
      <div className="dr-container">
        <div className="dr-section-head">
          <div>
            <h2>Datasets</h2>
            <p>
              {list.length} {list.length === 1 ? 'conjunto' : 'conjuntos'} de dados{' '}
              {activeCat ? 'nesta área' : 'disponíveis'}.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="dr-tabs">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  className={`dr-tab ${tab === t.id ? 'active' : ''}`}
                  onClick={() => onTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="dr-tabs" role="group" aria-label="Visualização">
              <button
                className={`dr-tab ${view === 'grid' ? 'active' : ''}`}
                onClick={() => onView('grid')}
                title="Grade"
                aria-label="Grade"
              >
                <Ic.Grid size={16} />
              </button>
              <button
                className={`dr-tab ${view === 'list' ? 'active' : ''}`}
                onClick={() => onView('list')}
                title="Lista"
                aria-label="Lista"
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
