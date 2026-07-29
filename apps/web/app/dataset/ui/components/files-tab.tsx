import * as Ic from '#common/ui/components/datarural/icons'
import { DatasetDetail } from './detail-data'

export default function FilesTab({ ds, versions }: { ds: DatasetDetail; versions?: any[] }) {
  const finalDs = ds
  const finalVersions = versions && versions.length > 0 ? versions : []
  const latest = finalVersions[0]

  const filesList = latest
    ? [
        {
          name: latest.filename,
          size: latest.size,
          rows: finalDs.rows || '—',
          type: finalDs.format || 'CSV',
          primary: true,
          versionId: latest.id,
        },
        {
          name: 'README.md',
          size: '1.2 KB',
          rows: '—',
          type: 'Markdown',
          primary: false,
          versionId: null as number | null,
        },
      ]
    : []

  const handleDownload = (versionId: number | null, fileName: string) => {
    if (versionId !== null) {
      window.location.href = `/datasets/${finalDs.id}/version/${versionId}/download`
    } else {
      if (latest) {
        window.location.href = `/datasets/${finalDs.id}/version/${latest.id}/download`
      } else {
        alert(`Iniciando download do arquivo: ${fileName}`)
      }
    }
  }

  return (
    <div>
      <div className="dr-panel">
        <div className="dr-panel-head">
          <h3>
            <Ic.Folder size={17} className="ic" style={{ marginRight: 6 }} /> Arquivos
          </h3>
          <div className="right">
            <button
              className="dr-btn dr-btn-primary dr-btn-sm"
              onClick={() => {
                if (latest) {
                  handleDownload(latest.id, latest.filename)
                } else {
                  handleDownload(null, 'all')
                }
              }}
            >
              <Ic.Download size={15} /> Baixar tudo ({finalDs.size})
            </button>
          </div>
        </div>
        <div className="dr-filelist">
          {filesList.map((f) => (
            <div className="dr-filerow" key={f.name}>
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
                onClick={() => handleDownload(f.versionId, f.name)}
                style={{ marginLeft: 'auto' }}
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
