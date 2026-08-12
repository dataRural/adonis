import { Link } from '@adonisjs/inertia/react'
import { ArcosClusterMono } from './brand'
import * as Ic from './icons'
import { useTranslation } from '#common/ui/hooks/use_translation'

export default function PublishCTA() {
  const { t } = useTranslation()

  return (
    <section className="dr-section" id="publicar" style={{ paddingTop: 8 }}>
      <div className="dr-container">
        <div className="dr-cta">
          <div className="dr-cta-arcos">
            <ArcosClusterMono color="rgba(255,255,255,0.08)" />
          </div>
          <div className="dr-cta-content">
            <h2>{t('marketing.publish_cta.title')}</h2>
            <p>
              {t('marketing.publish_cta.subtitle')}
            </p>
            <div className="dr-cta-steps">
              <div className="dr-cta-step">
                <span className="n">1</span>
                <span className="t">{t('marketing.publish_cta.step1')}</span>
              </div>
              <div className="dr-cta-step">
                <span className="n">2</span>
                <span className="t">{t('marketing.publish_cta.step2')}</span>
              </div>
              <div className="dr-cta-step">
                <span className="n">3</span>
                <span className="t">{t('marketing.publish_cta.step3')}</span>
              </div>
            </div>
          </div>
          <div className="dr-cta-actions">
            <Link className="dr-btn dr-btn-yellow dr-btn-lg" href="/dashboard/publish">
              <Ic.Download size={18} style={{ transform: 'rotate(180deg)' }} /> {t('marketing.publish_cta.btn_publish')}
            </Link>
            <Link
              className="dr-btn dr-btn-lg"
              href="/dashboard"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}
            >
              {t('marketing.publish_cta.btn_my_datasets')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
