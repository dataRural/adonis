import { useState, useRef } from 'react'
import * as Ic from '#common/ui/components/datarural/icons'
import { CSV_COLUMNS, TYPE_LABEL } from './panel-data'
import { useTranslation } from '#common/ui/hooks/use_translation'

interface Step1Props {
  data: any
  set: (patch: any) => void
}

export interface UploadedFileItem {
  id: string
  file: File
  fileName: string
  fileSize: string
  rowCount: number
  colCount: number
  schema: any[]
  qaChecks: any[]
  usabilityScore: number
}

export default function StepArquivo({ data, set }: Step1Props) {
  const { t } = useTranslation()
  const [drag, setDrag] = useState(false)
  const [selectedPreviewIdx, setSelectedPreviewIdx] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseSingleFile = (file: File): Promise<UploadedFileItem> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

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
            if (char === '\r' && text[i + 1] === '\n') i++
            lines.push(currentLine)
            currentLine = ''
            if (lines.length > 50000) break
          } else {
            currentLine += char
          }
        }
        if (currentLine) lines.push(currentLine)

        if (lines.length === 0) {
          return reject(new Error(`O arquivo ${file.name} está vazio.`))
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
          if (lines[i].trim() === '' || lines[i].split(',').every((cell) => cell.trim() === '')) {
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
              ? 'Aviso: Caracteres inválidos detectados.'
              : 'Arquivo lido sem caracteres inválidos.',
          },
          {
            id: 'head',
            state: colCount > 0 ? 'ok' : 'warn',
            title: 'Cabeçalho detectado',
            desc: colCount > 0 ? `${colCount} colunas nomeadas na primeira linha.` : 'Nenhum cabeçalho válido.',
          },
          {
            id: 'empty',
            state: emptyRowsCount > 0 ? 'warn' : 'ok',
            title: emptyRowsCount > 0 ? `${emptyRowsCount} linhas vazias` : 'Nenhuma linha vazia',
            desc: emptyRowsCount > 0 ? 'Revise se necessário.' : 'Todas as linhas possuem dados estruturados.',
          },
          {
            id: 'types',
            state: typeInconsistencies === 0 ? 'ok' : 'warn',
            title: typeInconsistencies === 0 ? 'Tipos consistentes' : 'Tipos inconsistentes',
            desc: typeInconsistencies === 0 ? 'Nenhum valor fora do tipo detectado.' : `${typeInconsistencies} células com tipo divergente.`,
          },
        ]

        let usabilityScore = 6.0
        if (!hasInvalidChars) usabilityScore += 1.0
        if (colCount > 0) usabilityScore += 1.0
        if (emptyRowsCount === 0) usabilityScore += 0.5
        if (typeInconsistencies === 0) usabilityScore += 1.0
        usabilityScore = Math.round(usabilityScore * 10) / 10

        resolve({
          id: Math.random().toString(36).substring(2, 9),
          file,
          fileName: file.name,
          fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          rowCount: totalRowsCount,
          colCount,
          schema,
          qaChecks,
          usabilityScore,
        })
      }

      reader.onerror = () => reject(new Error(`Erro ao ler o arquivo ${file.name}.`))
      reader.readAsText(file)
    })
  }

  const processFiles = async (fileList: File[]) => {
    const validCsvs = fileList.filter((f) => f.name.toLowerCase().endsWith('.csv'))
    if (validCsvs.length === 0) {
      alert('Por favor, selecione apenas arquivos com extensão .csv.')
      return
    }

    set({ uploading: true, progress: 20 })

    try {
      const parsedItems = await Promise.all(validCsvs.map((f) => parseSingleFile(f)))
      const existingFiles: UploadedFileItem[] = data.filesList || (data.file ? [{
        id: '1',
        file: data.file,
        fileName: data.fileName || data.file.name,
        fileSize: data.fileSize || '0 MB',
        rowCount: data.rowCount || 0,
        colCount: data.colCount || 0,
        schema: data.schema || [],
        qaChecks: data.qaChecks || [],
        usabilityScore: data.usabilityScore || 8.5,
      }] : [])

      const mergedFiles = [...existingFiles, ...parsedItems]

      const avgUsability = Math.round(
        (mergedFiles.reduce((acc, f) => acc + f.usabilityScore, 0) / mergedFiles.length) * 10
      ) / 10

      const primary = mergedFiles[0]

      set({
        uploading: false,
        uploaded: true,
        progress: 100,
        filesList: mergedFiles,
        file: primary.file,
        fileName: primary.fileName,
        fileSize: primary.fileSize,
        rowCount: primary.rowCount,
        colCount: primary.colCount,
        schema: primary.schema,
        qaChecks: primary.qaChecks,
        usabilityScore: avgUsability,
      })
    } catch (err: any) {
      alert(err.message || 'Erro ao processar arquivos CSV.')
      set({ uploading: false })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      processFiles(files)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDrag(false)
    const files = Array.from(e.dataTransfer.files || [])
    if (files.length > 0) {
      processFiles(files)
    }
  }

  const handleMakePrimary = (idx: number) => {
    const existingFiles: UploadedFileItem[] = data.filesList || []
    if (idx <= 0 || idx >= existingFiles.length) return

    const updated = [...existingFiles]
    const [target] = updated.splice(idx, 1)
    updated.unshift(target)

    setSelectedPreviewIdx(0)

    const avgUsability = Math.round(
      (updated.reduce((acc, f) => acc + f.usabilityScore, 0) / updated.length) * 10
    ) / 10

    set({
      filesList: updated,
      file: updated[0].file,
      fileName: updated[0].fileName,
      fileSize: updated[0].fileSize,
      rowCount: updated[0].rowCount,
      colCount: updated[0].colCount,
      schema: updated[0].schema,
      qaChecks: updated[0].qaChecks,
      usabilityScore: avgUsability,
    })
  }

  const handleRemoveFile = (idx: number) => {
    const existingFiles: UploadedFileItem[] = data.filesList || []
    const updated = existingFiles.filter((_, i) => i !== idx)

    if (updated.length === 0) {
      set({
        uploading: false,
        uploaded: false,
        progress: 0,
        filesList: [],
        file: null,
        fileName: '',
        fileSize: '',
        rowCount: 0,
        colCount: 0,
        schema: CSV_COLUMNS.map((c) => ({ ...c })),
        qaChecks: [],
        usabilityScore: 0,
      })
      setSelectedPreviewIdx(0)
    } else {
      const nextIdx = Math.min(selectedPreviewIdx, updated.length - 1)
      setSelectedPreviewIdx(nextIdx)

      const primary = updated[0]
      const avgUsability = Math.round(
        (updated.reduce((acc, f) => acc + f.usabilityScore, 0) / updated.length) * 10
      ) / 10

      set({
        filesList: updated,
        file: primary.file,
        fileName: updated[nextIdx].fileName,
        fileSize: updated[nextIdx].fileSize,
        rowCount: updated[nextIdx].rowCount,
        colCount: updated[nextIdx].colCount,
        schema: updated[nextIdx].schema,
        qaChecks: updated[nextIdx].qaChecks,
        usabilityScore: avgUsability,
      })
    }
  }

  const currentFiles: UploadedFileItem[] = data.filesList || (data.file ? [{
    id: '1',
    file: data.file,
    fileName: data.fileName || data.file.name,
    fileSize: data.fileSize || '0 MB',
    rowCount: data.rowCount || 0,
    colCount: data.colCount || 0,
    schema: data.schema || [],
    qaChecks: data.qaChecks || [],
    usabilityScore: data.usabilityScore || 8.5,
  }] : [])

  const activePreview = currentFiles[selectedPreviewIdx] || currentFiles[0]

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        multiple
        style={{ display: 'none' }}
      />

      {(!data.uploaded || currentFiles.length === 0) && !data.uploading && (
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
          <h3>{t('dataset.step_file.drag_drop_title')}</h3>
          <p>{t('dataset.step_file.drag_drop_desc')}</p>
          <button
            type="button"
            className="dr-btn dr-btn-primary"
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
          >
            <Ic.File size={17} /> {t('dataset.step_file.select_btn')}
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

      {currentFiles.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>
              {t('dataset.step_file.selected_files', { count: currentFiles.length })}
            </h4>
            <button
              type="button"
              className="dr-btn dr-btn-outline dr-btn-sm"
              onClick={() => fileInputRef.current?.click()}
              style={{ fontSize: 13 }}
            >
              <Ic.Plus size={14} /> {t('dataset.step_file.add_more')}
            </button>
          </div>

          {currentFiles.map((item, idx) => (
            <div
              key={item.id || idx}
              className="dr-file-card"
              style={{
                borderColor: selectedPreviewIdx === idx ? 'var(--brand-green)' : 'var(--border)',
                background: selectedPreviewIdx === idx ? 'color-mix(in srgb, var(--brand-green) 5%, var(--card))' : 'var(--card)',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedPreviewIdx(idx)}
            >
              <span className="fc-ic">
                <Ic.Table size={22} />
              </span>
              <div className="fc-main">
                <div className="fc-name" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{item.fileName}</span>
                  {idx === 0 ? (
                    <span className="dr-file-badge prim" style={{ fontSize: 11 }}>
                      {t('dataset.step_file.primary_badge')}
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="dr-btn dr-btn-ghost dr-btn-sm"
                      style={{ fontSize: 11, padding: '2px 8px', height: 'auto' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMakePrimary(idx)
                      }}
                      title={t('dataset.step_file.make_primary')}
                    >
                      {t('dataset.step_file.make_primary')}
                    </button>
                  )}
                </div>
                <div className="fc-sub">
                  {t('dataset.step_file.rows_cols', { size: item.fileSize, rows: item.rowCount.toLocaleString(), cols: item.colCount })}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {selectedPreviewIdx === idx && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-green)' }}>
                    {t('dataset.step_file.previewing')}
                  </span>
                )}
                <button
                  type="button"
                  className="fc-x"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFile(idx)
                  }}
                  title={t('dataset.step_file.remove_file')}
                >
                  <Ic.X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.uploaded && activePreview && (
        <>
          <div className="dr-subhead">
            <span className="ic">
              <Ic.Table size={16} />
            </span>{' '}
            {t('dataset.step_file.preview_subhead')} <strong>{activePreview.fileName}</strong> {selectedPreviewIdx === 0 ? t('dataset.step_file.primary_label') : ''}
            <span className="tail">{t('dataset.step_file.first_rows', { rows: activePreview.rowCount.toLocaleString() })}</span>
          </div>
          <div className="dr-csv-wrap">
            <div className="dr-csv-scroll">
              <table className="dr-csv-table">
                <thead>
                  <tr>
                    {activePreview.schema.map((c: any) => (
                      <th key={c.name}>
                        <span className="col-name">
                          <Ic.Hash size={12} style={{ color: 'var(--muted-foreground)', marginRight: 4 }} />
                          {c.name}
                        </span>
                        <span
                          className={`col-type col-type-${c.type} dr-type-${c.type}`}
                          style={{ marginTop: 6, display: 'inline-block' }}
                        >
                          {(TYPE_LABEL as any)[c.type]}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.min(3, activePreview.rowCount) }).map((_, r) => (
                    <tr key={r}>
                      {activePreview.schema.map((c: any) => (
                        <td key={c.name}>{c.sample?.[r] ?? ''}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="dr-csv-foot">
              {t('dataset.step_file.stats_tail', {
                cols: activePreview.colCount,
                num: activePreview.schema.filter((c: any) => c.type === 'num').length,
                text: activePreview.schema.filter((c: any) => c.type === 'text').length,
                date: activePreview.schema.filter((c: any) => c.type === 'date').length,
                geo: activePreview.schema.filter((c: any) => c.type === 'geo').length,
                filename: activePreview.fileName,
              })}
            </div>
          </div>

          <div className="dr-subhead">
            <span className="ic">
              <Ic.Verified size={16} />
            </span>{' '}
            {t('dataset.step_file.qa_subhead')} {activePreview.fileName}
          </div>
          <div className="dr-qa-grid">
            {activePreview.qaChecks.map((q: any) => (
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
              <div className="ut">
                {t('dataset.step_file.usability_title')}{' '}
                {Number(data.usabilityScore) >= 9.0
                  ? t('dataset.step_file.usability_exc')
                  : Number(data.usabilityScore) >= 8.0
                  ? t('dataset.step_file.usability_good')
                  : t('dataset.step_file.usability_fair')}
              </div>
              <div className="ud" style={{ margin: '3px 0 0' }}>
                {t('dataset.step_file.usability_desc', { count: currentFiles.length })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
