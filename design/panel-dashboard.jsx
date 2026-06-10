/* ============================================================
   panel-dashboard.jsx — navbar autenticada + painel Meus datasets
   ============================================================ */
const { useState: useStateD, useMemo: useMemoD, useEffect: useEffectD, useRef: useRefD } = React;

const HOME_URL = "DataRural%20-%20Home%20UFRRJ.html";
const DETAIL_URL = "DataRural%20-%20Dataset%20UFRRJ.html";

/* -------------------------------- USER MENU (logado) ------- */
function NavUser() {
  const [open, setOpen] = useStateD(false);
  const ref = useRefD(null);

  useEffectD(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("click", onDoc);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("click", onDoc); window.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div className="nav-user-wrap" ref={ref}>
      <button className={"nav-user" + (open ? " open" : "")}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        aria-haspopup="menu" aria-expanded={open} title="Conta">
        <span className="nav-avatar">{ME.short}</span>
        <span className="nu-text">
          <span className="nu-name">{ME.name.split(" ").slice(0, 2).join(" ")}</span>
          <span className="nu-role">Pesquisadora</span>
        </span>
        <Ic.chevd size={15} className="nu-chev" style={{ color: "var(--muted-foreground)", marginRight: 2 }} />
      </button>

      {open && (
        <div className="user-menu" role="menu">
          <div className="user-menu-head">
            <span className="nav-avatar lg">{ME.short}</span>
            <span className="umh-text">
              <span className="umh-name">{ME.name}</span>
              <span className="umh-mail">h.vasconcelos@ufrrj.br</span>
              <span className="umh-unit"><Ic.building size={12} /> {ME.unit}</span>
            </span>
          </div>
          <div className="sep"></div>
          <button role="menuitem"><Ic.user size={16} /> Meu perfil público</button>
          <button role="menuitem"><Ic.database size={16} /> Meus datasets</button>
          <button role="menuitem"><Ic.bookmark size={16} /> Salvos</button>
          <button role="menuitem"><Ic.settings size={16} /> Configurações da conta</button>
          <div className="sep"></div>
          <button role="menuitem"><Ic.book size={16} /> Ajuda &amp; documentação</button>
          <button className="danger" role="menuitem"><Ic.logout size={16} /> Sair</button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------- NAVBAR (logada) ---------- */
function PanelNav({ theme, onToggleTheme, onPublish, active }) {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a className="brand" href={HOME_URL}>
          <BrandMark />
          <span className="brand-text">
            <span className="brand-name">Data<span>Rural</span></span>
            <span className="brand-sub">UFRRJ · Datasets</span>
          </span>
        </a>
        <nav className="nav-links">
          <a className="nav-link" href={HOME_URL + "#datasets"}>Datasets</a>
          <a className="nav-link" href={HOME_URL + "#categorias"}>Áreas</a>
          <a className={"nav-link" + (active === "dashboard" ? " active" : "")} href="#">Meus datasets</a>
          <a className="nav-link" href={HOME_URL + "#"}>Documentação</a>
        </nav>
        <div className="nav-right">
          <button className="btn btn-icon" onClick={onToggleTheme}
            title={theme === "dark" ? "Tema claro" : "Tema escuro"} aria-label="Alternar tema">
            {theme === "dark" ? <Ic.sun size={18} /> : <Ic.moon size={18} />}
          </button>
          <button className="btn btn-primary" onClick={onPublish}><Ic.plus size={17} /> Publicar dataset</button>
          <NavUser />
        </div>
      </div>
    </header>
  );
}

/* -------------------------------- ROW MENU ----------------- */
function RowMenu({ d, onEdit, onVersion, onClose }) {
  const isPub = d.status === "published";
  return (
    <div className="row-menu" role="menu">
      <button onClick={() => onEdit(d)}><Ic.edit size={16} /> Editar metadados</button>
      <button onClick={() => onVersion(d)}><Ic.branch size={16} /> Enviar nova versão</button>
      <button onClick={onClose}><Ic.eye size={16} /> Ver página pública</button>
      <button onClick={onClose}><Ic.chart size={16} /> Estatísticas de uso</button>
      <div className="sep"></div>
      {isPub
        ? <button onClick={onClose}><Ic.eyeoff size={16} /> Despublicar</button>
        : <button onClick={onClose}><Ic.send size={16} /> Publicar agora</button>}
      <button className="danger" onClick={onClose}><Ic.trash size={16} /> Excluir</button>
    </div>
  );
}

/* -------------------------------- TABLE ROW ---------------- */
function DatasetRow({ d, open, onToggleMenu, onEdit, onVersion, onCloseMenu }) {
  const sm = STATUS_META[d.status];
  return (
    <div className="mds-row">
      <div className="mds-name">
        <span className="mds-thumb" style={{ background: d.tint }}>
          <Ic.table size={20} />
          <span className="fmt">{d.format}</span>
        </span>
        <span className="nm">
          <span className="t" title={d.title}>{d.title}</span>
          <span className="sub">
            <span className="v"><Ic.history size={12} /> {d.version}</span>
            <span className="dotsep"></span>
            <span className="v"><Ic.rows size={12} /> {d.rows} linhas</span>
            <span className="dotsep"></span>
            <span className="v"><Ic.clock size={12} /> {d.updated}</span>
          </span>
        </span>
      </div>

      <div className="col-status">
        <span className={"status-badge " + d.status}>
          <span className="d" style={{ background: sm.color }}></span>{sm.label}
        </span>
      </div>

      <div className="col-dl mds-metric">
        <span className="num">{d.downloads}</span>
        <span className="lbl">downloads</span>
      </div>

      <div className="col-views mds-metric">
        <span className="num">{d.views}</span>
        <span className="lbl">visualizações</span>
      </div>

      <div className="col-usab">
        {d.usability
          ? <span className="mds-usab"><Ic.verified size={15} /> {d.usability}</span>
          : <span className="mds-usab na">—</span>}
      </div>

      <div style={{ position: "relative" }}>
        <button className={"row-menu-btn" + (open ? " open" : "")}
          onClick={(e) => { e.stopPropagation(); onToggleMenu(d.id); }} aria-label="Ações">
          <Ic.more size={18} />
        </button>
        {open && <RowMenu d={d} onEdit={onEdit} onVersion={onVersion} onClose={onCloseMenu} />}
      </div>
    </div>
  );
}

/* -------------------------------- DASHBOARD ---------------- */
function Dashboard({ onPublish, onEdit }) {
  const [filter, setFilter] = useStateD("all");
  const [query, setQuery] = useStateD("");
  const [openMenu, setOpenMenu] = useStateD(null);

  useEffectD(() => {
    const close = () => setOpenMenu(null);
    if (openMenu !== null) {
      window.addEventListener("click", close);
      return () => window.removeEventListener("click", close);
    }
  }, [openMenu]);

  const counts = useMemoD(() => ({
    all: MY_DATASETS.length,
    published: MY_DATASETS.filter((d) => d.status === "published").length,
    review: MY_DATASETS.filter((d) => d.status === "review").length,
    draft: MY_DATASETS.filter((d) => d.status === "draft").length,
    unpublished: MY_DATASETS.filter((d) => d.status === "unpublished").length,
  }), []);

  const list = useMemoD(() => {
    let arr = MY_DATASETS.slice();
    if (filter !== "all") arr = arr.filter((d) => d.status === filter);
    const q = query.trim().toLowerCase();
    if (q) arr = arr.filter((d) => d.title.toLowerCase().includes(q));
    return arr;
  }, [filter, query]);

  const filters = [
    { id: "all", label: "Todos", n: counts.all },
    { id: "published", label: "Publicados", n: counts.published },
    { id: "review", label: "Em revisão", n: counts.review },
    { id: "draft", label: "Rascunhos", n: counts.draft },
    { id: "unpublished", label: "Despublicados", n: counts.unpublished },
  ];

  return (
    <div className="panel-wrap">
      <div className="page-head">
        <div className="container">
          <div className="page-head-inner">
            <div>
              <div className="page-breadcrumb">
                <a href={HOME_URL}>Início</a>
                <span className="sep"><Ic.chevr size={13} /></span>
                <span>Meus datasets</span>
              </div>
              <h1>Meus datasets</h1>
              <p className="page-sub">Gerencie o que você publica, acompanhe o uso e envie novas versões.</p>
            </div>
            <div className="page-head-actions">
              <button className="btn btn-outline btn-lg"><Ic.chart size={18} /> Relatório</button>
              <button className="btn btn-primary btn-lg" onClick={onPublish}><Ic.plus size={18} /> Publicar dataset</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* stats */}
        <div className="mstats">
          {MY_STATS.map((s) => (
            <div className="mstat" key={s.id}>
              <div className="mstat-top">
                <span className="mstat-ic" style={{ background: s.color }}><Ic.dot size={0} />{React.createElement(Ic[s.icon] || Ic.database, { size: 18 })}</span>
                <span className="mstat-trend"><Ic.up size={12} /> {s.trend}</span>
              </div>
              <span className="mstat-val">{s.val}</span>
              <span className="mstat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* toolbar */}
        <div className="mgmt-toolbar">
          <div className="seg">
            {filters.map((f) => (
              <button key={f.id} className={filter === f.id ? "on" : ""} onClick={() => setFilter(f.id)}>
                {f.label} <span className="cnt">{f.n}</span>
              </button>
            ))}
          </div>
          <span className="grow"></span>
          <div className="mgmt-search">
            <Ic.search size={17} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar nos meus datasets…" />
          </div>
          <button className="btn btn-outline"><Ic.sort size={16} /> Ordenar</button>
        </div>

        {/* table */}
        <div className="mds">
          <div className="mds-head">
            <span>Dataset</span>
            <span>Status</span>
            <span>Downloads</span>
            <span>Visualizações</span>
            <span>Usabilidade</span>
            <span></span>
          </div>
          {list.length === 0 ? (
            <div className="mds-empty">
              <span className="ic"><Ic.folder size={28} /></span>
              <strong>Nenhum dataset nesta visão</strong>
              <p>Ajuste os filtros ou publique um novo conjunto de dados.</p>
              <button className="btn btn-primary" onClick={onPublish}><Ic.plus size={17} /> Publicar dataset</button>
            </div>
          ) : (
            list.map((d) => (
              <DatasetRow
                key={d.id} d={d} open={openMenu === d.id}
                onToggleMenu={(id) => setOpenMenu(openMenu === id ? null : id)}
                onCloseMenu={() => setOpenMenu(null)}
                onEdit={onEdit} onVersion={onEdit}
              />
            ))
          )}
        </div>
        <div style={{ height: 56 }}></div>
      </div>
    </div>
  );
}

Object.assign(window, { PanelNav, Dashboard, HOME_URL, DETAIL_URL });
