import * as Ic from '#common/ui/components/datarural/icons'

interface SuccessProps {
  data: any
  onDashboard: () => void
}

export default function PublishSuccess({ data, onDashboard }: SuccessProps) {
  return (
    <div className="dr-wpanel">
      <div className="dr-publish-success">
        <div className="dr-ps-check">
          <Ic.Check size={44} />
        </div>
        <h2>Dataset enviado para curadoria!</h2>
        <p>
          <strong style={{ color: 'var(--foreground)' }}>{data.title || 'Seu dataset'}</strong>{' '}
          foi recebido e está na fila de revisão da equipe DataRural. Você será notificada por
          e-mail quando ele for ao ar — normalmente em até 2 dias úteis.
        </p>
        <div className="dr-ps-actions">
          <button className="dr-btn dr-btn-primary dr-btn-lg" onClick={onDashboard}>
            <Ic.Layers size={18} /> Ir para Meus datasets
          </button>
          <a
            className="dr-btn dr-btn-outline dr-btn-lg"
            href={`/datasets/1`}
            onClick={() => {
              // we can navigate to detail page or let the user click through
            }}
          >
            <Ic.Eye size={18} /> Pré-visualizar página
          </a>
        </div>
        <div className="dr-ps-meta">
          <div className="pm">
            <span className="k">Status</span>
            <span className="v" style={{ color: 'var(--brand-orange)' }}>
              Em revisão
            </span>
          </div>
          <div className="pm">
            <span className="k">Versão</span>
            <span className="v">v1</span>
          </div>
          <div className="pm">
            <span className="k">Identificador</span>
            <span className="v">DR-2026-0148</span>
          </div>
        </div>
      </div>
    </div>
  )
}
