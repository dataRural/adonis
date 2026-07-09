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

  const processFile = (file: File) => {
    set({
      file,
      uploading: true,
      progress: 0,
      uploaded: false,
      fileName: file.name,
      fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    })

    const reader = new FileReader()

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100)
        set({ progress: percent })
      }
    }

    reader.onload = (event) => {
      const text = event.target?.result as string
      
      const lines: string[] = []
      let currentLine = ''
      let inQuotes = false

      for (let i = 0; i < text.length; i++) {
        const char = text[i]
        if (char === '"') {
          inQuotes = !inQuotes
          currentLine += char
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
          if (char === '\r' && text[i + 1] === '\n') {
            i++
          }
          lines.push(currentLine)
          currentLine = ''
          if (lines.length > 50000) {
            break
          }
        } else {
          currentLine += char
        }
      }
      if (currentLine) {
        lines.push(currentLine)
      }

      if (lines.length === 0) {
        alert('O arquivo CSV está vazio.')
        set({ uploading: false, uploaded: false })
        return
      }

      const parseCsvLine = (lineStr: string) => {
        const values: string[] = []
        let currentVal = ''
        let insideQuotes = false

        for (let index = 0; index < lineStr.length; index++) {
          const char = lineStr[index]
          const nextChar = lineStr[index + 1]

          if (char === '"') {
            if (insideQuotes && nextChar === '"') {
              currentVal += '"'
              index++
            } else {
              insideQuotes = !insideQuotes
            }
            continue
          }

          if (char === ',' && !insideQuotes) {
            values.push(currentVal)
            currentVal = ''
            continue
          }

          currentVal += char
        }

        values.push(currentVal)
        return values
      }

      const parsedRows = lines.map((l) => parseCsvLine(l))
      const headers = parsedRows[0] || []
      const dataRows = parsedRows.slice(1).filter((r) => r.length > 0 && r.some((val) => val.trim() !== ''))
      
      const totalRowsCount = dataRows.length
      const colCount = headers.length

      let emptyRowsCount = 0
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '' || lines[i].split(',').every(cell => cell.trim() === '')) {
          emptyRowsCount++
        }
      }

      const hasInvalidChars = text.includes('\uFFFD')

      const numericRegex = /^-?\d+(?:[.,]\d+)?$/
      const dateRegex = /^(?:\d{4}[-/]\d{2}[-/]\d{2}|\d{2}[-/]\d{2}[-/]\d{4})(?:\s+\d{2}:\d{2}(?::\d{2})?)?$/

      const schema = headers.map((headerName, colIdx) => {
        let numCount = 0
        let dateCount = 0
        let textCount = 0

        const sampleSize = Math.min(100, dataRows.length)

        for (let rIdx = 0; rIdx < sampleSize; rIdx++) {
          const cellVal = dataRows[rIdx][colIdx]?.trim() || ''

          if (cellVal !== '') {
            if (numericRegex.test(cellVal)) {
              numCount++
            } else if (dateRegex.test(cellVal)) {
              dateCount++
            } else {
              textCount++
            }
          }
        }

        let inferredType: 'num' | 'text' | 'date' | 'geo' = 'text'
        if (numCount > textCount && numCount > dateCount) {
          inferredType = 'num'
        } else if (dateCount > numCount && dateCount > textCount) {
          inferredType = 'date'
        }

        const first3Samples = [
          dataRows[0]?.[colIdx] || '',
          dataRows[1]?.[colIdx] || '',
          dataRows[2]?.[colIdx] || '',
        ]

        return {
          name: headerName || `Coluna_${colIdx + 1}`,
          type: inferredType,
          sample: first3Samples,
          desc: '',
          unit: '',
        }
      })

      let typeInconsistencies = 0
      schema.forEach((col, colIdx) => {
        const expectedType = col.type
        if (expectedType === 'num' || expectedType === 'date') {
          const sampleSize = Math.min(100, dataRows.length)
          for (let rIdx = 0; rIdx < sampleSize; rIdx++) {
            const cellVal = dataRows[rIdx][colIdx]?.trim() || ''
            if (cellVal !== '') {
              if (expectedType === 'num' && !numericRegex.test(cellVal)) {
                typeInconsistencies++
              } else if (expectedType === 'date' && !dateRegex.test(cellVal)) {
                typeInconsistencies++
              }
            }
          }
        }
      })

      const qaChecks: any[] = [
        {
          id: 'enc',
          state: hasInvalidChars ? 'warn' : 'ok',
          title: 'Codificação UTF-8',
          desc: hasInvalidChars
            ? 'Aviso: Caracteres inválidos detectados. Verifique se a codificação do arquivo é UTF-8.'
            : 'Arquivo lido sem caracteres inválidos.',
        },
        {
          id: 'head',
          state: colCount > 0 ? 'ok' : 'warn',
          title: 'Cabeçalho detectado',
          desc: colCount > 0
            ? `${colCount} colunas nomeadas na primeira linha.`
            : 'Nenhum cabeçalho válido ou colunas detectadas.',
        },
        {
          id: 'empty',
          state: emptyRowsCount > 0 ? 'warn' : 'ok',
          title: emptyRowsCount > 0 ? `${emptyRowsCount} linhas vazias` : 'Nenhuma linha vazia',
          desc: emptyRowsCount > 0
            ? 'Serão ignoradas na publicação. Revise se necessário.'
            : 'Todas as linhas possuem dados estruturados.',
        },
        {
          id: 'types',
          state: typeInconsistencies === 0 ? 'ok' : 'warn',
          title: typeInconsistencies === 0 ? 'Tipos consistentes' : 'Tipos inconsistentes',
          desc: typeInconsistencies === 0
            ? 'Nenhum valor fora do tipo detectado por coluna.'
            : `${typeInconsistencies} células possuem tipo de dado divergente do tipo da coluna.`,
        },
      ]

      let usabilityScore = 6.0
      if (!hasInvalidChars) usabilityScore += 1.0
      if (colCount > 0) usabilityScore += 1.0
      if (emptyRowsCount === 0) usabilityScore += 0.5
      if (typeInconsistencies === 0) usabilityScore += 1.0
      usabilityScore = Math.round(usabilityScore * 10) / 10

      set({
        uploading: false,
        uploaded: true,
        progress: 100,
        rowCount: totalRowsCount,
        colCount,
        schema,
        qaChecks,
        usabilityScore,
      })
    }

    reader.onerror = () => {
      alert('Erro ao ler o arquivo.')
      set({ uploading: false, uploaded: false })
    }

    reader.readAsText(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.endsWith('.csv')) {
        alert('Por favor, envie um arquivo no formato CSV.')
        return
      }
      processFile(file)
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
      processFile(file)
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
              {data.uploaded ? `${data.rowCount.toLocaleString('pt-BR')} linhas · ${data.colCount} colunas detectadas` : `Enviando… ${data.progress}%`}
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
              onClick={() => set({ uploading: false, uploaded: false, progress: 0, file: null, fileName: '', fileSize: '', rowCount: 0, colCount: 0, schema: CSV_COLUMNS.map((c) => ({ ...c })), qaChecks: [], usabilityScore: 0 })}
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
            <span className="tail">primeiras 3 linhas de {data.rowCount.toLocaleString('pt-BR')}</span>
          </div>
          <div className="dr-csv-wrap">
            <div className="dr-csv-scroll">
              <table className="dr-csv-table">
                <thead>
                  <tr>
                    {data.schema.map((c: any) => (
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
                  {Array.from({ length: Math.min(3, data.rowCount) }).map((_, r) => (
                    <tr key={r}>
                      {data.schema.map((c: any) => (
                        <td key={c.name}>{c.sample?.[r] ?? ''}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="dr-csv-foot">
              {data.colCount} colunas ·{' '}
              {data.schema.filter((c: any) => c.type === 'num').length} numéricas ·{' '}
              {data.schema.filter((c: any) => c.type === 'text').length} texto ·{' '}
              {data.schema.filter((c: any) => c.type === 'date').length} data ·{' '}
              {data.schema.filter((c: any) => c.type === 'geo').length} geo — tipos inferidos
              automaticamente, ajuste no passo Esquema.
            </div>
          </div>

          <div className="dr-subhead">
            <span className="ic">
              <Ic.Verified size={16} />
            </span>{' '}
            Validação de qualidade
          </div>
          <div className="dr-qa-grid">
            {data.qaChecks.map((q: any) => (
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
            <span className="dr-usab-ring" style={{ '--p': (Number(data.usabilityScore) || 0) * 10 } as React.CSSProperties}>
              <span>{data.usabilityScore ? Number(data.usabilityScore).toFixed(1) : '0.0'}</span>
            </span>
            <div className="ub-main">
              <div className="ut">Usabilidade estimada: {Number(data.usabilityScore) >= 9.0 ? 'excelente' : Number(data.usabilityScore) >= 8.0 ? 'boa' : 'regular'}</div>
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
