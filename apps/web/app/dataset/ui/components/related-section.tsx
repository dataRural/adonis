import DatasetCard from '#common/ui/components/datarural/dataset-card'
import * as Ic from '#common/ui/components/datarural/icons'
import { RELATED } from './detail-data'

export default function RelatedSection() {
  return (
    <section className="dr-section dr-related-wrap" style={{ paddingTop: 14 }}>
      <div className="dr-container">
        <div className="dr-section-head">
          <div>
            <h2>Datasets relacionados</h2>
            <p>Outros conjuntos da mesma região e linha de pesquisa.</p>
          </div>
          <a className="dr-link-more" href="/#datasets">
            Ver todos <Ic.Arrow size={16} style={{ display: 'inline', marginLeft: 4 }} />
          </a>
        </div>
        <div className="dr-ds-grid">
          {RELATED.map((d) => (
            <DatasetCard key={d.id} d={d} />
          ))}
        </div>
      </div>
    </section>
  )
}
