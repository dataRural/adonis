import { useRef } from 'react'
import * as Ic from '#common/ui/components/datarural/icons'
import { UNITS, AREAS, SUGGESTED_TAGS } from './panel-data'

interface Step2Props {
  data: any
  set: (patch: any) => void
}

export default function StepMetadados({ data, set }: Step2Props) {
  const tagInputRef = useRef<HTMLInputElement>(null)

  const addTag = (t: string) => {
    t = t.trim()
    if (t && !data.tags.includes(t)) {
      set({ tags: [...data.tags, t] })
    }
  }

  const removeTag = (t: string) => {
    set({ tags: data.tags.filter((x: string) => x !== t) })
  }

  const remaining = SUGGESTED_TAGS.filter((t) => !data.tags.includes(t))

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
          placeholder="Ex.: Dados Meteorológicos — Estação Seropédica (2010–2024)"
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
          {AREAS.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <span className="dr-field-hint" style={{ color: 'var(--brand-green)', fontWeight: 700 }}>
          <Ic.Spark
            size={12}
            style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }}
          />
          Sugerido automaticamente a partir das colunas detectadas.
        </span>
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
          placeholder="Seropédica, RJ"
        />
      </div>

      <div className="dr-field dr-field-full">
        <label className="dr-field-label">
          Tags <span className="opt">ajudam na busca</span>
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
        {remaining.length > 0 && (
          <div className="dr-suggest-row">
            <span className="sl">
              <Ic.Spark size={13} style={{ display: 'inline', marginRight: 4 }} /> Sugeridas:
            </span>
            {remaining.map((t) => (
              <button
                type="button"
                key={t}
                className="dr-suggest-chip"
                onClick={() => addTag(t)}
              >
                <Ic.Plus size={12} style={{ display: 'inline', marginRight: 4 }} /> {t}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
