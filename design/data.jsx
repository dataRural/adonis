/* ============================================================
   data.jsx — conteúdo de exemplo (datasets, categorias, stats)
   ============================================================ */

const CATEGORIES = [
  { id: "agro",   name: "Agronomia",            count: 214, icon: "sprout", color: "var(--brand-green)" },
  { id: "vet",    name: "Veterinária",          count: 168, icon: "paw",    color: "var(--brand-orange)" },
  { id: "clima",  name: "Clima & Meteorologia", count: 96,  icon: "cloud",  color: "var(--brand-sky)" },
  { id: "bio",    name: "Ciências Biológicas",  count: 143, icon: "leaf",   color: "var(--brand-lightgreen)" },
  { id: "flor",   name: "Florestas",            count: 71,  icon: "tree",   color: "var(--brand-teal)" },
  { id: "exatas", name: "Ciências Exatas",      count: 88,  icon: "chart",  color: "var(--brand-blue)" },
  { id: "quim",   name: "Química",              count: 64,  icon: "flask",  color: "var(--brand-purple)" },
  { id: "zoo",    name: "Zootecnia",            count: 102, icon: "database", color: "var(--brand-orange)" },
  { id: "soc",    name: "Ciências Sociais",     count: 79,  icon: "users",  color: "var(--brand-blue)" },
  { id: "econ",   name: "Economia & Gestão",    count: 58,  icon: "chart",  color: "var(--brand-green)" },
];

const STATS = [
  { val: "1.247",  label: "Datasets publicados",  color: "var(--brand-blue)" },
  { val: "38,9 mil", label: "Downloads realizados", color: "var(--brand-green)" },
  { val: "12",     label: "Institutos contribuindo", color: "var(--brand-yellow)" },
  { val: "540",    label: "Pesquisadores",        color: "var(--brand-orange)" },
];

const POPULAR = ["Produção agrícola", "Clima Seropédica", "Solos", "Rebanho bovino", "Qualidade da água"];

const DATASETS = [
  {
    id: 1,
    title: "Dados Meteorológicos — Estação Seropédica (2010–2024)",
    unit: "Instituto de Ciências Exatas",
    desc: "Séries horárias de temperatura, umidade, precipitação e radiação solar da estação automática do campus principal.",
    tags: ["clima", "séries temporais", "meteorologia"],
    cat: "clima", format: "CSV", tint: "var(--brand-sky)",
    size: "12,4 MB", rows: "84,2 mil linhas", downloads: 2310, dl: "2,3 mil",
    updated: "há 3 dias", license: "CC BY 4.0", usability: "9.4",
    featured: true, recent: true, order: 1,
  },
  {
    id: 2,
    title: "Produção Agrícola Municipal — Baixada Fluminense",
    unit: "Instituto de Agronomia",
    desc: "Área plantada, produzida e rendimento médio por cultura e município, consolidado a partir de levantamentos de campo.",
    tags: ["agronomia", "produção", "geoespacial"],
    cat: "agro", format: "CSV", tint: "var(--brand-green)",
    size: "3,1 MB", rows: "21,7 mil linhas", downloads: 1890, dl: "1,9 mil",
    updated: "há 1 semana", license: "CC BY-SA 4.0", usability: "9.1",
    featured: true, recent: false, order: 2,
  },
  {
    id: 3,
    title: "Rebanho Bovino e Indicadores de Sanidade Animal",
    unit: "Instituto de Veterinária",
    desc: "Registros de efetivo, vacinação e ocorrências sanitárias do rebanho experimental, com recorte mensal por lote.",
    tags: ["veterinária", "pecuária", "sanidade"],
    cat: "vet", format: "CSV", tint: "var(--brand-orange)",
    size: "5,8 MB", rows: "34,1 mil linhas", downloads: 1430, dl: "1,4 mil",
    updated: "há 4 dias", license: "CC BY 4.0", usability: "8.8",
    featured: true, recent: true, order: 3,
  },
  {
    id: 4,
    title: "Matrículas e Trajetória de Graduação UFRRJ",
    unit: "Pró-Reitoria de Graduação",
    desc: "Ingressos, matrículas ativas, evasão e conclusão por curso e período, anonimizado conforme a LGPD.",
    tags: ["educação", "indicadores", "gestão"],
    cat: "soc", format: "CSV", tint: "var(--brand-blue)",
    size: "8,9 MB", rows: "112 mil linhas", downloads: 3120, dl: "3,1 mil",
    updated: "há 2 dias", license: "ODbL 1.0", usability: "9.6",
    featured: true, recent: true, order: 4,
  },
  {
    id: 5,
    title: "Qualidade da Água — Bacia do Rio Guandu",
    unit: "Ciências Biológicas e da Saúde",
    desc: "Parâmetros físico-químicos e microbiológicos coletados em pontos de monitoramento ao longo da bacia.",
    tags: ["água", "ambiental", "monitoramento"],
    cat: "bio", format: "CSV", tint: "var(--brand-lightgreen)",
    size: "2,2 MB", rows: "9,4 mil linhas", downloads: 980, dl: "980",
    updated: "há 5 dias", license: "CC BY 4.0", usability: "8.5",
    featured: false, recent: true, order: 5,
  },
  {
    id: 6,
    title: "Inventário Florestal — Floresta Nacional Mário Xavier",
    unit: "Instituto de Florestas",
    desc: "Medições dendrométricas de parcelas permanentes: espécie, DAP, altura e biomassa estimada.",
    tags: ["florestas", "biomassa", "ecologia"],
    cat: "flor", format: "CSV", tint: "var(--brand-teal)",
    size: "4,5 MB", rows: "27,8 mil linhas", downloads: 760, dl: "760",
    updated: "há 2 semanas", license: "CC BY-NC 4.0", usability: "8.2",
    featured: true, recent: false, order: 6,
  },
  {
    id: 7,
    title: "Composição e Fertilidade de Solos — Campus Seropédica",
    unit: "Instituto de Agronomia",
    desc: "Análises de pH, matéria orgânica, macro e micronutrientes em malha amostral georreferenciada.",
    tags: ["solos", "agronomia", "geoquímica"],
    cat: "agro", format: "CSV", tint: "var(--brand-green)",
    size: "1,7 MB", rows: "6,1 mil linhas", downloads: 1120, dl: "1,1 mil",
    updated: "há 6 dias", license: "CC BY 4.0", usability: "8.9",
    featured: false, recent: true, order: 7,
  },
  {
    id: 8,
    title: "Séries de Preços de Hortifrúti — CEASA-RJ",
    unit: "Ciências Sociais Aplicadas",
    desc: "Preços diários por produto e classificação, úteis para estudos de mercado agrícola e séries econômicas.",
    tags: ["economia", "preços", "séries temporais"],
    cat: "econ", format: "CSV", tint: "var(--brand-green)",
    size: "6,3 MB", rows: "58,9 mil linhas", downloads: 2040, dl: "2,0 mil",
    updated: "há 1 dia", license: "CC BY 4.0", usability: "9.0",
    featured: false, recent: true, order: 8,
  },
  {
    id: 9,
    title: "Perfis de Expressão Gênica em Cana-de-açúcar",
    unit: "Instituto de Química — Biotecnologia",
    desc: "Matriz de expressão normalizada de ensaios de bancada, com metadados de tratamento e réplica.",
    tags: ["química", "genômica", "biotecnologia"],
    cat: "quim", format: "CSV", tint: "var(--brand-purple)",
    size: "18,7 MB", rows: "146 mil linhas", downloads: 640, dl: "640",
    updated: "há 9 dias", license: "CC BY-NC 4.0", usability: "8.4",
    featured: false, recent: false, order: 9,
  },
];

Object.assign(window, { CATEGORIES, STATS, POPULAR, DATASETS });
