import DatasetCard, { DatasetItem } from '#common/ui/components/datarural/dataset-card'
import * as Ic from '#common/ui/components/datarural/icons'

interface RelatedSectionProps {
  items?: DatasetItem[]
}

export default function RelatedSection({ items }: RelatedSectionProps) {
  const list = items && items.length > 0 ? items : []


  return (
    <section className="dr-section dr-related-wrap" style={{ paddingTop: 14 }}>
      <div className="dr-container">
        <div className="dr-section-head">
          <div>
            <h2>Datasets relacionados</h2>
            <p>Outros conjuntos da mesma área e linha de pesquisa.</p>
          </div>
          <a className="dr-link-more" href="/#datasets">
            Ver todos <Ic.Arrow size={16} style={{ display: 'inline', marginLeft: 4 }} />
          </a>
        </div>
        <div className="dr-ds-grid">
          {list.map((d: any) => (
            <DatasetCard key={d.id} d={d} />
          ))}
        </div>
      </div>
    </section>
  )
}
