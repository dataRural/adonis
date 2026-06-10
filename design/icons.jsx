/* ============================================================
   icons.jsx — logo DataRural, grafismo Arcos da Rural, ícones UI
   Exporta tudo para window ao final.
   ============================================================ */

/* ---------- Logo original "DataRural" -----------------------
   Inspirado na linguagem da Rural: arcos/folha geométricos +
   nós (átomo) reinterpretados como camadas de dados (database).
   NÃO reproduz o brasão oficial UFRRJ. -------------------------*/
function BrandMark({ size = 38 }) {
  return (
    <svg className="brand-mark" width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* folha / arco (vesica) — verde */}
      <path d="M24 5 C33 12 33 24 24 31 C15 24 15 12 24 5 Z"
      stroke="var(--brand-green)" strokeWidth="2.4" fill="none" strokeLinejoin="round" />
      {/* haste */}
      <path d="M24 18 L24 33" stroke="var(--brand-green)" strokeWidth="2.4" strokeLinecap="round" />
      {/* camadas de dados (database) — azul */}
      <ellipse cx="24" cy="34" rx="13" ry="4.4" stroke="var(--brand-blue)" strokeWidth="2.4" fill="none" />
      <path d="M11 34 V40 C11 42.4 16.8 44 24 44 C31.2 44 37 42.4 37 40 V34"
      stroke="var(--brand-blue)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {/* nó amarelo (átomo/dado) */}
      <circle cx="24" cy="34" r="2.6" fill="var(--brand-yellow)" />
    </svg>);

}

/* ---------- Arcos da Rural ----------------------------------
   Cluster de folhas (vesica piscis) multicoloridas em linha,
   geradas a partir de arcos sobrepostos. Original. ------------*/
function leafPath(cx, cy, len, wid, angleDeg) {
  // folha apontada horizontal, depois rotacionada via transform
  const hl = len / 2,hw = wid / 2;
  return {
    d: `M ${-hl} 0 Q 0 ${-hw} ${hl} 0 Q 0 ${hw} ${-hl} 0 Z`,
    transform: `translate(${cx} ${cy}) rotate(${angleDeg})`
  };
}

function ArcosCluster({ palette }) {
  const cols = palette || [
  "var(--brand-blue)", "var(--brand-green)", "var(--brand-yellow)",
  "var(--brand-orange)", "var(--brand-sky)", "var(--brand-lightgreen)",
  "var(--brand-teal)", "var(--brand-purple)"];

  // posições/rotações curadas para parecer orgânico, não aleatório
  const leaves = [
  [150, 60, 150, 64, 18], [232, 96, 132, 56, -32], [120, 150, 168, 70, 62],
  [210, 176, 150, 60, 6], [298, 140, 138, 58, 40], [96, 250, 150, 62, -18],
  [188, 262, 162, 66, 78], [276, 232, 130, 54, 22], [320, 300, 150, 60, -44],
  [150, 330, 140, 58, 50], [238, 350, 158, 64, -8], [70, 360, 130, 52, 30],
  [330, 200, 120, 50, -70], [108, 70, 120, 50, 100]];

  // círculos soltos (formato mais circular do manual)
  const circles = [[300, 70, 46], [60, 180, 38], [360, 360, 40], [40, 300, 28]];
  return (
    <svg viewBox="0 0 400 420" fill="none" aria-hidden="true">
      <g strokeWidth="2.4" fill="none" strokeLinejoin="round" strokeLinecap="round">
        {circles.map((c, i) =>
        <circle key={"c" + i} cx={c[0]} cy={c[1]} r={c[2]} stroke={cols[(i + 2) % cols.length]} />
        )}
        {leaves.map((l, i) => {
          const p = leafPath(l[0], l[1], l[2], l[3], l[4]);
          return <path key={"l" + i} d={p.d} transform={p.transform} stroke={cols[i % cols.length]} />;
        })}
      </g>
    </svg>);

}

/* Versão branca para usar sobre fundo azul (CTA) */
function ArcosClusterMono({ color = "rgba(255,255,255,0.9)" }) {
  const leaves = [
  [150, 60, 150, 64, 18], [232, 96, 132, 56, -32], [120, 150, 168, 70, 62],
  [210, 176, 150, 60, 6], [298, 140, 138, 58, 40], [188, 262, 162, 66, 78],
  [276, 232, 130, 54, 22], [238, 350, 158, 64, -8]];

  const circles = [[300, 70, 46], [120, 300, 40]];
  return (
    <svg viewBox="0 0 400 420" fill="none" aria-hidden="true">
      <g strokeWidth="2.2" fill="none" strokeLinejoin="round" strokeLinecap="round" stroke={color}>
        {circles.map((c, i) => <circle key={"c" + i} cx={c[0]} cy={c[1]} r={c[2]} />)}
        {leaves.map((l, i) => {
          const p = leafPath(l[0], l[1], l[2], l[3], l[4]);
          return <path key={"l" + i} d={p.d} transform={p.transform} />;
        })}
      </g>
    </svg>);

}

/* fundo decorativo dos cards (folhas grandes suaves) */
function CardArt({ tint }) {
  return (
    <svg viewBox="0 0 320 96" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="320" height="96" fill={"color-mix(in srgb, " + tint + " 9%, var(--card))"} />
      <g strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round"
      stroke={"color-mix(in srgb, " + tint + " 55%, transparent)"}>
        <path d={leafPath(248, 30, 120, 50, 24).d} transform={leafPath(248, 30, 120, 50, 24).transform} />
        <path d={leafPath(286, 66, 100, 42, -30).d} transform={leafPath(286, 66, 100, 42, -30).transform} />
        <circle cx="300" cy="20" r="26" />
      </g>
      <g strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round"
      stroke={"color-mix(in srgb, " + tint + " 30%, transparent)"}>
        <path d={leafPath(40, 70, 110, 46, 50).d} transform={leafPath(40, 70, 110, 46, 50).transform} />
      </g>
    </svg>);

}

/* ---------- Ícones de UI (Lucide-style, traço) -------------- */
const Ic = {};
function mk(name, body, vb = "0 0 24 24") {
  Ic[name] = function ({ size = 18, stroke = 2, ...rest }) {
    return (
      <svg width={size} height={size} viewBox={vb} fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...rest}>
        {body}
      </svg>);

  };
}
mk("search", <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>);
mk("download", <><path d="M12 3v12" /><path d="m7 11 5 5 5-5" /><path d="M5 21h14" /></>);
mk("database", <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>);
mk("users", <><circle cx="9" cy="8" r="3.2" /><path d="M3.5 20a6 6 0 0 1 11 0" /><path d="M16 5.5a3.2 3.2 0 0 1 0 5" /><path d="M17 14.4a6 6 0 0 1 3.5 5.6" /></>);
mk("building", <><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" /></>);
mk("arrow", <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>);
mk("sun", <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>);
mk("moon", <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z" />);
mk("clock", <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);
mk("star", <path d="m12 3 2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9 6.7 19.2l1-5.8-4.2-4.1 5.9-.9Z" />);
mk("grid", <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>);
mk("rows", <><path d="M3 6h18M3 12h18M3 18h18" /></>);
mk("sprout", <><path d="M12 20v-8" /><path d="M12 12c0-3 2.5-5 6-5 0 3-2.5 5-6 5Z" /><path d="M12 13c0-2.6-2.2-4.4-5.5-4.4 0 2.6 2.2 4.4 5.5 4.4Z" /></>);
mk("flask", <><path d="M9 3h6M10 3v6l-5 8.5A2 2 0 0 0 6.7 21h10.6a2 2 0 0 0 1.7-3.5L14 9V3" /><path d="M8 15h8" /></>);
mk("leaf", <><path d="M4 20c0-9 7-15 16-15 0 9-7 15-16 15Z" /><path d="M4 20c4-6 8-9 12-10" /></>);
mk("cloud", <><path d="M7 18a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.5 1.5A3.5 3.5 0 0 1 17 18Z" /></>);
mk("paw", <><circle cx="6.5" cy="11" r="1.8" /><circle cx="10" cy="7.5" r="1.8" /><circle cx="14" cy="7.5" r="1.8" /><circle cx="17.5" cy="11" r="1.8" /><path d="M8 16.5c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5-1.8 3-4 3-4-1-4-3Z" /></>);
mk("tree", <><path d="M12 22v-5" /><path d="M12 17a6 6 0 0 0 6-6 5 5 0 0 0-1-3 5 5 0 0 0-10 0 5 5 0 0 0-1 3 6 6 0 0 0 6 6Z" /></>);
mk("chart", <><path d="M3 3v18h18" /><path d="M7 14l3-4 3 3 4-6" /></>);
mk("scale", <><path d="M12 3v18" /><path d="M5 7h14" /><path d="m5 7-2.5 6a3 3 0 0 0 5 0L5 7Z" /><path d="m19 7-2.5 6a3 3 0 0 0 5 0L19 7Z" /><path d="M8 21h8" /></>);
mk("book", <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" /><path d="M4 19a2 2 0 0 0 2 2h13" /></>);
mk("verified", <><path d="m9 12 2 2 4-4" /><path d="M12 2.5 14.5 5l3.5-.3.3 3.5L21 12l-2.7 3.5-.3 3.5-3.5-.3L12 21.5 9 19l-3.5.3-.3-3.5L2.5 12 5.2 8.5 5.5 5 9 5.3 12 2.5Z" /></>);
mk("file", <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5" /></>);
mk("dot", <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />);
/* --- detalhamento de dataset --- */
mk("share", <><circle cx="18" cy="5" r="2.6" /><circle cx="6" cy="12" r="2.6" /><circle cx="18" cy="19" r="2.6" /><path d="m8.3 10.7 7.4-4.4M8.3 13.3l7.4 4.4" /></>);
mk("link", <><path d="M10 13a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 1 0-5.7-5.7L11 6.3" /><path d="M14 11a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 1 0 5.7 5.7L13 17.7" /></>);
mk("copy", <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2" /></>);
mk("code", <><path d="m9 8-4 4 4 4" /><path d="m15 8 4 4-4 4" /></>);
mk("history", <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 4v4h4" /><path d="M12 8v4l3 2" /></>);
mk("calendar", <><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></>);
mk("pin", <><path d="M12 21s7-6.3 7-11a7 7 0 0 0-14 0c0 4.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></>);
mk("message", <><path d="M21 12a8 8 0 0 1-11.5 7.2L4 20.5l1.3-5.4A8 8 0 1 1 21 12Z" /></>);
mk("eye", <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>);
mk("heart", <path d="M12 20s-7-4.4-9.2-9A4.7 4.7 0 0 1 12 6.5 4.7 4.7 0 0 1 21.2 11C19 15.6 12 20 12 20Z" />);
mk("up", <><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></>);
mk("chevd", <path d="m6 9 6 6 6-6" />);
mk("chevr", <path d="m9 6 6 6-6 6" />);
mk("external", <><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></>);
mk("hash", <><path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16" /></>);
mk("type", <><path d="M4 7V5h16v2" /><path d="M12 5v14" /><path d="M9 19h6" /></>);
mk("sigma", <><path d="M18 5H6l6 7-6 7h12" /></>);
mk("sort", <><path d="M7 4v16" /><path d="m4 8 3-4 3 4" /><path d="M17 20V4" /><path d="m14 16 3 4 3-4" /></>);
mk("check", <path d="m5 12 5 5L20 7" />);
mk("info", <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>);
mk("spark", <><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="m6 6 2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /></>);
mk("folder", <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h6a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />);
mk("columns", <><rect x="3.5" y="4" width="17" height="16" rx="2" /><path d="M9.5 4v16M14.5 4v16" /></>);
mk("bookmark", <path d="M6 4h12v16l-6-4-6 4Z" />);
mk("plus", <><path d="M12 5v14M5 12h14" /></>);
mk("quote", <><path d="M7 7H4v6h6V7H7Zm0 0c0 4-1 5-3 6" /><path d="M17 7h-3v6h6V7h-3Zm0 0c0 4-1 5-3 6" /></>);
mk("table", <><rect x="3.5" y="4" width="17" height="16" rx="2" /><path d="M3.5 9.5h17M3.5 15h17M9.5 9.5V20M14.5 9.5V20" /></>);
mk("filter", <path d="M3 5h18l-7 8v5l-4 2v-7Z" />);
mk("globe", <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" /></>);
mk("flag", <><path d="M5 21V4M5 4h11l-2 4 2 4H5" /></>);
mk("thermometer", <><path d="M12 4a2 2 0 0 1 2 2v8.5a4 4 0 1 1-4 0V6a2 2 0 0 1 2-2Z" /></>);
/* --- painel / envio --- */
mk("more", <><circle cx="12" cy="5" r="1.6" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /><circle cx="12" cy="19" r="1.6" fill="currentColor" stroke="none" /></>);
mk("edit", <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>);
mk("trash", <><path d="M4 7h16" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" /><path d="M10 11v6M14 11v6" /></>);
mk("eyeoff", <><path d="M10.6 6.2A9.7 9.7 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3 3.5M6.6 6.6A17 17 0 0 0 2 12s3.6 6 10 6a9.4 9.4 0 0 0 4.5-1.1" /><path d="m9.9 9.9a3 3 0 0 0 4.2 4.2" /><path d="M2 2l20 20" /></>);
mk("branch", <><circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="8" r="2.5" /><path d="M6 8.5v7M18 10.5a6 6 0 0 1-6 6H6" /></>);
mk("x", <><path d="M6 6l12 12M18 6 6 18" /></>);
mk("alert", <><path d="M12 3 2.5 19.5a1 1 0 0 0 .9 1.5h17.2a1 1 0 0 0 .9-1.5L12 3Z" /><path d="M12 9v5M12 17.5h.01" /></>);
mk("uploadcloud", <><path d="M7 18a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.5 1.5A3.5 3.5 0 0 1 17 18" /><path d="M12 13v7" /><path d="m9 16 3-3 3 3" /></>);
mk("save", <><path d="M5 3h11l3 3v15H5Z" /><path d="M8 3v5h7M8 21v-7h8v7" /></>);
mk("send", <><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4Z" /></>);
mk("layers", <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5M3 18l9 5 9-5" /></>);
mk("lock", <><rect x="4.5" y="11" width="15" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>);
mk("settings", <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 0 1-4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 0 1 0-4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 2.9-1.2V3a2 2 0 0 1 4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9H21a2 2 0 0 1 0 4h-.2a1.7 1.7 0 0 0-1.4.9Z" /></>);
mk("user", <><circle cx="12" cy="8" r="3.6" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>);
mk("logout", <><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 17l-5-5 5-5" /><path d="M5 12h11" /></>);

Object.assign(window, { BrandMark, ArcosCluster, ArcosClusterMono, CardArt, leafPath, Ic });