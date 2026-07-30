import * as Ic from '#common/ui/components/datarural/icons'
import { DatasetDetail } from './detail-data'

export default function FilesTab({ ds, versions }: { ds: DatasetDetail; versions?: any[] }) {
  const finalDs = ds
  const finalVersions = versions && versions.length > 0 ? versions : []
  const selectedVersionId = (finalDs as any).selectedVersionId
  const currentVersion = finalVersions.find((v) => v.id === selectedVersionId) || finalVersions[0]

  const versionFiles: any[] = currentVersion?.files || []

  const filesList = versionFiles.length > 0
    ? [
        ...versionFiles.map((f) => ({
          name: f.name,
          size: f.size,
          rows: f.isPrimary ? (finalDs.rows || '—') : '—',
          type: f.name.split('.').pop()?.toUpperCase() || 'CSV',
          primary: f.isPrimary,
          versionId: currentVersion.id,
          fileId: f.id,
          isReadme: false,
        })),
        {
          name: 'README.md',
          size: '1.2 KB',
          rows: '—',
          type: 'Markdown',
          primary: false,
          versionId: currentVersion?.id || null,
          fileId: null,
          isReadme: true,
        },
      ]
    : (currentVersion
      ? [
          {
            name: currentVersion.filename || `${finalDs.title}.csv`,
            size: currentVersion.size || finalDs.size,
            rows: finalDs.rows || '—',
            type: finalDs.format || 'CSV',
            primary: true,
            versionId: currentVersion.id,
            fileId: null,
            isReadme: false,
          },
          {
            name: 'README.md',
            size: '1.2 KB',
            rows: '—',
            type: 'Markdown',
            primary: false,
            versionId: currentVersion.id,
            fileId: null,
            isReadme: true,
          },
        ]
      : [])

  const handleDownload = (versionId: number | null, fileId: number | null, isReadme?: boolean) => {
    if (!versionId && currentVersion) {
      versionId = currentVersion.id
    }
    if (!versionId) return

    if (isReadme) {
      window.location.href = `/datasets/${finalDs.id}/version/${versionId}/readme/download`
    } else if (fileId !== null && fileId !== undefined) {
      window.location.href = `/datasets/${finalDs.id}/version/${versionId}/file/${fileId}/download`
    } else {
      window.location.href = `/datasets/${finalDs.id}/version/${versionId}/download`
    }
  }

  const handleDownloadAll = () => {
    if (currentVersion) {
      window.location.href = `/datasets/${finalDs.id}/version/${currentVersion.id}/download-all`
    }
  }

  return (
    <div>
      <div className="dr-panel">
        <div className="dr-panel-head">
          <h3>
            <Ic.Folder size={17} className="ic" style={{ marginRight: 6 }} /> Arquivos da versão ({currentVersion?.name || 'V1'})
          </h3>
        </div>
        <div className="dr-filelist">
          {filesList.map((f, idx) => (
            <div className="dr-filerow" key={f.name + '_' + idx}>
              <span className="file-ic">
                <Ic.File size={18} />
              </span>
              <div className="dr-file-meta">
                <span className="fn">{f.name}</span>
                <span className="fd">
                  <span>{f.size}</span>
                  <span>{f.rows !== '—' && f.rows !== '---' ? f.rows + ' linhas' : '—'}</span>
                </span>
              </div>
              {f.primary && <span className="dr-file-badge prim">principal</span>}
              <span className="dr-file-badge">{f.type}</span>
              <button
                className="dr-btn dr-btn-outline dr-btn-sm"
                onClick={() => handleDownload(f.versionId, f.fileId, f.isReadme)}
                style={{ marginLeft: 'auto' }}
                title={`Baixar ${f.name}`}
              >
                <Ic.Download size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
