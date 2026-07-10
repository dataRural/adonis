import * as Ic from '#common/ui/components/datarural/icons'
import { LICENSES, AREAS } from './panel-data'

interface Step5Props {
  data: any
  set: (patch: any) => void
  onJump: (n: number) => void
}

export default function StepRevisao({ data, set, onJump }: Step5Props) {
  const lic = LICENSES.find((l) => l.id === data.license) || LICENSES[0]
  const area = AREAS.find((a) => a.id === data.area)

  const cards = [
    {
      title: 'Arquivo',
      icon: 'Uploadcloud',
      color: 'var(--brand-blue)',
      step: 0,
      rows: [
        ['Nome do arquivo', data.fileName || '—'],
        ['Tamanho', data.fileSize || '—'],
        ['Conteúdo', `${data.rowCount.toLocaleString('pt-BR')} linhas · ${data.colCount} colunas`],
      ],
    },
    {
      title: 'Metadados',
      icon: 'Info',
      color: 'var(--brand-sky)',
      step: 1,
      rows: [
        ['Título', data.title || '—'],
        ['Unidade', data.unit],
        ['Área', area ? area.name : '—'],
        ['Período', data.period || '—'],
        ['Tags', 'tags'],
      ],
    },
    {
      title: 'Licença & visibilidade',
      icon: 'Scale',
      color: 'var(--brand-green)',
      step: 3,
      rows: [
        ['Licença', lic.name],
        ['Visibilidade', data.visibility === 'public' ? 'Público' : 'Restrito'],
      ],
    },
  ]

  return (
    <div>
      {cards.map((c) => {
        const Icon = (Ic as any)[c.icon] || Ic.Info
        return (
          <div className="dr-review-card" key={c.title}>
            <div className="dr-review-card-hd">
              <span className="ric" style={{ background: c.color }}>
                <Icon size={16} />
              </span>
              <span className="rt">{c.title}</span>
              <button className="edit" type="button" onClick={() => onJump(c.step)}>
                <Ic.Edit size={13} style={{ marginRight: 4 }} /> Editar
              </button>
            </div>
            <div className="dr-review-rows">
              {c.rows.map(([k, v]) => (
                <div className="dr-review-row" key={k}>
                  <span className="rk">{k}</span>
                  <span className="rv">
                    {v === 'tags' ? (
                      <span className="tagline">
                        {data.tags.length
                          ? data.tags.map((t: string) => (
                              <span key={t} className="dr-review-row rv tagline ds-tag">
                                {t}
                              </span>
                            ))
                          : '—'}
                      </span>
                    ) : (
                      v
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <div className="dr-review-confirm">
        <input
          type="checkbox"
          id="confirm"
          checked={data.confirm}
          onChange={(e) => set({ confirm: e.target.checked })}
        />
        <label htmlFor="confirm" style={{ marginLeft: 8 }}>
          Confirmo que tenho autorização para publicar estes dados e que eles estão de acordo com a{' '}
          <a href="#" onClick={(e) => e.preventDefault()}>Política de Dados Abertos da UFRRJ</a> e a LGPD (sem dados pessoais
          identificáveis).
        </label>
      </div>
    </div>
  )
}
