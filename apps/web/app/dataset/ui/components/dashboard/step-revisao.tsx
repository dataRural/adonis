import * as Ic from '#common/ui/components/datarural/icons'
import { LICENSES, AREAS } from './panel-data'
import { useTranslation } from '#common/ui/hooks/use_translation'

interface Step5Props {
  data: any
  set: (patch: any) => void
  onJump: (n: number) => void
}

export default function StepRevisao({ data, set, onJump }: Step5Props) {
  const { t } = useTranslation()
  const lic = LICENSES.find((l) => l.id === data.license) || LICENSES[0]
  const area = AREAS.find((a) => a.id === data.area)

  const cards = [
    {
      title: t('dataset.step_review.file_card_title'),
      icon: 'Uploadcloud',
      color: 'var(--brand-blue)',
      step: 0,
      rows: [
        [t('dataset.step_review.filename'), data.fileName || '—'],
        [t('dataset.step_review.size'), data.fileSize || '—'],
        [t('dataset.step_review.content'), t('dataset.step_review.content_val', { rows: data.rowCount.toLocaleString(), cols: data.colCount })],
      ],
    },
    {
      title: t('dataset.step_review.metadata_card_title'),
      icon: 'Info',
      color: 'var(--brand-sky)',
      step: 1,
      rows: [
        [t('dataset.step_review.title'), data.title || '—'],
        [t('dataset.step_review.unit'), data.unit],
        [t('dataset.step_review.area'), area ? area.name : '—'],
        [t('dataset.step_review.period'), data.period || '—'],
        [t('dataset.step_review.tags'), 'tags'],
      ],
    },
    {
      title: t('dataset.step_review.license_vis_card_title'),
      icon: 'Scale',
      color: 'var(--brand-green)',
      step: 3,
      rows: [
        [t('dataset.step_review.license'), lic.name],
        [t('dataset.step_review.visibility'), data.visibility === 'public' ? t('dataset.step_review.public') : t('dataset.step_review.restricted')],
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
                <Ic.Edit size={13} style={{ marginRight: 4 }} /> {t('dataset.step_review.edit')}
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
                          ? data.tags.map((tTag: string) => (
                              <span key={tTag} className="dr-review-row rv tagline ds-tag">
                                {tTag}
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
          {t('dataset.step_review.confirm_label')}
        </label>
      </div>
    </div>
  )
}
