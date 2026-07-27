import * as Ic from '#common/ui/components/datarural/icons'
import { DatasetDetail } from './detail-data'

export default function FilesTab({ ds, versions }: { ds: DatasetDetail; versions?: any[] }) {
  const finalDs = ds
  const finalVersions = versions && versions.length > 0 ? versions : []

  const latest = finalVersions[0]

  // Build files list
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
          id: v.id,
        }))
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

      <div className="dr-panel">
        <div className="dr-panel-head">
          <h3>
            <Ic.History size={17} className="ic" style={{ marginRight: 6 }} /> Histórico de versões
          </h3>
        </div>
        <div className="dr-panel-body">
          <div className="dr-timeline">
            {versionsList.map((v) => (
              <div className={'dr-tl-item' + (v.current ? ' cur' : '')} key={v.v}>
                <div className="dr-tl-rail">
                  <span className="dr-tl-dot"></span>
                  <span className="dr-tl-line"></span>
                </div>
                <div className="dr-tl-body">
                  <div className="dr-tl-head" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <span className="dr-tl-v">{v.v}</span>
                    {v.current && <span className="dr-tl-cur-badge">atual</span>}
                    <span className="dr-tl-date" style={{ marginLeft: 8 }}>
                      {v.date}
                    </span>
                    <button
                      className="dr-btn dr-btn-icon"
                      onClick={() => handleDownload(v.id || null, v.v)}
                      title="Download desta versão"
                      style={{
                        marginLeft: 'auto',
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
                  <p className="dr-tl-note" style={{ margin: '8px 0 0' }}>
                    {v.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
