import { useState } from 'react'
import * as Ic from '#common/ui/components/datarural/icons'
import ColumnStats from './column-stats'
import { DS, QUALITY, COLUMNS, DatasetDetail } from './detail-data'

export default function OverviewTab({ ds, columns }: { ds?: DatasetDetail; columns?: any[] }) {
  const [hot, setHot] = useState<string | null>(null)
  const finalDs = ds || DS

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
              <>
                <p>
                  Série histórica <b>horária</b> de variáveis meteorológicas registradas pela estação
                  automática do <b>Campus Seropédica</b> da UFRRJ, mantida pelo Laboratório de
                  Agrometeorologia. O conjunto cobre o período de <code>jan/2010</code> a{' '}
                  <code>abr/2026</code> e é atualizado mensalmente.
                </p>
                <p>
                  Cada linha corresponde a uma hora cheia, com agregação das leituras coletadas a cada
                  10 minutos. Os dados passam por controle de qualidade automático (limites físicos,
                  persistência e consistência entre variáveis) e revisão manual trimestral.
                </p>
                <h4>Usos comuns</h4>
                <ul>
                  <li>
                    Climatologia local e cálculo de normais climatológicas para Seropédica e a Baixada
                    Fluminense.
                  </li>
                  <li>
                    Balanço hídrico e evapotranspiração de referência para planejamento de irrigação.
                  </li>
                  <li>Calibração e validação de modelos agrometeorológicos e de previsão.</li>
                  <li>Detecção de eventos extremos — ondas de calor, estiagem e chuvas intensas.</li>
                </ul>
                <h4>Atenção</h4>
                <p>
                  Há pequenas lacunas em <code>radiacao_solar</code> entre 2013 e 2014 por manutenção do
                  sensor; valores ausentes são deixados em branco (não imputados). Consulte a aba{' '}
                  <b>Discussão</b> para detalhes.
                </p>
              </>
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
            <span className="dr-ds-license">{(columns || COLUMNS).length} colunas</span>
          </div>
        </div>
        <ColumnStats hot={hot} onHot={setHot} columns={columns} />
      </div>
    </div>
  )
}
