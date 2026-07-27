import { useState } from 'react'
import * as Ic from '#common/ui/components/datarural/icons'
import { NOTEBOOKS, SNIPPET } from './detail-data'

function CodeSnippet() {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(SNIPPET)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    }
  }

  return (
    <div className="dr-codeblock">
      <div className="dr-codeblock-head">
        <span className="dots">
          <i style={{ background: '#ff5f57', width: 11, height: 11, borderRadius: '50%', display: 'inline-block', marginRight: 4 }}></i>
          <i style={{ background: '#febc2e', width: 11, height: 11, borderRadius: '50%', display: 'inline-block', marginRight: 4 }}></i>
          <i style={{ background: '#28c840', width: 11, height: 11, borderRadius: '50%', display: 'inline-block' }}></i>
        </span>
        <span className="fn" style={{ marginLeft: 8 }}>exemplo_carregamento.py</span>
        <button className="copy" onClick={copy}>
          {copied ? (
            <>
              <Ic.Check size={13} style={{ marginRight: 4 }} /> Copiado
            </>
          ) : (
            <>
              <Ic.Copy size={13} style={{ marginRight: 4 }} /> Copiar
            </>
          )}
        </button>
      </div>
      <pre style={{ margin: 0, padding: 16 }}>
        <span className="tk-kw">import</span> pandas <span className="tk-kw">as</span> pd{'\n'}
        {'\n'}
        <span className="tk-com"># Carrega a série horária</span>{'\n'}
        df = pd.<span className="tk-fn">read_csv</span>({'\n'}
        {'    '}
        <span className="tk-str">"seropedica_horario_2010_2026.csv"</span>,{'\n'}
        {'    '}parse_dates=[<span className="tk-str">"data_hora"</span>],{'\n'}
        {'    '}index_col=<span className="tk-str">"data_hora"</span>,{'\n'}
        ){'\n'}
        {'\n'}
        <span className="tk-com"># Média mensal de temperatura e chuva acumulada</span>{'\n'}
        mensal = df.<span className="tk-fn">resample</span>(<span className="tk-str">"MS"</span>).<span className="tk-fn">agg</span>({'\n'}
        {'    '}temp_media=(<span className="tk-str">"temp_ar"</span>, <span className="tk-str">"mean"</span>),{'\n'}
        {'    '}chuva_mm=(<span className="tk-str">"precipitacao"</span>, <span className="tk-str">"sum"</span>),{'\n'}
        ){'\n'}
        <span className="tk-fn">print</span>(mensal.<span className="tk-fn">tail</span>())
      </pre>
    </div>
  )
}

export default function NotebooksTab() {
  return (
    <div>
      <div className="dr-panel">
        <div className="dr-panel-head">
          <h3>
            <Ic.Code size={17} className="ic" style={{ marginRight: 6 }} /> Comece em segundos
          </h3>
          <div className="right">
            <button className="dr-btn dr-btn-primary dr-btn-sm" onClick={() => alert('Criar novo notebook')}>
              <Ic.Plus size={15} /> Novo notebook
            </button>
          </div>
        </div>
        <div className="dr-panel-body">
          <p className="dr-prose" style={{ marginBottom: 16 }}>
            Carregue a série horária direto no seu ambiente — o arquivo já vem com{' '}
            <code>data_hora</code> pronta para indexação temporal.
          </p>
          <CodeSnippet />
        </div>
      </div>

      <div className="dr-panel">
        <div className="dr-panel-head">
          <h3>
            <Ic.Book size={17} className="ic" style={{ marginRight: 6 }} /> Notebooks da comunidade
          </h3>
          <div className="right">
            <span className="dr-ds-license">{NOTEBOOKS.length} públicos</span>
          </div>
        </div>
        <div className="dr-panel-body">
          <div className="dr-nb-grid">
            {NOTEBOOKS.map((n) => (
              <a className="dr-nb-card" href="#" key={n.title} onClick={(e) => e.preventDefault()}>
                <span className="nb-ic" style={{ background: n.color }}>
                  <Ic.Code size={18} />
                </span>
                <span className="nb-title">{n.title}</span>
                <span className="nb-meta">
                  <span className="lang">
                    <i style={{ background: n.color, width: 8, height: 8, borderRadius: '50%', display: 'inline-block', marginRight: 4 }}></i> {n.lang}
                  </span>
                  <span className="mi" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Ic.Up size={13} /> {n.runs} execuções
                  </span>
                  <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Ic.Users size={13} /> {n.author}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
