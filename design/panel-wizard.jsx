/* ============================================================
   panel-wizard.jsx — Assistente de envio de dataset (5 etapas)
   Arquivo → Metadados → Esquema → Licença → Revisão
   ============================================================ */
const { useState: useStateW, useRef: useRefW, useEffect: useEffectW } = React;

const WIZ_STEPS = [
  { id: 0, label: "Etapa 1", title: "Arquivo", icon: "uploadcloud" },
  { id: 1, label: "Etapa 2", title: "Metadados", icon: "info" },
  { id: 2, label: "Etapa 3", title: "Esquema", icon: "columns" },
  { id: 3, label: "Etapa 4", title: "Licença", icon: "scale" },
  { id: 4, label: "Etapa 5", title: "Revisão", icon: "verified" },
];

const STEP_HELP = [
  { h: "Formatos aceitos", t: "CSV, TSV, Parquet, XLSX e JSON até 2 GB. Para arquivos maiores, use a API de ingestão." },
  { h: "Bons metadados = mais uso", t: "Datasets bem descritos recebem em média 3× mais downloads e melhor índice de usabilidade." },
  { h: "Descreva cada coluna", t: "Nomes claros e unidades explícitas evitam dúvidas e elevam a nota de usabilidade." },
  { h: "Escolha consciente", t: "A licença define como a comunidade pode reutilizar seus dados. CC BY 4.0 é o padrão aberto." },
  { h: "Quase lá", t: "Revise os dados. Publicações passam por curadoria leve da equipe DataRural antes de irem ao ar." },
];

/* -------------------------------- STEPPER ------------------ */
function Stepper({ step, onJump, maxReached }) {
  return (
    <aside className="stepper">
      <div className="stepper-inner">
        <p className="stepper-title">Publicar dataset</p>
        {WIZ_STEPS.map((s) => {
          const state = s.id === step ? "active" : s.id < step ? "done" : "todo";
          const clickable = s.id <= maxReached;
          return (
            <div key={s.id}
              className={"step-item " + state + (clickable ? "" : " locked")}
              onClick={() => clickable && onJump(s.id)}
              style={{ cursor: clickable ? "pointer" : "default" }}>
              {s.id < WIZ_STEPS.length - 1 && <span className="line"></span>}
              <span className="step-num">{s.id < step ? <Ic.check size={16} /> : s.id + 1}</span>
              <span className="step-meta">
                <span className="sl">{s.label}</span>
                <span className="st">{s.title}</span>
              </span>
            </div>
          );
        })}
      </div>
      <div className="stepper-help">
        <span className="hh"><Ic.info size={15} /> {STEP_HELP[step].h}</span>
        <p>{STEP_HELP[step].t}</p>
      </div>
    </aside>
  );
}

/* ===================== STEP 1 — ARQUIVO ==================== */
function StepArquivo({ data, set }) {
  const [drag, setDrag] = useStateW(false);
  const inputRef = useRefW(null);

  const simulateUpload = () => {
    set({ uploading: true, progress: 0, fileName: "estacao-seropedica-2010-2024.csv", fileSize: "12,4 MB" });
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 22 + 10;
      if (p >= 100) { p = 100; clearInterval(iv); set({ uploading: false, uploaded: true, progress: 100 }); }
      else set({ progress: Math.round(p) });
    }, 180);
  };

  return (
    <div>
      {!data.uploaded && !data.uploading && (
        <div className={"dropzone" + (drag ? " drag" : "")}
          onClick={simulateUpload}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); simulateUpload(); }}>
          <span className="dz-ic"><Ic.uploadcloud size={30} /></span>
          <h3>Arraste seu arquivo aqui ou clique para selecionar</h3>
          <p>O preview e a detecção de colunas acontecem automaticamente após o envio.</p>
          <button className="btn btn-primary"><Ic.file size={17} /> Selecionar arquivo</button>
          <div className="formats">
            {["CSV", "TSV", "Parquet", "XLSX", "JSON"].map((f) => <span key={f} className="fmt-pill">{f}</span>)}
          </div>
          <input ref={inputRef} type="file" hidden />
        </div>
      )}

      {(data.uploading || data.uploaded) && (
        <div className="file-card">
          <span className="fc-ic"><Ic.table size={22} /></span>
          <div className="fc-main">
            <div className="fc-name">{data.fileName}</div>
            <div className="fc-sub">
              {data.fileSize} · {data.uploaded ? "84.234 linhas · 6 colunas detectadas" : "Enviando… " + data.progress + "%"}
            </div>
            {!data.uploaded && <div className="fc-bar"><i style={{ width: data.progress + "%" }}></i></div>}
          </div>
          {data.uploaded
            ? <span className="fc-done"><Ic.verified size={26} /></span>
            : <button className="fc-x" onClick={() => set({ uploading: false, uploaded: false, progress: 0 })}><Ic.x size={16} /></button>}
        </div>
      )}

      {data.uploaded && (
        <>
          <div className="subhead">
            <span className="ic"><Ic.table size={16} /></span> Pré-visualização detectada
            <span className="tail">primeiras 3 linhas de 84.234</span>
          </div>
          <div className="csv-wrap">
            <div className="csv-scroll">
              <table className="csv-table">
                <thead>
                  <tr>
                    {CSV_COLUMNS.map((c) => (
                      <th key={c.name}>
                        <span className="col-name">
                          <Ic.hash size={12} style={{ color: "var(--muted-foreground)" }} />{c.name}
                        </span>
                        <span className={"col-type type-" + c.type} style={{ marginTop: 6, display: "inline-block" }}>{TYPE_LABEL[c.type]}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2].map((r) => (
                    <tr key={r}>{CSV_COLUMNS.map((c) => <td key={c.name}>{c.sample[r]}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="csv-foot">6 colunas · 4 numéricas · 1 texto · 1 data — tipos inferidos automaticamente, ajuste no passo Esquema.</div>
          </div>

          <div className="subhead"><span className="ic"><Ic.verified size={16} /></span> Validação de qualidade</div>
          <div className="qa-grid">
            {QA_CHECKS.map((q) => (
              <div key={q.id} className={"qa-item " + q.state}>
                <span className="qic">{q.state === "ok" ? <Ic.check size={16} /> : <Ic.alert size={16} />}</span>
                <div>
                  <div className="qt">{q.title}</div>
                  <div className="qd">{q.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="usab-badge">
            <span className="usab-ring" style={{ "--p": 84 }}><span>8.4</span></span>
            <div className="ub-main">
              <div className="ut">Usabilidade estimada: boa</div>
              <div className="ud">Adicione descrições de colunas e licença explícita para chegar a 9+ e ganhar destaque na busca.</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ===================== STEP 2 — METADADOS ================== */
function StepMetadados({ data, set }) {
  const tagInputRef = useRefW(null);
  const addTag = (t) => {
    t = t.trim();
    if (t && !data.tags.includes(t)) set({ tags: [...data.tags, t] });
  };
  const removeTag = (t) => set({ tags: data.tags.filter((x) => x !== t) });
  const remaining = SUGGESTED_TAGS.filter((t) => !data.tags.includes(t));

  return (
    <div className="fgrid">
      <div className="field full">
        <label className="field-label">Título do dataset <span className="req">*</span></label>
        <input className="input" value={data.title} onChange={(e) => set({ title: e.target.value })}
          placeholder="Ex.: Dados Meteorológicos — Estação Seropédica (2010–2024)" />
        <span className="field-hint">Seja específico: inclua local e período cobertos.</span>
      </div>

      <div className="field full">
        <label className="field-label">Descrição <span className="req">*</span><span className="opt">{data.desc.length}/600</span></label>
        <textarea className="textarea" maxLength={600} value={data.desc} onChange={(e) => set({ desc: e.target.value })}
          placeholder="Descreva o que o conjunto contém, como foi coletado, a frequência das medições e usos recomendados." />
      </div>

      <div className="field">
        <label className="field-label">Unidade / Instituto <span className="req">*</span></label>
        <select className="select" value={data.unit} onChange={(e) => set({ unit: e.target.value })}>
          {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>

      <div className="field">
        <label className="field-label">Área de conhecimento <span className="req">*</span></label>
        <select className="select" value={data.area} onChange={(e) => set({ area: e.target.value })}>
          {AREAS.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <span className="field-hint" style={{ color: "var(--brand-green)", fontWeight: 700 }}>
          <Ic.spark size={12} style={{ display: "inline", verticalAlign: "-2px", marginRight: 4 }} />
          Sugerido automaticamente a partir das colunas detectadas.
        </span>
      </div>

      <div className="field">
        <label className="field-label">Período de cobertura</label>
        <input className="input" value={data.period} onChange={(e) => set({ period: e.target.value })} placeholder="2010 – 2024" />
      </div>

      <div className="field">
        <label className="field-label">Região / Local</label>
        <input className="input" value={data.region} onChange={(e) => set({ region: e.target.value })} placeholder="Seropédica, RJ" />
      </div>

      <div className="field full">
        <label className="field-label">Tags <span className="opt">ajudam na busca</span></label>
        <div className="tag-box" onClick={() => tagInputRef.current && tagInputRef.current.focus()}>
          {data.tags.map((t) => (
            <span key={t} className="tag-pill">{t}<button onClick={() => removeTag(t)} aria-label={"remover " + t}><Ic.x size={13} /></button></span>
          ))}
          <input ref={tagInputRef} placeholder={data.tags.length ? "" : "Digite e pressione Enter…"}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(e.target.value); e.target.value = ""; } }} />
        </div>
        {remaining.length > 0 && (
          <div className="suggest-row">
            <span className="sl"><Ic.spark size={13} /> Sugeridas:</span>
            {remaining.map((t) => (
              <button key={t} className="suggest-chip" onClick={() => addTag(t)}><Ic.plus size={12} /> {t}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== STEP 3 — ESQUEMA ==================== */
function StepEsquema({ data, set }) {
  const update = (i, key, val) => {
    const next = data.schema.map((c, idx) => idx === i ? { ...c, [key]: val } : c);
    set({ schema: next });
  };
  return (
    <div>
      <div className="subhead" style={{ marginTop: 0 }}>
        <span className="ic"><Ic.columns size={16} /></span> Descreva as colunas
        <span className="tail">{data.schema.length} colunas · descrições elevam a usabilidade</span>
      </div>
      <div className="schema-tbl">
        <div className="schema-hd">
          <span>Coluna</span><span>Tipo</span><span>Descrição</span><span>Unidade</span>
        </div>
        {data.schema.map((c, i) => (
          <div className="schema-rw" key={c.name}>
            <span className="sc-name"><Ic.hash size={14} className="hashic" />{c.name}</span>
            <select className="sc-type-sel" value={c.type} onChange={(e) => update(i, "type", e.target.value)}>
              <option value="num">Número</option>
              <option value="text">Texto</option>
              <option value="date">Data</option>
              <option value="geo">Geo</option>
            </select>
            <input className="sc-input" value={c.desc} onChange={(e) => update(i, "desc", e.target.value)} placeholder="O que esta coluna representa?" />
            <input className="sc-input" value={c.unit} onChange={(e) => update(i, "unit", e.target.value)} placeholder="—" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== STEP 4 — LICENÇA ==================== */
function StepLicenca({ data, set }) {
  const lic = LICENSES.find((l) => l.id === data.license) || LICENSES[0];
  const year = 2026;
  return (
    <div>
      <div className="subhead" style={{ marginTop: 0 }}><span className="ic"><Ic.scale size={16} /></span> Licença de uso</div>
      <div className="lic-grid">
        {LICENSES.map((l) => (
          <div key={l.id} className={"lic-card" + (data.license === l.id ? " sel" : "")} onClick={() => set({ license: l.id })}>
            <span className="lic-radio"></span>
            <div className="lc-main">
              <div className="lc-name">{l.name} <span className={"lc-tag" + (l.rec ? " rec" : "")}>{l.tag}</span></div>
              <div className="lc-desc">{l.desc}</div>
              <div className="lc-perms">
                <span className={l.commercial ? "yes" : "no"}>{l.commercial ? <Ic.check size={13} /> : <Ic.x size={13} />} Uso comercial</span>
                <span className={l.derivatives ? "yes" : "no"}>{l.derivatives ? <Ic.check size={13} /> : <Ic.x size={13} />} Derivações</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="subhead"><span className="ic"><Ic.eye size={16} /></span> Visibilidade</div>
      <div className="vis-row">
        <div className={"vis-card" + (data.visibility === "public" ? " sel" : "")} onClick={() => set({ visibility: "public" })}>
          <span className="vic" style={{ background: "var(--brand-green)" }}><Ic.globe size={20} /></span>
          <div>
            <div className="vt">Público</div>
            <div className="vd">Qualquer pessoa pode encontrar, visualizar e baixar.</div>
          </div>
        </div>
        <div className={"vis-card" + (data.visibility === "restricted" ? " sel" : "")} onClick={() => set({ visibility: "restricted" })}>
          <span className="vic" style={{ background: "var(--brand-orange)" }}><Ic.lock size={20} /></span>
          <div>
            <div className="vt">Restrito</div>
            <div className="vd">Acesso mediante solicitação aprovada pelo autor.</div>
          </div>
        </div>
      </div>

      <div className="cite-box">
        <div className="ch"><Ic.quote size={14} /> Como será citado</div>
        <div className="ctext">
          {data.unit ? ME.name + " (" + year + "). " : ""}
          <em>{data.title || "Título do dataset"}</em> ({lic.name}). DataRural — UFRRJ.{" "}
          <span className="doi">https://doi.org/10.5281/datarural.{Math.floor(Math.random() * 9000 + 1000)}</span>
        </div>
      </div>
    </div>
  );
}

/* ===================== STEP 5 — REVISÃO =================== */
function StepRevisao({ data, set, onJump }) {
  const lic = LICENSES.find((l) => l.id === data.license) || LICENSES[0];
  const area = AREAS.find((a) => a.id === data.area);
  const cards = [
    { title: "Arquivo", icon: "uploadcloud", color: "var(--brand-blue)", step: 0, rows: [
      ["Nome do arquivo", data.fileName || "—"],
      ["Tamanho", data.fileSize || "—"],
      ["Conteúdo", "84.234 linhas · 6 colunas"],
    ]},
    { title: "Metadados", icon: "info", color: "var(--brand-sky)", step: 1, rows: [
      ["Título", data.title || "—"],
      ["Unidade", data.unit],
      ["Área", area ? area.name : "—"],
      ["Período", data.period || "—"],
      ["Tags", "tags"],
    ]},
    { title: "Licença & visibilidade", icon: "scale", color: "var(--brand-green)", step: 3, rows: [
      ["Licença", lic.name],
      ["Visibilidade", data.visibility === "public" ? "Público" : "Restrito"],
    ]},
  ];
  return (
    <div>
      {cards.map((c) => (
        <div className="review-card" key={c.title}>
          <div className="review-card-hd">
            <span className="ric" style={{ background: c.color }}>{React.createElement(Ic[c.icon], { size: 16 })}</span>
            <span className="rt">{c.title}</span>
            <button className="edit" onClick={() => onJump(c.step)}><Ic.edit size={13} /> Editar</button>
          </div>
          <div className="review-rows">
            {c.rows.map(([k, v]) => (
              <div className="review-row" key={k}>
                <span className="rk">{k}</span>
                <span className="rv">
                  {v === "tags"
                    ? <span className="tagline">{data.tags.length ? data.tags.map((t) => <span key={t} className="ds-tag">{t}</span>) : "—"}</span>
                    : v}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="review-confirm">
        <input type="checkbox" id="confirm" checked={data.confirm} onChange={(e) => set({ confirm: e.target.checked })} />
        <label htmlFor="confirm">
          Confirmo que tenho autorização para publicar estes dados e que eles estão de acordo com a{" "}
          <a href="#">Política de Dados Abertos da UFRRJ</a> e a LGPD (sem dados pessoais identificáveis).
        </label>
      </div>
    </div>
  );
}

/* ===================== SUCCESS ============================ */
function PublishSuccess({ data, onDashboard, onView }) {
  return (
    <div className="wpanel">
      <div className="publish-success">
        <div className="ps-check"><Ic.check size={44} /></div>
        <h2>Dataset enviado para curadoria!</h2>
        <p>
          <strong style={{ color: "var(--foreground)" }}>{data.title || "Seu dataset"}</strong> foi recebido e está na fila
          de revisão da equipe DataRural. Você será notificada por e-mail quando ele for ao ar — normalmente em até 2 dias úteis.
        </p>
        <div className="ps-actions">
          <button className="btn btn-primary btn-lg" onClick={onDashboard}><Ic.layers size={18} /> Ir para Meus datasets</button>
          <a className="btn btn-outline btn-lg" href={DETAIL_URL}><Ic.eye size={18} /> Pré-visualizar página</a>
        </div>
        <div className="ps-meta">
          <div className="pm"><span className="k">Status</span><span className="v" style={{ color: "var(--brand-orange)" }}>Em revisão</span></div>
          <div className="pm"><span className="k">Versão</span><span className="v">v1</span></div>
          <div className="pm"><span className="k">Identificador</span><span className="v">DR-2026-0148</span></div>
        </div>
      </div>
    </div>
  );
}

/* ===================== WIZARD SHELL ====================== */
function UploadWizard({ onExit, onDashboard }) {
  const [step, setStep] = useStateW(0);
  const [maxReached, setMaxReached] = useStateW(0);
  const [published, setPublished] = useStateW(false);
  const [data, setData] = useStateW({
    uploaded: false, uploading: false, progress: 0, fileName: "", fileSize: "",
    title: "", desc: "", unit: UNITS[0], area: "clima", period: "", region: "",
    tags: ["clima", "séries temporais"],
    schema: CSV_COLUMNS.map((c) => ({ ...c })),
    license: "ccby", visibility: "public", confirm: false,
  });
  const set = (patch) => setData((d) => ({ ...d, ...patch }));

  const goto = (n) => {
    const clamped = Math.max(0, Math.min(WIZ_STEPS.length - 1, n));
    setStep(clamped);
    setMaxReached((m) => Math.max(m, clamped));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canNext = (() => {
    if (step === 0) return data.uploaded;
    if (step === 1) return data.title.trim() && data.desc.trim();
    if (step === 4) return data.confirm;
    return true;
  })();

  const heads = [
    { h: "Envie seu arquivo de dados", p: "Faça o upload do conjunto. Detectamos colunas, tipos e qualidade automaticamente." },
    { h: "Descreva o dataset", p: "Bons metadados tornam seus dados encontráveis e reutilizáveis pela comunidade." },
    { h: "Refine o esquema", p: "Confirme os tipos e descreva cada coluna — isso eleva a nota de usabilidade." },
    { h: "Defina licença e acesso", p: "Escolha como a comunidade pode reutilizar seus dados." },
    { h: "Revise e publique", p: "Confira tudo antes de enviar para a curadoria DataRural." },
  ];

  if (published) {
    return (
      <div className="panel-wrap">
        <SimplePageHead onExit={onExit} />
        <div className="container"><div className="wizard"><div style={{ maxWidth: 720, margin: "0 auto" }}><PublishSuccess data={data} onDashboard={onDashboard} /></div></div></div>
      </div>
    );
  }

  return (
    <div className="panel-wrap">
      <SimplePageHead onExit={onExit} step={step} />
      <div className="container">
        <div className="wizard">
          <div className="wizard-grid">
            <Stepper step={step} onJump={goto} maxReached={maxReached} />
            <div className="wpanel">
              <div className="wpanel-head">
                <h2>{heads[step].h}</h2>
                <p>{heads[step].p}</p>
              </div>
              <div className="wpanel-body">
                {step === 0 && <StepArquivo data={data} set={set} />}
                {step === 1 && <StepMetadados data={data} set={set} />}
                {step === 2 && <StepEsquema data={data} set={set} />}
                {step === 3 && <StepLicenca data={data} set={set} />}
                {step === 4 && <StepRevisao data={data} set={set} onJump={goto} />}
              </div>
              <div className="wpanel-foot">
                {step === 0
                  ? <button className="btn btn-ghost" onClick={onExit}>Cancelar</button>
                  : <button className="btn btn-outline" onClick={() => goto(step - 1)}><Ic.arrow size={16} style={{ transform: "rotate(180deg)" }} /> Voltar</button>}
                <span className="save-note"><Ic.check size={14} /> Rascunho salvo automaticamente</span>
                <div className="foot-right">
                  {step < WIZ_STEPS.length - 1
                    ? <button className="btn btn-primary" disabled={!canNext} onClick={() => goto(step + 1)}
                        style={!canNext ? { opacity: 0.5, cursor: "not-allowed" } : null}>Continuar <Ic.arrow size={16} /></button>
                    : <button className="btn btn-yellow btn-lg" disabled={!canNext} onClick={() => { setPublished(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        style={!canNext ? { opacity: 0.5, cursor: "not-allowed" } : null}><Ic.send size={18} /> Publicar dataset</button>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimplePageHead({ onExit, step }) {
  return (
    <div className="page-head">
      <div className="container">
        <div className="page-head-inner">
          <div>
            <div className="page-breadcrumb">
              <a href={HOME_URL}>Início</a>
              <span className="sep"><Ic.chevr size={13} /></span>
              <a href="#" onClick={(e) => { e.preventDefault(); onExit(); }}>Meus datasets</a>
              <span className="sep"><Ic.chevr size={13} /></span>
              <span>Publicar</span>
            </div>
            <h1>Publicar dataset</h1>
            <p className="page-sub">Em 5 etapas seu conjunto fica documentado, versionado e pronto para a comunidade.</p>
          </div>
          <div className="page-head-actions">
            <button className="btn btn-outline btn-lg" onClick={onExit}><Ic.x size={18} /> Sair do envio</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { UploadWizard });
