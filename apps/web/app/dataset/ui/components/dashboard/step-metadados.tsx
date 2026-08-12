import { useRef, useState, useEffect } from 'react'
import * as Ic from '#common/ui/components/datarural/icons'
import { UNITS, AREAS } from './panel-data'
import { useTranslation } from '#common/ui/hooks/use_translation'

interface Step2Props {
  data: any
  set: (patch: any) => void
}

export default function StepMetadados({ data, set }: Step2Props) {
  const { t } = useTranslation()
  const tagInputRef = useRef<HTMLInputElement>(null)
  const [areaOptions, setAreaOptions] = useState<{ id: string; name: string }[]>(AREAS)

  useEffect(() => {
    fetch('/api/areas')
      .then((res) => res.json())
      .then((list) => {
        if (Array.isArray(list) && list.length > 0) {
          setAreaOptions(list.map((a: any) => ({ id: a.code, name: a.name })))
        }
      })
      .catch(() => { })
  }, [])

  const addTag = (tTag: string) => {
    tTag = tTag.trim()
    if (tTag && !data.tags.includes(tTag)) {
      set({ tags: [...data.tags, tTag] })
    }
  }

  const removeTag = (tTag: string) => {
    set({ tags: data.tags.filter((x: string) => x !== tTag) })
  }

  return (
    <div className="dr-fgrid">
      <div className="dr-field dr-field-full">
        <label className="dr-field-label">
          {t('dataset.step_metadata.title_label')} <span className="req">*</span>
        </label>
        <input
          className="dr-input"
          value={data.title}
          onChange={(e) => set({ title: e.target.value })}
          placeholder={t('dataset.step_metadata.title_placeholder')}
        />
        <span className="dr-field-hint">{t('dataset.step_metadata.title_hint')}</span>
      </div>

      <div className="dr-field dr-field-full">
        <label className="dr-field-label">
          {t('dataset.step_metadata.desc_label')} <span className="req">*</span>
          <span className="opt">{data.desc.length}/600</span>
        </label>
        <textarea
          className="dr-textarea"
          maxLength={600}
          value={data.desc}
          onChange={(e) => set({ desc: e.target.value })}
          placeholder={t('dataset.step_metadata.desc_placeholder')}
        />
      </div>

      <div className="dr-field">
        <label className="dr-field-label">
          {t('dataset.step_metadata.unit_label')} <span className="req">*</span>
        </label>
        <select
          className="dr-select"
          value={data.unit}
          onChange={(e) => set({ unit: e.target.value })}
        >
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      <div className="dr-field">
        <label className="dr-field-label">
          {t('dataset.step_metadata.area_label')} <span className="req">*</span>
        </label>
        <select
          className="dr-select"
          value={data.area}
          onChange={(e) => set({ area: e.target.value })}
        >
          {areaOptions.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div className="dr-field">
        <label className="dr-field-label">{t('dataset.step_metadata.period_label')}</label>
        <input
          className="dr-input"
          value={data.period}
          onChange={(e) => set({ period: e.target.value })}
          placeholder={t('dataset.step_metadata.period_placeholder')}
        />
      </div>

      <div className="dr-field">
        <label className="dr-field-label">{t('dataset.step_metadata.region_label')}</label>
        <input
          className="dr-input"
          value={data.region}
          onChange={(e) => set({ region: e.target.value })}
          placeholder={t('dataset.step_metadata.region_placeholder')}
        />
      </div>

      <div className="dr-field dr-field-full">
        <label className="dr-field-label">
          {t('dataset.step_metadata.tags_label')}
        </label>
        <div
          className="dr-tag-box"
          onClick={() => tagInputRef.current && tagInputRef.current.focus()}
        >
          {data.tags.map((tTag: string) => (
            <span key={tTag} className="dr-tag-pill">
              {tTag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeTag(tTag)
                }}
                aria-label={'remover ' + tTag}
              >
                <Ic.X size={13} />
              </button>
            </span>
          ))}
          <input
            ref={tagInputRef}
            placeholder={data.tags.length ? '' : t('dataset.step_metadata.tags_placeholder')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const target = e.target as HTMLInputElement
                addTag(target.value)
                target.value = ''
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
