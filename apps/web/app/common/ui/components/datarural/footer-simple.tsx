import { useTranslation } from '#common/ui/hooks/use_translation'

export default function PanelFooter() {
  const { t } = useTranslation()

  return (
    <footer className="dr-footer" style={{ padding: '24px 0' }}>
      <div className="dr-container">
        <div className="dr-footer-bar" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
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
