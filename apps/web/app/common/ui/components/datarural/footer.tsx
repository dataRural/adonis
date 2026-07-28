import { Link } from '@adonisjs/inertia/react'
import { BrandMark } from './brand'

export default function Footer() {
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
              Plataforma institucional de datasets da Universidade Federal Rural do Rio de Janeiro.
            </p>
            <p className="dr-footer-about">
              Dados abertos para ensino, pesquisa e extensão.
            </p>
            <p className="dr-footer-addr">
              R. Savero José Bruno, 485 — Instituto Multidisciplinar
              <br />
              Moquetá, Nova Iguaçu - RJ · CEP 26285-020
            </p>
          </div>
          <div className="dr-footer-col">
            <h4>Plataforma</h4>
            <Link href="/datasets">Explorar datasets</Link>
            <Link href="/dashboard/publish">Publicar dados</Link>
            <a href="#">Coleções</a>
          </div>
          <div className="dr-footer-col">
            <h4>Recursos</h4>
            <a href="#">Documentação</a>
            <a href="#">Sobre licenças</a>
            <a href="#">API de dados</a>
            <a href="#">Política de dados</a>
          </div>
          <div className="dr-footer-col">
            <h4>Institucional</h4>
            <a href="https://portal.ufrrj.br" target="_blank" rel="noopener noreferrer">
              UFRRJ
            </a>
            <a href="#">Pró-Reitorias</a>
            <a href="#">Institutos</a>
            <a href="#">Contato</a>
          </div>
        </div>
        <div className="dr-footer-bar">
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
