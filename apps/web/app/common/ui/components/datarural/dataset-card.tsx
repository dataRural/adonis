import { Link } from '@adonisjs/inertia/react'
import { router } from '@inertiajs/react'
import { CardArt } from './brand'
import * as Ic from './icons'

export interface DatasetItem {
  id: number
  title?: string
  name?: string
  desc?: string
  description?: string
  unit?: string
  tags?: string[]
  dl?: string | number
  likesCount?: number
  isLiked?: boolean
  updated?: string
  usability?: string | number | null
  rows?: string | number
  size?: string
  license?: any
  format?: string
  tint?: string
}

interface DatasetCardProps {
  d: DatasetItem
}

export default function DatasetCard({ d }: DatasetCardProps) {
  const id = d.id
  const title = d.title || d.name || 'Sem título'
  const desc = d.desc || d.description || 'Nenhuma descrição fornecida para este conjunto de dados.'
  const unit = d.unit || 'Instituto de Ciências Exatas'
  const tags = d.tags && d.tags.length > 0 ? d.tags : ['Geral']
  const dl = d.likesCount !== undefined ? d.likesCount : (d.dl !== undefined ? d.dl : 0)
  const isLiked = !!d.isLiked
  const updated = d.updated || 'Recentemente'
  const usability = d.usability !== null && d.usability !== undefined ? d.usability : '8.0'
  const size = d.size || '—'

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.post(`/datasets/${id}/like`, {}, { preserveScroll: true })
  }
  
  let licenseName = 'Proprietária'
  if (d.license) {
    if (typeof d.license === 'string') {
      licenseName = d.license
    } else if (typeof d.license === 'object' && d.license.name) {
      licenseName = d.license.name
    }
  }

  const format = d.format || 'CSV'
  const tint = d.tint || 'var(--brand-blue)'

  return (
    <Link className="dr-ds-card" href={`/datasets/${id}`}>
      <div className="dr-ds-top">
        <CardArt tint={tint} />
        <span className="dr-ds-format">
          <span className="sq" style={{ background: tint }}></span>
          {format}
        </span>
      </div>
      <div className="dr-ds-body">
        <span className="dr-ds-unit" style={{ color: tint }}>
          <Ic.Building size={13} /> {unit}
        </span>
        <h3 className="dr-ds-title">{title}</h3>
        <p className="dr-ds-desc">{desc}</p>
        <div className="dr-ds-tags">
          {tags.slice(0, 3).map((t) => (
            <span className="dr-ds-tag" key={t}>
              {t}
            </span>
          ))}
        </div>
        <div className="dr-ds-meta">
          <button
            type="button"
            className={`dr-card-like-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            title="Curtir dataset"
          >
            <Ic.Heart size={14} style={{ color: isLiked ? '#e11d48' : undefined, fill: isLiked ? '#e11d48' : 'none' }} /> {dl}
          </button>
          <span className="m">
            <Ic.Clock size={14} /> {updated}
          </span>
          <span className="spacer"></span>
          <span className="dr-usability" title="Índice de usabilidade">
            <Ic.Verified size={14} /> {usability}
          </span>
        </div>
        <div className="dr-ds-meta" style={{ borderTop: 'none', paddingTop: '10px' }}>
          <span className="m">
            <Ic.File size={14} /> {size}
          </span>
          <span className="spacer"></span>
          <span className="dr-ds-license">
            <Ic.Scale size={11} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 3 }} />
            {licenseName}
          </span>
        </div>
      </div>
    </Link>
  )
}
