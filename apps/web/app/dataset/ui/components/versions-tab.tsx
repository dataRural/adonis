import { router } from '@inertiajs/react'
import * as Ic from '#common/ui/components/datarural/icons'
import { DatasetDetail } from './detail-data'
import { useTranslation } from '#common/ui/hooks/use_translation'

export default function VersionsTab({ ds, versions }: { ds: DatasetDetail; versions?: any[] }) {
  const { t } = useTranslation()
  const finalDs = ds
  const finalVersions = versions && versions.length > 0 ? versions : []

  // Build versions history list
  const versionsList =
    finalVersions.length > 0
      ? finalVersions.map((v) => ({
          v: v.name,
          date: t('dataset.detail.published_on', { date: v.createdAt }),
          note: v.isLatest
            ? t('dataset.detail.initial_version_note')
            : t('dataset.detail.previous_version_note'),
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
        alert(`Download: ${fileName}`)
      }
    }
  }

  const handleRestore = (versionId: number, versionName: string) => {
    if (confirm(t('dataset.detail.restore_confirm', { name: versionName }))) {
      router.post(`/datasets/${finalDs.id}/version/${versionId}/restore`)
    }
  }

  const handleDelete = (versionId: number, versionName: string) => {
    if (confirm(t('dataset.detail.delete_confirm', { name: versionName }))) {
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
          <Ic.History size={17} className="ic" style={{ marginRight: 6 }} /> {t('dataset.detail.version_history')}
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
                  {v.current && <span className="dr-tl-cur-badge">{t('dataset.detail.current_badge')}</span>}
                  {v.selected && !v.current && <span className="dr-tl-cur-badge" style={{ background: 'var(--brand-sky)', color: '#fff' }}>{t('dataset.detail.view_version')}</span>}
                  <span className="dr-tl-date">
                    {v.date}
                  </span>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {!v.selected && (
                      <button
                        className="dr-btn dr-btn-outline dr-btn-sm"
                        onClick={() => handleSelectVersion(v.id)}
                        title={t('dataset.detail.view_version')}
                        style={{ fontSize: 12, padding: '3px 8px' }}
                      >
                        <Ic.Eye size={13} style={{ marginRight: 4 }} /> {t('dataset.detail.view_version')}
                      </button>
                    )}
                    {finalDs.isOwner && !v.current && (
                      <button
                        className="dr-btn dr-btn-outline dr-btn-sm"
                        onClick={() => handleRestore(v.id, v.v)}
                        title={t('dataset.detail.restore')}
                        style={{ fontSize: 12, padding: '3px 8px', color: 'var(--brand-green)', borderColor: 'var(--brand-green)' }}
                      >
                        <Ic.Rotate size={13} style={{ marginRight: 4 }} /> {t('dataset.detail.restore')}
                      </button>
                    )}
                    {finalDs.isOwner && finalVersions.length > 1 && (
                      <button
                        className="dr-btn dr-btn-outline dr-btn-sm"
                        onClick={() => handleDelete(v.id, v.v)}
                        title={t('dataset.detail.delete')}
                        style={{ fontSize: 12, padding: '3px 8px', color: 'var(--destructive)', borderColor: 'var(--destructive)' }}
                      >
                        <Ic.X size={13} style={{ marginRight: 4 }} /> {t('dataset.detail.delete')}
                      </button>
                    )}
                    <button
                      className="dr-btn dr-btn-icon"
                      onClick={() => handleDownload(v.id || null, v.v)}
                      title={t('dataset.detail.download')}
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
