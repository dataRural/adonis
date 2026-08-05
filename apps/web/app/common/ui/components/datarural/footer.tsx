import { Link } from '@adonisjs/inertia/react'
import { BrandMark } from './brand'
import { useTranslation } from '#common/ui/hooks/use_translation'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="dr-footer">
      <div className="dr-container">
        <div className="dr-footer-grid">
          <div className="dr-footer-brand">
            <Link className="dr-brand" href="/">
              <BrandMark size={36} />
              <span className="dr-brand-text">
                <span className="dr-brand-name">
                  Data<span>Rural</span>
                </span>
                <span className="dr-brand-sub">UFRRJ · Datasets</span>
              </span>
            </Link>
            <p className="dr-footer-about">
              {t('common.footer.about_1')}
            </p>
            <p className="dr-footer-about">
              {t('common.footer.about_2')}
            </p>
            <p className="dr-footer-addr">
              R. Savero José Bruno, 485 — Instituto Multidisciplinar
              <br />
              Moquetá, Nova Iguaçu - RJ · CEP 26285-020
            </p>
          </div>
          <div className="dr-footer-col">
            <h4>{t('common.footer.platform')}</h4>
            <Link href="/datasets">{t('common.footer.explore_datasets')}</Link>
            <Link href="/dashboard/publish">{t('common.footer.publish_data')}</Link>
            <a href="#">{t('common.footer.collections')}</a>
          </div>
          <div className="dr-footer-col">
            <h4>{t('common.footer.resources')}</h4>
            <a href="#">{t('common.footer.documentation')}</a>
            <a href="#">{t('common.footer.about_licenses')}</a>
            <a href="#">{t('common.footer.data_api')}</a>
            <a href="#">{t('common.footer.data_policy')}</a>
          </div>
          <div className="dr-footer-col">
            <h4>{t('common.footer.institutional')}</h4>
            <a href="https://portal.ufrrj.br" target="_blank" rel="noopener noreferrer">
              {t('common.footer.ufrrj')}
            </a>
            <a href="#">{t('common.footer.deanships')}</a>
            <a href="#">{t('common.footer.institutes')}</a>
            <a href="#">{t('common.footer.contact')}</a>
          </div>
        </div>
        <div className="dr-footer-bar">
          <span>{t('common.footer.copyright')}</span>
          <span className="colors" aria-hidden="true">
            <i style={{ background: 'var(--brand-blue)' }}></i>
            <i style={{ background: 'var(--brand-green)' }}></i>
            <i style={{ background: 'var(--brand-yellow)' }}></i>
            <i style={{ background: 'var(--brand-orange)' }}></i>
            <i style={{ background: 'var(--brand-sky)' }}></i>
          </span>
        </div>
      </div>
    </footer>
  )
}
