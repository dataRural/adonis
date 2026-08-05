import * as Ic from '#common/ui/components/datarural/icons'
import { useTranslation } from '#common/ui/hooks/use_translation'

interface SuccessProps {
  data: any
  onDashboard: () => void
}

export default function PublishSuccess({ data, onDashboard }: SuccessProps) {
  const { t } = useTranslation()

  return (
    <div className="dr-wpanel">
      <div className="dr-publish-success">
        <div className="dr-ps-check">
          <Ic.Check size={44} />
        </div>
        <h2>{t('dataset.publish_success.heading')}</h2>
        <p>
          <strong style={{ color: 'var(--foreground)' }}>{data.title || 'Seu dataset'}</strong>{' '}
          {t('dataset.publish_success.message')}
        </p>
        <div className="dr-ps-actions">
          <button className="dr-btn dr-btn-primary dr-btn-lg" onClick={onDashboard}>
            <Ic.Layers size={18} /> {t('dataset.publish_success.my_datasets')}
          </button>
          <a
            className="dr-btn dr-btn-outline dr-btn-lg"
            href={`/datasets/1`}
            onClick={() => {
              // we can navigate to detail page or let the user click through
            }}
          >
            <Ic.Eye size={18} /> {t('dataset.publish_success.preview')}
          </a>
        </div>
        <div className="dr-ps-meta">
          <div className="pm">
            <span className="k">{t('dataset.publish_success.status')}</span>
            <span className="v" style={{ color: 'var(--brand-orange)' }}>
              {t('dataset.publish_success.in_review')}
            </span>
          </div>
          <div className="pm">
            <span className="k">{t('dataset.publish_success.version')}</span>
            <span className="v">v1</span>
          </div>
          <div className="pm">
            <span className="k">{t('dataset.publish_success.identifier')}</span>
            <span className="v">DR-2026-0148</span>
          </div>
        </div>
      </div>
    </div>
  )
}
