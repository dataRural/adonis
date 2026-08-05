import DatasetCard, { DatasetItem } from '#common/ui/components/datarural/dataset-card'
import * as Ic from '#common/ui/components/datarural/icons'
import { useTranslation } from '#common/ui/hooks/use_translation'

interface RelatedSectionProps {
  items?: DatasetItem[]
}

export default function RelatedSection({ items }: RelatedSectionProps) {
  const { t } = useTranslation()
  const list = items && items.length > 0 ? items : []

  return (
    <section className="dr-section dr-related-wrap" style={{ paddingTop: 14 }}>
      <div className="dr-container">
        <div className="dr-section-head">
          <div>
            <h2>{t('dataset.show.related_title')}</h2>
            <p>{t('dataset.show.related_sub')}</p>
          </div>
          <a className="dr-link-more" href="/#datasets">
            {t('dataset.show.see_all')} <Ic.Arrow size={16} style={{ display: 'inline', marginLeft: 4 }} />
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
