import { Link } from '@adonisjs/inertia/react'
import { ArcosClusterMono } from './brand'
import * as Ic from './icons'

export default function PublishCTA() {
  return (
    <section className="dr-section" id="publicar" style={{ paddingTop: 8 }}>
      <div className="dr-container">
        <div className="dr-cta">
          <div className="dr-cta-arcos">
            <ArcosClusterMono color="rgba(255,255,255,0.08)" />
          </div>
          <div className="dr-cta-content">
            <h2>Você produz dados na Rural? Publique-os aqui.</h2>
            <p>
              Transforme planilhas dispersas em um repositório vivo, documentado e reutilizável pela
              comunidade acadêmica.
            </p>
            <div className="dr-cta-steps">
              <div className="dr-cta-step">
                <span className="n">1</span>
                <span className="t">Envie seu arquivo CSV</span>
              </div>
              <div className="dr-cta-step">
                <span className="n">2</span>
                <span className="t">Descreva metadados e licença</span>
              </div>
              <div className="dr-cta-step">
                <span className="n">3</span>
                <span className="t">Publique e acompanhe o uso</span>
              </div>
            </div>
          </div>
          <div className="dr-cta-actions">
            <Link className="dr-btn dr-btn-yellow dr-btn-lg" href="/dashboard/publish">
              <Ic.Download size={18} style={{ transform: 'rotate(180deg)' }} /> Publicar dataset
            </Link>
            <Link
              className="dr-btn dr-btn-lg"
              href="/dashboard"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}
            >
              Meus datasets
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
