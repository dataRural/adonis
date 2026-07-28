import { router } from '@inertiajs/react'
import * as Ic from '#common/ui/components/datarural/icons'
import { DatasetDetail } from './detail-data'

export default function VersionsTab({ ds, versions }: { ds: DatasetDetail; versions?: any[] }) {
  const finalDs = ds
  const finalVersions = versions && versions.length > 0 ? versions : []

  // Build versions history list
  const versionsList =
    finalVersions.length > 0
      ? finalVersions.map((v) => ({
          v: v.name,
          date: `Publicado ${v.createdAt}`,
          note: v.isLatest
            ? 'Versão inicial ou atualizações gerais dos dados.'
            : 'Versão anterior arquivada.',
          current: v.isLatest,
          selected: v.isSelected,
          id: v.id,
        }))
      : []

  const handleDownload = (versionId: number | null, fileName: string) => {
    if (versionId !== null) {
      window.location.href = `/datasets/${finalDs.id}/version/${versionId}/download`
    } else {
      if (finalVersions[0]) {
        window.location.href = `/datasets/${finalDs.id}/version/${finalVersions[0].id}/download`
      } else {
        alert(`Iniciando download do arquivo: ${fileName}`)
      }
    }
  }

  const handleRestore = (versionId: number, versionName: string) => {
    if (confirm(`Deseja restaurar a versão ${versionName} como a mais recente?`)) {
      router.post(`/datasets/${finalDs.id}/version/${versionId}/restore`)
    }
  }

  const handleDelete = (versionId: number, versionName: string) => {
    if (confirm(`Tem certeza de que deseja excluir a versão ${versionName}? Ela será arquivada.`)) {
      router.post(`/datasets/${finalDs.id}/version/${versionId}/delete`)
    }
  }

  const handleSelectVersion = (versionId: number) => {
    router.visit(`/datasets/${finalDs.id}?versionId=${versionId}`)
  }

  return (
    <div className="dr-panel">
      <div className="dr-panel-head">
        <h3>
          <Ic.History size={17} className="ic" style={{ marginRight: 6 }} /> Histórico de versões
        </h3>
      </div>
      <div className="dr-panel-body">
        <div className="dr-timeline">
          {versionsList.map((v) => (
            <div className={'dr-tl-item' + (v.selected ? ' cur' : '')} key={v.v}>
              <div className="dr-tl-rail">
                <span className="dr-tl-dot"></span>
                <span className="dr-tl-line"></span>
              </div>
              <div className="dr-tl-body">
                <div className="dr-tl-head" style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 8, flexWrap: 'wrap' }}>
                  <span className="dr-tl-v">{v.v}</span>
                  {v.current && <span className="dr-tl-cur-badge">mais recente</span>}
                  {v.selected && !v.current && <span className="dr-tl-cur-badge" style={{ background: 'var(--brand-sky)', color: '#fff' }}>selecionada</span>}
                  <span className="dr-tl-date">
                    {v.date}
                  </span>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {!v.selected && (
                      <button
                        className="dr-btn dr-btn-outline dr-btn-sm"
                        onClick={() => handleSelectVersion(v.id)}
                        title="Visualizar esta versão"
                        style={{ fontSize: 12, padding: '3px 8px' }}
                      >
                        <Ic.Eye size={13} style={{ marginRight: 4 }} /> Ver
                      </button>
                    )}
                    {finalDs.isOwner && !v.current && (
                      <button
                        className="dr-btn dr-btn-outline dr-btn-sm"
                        onClick={() => handleRestore(v.id, v.v)}
                        title="Restaurar esta versão como a mais recente"
                        style={{ fontSize: 12, padding: '3px 8px', color: 'var(--brand-green)', borderColor: 'var(--brand-green)' }}
                      >
                        <Ic.Rotate size={13} style={{ marginRight: 4 }} /> Restaurar
                      </button>
                    )}
                    {finalDs.isOwner && finalVersions.length > 1 && (
                      <button
                        className="dr-btn dr-btn-outline dr-btn-sm"
                        onClick={() => handleDelete(v.id, v.v)}
                        title="Excluir (arquivar) esta versão"
                        style={{ fontSize: 12, padding: '3px 8px', color: 'var(--destructive)', borderColor: 'var(--destructive)' }}
                      >
                        <Ic.X size={13} style={{ marginRight: 4 }} /> Excluir
                      </button>
                    )}
                    <button
                      className="dr-btn dr-btn-icon"
                      onClick={() => handleDownload(v.id || null, v.v)}
                      title="Download desta versão"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--muted-foreground)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                      }}
                    >
                      <Ic.Download size={14} />
                    </button>
                  </div>
                </div>
                <p className="dr-tl-note" style={{ margin: '8px 0 0' }}>
                  {v.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
