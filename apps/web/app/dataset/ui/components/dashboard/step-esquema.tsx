import { useState } from 'react'
import * as Ic from '#common/ui/components/datarural/icons'
import { useTranslation } from '#common/ui/hooks/use_translation'

interface Step3Props {
  data: any
  set: (patch: any) => void
}

export default function StepEsquema({ data, set }: Step3Props) {
  const { t } = useTranslation()
  const [activeFileIdx, setActiveFileIdx] = useState(0)

  const filesList = data.filesList && data.filesList.length > 0
    ? data.filesList
    : (data.file ? [{
        fileName: data.fileName || data.file.name,
        schema: data.schema || [],
      }] : [])

  const safeActiveIdx = Math.min(activeFileIdx, Math.max(0, filesList.length - 1))
  const currentFile = filesList[safeActiveIdx] || filesList[0]
  const currentSchema = currentFile?.schema || data.schema || []

  const update = (i: number, key: string, val: string) => {
    if (data.filesList && data.filesList.length > 0) {
      const updatedFiles = data.filesList.map((fItem: any, fIdx: number) => {
        if (fIdx !== safeActiveIdx) return fItem
        const newSchema = (fItem.schema || []).map((c: any, idx: number) =>
          idx === i ? { ...c, [key]: val } : c
        )
        return { ...fItem, schema: newSchema }
      })

      const primarySchema = updatedFiles[0]?.schema || []
      set({
        filesList: updatedFiles,
        schema: primarySchema,
      })
    } else {
      const next = (data.schema || []).map((c: any, idx: number) =>
        idx === i ? { ...c, [key]: val } : c
      )
      set({ schema: next })
    }
  }

  return (
    <div>
      {filesList.length > 1 && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--muted-foreground)' }}>
            {t('dataset.step_schema.select_csv')}
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {filesList.map((f: any, idx: number) => (
              <button
                key={f.fileName + '_' + idx}
                type="button"
                className={`dr-btn dr-btn-sm ${safeActiveIdx === idx ? 'dr-btn-primary' : 'dr-btn-outline'}`}
                onClick={() => setActiveFileIdx(idx)}
                style={{ fontSize: 13, gap: 6 }}
              >
                <Ic.File size={14} />
                <span>{f.fileName}</span>
                {idx === 0 && (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '1px 5px',
                    borderRadius: 4,
                    background: safeActiveIdx === idx ? 'rgba(255,255,255,0.25)' : 'var(--muted)',
                  }}>
                    {t('dataset.step_schema.primary')}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="dr-subhead" style={{ marginTop: 0 }}>
        <span className="ic">
          <Ic.Columns size={16} />
        </span>{' '}
        {t('dataset.step_schema.describe_cols')} <strong>{currentFile?.fileName || 'Dataset'}</strong>
        <span className="tail">
          {t('dataset.step_schema.schema_tail', { count: currentSchema.length })}
        </span>
      </div>
      <div className="dr-schema-tbl">
        <div className="dr-schema-hd">
          <span>{t('dataset.step_schema.th_col')}</span>
          <span>{t('dataset.step_schema.th_type')}</span>
          <span>{t('dataset.step_schema.th_desc')}</span>
          <span>{t('dataset.step_schema.th_unit')}</span>
        </div>
        {currentSchema.map((c: any, i: number) => (
          <div className="dr-schema-rw" key={c.name + '_' + i}>
            <span className="sc-name">
              <Ic.Hash size={14} className="hashic" style={{ marginRight: 6 }} />
              {c.name}
            </span>
            <select
              className="dr-sc-type-sel"
              value={c.type}
              onChange={(e) => update(i, 'type', e.target.value)}
            >
              <option value="num">{t('dataset.step_schema.type_num')}</option>
              <option value="text">{t('dataset.step_schema.type_text')}</option>
              <option value="date">{t('dataset.step_schema.type_date')}</option>
              <option value="geo">{t('dataset.step_schema.type_geo')}</option>
            </select>
            <input
              className="dr-sc-input"
              value={c.desc || ''}
              onChange={(e) => update(i, 'desc', e.target.value)}
              placeholder={t('dataset.step_schema.desc_placeholder')}
            />
            <input
              className="dr-sc-input"
              value={c.unit || ''}
              onChange={(e) => update(i, 'unit', e.target.value)}
              placeholder="—"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
