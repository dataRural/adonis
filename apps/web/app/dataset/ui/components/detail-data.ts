export type AuthorItem = {
  name: string
  role: string
  inst: string
  color: string
  initials: string
}

export type DatasetDetail = {
  id: number
  title: string
  slug: string
  unit: string
  unitShort: string
  cat: string
  catName: string
  tint: string
  format: string
  license: string
  licenseUrl: string
  usability: string
  doi: string
  version: string
  updated: string
  published: string
  size: string
  rows: string
  cols: number
  files: number
  downloads: string
  views: string
  votes: number
  watchers: number
  freq: string
  coverageTime: string
  coverageGeo: string
  collection: string
  tags: string[]
  authors: AuthorItem[]
  description?: string
}

export interface QualityItem {
  label: string
  desc: string
  score: number
}

export interface ColumnDetail {
  key: string
  label: string
  unit?: string
  kind: 'datetime' | 'number' | 'category' | 'text'
  icon: string
  desc: string
  valid: number
  distinct: string
  sample: string
  range?: string
  min?: number
  max?: number
  mean?: number
  std?: number
  hist: number[]
}

export interface FileItem {
  name: string
  size: string
  rows: string
  type: string
  primary?: boolean
}

export interface VersionItem {
  v: string
  date: string
  note: string
  current?: boolean
}

export interface NotebookItem {
  title: string
  author: string
  lang: string
  runs: string
  color: string
}

export interface ThreadItem {
  title: string
  author: string
  replies: number
  votes: number
  time: string
  tag: string
  pinned?: boolean
}

export const DS: DatasetDetail = {
  id: 1,
  title: 'Dados Meteorológicos — Estação Automática de Seropédica',
  slug: 'ufrrj/meteorologia-seropedica',
  unit: 'Instituto de Ciências Exatas',
  unitShort: 'ICE',
  cat: 'clima',
  catName: 'Clima & Meteorologia',
  tint: 'var(--brand-sky)',
  format: 'CSV',
  license: 'CC BY 4.0',
  licenseUrl: '#',
  usability: '9.4',
  doi: '10.5281/zenodo.8847291',
  version: 'v4 · jun/2026',
  updated: 'atualizado há 3 dias',
  published: 'publicado em 14 mar 2021',
  size: '12,4 MB',
  rows: '84.216',
  cols: 8,
  files: 3,
  downloads: '2.310',
  views: '9.840',
  votes: 47,
  watchers: 31,
  freq: 'Mensal',
  coverageTime: '01/2010 — 04/2026',
  coverageGeo: 'Campus Seropédica · 22°45′S, 43°41′W',
  collection: 'Estação automática Davis Vantage Pro2 — leituras a cada 10 min, agregadas por hora.',
  tags: ['clima', 'meteorologia', 'séries temporais', 'agrometeorologia', 'estação automática', 'Seropédica'],
  authors: [
    { name: 'Lab. de Agrometeorologia', role: 'Mantenedor', inst: 'ICE · UFRRJ', color: 'var(--brand-sky)', initials: 'AG' },
    { name: 'M. Carvalho', role: 'Curadoria de dados', inst: 'Depto. de Física', color: 'var(--brand-blue)', initials: 'MC' },
    { name: 'R. Nogueira', role: 'Validação', inst: 'PPGEA', color: 'var(--brand-green)', initials: 'RN' },
  ],
}

export const QUALITY: QualityItem[] = [
  { label: 'Completude', desc: 'Metadados, descrição e dicionário de colunas preenchidos.', score: 1.0 },
  { label: 'Credibilidade', desc: 'Fonte, proveniência e metodologia de coleta declaradas.', score: 1.0 },
  { label: 'Compatibilidade', desc: 'Licença aberta, formato CSV e atualização contínua.', score: 0.88 },
]

export const COLUMNS: ColumnDetail[] = [
  {
    key: 'data_hora',
    label: 'data_hora',
    kind: 'datetime',
    icon: 'calendar',
    desc: 'Carimbo de data/hora da medição (fuso BRT, sem horário de verão).',
    valid: 100,
    distinct: '84.216',
    sample: '2024-08-12 14:00',
    range: '01/2010 – 04/2026',
    hist: [0.2, 0.35, 0.5, 0.62, 0.7, 0.78, 0.84, 0.9, 0.95, 0.99, 1.0, 0.97, 0.92, 0.86, 0.8, 0.5],
  },
  {
    key: 'temp_ar',
    label: 'temp_ar',
    unit: '°C',
    kind: 'number',
    icon: 'thermometer',
    desc: 'Temperatura do ar a 2 m de altura.',
    valid: 99.6,
    distinct: '1.842',
    min: 9.4,
    max: 39.8,
    mean: 23.7,
    std: 4.9,
    sample: '26.3',
    hist: [0.04, 0.09, 0.18, 0.34, 0.55, 0.78, 0.95, 1.0, 0.93, 0.74, 0.52, 0.33, 0.18, 0.09, 0.04, 0.02],
  },
  {
    key: 'umidade_rel',
    label: 'umidade_rel',
    unit: '%',
    kind: 'number',
    icon: 'sigma',
    desc: 'Umidade relativa do ar.',
    valid: 99.4,
    distinct: '986',
    min: 18,
    max: 100,
    mean: 78.1,
    std: 16.2,
    sample: '82',
    hist: [0.03, 0.04, 0.06, 0.08, 0.11, 0.16, 0.23, 0.33, 0.46, 0.62, 0.8, 0.95, 1.0, 0.86, 0.55, 0.22],
  },
  {
    key: 'precipitacao',
    label: 'precipitacao',
    unit: 'mm',
    kind: 'number',
    icon: 'sigma',
    desc: 'Precipitação acumulada na hora.',
    valid: 100,
    distinct: '412',
    min: 0,
    max: 84.6,
    mean: 0.41,
    std: 2.3,
    sample: '0.0',
    hist: [1.0, 0.16, 0.08, 0.05, 0.035, 0.025, 0.02, 0.015, 0.012, 0.01, 0.008, 0.006, 0.005, 0.004, 0.003, 0.002],
  },
  {
    key: 'radiacao_solar',
    label: 'radiacao_solar',
    unit: 'W/m²',
    kind: 'number',
    icon: 'sigma',
    desc: 'Radiação solar global incidente.',
    valid: 98.9,
    distinct: '1.530',
    min: 0,
    max: 1184,
    mean: 214,
    std: 296,
    sample: '742',
    hist: [1.0, 0.42, 0.3, 0.26, 0.24, 0.23, 0.22, 0.21, 0.2, 0.2, 0.19, 0.18, 0.17, 0.14, 0.1, 0.05],
  },
  {
    key: 'vel_vento',
    label: 'vel_vento',
    unit: 'm/s',
    kind: 'number',
    icon: 'sigma',
    desc: 'Velocidade média do vento.',
    valid: 99.1,
    distinct: '734',
    min: 0,
    max: 14.2,
    mean: 1.8,
    std: 1.4,
    sample: '2.1',
    hist: [0.42, 0.78, 1.0, 0.92, 0.72, 0.52, 0.36, 0.24, 0.16, 0.1, 0.07, 0.045, 0.03, 0.02, 0.012, 0.006],
  },
  {
    key: 'dir_vento',
    label: 'dir_vento',
    unit: '°',
    kind: 'number',
    icon: 'sigma',
    desc: 'Direção predominante do vento (azimute).',
    valid: 99.0,
    distinct: '360',
    min: 0,
    max: 359,
    mean: 142,
    std: 98,
    sample: '118',
    hist: [0.6, 0.85, 0.7, 0.45, 0.38, 0.55, 0.78, 1.0, 0.82, 0.5, 0.34, 0.42, 0.6, 0.74, 0.5, 0.32],
  },
  {
    key: 'pressao_atm',
    label: 'pressao_atm',
    unit: 'hPa',
    kind: 'number',
    icon: 'sigma',
    desc: 'Pressão atmosférica ao nível da estação.',
    valid: 99.3,
    distinct: '418',
    min: 994,
    max: 1029,
    mean: 1013.2,
    std: 4.1,
    sample: '1014.6',
    hist: [0.03, 0.06, 0.12, 0.22, 0.4, 0.64, 0.88, 1.0, 0.94, 0.72, 0.48, 0.28, 0.15, 0.07, 0.03, 0.015],
  },
]

export const ROWS: any[][] = [
  ['2024-08-12 09:00', 21.4, 86, 0.0, 318, 1.2, 96, 1015.1],
  ['2024-08-12 10:00', 24.1, 74, 0.0, 564, 1.8, 110, 1014.8],
  ['2024-08-12 11:00', 26.3, 65, 0.0, 742, 2.4, 118, 1014.2],
  ['2024-08-12 12:00', 27.8, 58, 0.0, 905, 2.9, 132, 1013.6],
  ['2024-08-12 13:00', 28.6, 54, 0.0, 988, 3.1, 141, 1012.9],
  ['2024-08-12 14:00', 28.9, 52, 0.0, 942, 3.3, 150, 1012.4],
  ['2024-08-12 15:00', 28.1, 55, 0.2, 760, 2.8, 144, 1012.1],
  ['2024-08-12 16:00', 26.7, 61, 1.6, 488, 2.2, 128, 1012.0],
  ['2024-08-12 17:00', 24.3, 72, 4.8, 214, 1.6, 102, 1012.3],
  ['2024-08-12 18:00', 22.5, 83, 2.1, 56, 1.1, 88, 1012.9],
  ['2024-08-12 19:00', 21.6, 88, 0.4, 0, 0.8, 74, 1013.5],
  ['2024-08-12 20:00', 21.0, 90, 0.0, 0, 0.6, 60, 1014.1],
]

export const FILES: FileItem[] = [
  { name: 'seropedica_horario_2010_2026.csv', size: '11,2 MB', rows: '84.216', type: 'CSV', primary: true },
  { name: 'dicionario_de_dados.csv', size: '3,1 KB', rows: '8', type: 'CSV' },
  { name: 'metadados_estacao.json', size: '1,8 KB', rows: '—', type: 'JSON' },
]

export const VERSIONS: VersionItem[] = [
  { v: 'v4', date: '08 jun 2026', note: 'Inclusão dos registros de jan–abr/2026 e correção de 11 leituras de radiação.', current: true },
  { v: 'v3', date: '12 jan 2026', note: 'Reprocessamento da série 2010–2014 com novo controle de qualidade.' },
  { v: 'v2', date: '30 jul 2024', note: 'Adição das colunas de pressão atmosférica e direção do vento.' },
  { v: 'v1', date: '14 mar 2021', note: 'Publicação inicial — série horária 2010–2020.' },
]

export const SNIPPET = `import pandas as pd

# Carrega a série horária
df = pd.read_csv(
    "seropedica_horario_2010_2026.csv",
    parse_dates=["data_hora"],
    index_col="data_hora",
)

# Média mensal de temperatura e chuva acumulada
mensal = df.resample("MS").agg(
    temp_media=("temp_ar", "mean"),
    chuva_mm=("precipitacao", "sum"),
)
print(mensal.tail())`

export const NOTEBOOKS: NotebookItem[] = [
  { title: 'Climatologia mensal de Seropédica (1991–2020 vs. atual)', author: 'M. Carvalho', lang: 'Python', runs: '1.204', color: 'var(--brand-sky)' },
  { title: 'Detecção de ondas de calor com a série horária', author: 'PPGEA', lang: 'Python', runs: '638', color: 'var(--brand-orange)' },
  { title: 'Balanço hídrico para planejamento de irrigação', author: 'Inst. de Agronomia', lang: 'R', runs: '415', color: 'var(--brand-green)' },
]

export const THREADS: ThreadItem[] = [
  { title: 'Há gaps na série de radiação entre 2013 e 2014?', author: 'j.ferreira', replies: 6, votes: 12, time: 'há 2 dias', tag: 'Qualidade dos dados', pinned: true },
  { title: 'Sugestão: incluir ponto de orvalho calculado', author: 'ana.lima', replies: 3, votes: 9, time: 'há 1 semana', tag: 'Sugestão' },
  { title: 'Como vocês trataram o horário de verão nos anos antigos?', author: 'rmendes', replies: 8, votes: 5, time: 'há 2 semanas', tag: 'Metodologia' },
  { title: 'Licença permite uso em produto comercial de previsão?', author: 'startup.agro', replies: 2, votes: 4, time: 'há 3 semanas', tag: 'Licença' },
]

export const RELATED = [
  {
    id: 7,
    title: 'Composição e Fertilidade de Solos — Campus Seropédica',
    unit: 'Instituto de Agronomia',
    desc: 'Análises de pH, matéria orgânica, macro e micronutrientes em malha amostral georreferenciada.',
    tags: ['solos', 'agronomia'],
    format: 'CSV',
    tint: 'var(--brand-green)',
    size: '1,7 MB',
    rows: '6,1 mil linhas',
    dl: '1,1 mil',
    updated: 'há 6 dias',
    license: 'CC BY 4.0',
    usability: '8.9',
  },
  {
    id: 5,
    title: 'Qualidade da Água — Bacia do Rio Guandu',
    unit: 'Ciências Biológicas e da Saúde',
    desc: 'Parâmetros físico-químicos e microbiológicos em pontos de monitoramento ao longo da bacia.',
    tags: ['água', 'ambiental'],
    format: 'CSV',
    tint: 'var(--brand-lightgreen)',
    size: '2,2 MB',
    rows: '9,4 mil linhas',
    dl: '980',
    updated: 'há 5 dias',
    license: 'CC BY 4.0',
    usability: '8.5',
  },
  {
    id: 8,
    title: 'Séries de Preços de Hortifrúti — CEASA-RJ',
    unit: 'Ciências Sociais Aplicadas',
    desc: 'Preços diários por produto e classificação, úteis para estudos de mercado agrícola e séries econômicas.',
    tags: ['economia', 'preços'],
    format: 'CSV',
    tint: 'var(--brand-green)',
    size: '6,3 MB',
    rows: '58,9 mil linhas',
    dl: '2,0 mil',
    updated: 'há 1 dia',
    license: 'CC BY 4.0',
    usability: '9.0',
  },
]

export const CITATION = `Laboratório de Agrometeorologia (ICE/UFRRJ). (2026).
Dados Meteorológicos — Estação Automática de Seropédica
(2010–2026) [Conjunto de dados]. DataRural, UFRRJ.
https://doi.org/10.5281/zenodo.8847291`
