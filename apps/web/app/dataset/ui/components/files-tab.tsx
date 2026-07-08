import * as Ic from '#common/ui/components/datarural/icons'
import { FILES, VERSIONS, DS } from './detail-data'

export default function FilesTab() {
  const handleDownload = (fileName: string) => {
    alert(`Iniciando download do arquivo: ${fileName}`)
  }

  return (
    <div>
      <div className="dr-panel">
        <div className="dr-panel-head">
          <h3>
            <Ic.Folder size={17} className="ic" style={{ marginRight: 6 }} /> Arquivos
          </h3>
          <div className="right">
            <button className="dr-btn dr-btn-primary dr-btn-sm" onClick={() => handleDownload('all')}>
              <Ic.Download size={15} /> Baixar tudo ({DS.size})
            </button>
          </div>
        </div>
        <div className="dr-filelist">
          {FILES.map((f) => (
            <div className="dr-filerow" key={f.name}>
              <span className="file-ic">
                <Ic.File size={18} />
              </span>
              <div className="dr-file-meta">
                <span className="fn">{f.name}</span>
                <span className="fd">
                  <span>{f.size}</span>
                  <span>{f.rows !== '—' ? f.rows + ' linhas' : '—'}</span>
                </span>
              </div>
              {f.primary && <span className="dr-file-badge prim">principal</span>}
              <span className="dr-file-badge">{f.type}</span>
              <button className="dr-btn dr-btn-outline dr-btn-sm" style={{ marginLeft: 8 }}>
                <Ic.Eye size={15} style={{ marginRight: 4 }} /> Prévia
              </button>
              <button 
                className="dr-btn dr-btn-outline dr-btn-sm"
                onClick={() => handleDownload(f.name)}
                style={{ marginLeft: 8 }}
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
            {VERSIONS.map((v) => (
              <div className={'dr-tl-item' + (v.current ? ' cur' : '')} key={v.v}>
                <div className="dr-tl-rail">
                  <span className="dr-tl-dot"></span>
                  <span className="dr-tl-line"></span>
                </div>
                <div className="dr-tl-body">
                  <div className="dr-tl-head">
                    <span className="dr-tl-v">{v.v}</span>
                    {v.current && <span className="dr-tl-cur-badge">atual</span>}
                    <span className="dr-tl-date" style={{ marginLeft: 8 }}>{v.date}</span>
                  </div>
                  <p className="dr-tl-note" style={{ margin: '8px 0 0' }}>{v.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
