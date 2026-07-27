import * as Ic from '#common/ui/components/datarural/icons'

interface Step3Props {
  data: any
  set: (patch: any) => void
}

export default function StepEsquema({ data, set }: Step3Props) {
  const update = (i: number, key: string, val: string) => {
    const next = data.schema.map((c: any, idx: number) =>
      idx === i ? { ...c, [key]: val } : c
    )
    set({ schema: next })
  }

  return (
    <div>
      <div className="dr-subhead" style={{ marginTop: 0 }}>
        <span className="ic">
          <Ic.Columns size={16} />
        </span>{' '}
        Descreva as colunas
        <span className="tail">
          {data.schema.length} colunas · descrições elevam a usabilidade
        </span>
      </div>
      <div className="dr-schema-tbl">
        <div className="dr-schema-hd">
          <span>Coluna</span>
          <span>Tipo</span>
          <span>Descrição</span>
          <span>Unidade</span>
        </div>
        {data.schema.map((c: any, i: number) => (
          <div className="dr-schema-rw" key={c.name}>
            <span className="sc-name">
              <Ic.Hash size={14} className="hashic" style={{ marginRight: 6 }} />
              {c.name}
            </span>
            <select
              className="dr-sc-type-sel"
              value={c.type}
              onChange={(e) => update(i, 'type', e.target.value)}
            >
              <option value="num">Número</option>
              <option value="text">Texto</option>
              <option value="date">Data</option>
              <option value="geo">Geo</option>
            </select>
            <input
              className="dr-sc-input"
              value={c.desc}
              onChange={(e) => update(i, 'desc', e.target.value)}
              placeholder="O que esta coluna representa?"
            />
            <input
              className="dr-sc-input"
              value={c.unit}
              onChange={(e) => update(i, 'unit', e.target.value)}
              placeholder="—"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
