export type AuthorItem = {
  name: string
  role: string
  inst: string
  color: string
  initials: string
  userId?: number
  profileUrl?: string
  avatarUrl?: string | null
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
  isOwner?: boolean
  isLiked?: boolean
  selectedVersionId?: number
  selectedVersionName?: string
  isLatestVersionSelected?: boolean
}

export interface QualityItem {
  label: string
  desc: string
  score: number
}

export const QUALITY: QualityItem[] = [
  { label: 'Completude: ', desc: 'Metadados, descrição e dicionário de colunas preenchidos.', score: 1.0 },
  { label: 'Credibilidade: ', desc: 'Fonte, proveniência e metodologia de coleta declaradas.', score: 1.0 },
  { label: 'Compatibilidade: ', desc: 'Licença aberta, formato CSV e atualização contínua.', score: 0.88 },
]
