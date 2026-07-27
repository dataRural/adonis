import { useState } from 'react'
import * as Ic from '#common/ui/components/datarural/icons'
import ColumnStats from './column-stats'
import { QUALITY, DatasetDetail } from './detail-data'

export default function OverviewTab({ ds, columns }: { ds: DatasetDetail; columns?: any[] }) {
  const [hot, setHot] = useState<string | null>(null)
  const finalDs = ds

  return (
    <div>
      {/* README */}
      <div className="dr-panel">
        <div className="dr-panel-head">
          <h3>
            <Ic.Book size={17} className="ic" style={{ marginRight: 6 }} /> Sobre este conjunto de dados
          </h3>
        </div>
        <div className="dr-panel-body">
          <div className="dr-prose">
            {finalDs.description ? (
              <div dangerouslySetInnerHTML={{ __html: finalDs.description }} />
            ) : (
              <p style={{ color: 'var(--muted-foreground)' }}>Nenhuma descrição disponível para este conjunto de dados.</p>
            )}
          </div>
        </div>
      </div>

      {/* Qualidade / usabilidade */}
      <div className="dr-panel">
        <div className="dr-panel-head">
          <h3>
            <Ic.Verified size={17} className="ic" style={{ marginRight: 6 }} /> Índice de usabilidade
          </h3>
          <div className="right">
            <span className="dr-ds-license">como é calculado</span>
          </div>
        </div>
        <div className="dr-panel-body">
          <div className="dr-quality">
            <div className="dr-quality-top">
              <div className="dr-quality-score">
                <span className="v">{finalDs.usability}</span>
                <span className="l">de 10</span>
              </div>
              <p className="lead" style={{ margin: 0 }}>
                Pontuação alta: o conjunto tem <b>documentação completa</b>,{' '}
                <b>proveniência rastreável</b> e <b> licença aberta</b>. Avaliamos completude,
                credibilidade e compatibilidade de uso.
              </p>
            </div>
            <div className="dr-quality-list">
              {QUALITY.map((q) => (
                <div className="dr-quality-item" key={q.label}>
                  <span
                    className="chk"
                    style={{
                      background: q.score >= 1 ? 'var(--brand-green)' : 'var(--brand-yellow)',
                      color: q.score >= 1 ? '#fff' : '#3a2c00',
                    }}
                  >
                    <Ic.Check size={14} />
                  </span>
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span className="dr-qt">{q.label}</span>
                    <span className="dr-qd">{q.desc}</span>
                  </span>
                  <span className="pct">{Math.round(q.score * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dicionário de colunas */}
      <div className="dr-panel">
        <div className="dr-panel-head">
          <h3>
            <Ic.Columns size={17} className="ic" style={{ marginRight: 6 }} /> Dicionário de colunas
          </h3>
          <div className="right">
            <span className="dr-ds-license">{(columns || []).length} colunas</span>
          </div>
        </div>
        <ColumnStats hot={hot} onHot={setHot} columns={columns} />
      </div>
    </div>
  )
}
