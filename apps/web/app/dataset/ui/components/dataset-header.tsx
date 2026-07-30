import { useState, useRef, useEffect } from 'react'
import { router } from '@inertiajs/react'
import * as Ic from '#common/ui/components/datarural/icons'
import { DatasetDetail } from './detail-data'
import LicenseModal from './license-modal'

interface DatasetHeaderProps {
  ds: DatasetDetail
  latestVersionId?: number
}

export default function DatasetHeader({ ds, latestVersionId }: DatasetHeaderProps) {
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [licenseModalOpen, setLicenseModalOpen] = useState(false)
  const shareRef = useRef<HTMLDivElement>(null)
  const isLiked = !!(ds as any).isLiked
  const isSaved = !!(ds as any).isSaved
  const isOwner = !!(ds as any).isOwner
  const votes = ds.votes || 0
  const publisherName = (ds as any).publisherName || ds.unit || 'UFRRJ'

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false)
      }
    }
    if (shareOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [shareOpen])

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    router.post(`/datasets/${ds.id}/like`, {}, { preserveScroll: true })
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    router.post(`/datasets/${ds.id}/favorite`, {}, { preserveScroll: true })
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    const versionIdToDownload = (ds as any).selectedVersionId || latestVersionId
    if (versionIdToDownload) {
      window.location.href = `/datasets/${ds.id}/version/${versionIdToDownload}/download-all`
    } else {
      alert(`Iniciando download do dataset (${ds.size})`)
    }
  }

  const getShareUrl = () => typeof window !== 'undefined' ? window.location.href : ''

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(getShareUrl())
    setCopied(true)
    setTimeout(() => { setCopied(false); setShareOpen(false) }, 1500)
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(ds.title)
    const body = encodeURIComponent(`Confira este dataset: ${getShareUrl()}`)
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
    setShareOpen(false)
  }

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`${ds.title} — ${getShareUrl()}`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'width=550,height=420')
    setShareOpen(false)
  }

  const handleLinkedInShare = () => {
    const url = encodeURIComponent(getShareUrl())
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=550,height=420')
    setShareOpen(false)
  }

  return (
    <section className="dr-ds-header">
      <div className="dr-ds-header-arcos">
        <svg viewBox="0 0 400 420" fill="none" className="strand strand-right" style={{ width: 400, height: 420, position: 'absolute', right: 0, top: -40, opacity: 0.15 }}>
          <circle cx="300" cy="70" r="46" stroke="var(--brand-blue)" strokeWidth="2.4" />
          <path d="M 75 0 Q 0 -32 75 0 Q 0 32 75 0 Z" transform="translate(150 60) rotate(18)" stroke="var(--brand-green)" strokeWidth="2.4" />
        </svg>
      </div>
      <div className="dr-container dr-ds-header-inner">
        <nav className="dr-breadcrumb" aria-label="Trilha">
          <a href="/datasets">Datasets</a>
          <span className="sep">
            <Ic.Chevr size={13} />
          </span>
          <span className="sep">
            <Ic.Chevr size={13} />
          </span>
          <span className="here">{publisherName}</span>
        </nav>

        {(ds as any).isLatestVersionSelected === false && (
          <div style={{
            background: 'color-mix(in srgb, var(--brand-sky) 15%, transparent)',
            border: '1px solid var(--brand-sky)',
            color: 'var(--foreground)',
            padding: '12px 18px',
            borderRadius: 'var(--radius)',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            fontSize: 13.5,
            flexWrap: 'wrap',
          }}>
            <span>
              <Ic.Clock size={16} style={{ display: 'inline', marginRight: 6, color: 'var(--brand-sky)' }} />
              Você está visualizando a versão arquivada <strong>{(ds as any).selectedVersionName || ds.version}</strong>.
            </span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {isOwner && (
                <button
                  className="dr-btn dr-btn-primary dr-btn-sm"
                  onClick={() => {
                    if (confirm(`Deseja restaurar a versão ${(ds as any).selectedVersionName || ds.version} como a mais recente?`)) {
                      router.post(`/datasets/${ds.id}/version/${(ds as any).selectedVersionId}/restore`)
                    }
                  }}
                >
                  <Ic.Rotate size={14} style={{ marginRight: 4 }} /> Restaurar esta versão
                </button>
              )}
              <a href={`/datasets/${ds.id}`} className="dr-btn dr-btn-outline dr-btn-sm">
                Ir para a versão mais recente
              </a>
            </div>
          </div>
        )}

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
              <button
                type="button"
                className="mi"
                onClick={() => setLicenseModalOpen(true)}
                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer', color: 'inherit' }}
                title="Clique para ler os termos da licença"
              >
                <Ic.Scale size={14} /> {ds.license}
              </button>
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
            <button className="dr-btn dr-btn-primary dr-btn-lg" onClick={handleDownload} title="Baixar dataset compactado em arquivo ZIP com todos os CSVs e README.md">
              <Ic.Download size={18} /> Baixar ({ds.size})
            </button>
            {isOwner && (
              <div className="dr-ds-action-row">
                <a className="dr-btn dr-btn-outline" href={`/dashboard/publish?id=${ds.id}`}>
                  <Ic.Edit size={16} /> Editar
                </a>
                <a className="dr-btn dr-btn-outline" href={`/datasets/${ds.id}/version/new`}>
                  <Ic.Plus size={16} /> Nova versão
                </a>
              </div>
            )}
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
                className={`dr-btn-count ${isSaved ? 'on' : ''}`}
                onClick={handleFavorite}
                title={isSaved ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                style={{ flex: 1 }}
              >
                <Ic.Bookmark size={15} className="ic" style={{ marginRight: 6, color: isSaved ? 'var(--brand-green)' : undefined, fill: isSaved ? 'var(--brand-green)' : 'none' }} />{' '}
                {isSaved ? 'Salvo' : 'Salvar'}
              </button>
              <div ref={shareRef} style={{ position: 'relative' }}>
                <button
                  className={`dr-btn-count ${shareOpen ? 'on' : ''}`}
                  title="Compartilhar"
                  onClick={() => setShareOpen(!shareOpen)}
                >
                  <Ic.Share size={15} className="ic" />
                </button>
                {shareOpen && (
                  <div className="dr-share-menu">
                    <div className="dr-share-menu-header">Compartilhar</div>
                    <button className="dr-share-menu-item" onClick={handleCopyLink}>
                      {copied ? <Ic.Check size={16} /> : <Ic.Copy size={16} />}
                      {copied ? 'Link copiado!' : 'Copiar link'}
                    </button>
                    <button className="dr-share-menu-item" onClick={handleEmailShare}>
                      <Ic.Send size={16} />
                      Email
                    </button>
                    <div className="dr-share-menu-sep"></div>
                    <button className="dr-share-menu-item" onClick={handleTwitterShare}>
                      <Ic.External size={16} />
                      Twitter / X
                    </button>
                    <button className="dr-share-menu-item" onClick={handleLinkedInShare}>
                      <Ic.External size={16} />
                      LinkedIn
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <LicenseModal
        isOpen={licenseModalOpen}
        onClose={() => setLicenseModalOpen(false)}
        licenseName={ds.license}
      />
    </section>
  )
}

