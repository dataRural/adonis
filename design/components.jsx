/* ============================================================
   components.jsx — Navbar, Hero, Categorias, Cards, CTA, Footer
   ============================================================ */

/* -------------------------------- NAVBAR -------------------- */
function Navbar({ theme, onToggleTheme }) {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a className="brand" href="#top">
          <BrandMark />
          <span className="brand-text">
            <span className="brand-name">Data<span>Rural</span></span>
            <span className="brand-sub">UFRRJ · Datasets</span>
          </span>
        </a>
        <nav className="nav-links">
          <a className="nav-link active" href="#datasets">Datasets</a>
          <a className="nav-link" href="#categorias">Áreas</a>
          <a className="nav-link" href="#publicar">Publicar</a>
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

/* -------------------------------- HERO ---------------------- */
function Hero({ query, onQuery, onChip }) {
  return (
    <section className="hero" id="top">
      <div className="hero-arcos">
        <img className="strand strand-right" src="arcos-rural.svg" alt="" aria-hidden="true" />
        <img className="strand strand-left" src="arcos-rural.svg" alt="" aria-hidden="true" />
      </div>
      <div className="container">
        <div className="hero-inner">
          <span className="hero-eyebrow"><span className="dot"></span>Repositório institucional de dados abertos</span>
          <h1>Encontre, explore e reutilize os <span className="hl">dados da Rural</span></h1>
          <p className="hero-lead">
            Uma plataforma para publicar, versionar e consumir conjuntos de dados acadêmicos
            e administrativos da UFRRJ — com metadados ricos, licenças explícitas e estatísticas de uso.
          </p>

          <div className="search">
            <Ic.search size={21} />
            <input
              type="text"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Buscar datasets — ex.: produção agrícola, clima, solos…"
              aria-label="Buscar datasets"
            />
            <button className="btn btn-primary">Buscar</button>
          </div>

          <div className="hero-tags">
            <span className="lbl">Buscas populares:</span>
            {POPULAR.map((t) => (
              <button key={t} className="chip" onClick={() => onChip(t)}>{t}</button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- STATS --------------------- */
function StatsStrip() {
  return (
    <div className="container">
      <div className="stats">
        {STATS.map((s) => (
          <div className="stat" key={s.label}>
            <span className="stat-val">
              <span className="ic" style={{ background: s.color }}></span>
              {s.val}
            </span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- CATEGORIAS ---------------- */
function Categories({ active, onPick }) {
  return (
    <section className="section" id="categorias">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Explore por área de conhecimento</h2>
            <p>Dados organizados pelos institutos e unidades da Universidade.</p>
          </div>
          <a className="link-more" href="#">Ver todas as áreas <Ic.arrow size={16} /></a>
        </div>
        <div className="cat-grid">
          {CATEGORIES.map((c) => {
            const Icon = Ic[c.icon] || Ic.database;
            return (
              <button
                key={c.id}
                className={"cat-card" + (active === c.id ? " active" : "")}
                onClick={() => onPick(active === c.id ? null : c.id)}
              >
                <span className="cat-ic" style={{ background: c.color }}><Icon size={22} /></span>
                <span>
                  <span className="cat-name">{c.name}</span>
                  <span className="cat-count">{c.count} datasets</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- DATASET CARD -------------- */
function DatasetCard({ d }) {
  return (
    <article className="ds-card">
      <div className="ds-top">
        <CardArt tint={d.tint} />
        <span className="ds-format"><span className="sq" style={{ background: d.tint }}></span>{d.format}</span>
      </div>
      <div className="ds-body">
        <span className="ds-unit"><Ic.building size={13} /> {d.unit}</span>
        <h3 className="ds-title">{d.title}</h3>
        <p className="ds-desc">{d.desc}</p>
        <div className="ds-tags">
          {d.tags.map((t) => <span className="ds-tag" key={t}>{t}</span>)}
        </div>
        <div className="ds-meta">
          <span className="m"><Ic.download size={14} /> {d.dl}</span>
          <span className="m"><Ic.clock size={14} /> {d.updated}</span>
          <span className="spacer"></span>
          <span className="usability" title="Índice de usabilidade">
            <Ic.verified size={14} /> {d.usability}
          </span>
        </div>
        <div className="ds-meta" style={{ borderTop: "none", paddingTop: "10px" }}>
          <span className="m"><Ic.rows size={14} /> {d.rows}</span>
          <span className="m"><Ic.file size={14} /> {d.size}</span>
          <span className="spacer"></span>
          <span className="ds-license"><Ic.scale size={11} style={{ display: "inline", verticalAlign: "-1px", marginRight: 3 }} />{d.license}</span>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------- DATASETS SECTION ---------- */
function DatasetsSection({ list, tab, onTab, view, onView, activeCat }) {
  const tabs = [
    { id: "featured", label: "Em destaque" },
    { id: "downloads", label: "Mais baixados" },
    { id: "recent", label: "Recentes" },
  ];
  return (
    <section className="section" id="datasets" style={{ paddingTop: 8 }}>
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Datasets</h2>
            <p>
              {list.length} {list.length === 1 ? "conjunto" : "conjuntos"} de dados
              {activeCat ? " nesta área" : " disponíveis"}.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="tabs">
              {tabs.map((t) => (
                <button key={t.id} className={"tab" + (tab === t.id ? " active" : "")} onClick={() => onTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="tabs" role="group" aria-label="Visualização">
              <button className={"tab" + (view === "grid" ? " active" : "")} onClick={() => onView("grid")} title="Grade" aria-label="Grade">
                <Ic.grid size={16} />
              </button>
              <button className={"tab" + (view === "list" ? " active" : "")} onClick={() => onView("list")} title="Lista" aria-label="Lista">
                <Ic.rows size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="ds-grid" style={view === "list" ? { gridTemplateColumns: "1fr" } : null}>
          {list.length === 0 ? (
            <div className="no-results">
              <strong>Nenhum dataset encontrado</strong>
              Ajuste a busca ou remova os filtros para ver mais resultados.
            </div>
          ) : (
            list.map((d) => <DatasetCard key={d.id} d={d} />)
          )}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- CTA PUBLICAR -------------- */
function PublishCTA() {
  return (
    <section className="section" id="publicar" style={{ paddingTop: 8 }}>
      <div className="container">
        <div className="cta">
          <div className="cta-arcos"><img src="arcos-rural-mono.svg" alt="" aria-hidden="true" /></div>
          <div className="cta-content">
            <h2>Você produz dados na Rural? Publique-os aqui.</h2>
            <p>Transforme planilhas dispersas em um repositório vivo, documentado e reutilizável pela comunidade acadêmica.</p>
            <div className="cta-steps">
              <div className="cta-step"><span className="n">1</span><span className="t">Envie seu arquivo CSV</span></div>
              <div className="cta-step"><span className="n">2</span><span className="t">Descreva metadados e licença</span></div>
              <div className="cta-step"><span className="n">3</span><span className="t">Publique e acompanhe o uso</span></div>
            </div>
          </div>
          <div className="cta-actions">
            <a className="btn btn-yellow btn-lg" href="DataRural%20-%20Painel%20UFRRJ.html#publicar"><Ic.download size={18} style={{ transform: "rotate(180deg)" }} /> Publicar dataset</a>
            <a className="btn btn-lg" href="DataRural%20-%20Painel%20UFRRJ.html" style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}>Meus datasets</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- FOOTER -------------------- */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a className="brand" href="#top">
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
            <a href="#datasets">Explorar datasets</a>
            <a href="#categorias">Áreas de conhecimento</a>
            <a href="#publicar">Publicar dados</a>
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
  Navbar, Hero, StatsStrip, Categories, DatasetCard, DatasetsSection, PublishCTA, Footer,
});
