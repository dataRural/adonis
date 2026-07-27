export default function PanelFooter() {
  return (
    <footer className="dr-footer" style={{ padding: '24px 0' }}>
      <div className="dr-container">
        <div className="dr-footer-bar" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
          <span>© 2026 Universidade Federal Rural do Rio de Janeiro · DataRural</span>
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
