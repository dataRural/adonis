import { useRef, useState, useEffect } from 'react'
import * as Ic from '#common/ui/components/datarural/icons'
import { UNITS, AREAS } from './panel-data'

interface Step2Props {
  data: any
  set: (patch: any) => void
}

export default function StepMetadados({ data, set }: Step2Props) {
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

  const addTag = (t: string) => {
    t = t.trim()
    if (t && !data.tags.includes(t)) {
      set({ tags: [...data.tags, t] })
    }
  }

  const removeTag = (t: string) => {
    set({ tags: data.tags.filter((x: string) => x !== t) })
  }


  return (
    <div className="dr-fgrid">
      <div className="dr-field dr-field-full">
        <label className="dr-field-label">
          Título do dataset <span className="req">*</span>
        </label>
        <input
          className="dr-input"
          value={data.title}
          onChange={(e) => set({ title: e.target.value })}
          placeholder="Ex.: Dados Meteorológicos (2010-2024)"
        />
        <span className="dr-field-hint">Seja específico: inclua local e período cobertos.</span>
      </div>

      <div className="dr-field dr-field-full">
        <label className="dr-field-label">
          Descrição <span className="req">*</span>
          <span className="opt">{data.desc.length}/600</span>
        </label>
        <textarea
          className="dr-textarea"
          maxLength={600}
          value={data.desc}
          onChange={(e) => set({ desc: e.target.value })}
          placeholder="Descreva o que o conjunto contém, como foi coletado, a frequência das medições e usos recomendados."
        />
      </div>

      <div className="dr-field">
        <label className="dr-field-label">
          Unidade / Instituto <span className="req">*</span>
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
          Área de conhecimento <span className="req">*</span>
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
        <label className="dr-field-label">Período de cobertura</label>
        <input
          className="dr-input"
          value={data.period}
          onChange={(e) => set({ period: e.target.value })}
          placeholder="2010 – 2024"
        />
      </div>

      <div className="dr-field">
        <label className="dr-field-label">Região / Local</label>
        <input
          className="dr-input"
          value={data.region}
          onChange={(e) => set({ region: e.target.value })}
          placeholder="No va Iguaçu, RJ"
        />
      </div>

      <div className="dr-field dr-field-full">
        <label className="dr-field-label">
          Tags
        </label>
        <div
          className="dr-tag-box"
          onClick={() => tagInputRef.current && tagInputRef.current.focus()}
        >
          {data.tags.map((t: string) => (
            <span key={t} className="dr-tag-pill">
              {t}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeTag(t)
                }}
                aria-label={'remover ' + t}
              >
                <Ic.X size={13} />
              </button>
            </span>
          ))}
          <input
            ref={tagInputRef}
            placeholder={data.tags.length ? '' : 'Digite e pressione Enter…'}
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
