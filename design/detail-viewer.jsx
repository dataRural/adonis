/* ============================================================
   detail-viewer.jsx — Visualizador de dados interativo
   Tabela com cabeçalho estatístico (histograma + tipo),
   ordenação por coluna, destaque ao passar o mouse e paginação.
   ============================================================ */

function MiniHist({ hist }) {
  return (
    <div className="minihist">
      {hist.map((h, i) => (
        <i key={i} style={{ height: Math.max(2, h * 26) + "px" }} />
      ))}
    </div>
  );
}

/* ---- visão "Colunas": estatística detalhada por coluna ---- */
function ColumnStats({ hot, onHot }) {
  return (
    <div className="coldict">
      {COLUMNS.map((c) => {
        const CIcon = Ic[c.icon] || Ic.sigma;
        return (
        <div
          className="coldict-row"
          key={c.key}
          onMouseEnter={() => onHot(c.key)}
          onMouseLeave={() => onHot(null)}
        >
          <div className="col-name">
            <span className="tic"><CIcon size={15} /></span>
            <span style={{ minWidth: 0 }}>
              <span className="nm" title={c.label}>{c.label}</span>
              <br />
              <span className="ty">{c.kind === "number" ? "numérico" : c.kind === "datetime" ? "data/hora" : "categoria"}{c.unit ? " · " + c.unit : ""}</span>
            </span>
          </div>
          <div className="col-desc">
            {c.desc}
            {c.kind === "number" && (
              <div style={{ marginTop: 6, display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12, fontWeight: 700, color: "var(--muted-foreground)" }}>
                <span>mín <b style={{ color: "var(--foreground)" }}>{c.min}</b></span>
                <span>média <b style={{ color: "var(--foreground)" }}>{c.mean}</b></span>
                <span>máx <b style={{ color: "var(--foreground)" }}>{c.max}</b></span>
                <span>σ <b style={{ color: "var(--foreground)" }}>{c.std}</b></span>
              </div>
            )}
            {c.kind === "datetime" && (
              <div style={{ marginTop: 6, fontSize: 12, fontWeight: 700, color: "var(--muted-foreground)" }}>
                intervalo <b style={{ color: "var(--foreground)" }}>{c.range}</b>
              </div>
            )}
          </div>
          <div className="col-stats">
            <div className="col-bars">
              {c.hist.map((h, i) => <i key={i} style={{ height: Math.max(2, h * 34) + "px" }} />)}
            </div>
            <div className="meta">
              <span className="ok">{c.valid}% válidos</span>
              <span>{c.distinct} únicos</span>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
}

/* ---- visão "Tabela": preview navegável e ordenável ---- */
function DataTable({ hot, onHot }) {
  const PAGE = 6;
  const [page, setPage] = React.useState(0);
  const [sortCol, setSortCol] = React.useState(null); // índice da coluna
  const [sortDir, setSortDir] = React.useState("asc");

  const sorted = React.useMemo(() => {
    const arr = ROWS.map((r, i) => ({ r, i }));
    if (sortCol !== null) {
      arr.sort((a, b) => {
        let x = a.r[sortCol], y = b.r[sortCol];
        if (sortCol === 0) { x = String(x); y = String(y); return sortDir === "asc" ? x.localeCompare(y) : y.localeCompare(x); }
        return sortDir === "asc" ? x - y : y - x;
      });
    }
    return arr;
  }, [sortCol, sortDir]);

  const pages = Math.ceil(sorted.length / PAGE);
  const slice = sorted.slice(page * PAGE, page * PAGE + PAGE);

  function clickSort(idx) {
    if (sortCol === idx) { setSortDir(sortDir === "asc" ? "desc" : "asc"); }
    else { setSortCol(idx); setSortDir(idx === 0 ? "asc" : "desc"); }
    setPage(0);
  }

  return (
    <div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th><div className="colhead idxh"><div className="colhead-top"><span className="nm" style={{ color: "var(--muted-foreground)" }}>#</span></div></div></th>
              {COLUMNS.map((c, idx) => (
                <th key={c.key} className={hot === c.key ? "col-hot" : ""}>
                  <div
                    className={"colhead" + (sortCol === idx ? " sorted" : "")}
                    onClick={() => clickSort(idx)}
                    onMouseEnter={() => onHot(c.key)}
                    onMouseLeave={() => onHot(null)}
                  >
                    <div className="colhead-top">
                      <span className="nm">{c.label}</span>
                      {c.unit && <span className="un">{c.unit}</span>}
                      <span className="srt">
                        {sortCol === idx ? (sortDir === "asc" ? <Ic.up size={13} /> : <Ic.up size={13} style={{ transform: "rotate(180deg)" }} />) : <Ic.sort size={13} />}
                      </span>
                    </div>
                    <div className="colhead-ty">{c.kind === "number" ? "numérico" : c.kind === "datetime" ? "data/hora" : "categoria"}</div>
                    <MiniHist hist={c.hist} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map(({ r, i }) => (
              <tr key={i}>
                <td className="idx">{i + 1}</td>
                {r.map((val, ci) => (
                  <td
                    key={ci}
                    className={(ci === 0 ? "dt" : "num") + (hot === COLUMNS[ci].key ? " col-hot" : "")}
                  >
                    {ci === 0 ? val : Number.isInteger(val) ? val : val.toFixed(1)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="viewer-foot">
        <span>Mostrando <b style={{ color: "var(--foreground)" }}>{page * PAGE + 1}–{Math.min((page + 1) * PAGE, sorted.length)}</b> de <b style={{ color: "var(--foreground)" }}>84.216</b> linhas <span style={{ opacity: 0.7 }}>· amostra</span></span>
        <span className="spacer"></span>
        <div className="pager">
          <button onClick={() => setPage(0)} disabled={page === 0} title="Primeira"><Ic.chevr size={15} style={{ transform: "rotate(180deg)" }} /></button>
          <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} title="Anterior"><Ic.chevd size={15} style={{ transform: "rotate(90deg)" }} /></button>
          <span className="pg">{page + 1} / {pages}</span>
          <button onClick={() => setPage(Math.min(pages - 1, page + 1))} disabled={page === pages - 1} title="Próxima"><Ic.chevd size={15} style={{ transform: "rotate(-90deg)" }} /></button>
          <button onClick={() => setPage(pages - 1)} disabled={page === pages - 1} title="Última"><Ic.chevr size={15} /></button>
        </div>
      </div>
    </div>
  );
}

function Viewer() {
  const [mode, setMode] = React.useState("table"); // table | columns
  const [hot, setHot] = React.useState(null);

  return (
    <div className="viewer">
      <div className="viewer-toolbar">
        <button className="file-select">
          <Ic.file size={15} className="ic" />
          seropedica_horario_2010_2026.csv
          <span className="sz">· 11,2 MB</span>
          <Ic.chevd size={14} style={{ color: "var(--muted-foreground)" }} />
        </button>
        <span className="vt-info"><b>84.216</b> linhas · <b>8</b> colunas</span>
        <span className="spacer"></span>
        <div className="viewer-toggle">
          <button className={mode === "table" ? "on" : ""} onClick={() => setMode("table")}>
            <Ic.table size={14} /> Tabela
          </button>
          <button className={mode === "columns" ? "on" : ""} onClick={() => setMode("columns")}>
            <Ic.columns size={14} /> Colunas
          </button>
        </div>
      </div>
      {mode === "table" ? <DataTable hot={hot} onHot={setHot} /> : <ColumnStats hot={hot} onHot={setHot} />}
    </div>
  );
}

Object.assign(window, { Viewer, MiniHist, ColumnStats, DataTable });
