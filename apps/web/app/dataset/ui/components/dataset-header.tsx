import { useState } from 'react'
import { router } from '@inertiajs/react'
import * as Ic from '#common/ui/components/datarural/icons'
import { DatasetDetail } from './detail-data'

interface DatasetHeaderProps {
  ds: DatasetDetail
  latestVersionId?: number
}

export default function DatasetHeader({ ds, latestVersionId }: DatasetHeaderProps) {
  const [saved, setSaved] = useState(false)
  const isLiked = !!(ds as any).isLiked
  const votes = ds.votes || 0

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    router.post(`/datasets/${ds.id}/like`, {}, { preserveScroll: true })
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    if (latestVersionId) {
      window.location.href = `/datasets/${ds.id}/version/${latestVersionId}/download`
    } else {
      alert(`Iniciando download do dataset (${ds.size})`)
    }
  }

  return (
    <section className="dr-ds-header">
      <div className="dr-ds-header-arcos">
        {/* We can inline the arcos clustering svg or use a decorative graphic */}
        <svg viewBox="0 0 400 420" fill="none" className="strand strand-right" style={{ width: 400, height: 420, position: 'absolute', right: 0, top: -40, opacity: 0.15 }}>
          <circle cx="300" cy="70" r="46" stroke="var(--brand-blue)" strokeWidth="2.4" />
          <path d="M 75 0 Q 0 -32 75 0 Q 0 32 75 0 Z" transform="translate(150 60) rotate(18)" stroke="var(--brand-green)" strokeWidth="2.4" />
        </svg>
      </div>
      <div className="dr-container dr-ds-header-inner">
        <nav className="dr-breadcrumb" aria-label="Trilha">
          <a href="/#datasets">Datasets</a>
          <span className="sep">
            <Ic.Chevr size={13} />
          </span>
          <a href={`/#categorias?cat=${ds.cat}`}>{ds.catName}</a>
          <span className="sep">
            <Ic.Chevr size={13} />
          </span>
          <span className="here">Estação Seropédica</span>
        </nav>

        <div className="dr-ds-head-top">
          <div className="dr-ds-head-main">
            <span className="dr-ds-head-unit">
              <span className="av" style={{ background: 'var(--brand-sky)' }}>
                {ds.unitShort}
              </span>
              {ds.unit}
            </span>
            <h1>{ds.title}</h1>
            <div className="dr-ds-head-metarow">
              <span className="mi usab">
                <Ic.Verified size={15} /> <b>{ds.usability}</b> usabilidade
              </span>
              <span className="vsep"></span>
              <span className="mi">
                <Ic.Scale size={14} /> {ds.license}
              </span>
              <span className="mi">
                <Ic.File size={14} /> {ds.format} · {ds.size}
              </span>
              <span className="mi">
                <Ic.Rows size={14} /> {ds.rows} linhas
              </span>
              <span className="mi">
                <Ic.History size={14} /> {ds.version}
              </span>
              <span className="mi">
                <Ic.Clock size={14} /> {ds.updated}
              </span>
            </div>
          </div>

          <div className="dr-ds-head-actions">
            <button className="dr-btn dr-btn-primary dr-btn-lg" onClick={handleDownload}>
              <Ic.Download size={18} /> Baixar ({ds.size})
            </button>
            <div className="dr-ds-action-row">
              <a className="dr-btn dr-btn-outline" href="#notebooks">
                <Ic.Code size={16} /> Notebook
              </a>
              <a className="dr-btn dr-btn-outline" href="#">
                <Ic.Columns size={16} /> API
              </a>
            </div>
            <div className="dr-ds-action-row">
              <button
                className={`dr-btn-count ${isLiked ? 'on' : ''}`}
                onClick={handleLike}
                style={{ flex: 1 }}
                title="Curtir dataset"
              >
                <Ic.Heart size={15} className="ic" style={{ marginRight: 6, color: isLiked ? '#e11d48' : undefined, fill: isLiked ? '#e11d48' : 'none' }} />{' '}
                <span className="n">{votes}</span>
              </button>
              <button
                className={`dr-btn-count ${saved ? 'on' : ''}`}
                onClick={() => setSaved(!saved)}
                title="Salvar"
                style={{ flex: 1 }}
              >
                <Ic.Bookmark size={15} className="ic" style={{ marginRight: 6 }} />{' '}
                {saved ? 'Salvo' : 'Salvar'}
              </button>
              <button className="dr-btn-count" title="Compartilhar">
                <Ic.Share size={15} className="ic" />
              </button>
            </div>
            <span className="dr-ds-dl-hint">
              {ds.downloads} downloads · {ds.views} visualizações
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
