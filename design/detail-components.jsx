/* ============================================================
   detail-components.jsx — navbar, cabeçalho do dataset,
   coluna lateral de metadados, relacionados e rodapé.
   ============================================================ */
const HOME = "DataRural%20-%20Home%20UFRRJ.html";

/* -------------------------------- NAVBAR -------------------- */
function DetailNav({ theme, onToggleTheme }) {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a className="brand" href={HOME}>
          <BrandMark />
          <span className="brand-text">
            <span className="brand-name">Data<span>Rural</span></span>
            <span className="brand-sub">UFRRJ · Datasets</span>
          </span>
        </a>
        <nav className="nav-links">
          <a className="nav-link active" href={HOME + "#datasets"}>Datasets</a>
          <a className="nav-link" href={HOME + "#categorias"}>Áreas</a>
          <a className="nav-link" href={HOME + "#publicar"}>Publicar</a>
          <a className="nav-link" href="#">Documentação</a>
        </nav>
        <div className="nav-right">
          <button className="btn btn-icon" onClick={onToggleTheme}
            title={theme === "dark" ? "Tema claro" : "Tema escuro"} aria-label="Alternar tema">
            {theme === "dark" ? <Ic.sun size={18} /> : <Ic.moon size={18} />}
          </button>
          <a className="btn btn-ghost" href="#">Entrar</a>
          <a className="btn btn-primary" href="#">Criar conta</a>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------- HEADER -------------------- */
function DatasetHeader() {
  const [voted, setVoted] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const votes = DS.votes + (voted ? 1 : 0);

  return (
    <section className="ds-header">
      <div className="ds-header-arcos"><img src="arcos-rural.svg" alt="" aria-hidden="true" /></div>
      <div className="container ds-header-inner">
        <nav className="breadcrumb" aria-label="Trilha">
          <a href={HOME + "#datasets"}>Datasets</a>
          <span className="sep"><Ic.chevr size={13} /></span>
          <a href={HOME + "#categorias"}>{DS.catName}</a>
          <span className="sep"><Ic.chevr size={13} /></span>
          <span className="here">Estação Seropédica</span>
        </nav>

        <div className="ds-head-top">
          <div className="ds-head-main">
            <span className="ds-head-unit">
              <span className="av" style={{ background: "var(--brand-sky)" }}>{DS.unitShort}</span>
              {DS.unit}
            </span>
            <h1>{DS.title}</h1>
            <div className="ds-head-metarow">
              <span className="mi usab"><Ic.verified size={15} /> <b>{DS.usability}</b> usabilidade</span>
              <span className="vsep"></span>
              <span className="mi"><Ic.scale size={14} /> {DS.license}</span>
              <span className="mi"><Ic.file size={14} /> {DS.format} · {DS.size}</span>
              <span className="mi"><Ic.rows size={14} /> {DS.rows} linhas</span>
              <span className="mi"><Ic.history size={14} /> {DS.version}</span>
              <span className="mi"><Ic.clock size={14} /> {DS.updated}</span>
            </div>
          </div>

          <div className="ds-head-actions">
            <a className="btn btn-primary btn-lg" href="#"><Ic.download size={18} /> Baixar ({DS.size})</a>
            <div className="ds-action-row">
              <a className="btn btn-outline" href="#"><Ic.code size={16} /> Notebook</a>
              <a className="btn btn-outline" href="#"><Ic.columns size={16} /> API</a>
            </div>
            <div className="ds-action-row">
              <button className={"btn-count" + (voted ? " on" : "")} onClick={() => setVoted(!voted)} style={{ flex: 1 }}>
                <Ic.heart size={15} className="ic" /> <span className="n">{votes}</span>
              </button>
              <button className={"btn-count" + (saved ? " on" : "")} onClick={() => setSaved(!saved)} title="Salvar" style={{ flex: 1 }}>
                <Ic.bookmark size={15} className="ic" /> Salvar
              </button>
              <button className="btn-count" title="Compartilhar"><Ic.share size={15} className="ic" /></button>
            </div>
            <span className="ds-dl-hint">{DS.downloads} downloads · {DS.views} visualizações</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- TABBAR -------------------- */
function TabBar({ tab, onTab }) {
  const tabs = [
    { id: "overview", label: "Visão geral", icon: "book" },
    { id: "viewer", label: "Visualizador", icon: "table" },
    { id: "files", label: "Arquivos", icon: "folder", badge: DS.files },
    { id: "notebooks", label: "Notebooks", icon: "code", badge: NOTEBOOKS.length },
    { id: "discussion", label: "Discussão", icon: "message", badge: THREADS.length },
  ];
  return (
    <div className="ds-tabbar">
      <div className="container ds-tabbar-inner">
        {tabs.map((t) => {
          const TIcon = Ic[t.icon];
          return (
          <button key={t.id} className={"ds-tab" + (tab === t.id ? " active" : "")} onClick={() => onTab(t.id)}>
            <TIcon size={16} /> {t.label}
            {t.badge != null && <span className="badge">{t.badge}</span>}
          </button>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------- SIDEBAR (RAIL) ----------- */
function Rail() {
  const [copied, setCopied] = React.useState(false);
  function copyCite() {
    navigator.clipboard && navigator.clipboard.writeText(CITATION);
    setCopied(true); setTimeout(() => setCopied(false), 1600);
  }
  const meta = [
    { k: "Formato", v: DS.format, icon: "file" },
    { k: "Tamanho", v: DS.size, icon: "database" },
    { k: "Linhas × Colunas", v: DS.rows + " × " + DS.cols, icon: "table" },
    { k: "Atualização", v: DS.freq, icon: "history" },
  ];
  return (
    <aside className="ds-rail">
      {/* licença */}
      <div className="rail-card">
        <div className="rail-card-head"><h4><Ic.scale size={13} /> Licença</h4></div>
        <div className="rail-card-body">
          <a className="license-pill" href={DS.licenseUrl}>
            <span className="lic-ic"><Ic.scale size={16} /></span>
            <span style={{ minWidth: 0 }}>
              <span className="lt">{DS.license}</span>
              <span className="ld">Atribuição · uso livre com crédito</span>
            </span>
            <span className="ext"><Ic.external size={15} /></span>
          </a>
        </div>
      </div>

      {/* metadados */}
      <div className="rail-card">
        <div className="rail-card-head"><h4><Ic.info size={13} /> Metadados</h4></div>
        <div className="rail-card-body">
          <div className="meta-list">
            {meta.map((m) => {
              const MIcon = Ic[m.icon];
              return (
              <div className="meta-item" key={m.k}>
                <span className="mic"><MIcon size={15} /></span>
                <span style={{ minWidth: 0 }}>
                  <span className="mk">{m.k}</span>
                  <span className="mv">{m.v}</span>
                </span>
              </div>
              );
            })}
            <div className="meta-item">
              <span className="mic"><Ic.hash size={15} /></span>
              <span style={{ minWidth: 0 }}>
                <span className="mk">DOI</span>
                <span className="mv" style={{ fontSize: 12.5 }}>{DS.doi}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* proveniência */}
      <div className="rail-card">
        <div className="rail-card-head"><h4><Ic.pin size={13} /> Proveniência</h4></div>
        <div className="rail-card-body">
          <div className="prov-list">
            <div className="prov-item"><span className="pic"><Ic.calendar size={16} /></span>
              <span><span className="pk">Cobertura temporal</span><span className="pv">{DS.coverageTime}</span></span></div>
            <div className="prov-item"><span className="pic"><Ic.globe size={16} /></span>
              <span><span className="pk">Cobertura geográfica</span><span className="pv">{DS.coverageGeo}</span></span></div>
            <div className="prov-item"><span className="pic"><Ic.thermometer size={16} /></span>
              <span><span className="pk">Coleta</span><span className="pv">{DS.collection}</span></span></div>
          </div>
        </div>
      </div>

      {/* engajamento */}
      <div className="rail-card">
        <div className="rail-card-head"><h4><Ic.spark size={13} /> Atividade</h4></div>
        <div className="rail-card-body">
          <div className="engage">
            <div className="e"><span className="ev"><Ic.download size={17} className="ic" /> {DS.downloads}</span><span className="el">Downloads</span></div>
            <div className="e"><span className="ev"><Ic.eye size={17} className="ic" /> {DS.views}</span><span className="el">Visualizações</span></div>
            <div className="e"><span className="ev"><Ic.heart size={17} className="ic" /> {DS.votes}</span><span className="el">Votos</span></div>
            <div className="e"><span className="ev"><Ic.bookmark size={17} className="ic" /> {DS.watchers}</span><span className="el">Salvos</span></div>
          </div>
        </div>
      </div>

      {/* autores */}
      <div className="rail-card">
        <div className="rail-card-head"><h4><Ic.users size={13} /> Mantenedores</h4></div>
        <div className="rail-card-body">
          {DS.authors.map((a) => (
            <div className="author-item" key={a.name}>
              <span className="author-av" style={{ background: a.color }}>{a.initials}</span>
              <span style={{ minWidth: 0 }}>
                <span className="an">{a.name}</span>
                <span className="ar">{a.role} · {a.inst}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* tags */}
      <div className="rail-card">
        <div className="rail-card-head"><h4><Ic.hash size={13} /> Tags</h4></div>
        <div className="rail-card-body">
          <div className="rail-tags">
            {DS.tags.map((t) => <span className="rail-tag" key={t}>{t}</span>)}
          </div>
        </div>
      </div>

      {/* citação */}
      <div className="rail-card">
        <div className="rail-card-head"><h4><Ic.quote size={13} /> Como citar</h4></div>
        <div className="rail-card-body">
          <div className="cite-box">{CITATION}</div>
          <button className="btn btn-outline btn-sm" onClick={copyCite} style={{ width: "100%" }}>
            {copied ? <><Ic.check size={15} /> Copiado</> : <><Ic.copy size={15} /> Copiar citação</>}
          </button>
        </div>
      </div>
    </aside>
  );
}

/* -------------------------------- RELACIONADOS ------------- */
function RelatedCard({ d }) {
  return (
    <a className="ds-card" href="#">
      <div className="ds-top">
        <CardArt tint={d.tint} />
        <span className="ds-format"><span className="sq" style={{ background: d.tint }}></span>{d.format}</span>
      </div>
      <div className="ds-body">
        <span className="ds-unit"><Ic.building size={13} /> {d.unit}</span>
        <h3 className="ds-title">{d.title}</h3>
        <p className="ds-desc">{d.desc}</p>
        <div className="ds-meta" style={{ marginTop: "auto" }}>
          <span className="m"><Ic.download size={14} /> {d.dl}</span>
          <span className="m"><Ic.clock size={14} /> {d.updated}</span>
          <span className="spacer"></span>
          <span className="usability"><Ic.verified size={14} /> {d.usability}</span>
        </div>
      </div>
    </a>
  );
}

function RelatedSection() {
  return (
    <section className="section related-wrap" style={{ paddingTop: 14 }}>
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Datasets relacionados</h2>
            <p>Outros conjuntos da mesma região e linha de pesquisa.</p>
          </div>
          <a className="link-more" href={HOME + "#datasets"}>Ver todos <Ic.arrow size={16} /></a>
        </div>
        <div className="ds-grid">
          {RELATED.map((d) => <RelatedCard key={d.id} d={d} />)}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- FOOTER ------------------- */
function DetailFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a className="brand" href={HOME}>
              <BrandMark size={36} />
              <span className="brand-text">
                <span className="brand-name">Data<span>Rural</span></span>
                <span className="brand-sub">UFRRJ · Datasets</span>
              </span>
            </a>
            <p className="footer-about">
              Plataforma institucional de datasets da Universidade Federal Rural do Rio de Janeiro.
              Dados abertos para ensino, pesquisa e extensão.
            </p>
            <p className="footer-addr">
              BR-465, Km 7 — Campus Seropédica<br />
              Seropédica, Rio de Janeiro · CEP 23897-000
            </p>
          </div>
          <div className="footer-col">
            <h4>Plataforma</h4>
            <a href={HOME + "#datasets"}>Explorar datasets</a>
            <a href={HOME + "#categorias"}>Áreas de conhecimento</a>
            <a href={HOME + "#publicar"}>Publicar dados</a>
            <a href="#">Coleções</a>
          </div>
          <div className="footer-col">
            <h4>Recursos</h4>
            <a href="#">Documentação</a>
            <a href="#">Sobre licenças</a>
            <a href="#">API de dados</a>
            <a href="#">Política de dados</a>
          </div>
          <div className="footer-col">
            <h4>Institucional</h4>
            <a href="#">UFRRJ</a>
            <a href="#">Pró-Reitorias</a>
            <a href="#">Institutos</a>
            <a href="#">Contato</a>
          </div>
        </div>
        <div className="footer-bar">
          <span>© 2026 Universidade Federal Rural do Rio de Janeiro · DataRural</span>
          <span className="colors" aria-hidden="true">
            <i style={{ background: "var(--brand-blue)" }}></i>
            <i style={{ background: "var(--brand-green)" }}></i>
            <i style={{ background: "var(--brand-yellow)" }}></i>
            <i style={{ background: "var(--brand-orange)" }}></i>
            <i style={{ background: "var(--brand-sky)" }}></i>
          </span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  DetailNav, DatasetHeader, TabBar, Rail, RelatedCard, RelatedSection, DetailFooter,
});
