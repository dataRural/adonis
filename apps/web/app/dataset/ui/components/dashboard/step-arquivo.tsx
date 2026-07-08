import { useState, useRef } from 'react'
import * as Ic from '#common/ui/components/datarural/icons'
import { CSV_COLUMNS, QA_CHECKS, TYPE_LABEL } from './panel-data'

interface Step1Props {
  data: any
  set: (patch: any) => void
}

export default function StepArquivo({ data, set }: Step1Props) {
  const [drag, setDrag] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.endsWith('.csv')) {
        alert('Por favor, envie um arquivo no formato CSV.')
        return
      }
      set({
        file: file,
        uploaded: true,
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      })
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDrag(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (!file.name.endsWith('.csv')) {
        alert('Por favor, envie um arquivo no formato CSV.')
        return
      }
      set({
        file: file,
        uploaded: true,
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      })
    }
  }

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        style={{ display: 'none' }}
      />
      {!data.uploaded && !data.uploading && (
        <div
          className={`dr-dropzone ${drag ? 'drag' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDrag(true)
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
        >
          <span className="dz-ic">
            <Ic.Uploadcloud size={30} />
          </span>
          <h3>Arraste seu arquivo aqui ou clique para selecionar</h3>
          <p>O preview e a detecção de colunas acontecem automaticamente após o envio.</p>
          <button
            type="button"
            className="dr-btn dr-btn-primary"
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
          >
            <Ic.File size={17} /> Selecionar arquivo
          </button>
          <div className="formats">
            {['CSV'].map((f) => (
              <span key={f} className="fmt-pill">
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {(data.uploading || data.uploaded) && (
        <div className="dr-file-card">
          <span className="fc-ic">
            <Ic.Table size={22} />
          </span>
          <div className="fc-main">
            <div className="fc-name">{data.fileName}</div>
            <div className="fc-sub">
              {data.fileSize} ·{' '}
              {data.uploaded ? '84.234 linhas · 6 colunas detectadas' : `Enviando… ${data.progress}%`}
            </div>
            {!data.uploaded && (
              <div className="fc-bar">
                <i style={{ width: data.progress + '%' }}></i>
              </div>
            )}
          </div>
          {data.uploaded ? (
            <span className="fc-done">
              <Ic.Verified size={26} />
            </span>
          ) : (
            <button
              className="fc-x"
              onClick={() => set({ uploading: false, uploaded: false, progress: 0, file: null, fileName: '', fileSize: '' })}
            >
              <Ic.X size={16} />
            </button>
          )}
        </div>
      )}

      {data.uploaded && (
        <>
          <div className="dr-subhead">
            <span className="ic">
              <Ic.Table size={16} />
            </span>{' '}
            Pré-visualização detectada
            <span className="tail">primeiras 3 linhas de 84.234</span>
          </div>
          <div className="dr-csv-wrap">
            <div className="dr-csv-scroll">
              <table className="dr-csv-table">
                <thead>
                  <tr>
                    {CSV_COLUMNS.map((c) => (
                      <th key={c.name}>
                        <span className="col-name">
                          <Ic.Hash size={12} style={{ color: 'var(--muted-foreground)', marginRight: 4 }} />
                          {c.name}
                        </span>
                        <span
                          className={`col-type col-type-${c.type} dr-type-${c.type}`}
                          style={{ marginTop: 6, display: 'inline-block' }}
                        >
                          {TYPE_LABEL[c.type]}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2].map((r) => (
                    <tr key={r}>
                      {CSV_COLUMNS.map((c) => (
                        <td key={c.name}>{c.sample[r]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="dr-csv-foot">
              6 colunas · 4 numéricas · 1 texto · 1 data — tipos inferidos automaticamente, ajuste no
              passo Esquema.
            </div>
          </div>

          <div className="dr-subhead">
            <span className="ic">
              <Ic.Verified size={16} />
            </span>{' '}
            Validação de qualidade
          </div>
          <div className="dr-qa-grid">
            {QA_CHECKS.map((q) => (
              <div key={q.id} className={'dr-qa-item ' + q.state}>
                <span className="qic">
                  {q.state === 'ok' ? <Ic.Check size={16} /> : <Ic.Alert size={16} />}
                </span>
                <div>
                  <div className="qt">{q.title}</div>
                  <div className="qd">{q.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="dr-usab-badge">
            <span className="dr-usab-ring" style={{ '--p': 84 } as React.CSSProperties}>
              <span>8.4</span>
            </span>
            <div className="ub-main">
              <div className="ut">Usabilidade estimada: boa</div>
              <div className="ud" style={{ margin: '3px 0 0' }}>
                Adicione descrições de colunas e licença explícita para chegar a 9+ e ganhar destaque
                na busca.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
