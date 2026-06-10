/* ============================================================
   panel-data.jsx — dados de exemplo do autor logado:
   "Meus datasets", esquema/preview de CSV, licenças.
   ============================================================ */

const ME = {
  name: "Dra. Helena Vasconcelos",
  short: "HV",
  role: "Instituto de Ciências Exatas",
  unit: "Instituto de Ciências Exatas",
};

const MY_STATS = [
  { id: "pub", val: "7", label: "Datasets publicados", icon: "database", color: "var(--brand-blue)", trend: "+2 este mês" },
  { id: "dl", val: "9.842", label: "Downloads totais", icon: "download", color: "var(--brand-green)", trend: "+12%" },
  { id: "views", val: "31,4 mil", label: "Visualizações", icon: "eye", color: "var(--brand-sky)", trend: "+8%" },
  { id: "rev", val: "2", label: "Em revisão", icon: "history", color: "var(--brand-orange)", trend: "curadoria" },
];

/* status: published | review | draft | unpublished */
const MY_DATASETS = [
  {
    id: 1, title: "Dados Meteorológicos — Estação Seropédica (2010–2024)",
    unit: "Instituto de Ciências Exatas", format: "CSV", tint: "var(--brand-sky)",
    status: "published", version: "v4", updated: "há 3 dias",
    downloads: "2.310", views: "8,1 mil", usability: "9.4", rows: "84,2 mil",
  },
  {
    id: 2, title: "Radiação Solar e Evapotranspiração — Baixada Fluminense",
    unit: "Instituto de Ciências Exatas", format: "CSV", tint: "var(--brand-orange)",
    status: "published", version: "v2", updated: "há 1 semana",
    downloads: "1.180", views: "4,3 mil", usability: "9.0", rows: "41,7 mil",
  },
  {
    id: 3, title: "Índices Climáticos Mensais — Campus UFRRJ",
    unit: "Instituto de Ciências Exatas", format: "CSV", tint: "var(--brand-blue)",
    status: "review", version: "v1", updated: "há 6 horas",
    downloads: "—", views: "—", usability: null, rows: "12,4 mil",
  },
  {
    id: 4, title: "Séries de Precipitação Horária — Rede Automática",
    unit: "Instituto de Ciências Exatas", format: "Parquet", tint: "var(--brand-teal)",
    status: "published", version: "v3", updated: "há 2 semanas",
    downloads: "3.420", views: "11,2 mil", usability: "9.6", rows: "210 mil",
  },
  {
    id: 5, title: "Qualidade do Ar — Estações de Monitoramento RJ",
    unit: "Instituto de Ciências Exatas", format: "CSV", tint: "var(--brand-purple)",
    status: "draft", version: "rascunho", updated: "há 1 dia",
    downloads: "—", views: "—", usability: null, rows: "6,8 mil",
  },
  {
    id: 6, title: "Balanço Hídrico Climatológico — Seropédica",
    unit: "Instituto de Ciências Exatas", format: "CSV", tint: "var(--brand-green)",
    status: "published", version: "v1", updated: "há 1 mês",
    downloads: "932", views: "3,8 mil", usability: "8.7", rows: "9,1 mil",
  },
  {
    id: 7, title: "Velocidade e Direção do Vento — Torre Anemométrica",
    unit: "Instituto de Ciências Exatas", format: "CSV", tint: "var(--brand-sky)",
    status: "review", version: "v2", updated: "há 2 dias",
    downloads: "—", views: "—", usability: null, rows: "58,2 mil",
  },
  {
    id: 8, title: "Temperatura do Solo por Profundidade (2018–2023)",
    unit: "Instituto de Ciências Exatas", format: "CSV", tint: "var(--brand-orange)",
    status: "unpublished", version: "v1", updated: "há 3 meses",
    downloads: "210", views: "1,1 mil", usability: "7.9", rows: "33,5 mil",
  },
];

const STATUS_META = {
  published:   { label: "Publicado",   color: "var(--brand-green)" },
  review:      { label: "Em revisão",  color: "var(--brand-orange)" },
  draft:       { label: "Rascunho",    color: "var(--muted-foreground)" },
  unpublished: { label: "Despublicado",color: "var(--destructive)" },
};

/* preview de CSV detectado no upload (passo 1) */
const CSV_COLUMNS = [
  { name: "data_hora",    type: "date", sample: ["2024-01-01 00:00", "2024-01-01 01:00", "2024-01-01 02:00"], desc: "Carimbo de data/hora da leitura", unit: "ISO 8601" },
  { name: "temp_c",       type: "num",  sample: ["22,4", "21,8", "21,1"], desc: "Temperatura do ar", unit: "°C" },
  { name: "umidade_pct",  type: "num",  sample: ["78", "81", "84"], desc: "Umidade relativa do ar", unit: "%" },
  { name: "precip_mm",    type: "num",  sample: ["0,0", "0,0", "1,2"], desc: "Precipitação acumulada", unit: "mm" },
  { name: "rad_wm2",      type: "num",  sample: ["0", "0", "0"], desc: "Radiação solar global", unit: "W/m²" },
  { name: "estacao",      type: "text", sample: ["Seropédica", "Seropédica", "Seropédica"], desc: "Identificação da estação", unit: "—" },
];

const TYPE_LABEL = { num: "Número", text: "Texto", date: "Data", geo: "Geo" };

const QA_CHECKS = [
  { id: "enc", state: "ok",   title: "Codificação UTF-8", desc: "Arquivo lido sem caracteres inválidos." },
  { id: "head", state: "ok",  title: "Cabeçalho detectado", desc: "6 colunas nomeadas na primeira linha." },
  { id: "empty", state: "warn", title: "3 linhas vazias", desc: "Serão ignoradas na publicação. Revise se necessário." },
  { id: "types", state: "ok", title: "Tipos consistentes", desc: "Nenhum valor fora do tipo detectado por coluna." },
];

const LICENSES = [
  { id: "ccby",   name: "CC BY 4.0",    tag: "Recomendada", rec: true,  desc: "Reuso livre com atribuição ao autor. Padrão para dados abertos acadêmicos.", commercial: true, derivatives: true },
  { id: "ccbysa", name: "CC BY-SA 4.0", tag: "Aberta",      rec: false, desc: "Atribuição + compartilhamento sob a mesma licença.", commercial: true, derivatives: true },
  { id: "ccbync", name: "CC BY-NC 4.0", tag: "Restrita",    rec: false, desc: "Atribuição, somente para uso não comercial.", commercial: false, derivatives: true },
  { id: "odbl",   name: "ODbL 1.0",     tag: "Base de dados", rec: false, desc: "Específica para bases de dados, com share-alike.", commercial: true, derivatives: true },
  { id: "cc0",    name: "CC0 1.0",      tag: "Domínio público", rec: false, desc: "Renúncia de direitos — uso totalmente livre, sem atribuição.", commercial: true, derivatives: true },
  { id: "custom", name: "Outra licença", tag: "Personalizada", rec: false, desc: "Especifique termos próprios da unidade ou projeto.", commercial: true, derivatives: true },
];

const UNITS = [
  "Instituto de Ciências Exatas", "Instituto de Agronomia", "Instituto de Veterinária",
  "Instituto de Florestas", "Instituto de Química", "Instituto de Ciências Biológicas e da Saúde",
  "Instituto de Ciências Sociais Aplicadas", "Instituto de Zootecnia", "Pró-Reitoria de Graduação",
];

const AREAS = [
  { id: "clima", name: "Clima & Meteorologia" }, { id: "agro", name: "Agronomia" },
  { id: "vet", name: "Veterinária" }, { id: "bio", name: "Ciências Biológicas" },
  { id: "flor", name: "Florestas" }, { id: "exatas", name: "Ciências Exatas" },
  { id: "quim", name: "Química" }, { id: "zoo", name: "Zootecnia" },
  { id: "soc", name: "Ciências Sociais" }, { id: "econ", name: "Economia & Gestão" },
];

const SUGGESTED_TAGS = ["clima", "séries temporais", "meteorologia", "temperatura", "Seropédica", "estação automática"];

Object.assign(window, {
  ME, MY_STATS, MY_DATASETS, STATUS_META, CSV_COLUMNS, TYPE_LABEL,
  QA_CHECKS, LICENSES, UNITS, AREAS, SUGGESTED_TAGS,
});
