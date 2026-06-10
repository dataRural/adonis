/* ============================================================
   detail-tabs.jsx — conteúdo das abas (visão geral, arquivos,
   notebooks, discussão).
   ============================================================ */

/* ============== VISÃO GERAL ============== */
function OverviewTab() {
  const [hot, setHot] = React.useState(null);
  return (
    <div>
      {/* README */}
      <div className="panel">
        <div className="panel-head"><h3><Ic.book size={17} className="ic" /> Sobre este conjunto de dados</h3></div>
        <div className="panel-body">
          <div className="prose">
            <p>
              Série histórica <b>horária</b> de variáveis meteorológicas registradas pela estação automática
              do <b>Campus Seropédica</b> da UFRRJ, mantida pelo Laboratório de Agrometeorologia. O conjunto
              cobre o período de <code>jan/2010</code> a <code>abr/2026</code> e é atualizado mensalmente.
            </p>
            <p>
              Cada linha corresponde a uma hora cheia, com agregação das leituras coletadas a cada 10 minutos.
              Os dados passam por controle de qualidade automático (limites físicos, persistência e consistência
              entre variáveis) e revisão manual trimestral.
            </p>
            <h4>Usos comuns</h4>
            <ul>
              <li>Climatologia local e cálculo de normais climatológicas para Seropédica e a Baixada Fluminense.</li>
              <li>Balanço hídrico e evapotranspiração de referência para planejamento de irrigação.</li>
              <li>Calibração e validação de modelos agrometeorológicos e de previsão.</li>
              <li>Detecção de eventos extremos — ondas de calor, estiagem e chuvas intensas.</li>
            </ul>
            <h4>Atenção</h4>
            <p>
              Há pequenas lacunas em <code>radiacao_solar</code> entre 2013 e 2014 por manutenção do sensor;
              valores ausentes são deixados em branco (não imputados). Consulte a aba <b>Discussão</b> para detalhes.
            </p>
          </div>
        </div>
      </div>

      {/* Qualidade / usabilidade */}
      <div className="panel">
        <div className="panel-head">
          <h3><Ic.verified size={17} className="ic" /> Índice de usabilidade</h3>
          <div className="right"><span className="ds-license">como é calculado</span></div>
        </div>
        <div className="panel-body">
          <div className="quality">
            <div className="quality-top">
              <div className="quality-score">
                <span className="v">{DS.usability}</span>
                <span className="l">de 10</span>
              </div>
              <p className="lead">
                Pontuação alta: o conjunto tem <b>documentação completa</b>, <b>proveniência rastreável</b> e
                <b> licença aberta</b>. Avaliamos completude, credibilidade e compatibilidade de uso.
              </p>
            </div>
            <div className="quality-list">
              {QUALITY.map((q) => (
                <div className="quality-item" key={q.label}>
                  <span className="chk" style={{ background: q.score >= 1 ? "var(--brand-green)" : "var(--brand-yellow)", color: q.score >= 1 ? "#fff" : "#3a2c00" }}>
                    <Ic.check size={14} />
                  </span>
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span className="qt">{q.label}</span>
                    <span className="qd">{q.desc}</span>
                  </span>
                  <span className="pct">{Math.round(q.score * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dicionário de colunas */}
      <div className="panel">
        <div className="panel-head">
          <h3><Ic.columns size={17} className="ic" /> Dicionário de colunas</h3>
          <div className="right"><span className="ds-license">{COLUMNS.length} colunas</span></div>
        </div>
        <ColumnStats hot={hot} onHot={setHot} />
      </div>
    </div>
  );
}

/* ============== ARQUIVOS & VERSÕES ============== */
function FilesTab() {
  return (
    <div>
      <div className="panel">
        <div className="panel-head">
          <h3><Ic.folder size={17} className="ic" /> Arquivos</h3>
          <div className="right"><a className="btn btn-primary btn-sm" href="#"><Ic.download size={15} /> Baixar tudo ({DS.size})</a></div>
        </div>
        <div className="filelist">
          {FILES.map((f) => (
            <div className="filerow" key={f.name}>
              <span className="file-ic"><Ic.file size={18} /></span>
              <div className="file-meta">
                <span className="fn">{f.name}</span>
                <span className="fd">
                  <span>{f.size}</span>
                  <span>{f.rows !== "—" ? f.rows + " linhas" : "—"}</span>
                </span>
              </div>
              {f.primary && <span className="file-badge prim">principal</span>}
              <span className="file-badge">{f.type}</span>
              <button className="btn btn-outline btn-sm"><Ic.eye size={15} /> Prévia</button>
              <button className="btn btn-outline btn-sm"><Ic.download size={15} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head"><h3><Ic.history size={17} className="ic" /> Histórico de versões</h3></div>
        <div className="panel-body">
          <div className="timeline">
            {VERSIONS.map((v) => (
              <div className={"tl-item" + (v.current ? " cur" : "")} key={v.v}>
                <div className="tl-rail">
                  <span className="tl-dot"></span>
                  <span className="tl-line"></span>
                </div>
                <div className="tl-body">
                  <div className="tl-head">
                    <span className="tl-v">{v.v}</span>
                    {v.current && <span className="tl-cur-badge">atual</span>}
                    <span className="tl-date">{v.date}</span>
                  </div>
                  <p className="tl-note">{v.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============== NOTEBOOKS / CÓDIGO ============== */
function CodeSnippet() {
  const [copied, setCopied] = React.useState(false);
  function copy() {
    navigator.clipboard && navigator.clipboard.writeText(SNIPPET);
    setCopied(true); setTimeout(() => setCopied(false), 1600);
  }
  return (
    <div className="codeblock">
      <div className="codeblock-head">
        <span className="dots"><i style={{ background: "#ff5f57" }}></i><i style={{ background: "#febc2e" }}></i><i style={{ background: "#28c840" }}></i></span>
        <span className="fn">exemplo_carregamento.py</span>
        <button className="copy" onClick={copy}>{copied ? <><Ic.check size={13} /> Copiado</> : <><Ic.copy size={13} /> Copiar</>}</button>
      </div>
      <pre>
<span className="tk-kw">import</span> pandas <span className="tk-kw">as</span> pd{"\n"}
{"\n"}
<span className="tk-com"># Carrega a série horária</span>{"\n"}
df = pd.<span className="tk-fn">read_csv</span>({"\n"}
{"    "}<span className="tk-str">"seropedica_horario_2010_2026.csv"</span>,{"\n"}
{"    "}parse_dates=[<span className="tk-str">"data_hora"</span>],{"\n"}
{"    "}index_col=<span className="tk-str">"data_hora"</span>,{"\n"}
){"\n"}
{"\n"}
<span className="tk-com"># Média mensal de temperatura e chuva acumulada</span>{"\n"}
mensal = df.<span className="tk-fn">resample</span>(<span className="tk-str">"MS"</span>).<span className="tk-fn">agg</span>({"\n"}
{"    "}temp_media=(<span className="tk-str">"temp_ar"</span>, <span className="tk-str">"mean"</span>),{"\n"}
{"    "}chuva_mm=(<span className="tk-str">"precipitacao"</span>, <span className="tk-str">"sum"</span>),{"\n"}
){"\n"}
<span className="tk-fn">print</span>(mensal.<span className="tk-fn">tail</span>())
      </pre>
    </div>
  );
}

function NotebooksTab() {
  return (
    <div>
      <div className="panel">
        <div className="panel-head">
          <h3><Ic.code size={17} className="ic" /> Comece em segundos</h3>
          <div className="right"><a className="btn btn-primary btn-sm" href="#"><Ic.plus size={15} /> Novo notebook</a></div>
        </div>
        <div className="panel-body">
          <p className="prose" style={{ marginBottom: 16 }}>Carregue a série horária direto no seu ambiente — o arquivo já vem com <code>data_hora</code> pronta para indexação temporal.</p>
          <CodeSnippet />
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3><Ic.book size={17} className="ic" /> Notebooks da comunidade</h3>
          <div className="right"><span className="ds-license">{NOTEBOOKS.length} públicos</span></div>
        </div>
        <div className="panel-body">
          <div className="nb-grid">
            {NOTEBOOKS.map((n) => (
              <a className="nb-card" href="#" key={n.title}>
                <span className="nb-ic" style={{ background: n.color }}><Ic.code size={18} /></span>
                <span className="nb-title">{n.title}</span>
                <span className="nb-meta">
                  <span className="lang"><i style={{ background: n.color }}></i> {n.lang}</span>
                  <span className="mi" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Ic.up size={13} /> {n.runs} execuções</span>
                  <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5 }}><Ic.users size={13} /> {n.author}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============== DISCUSSÃO ============== */
function DiscussionTab() {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3><Ic.message size={17} className="ic" /> Discussão</h3>
        <div className="right">
          <a className="btn btn-primary btn-sm" href="#"><Ic.plus size={15} /> Novo tópico</a>
        </div>
      </div>
      <div className="filelist">
        {THREADS.map((t) => (
          <div className="thread" key={t.title}>
            <div className="thread-votes">
              <Ic.up size={15} className="ic" />
              <span className="n">{t.votes}</span>
            </div>
            <div className="thread-main">
              <div className="thread-title">
                {t.pinned && <span className="pin" title="Fixado"><Ic.pin size={15} /></span>}
                {t.title}
              </div>
              <div className="thread-meta">
                <span className="thread-tag">{t.tag}</span>
                <span className="mi"><Ic.users size={13} /> <span className="who">{t.author}</span></span>
                <span className="mi"><Ic.message size={13} /> {t.replies} respostas</span>
                <span className="mi"><Ic.clock size={13} /> {t.time}</span>
              </div>
            </div>
            <Ic.chevr size={18} style={{ color: "var(--muted-foreground)", alignSelf: "center", flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { OverviewTab, FilesTab, NotebooksTab, DiscussionTab, CodeSnippet });
