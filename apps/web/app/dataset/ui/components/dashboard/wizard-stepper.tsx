import * as Ic from '#common/ui/components/datarural/icons'
import { useTranslation } from '#common/ui/hooks/use_translation'

interface StepMeta {
  id: number
  labelKey: string
  titleKey: string
  icon: string
}

interface StepperProps {
  step: number
  onJump: (n: number) => void
  maxReached: number
  isEditing?: boolean
}

export default function WizardStepper({ step, onJump, maxReached, isEditing }: StepperProps) {
  const { t } = useTranslation()

  const wizSteps: StepMeta[] = [
    { id: 0, labelKey: t('dataset.publish.step_label', { num: 1 }), titleKey: t('dataset.publish.steps.file'), icon: 'Uploadcloud' },
    { id: 1, labelKey: t('dataset.publish.step_label', { num: 2 }), titleKey: t('dataset.publish.steps.metadata'), icon: 'Info' },
    { id: 2, labelKey: t('dataset.publish.step_label', { num: 3 }), titleKey: t('dataset.publish.steps.schema'), icon: 'Columns' },
    { id: 3, labelKey: t('dataset.publish.step_label', { num: 4 }), titleKey: t('dataset.publish.steps.license'), icon: 'Scale' },
    { id: 4, labelKey: t('dataset.publish.step_label', { num: 5 }), titleKey: t('dataset.publish.steps.review'), icon: 'Verified' },
  ]

  const editSteps: StepMeta[] = [
    { id: 1, labelKey: t('dataset.publish.step_label', { num: 1 }), titleKey: t('dataset.publish.steps.metadata'), icon: 'Info' },
    { id: 2, labelKey: t('dataset.publish.step_label', { num: 2 }), titleKey: t('dataset.publish.steps.schema'), icon: 'Columns' },
    { id: 3, labelKey: t('dataset.publish.step_label', { num: 3 }), titleKey: t('dataset.publish.steps.license'), icon: 'Scale' },
  ]

  const stepsToRender = isEditing ? editSteps : wizSteps

  return (
    <aside className="dr-stepper">
      <div className="dr-stepper-inner">
        <p className="dr-stepper-title">{isEditing ? t('dataset.publish.title_edit') : t('dataset.publish.title')}</p>
        {stepsToRender.map((s, idx) => {
          const state = s.id === step ? 'active' : s.id < step ? 'done' : 'todo'
          const clickable = s.id <= maxReached

          return (
            <div
              key={s.id}
              className={`dr-step-item ${state} ${clickable ? '' : 'locked'}`}
              onClick={() => clickable && onJump(s.id)}
              style={{ cursor: clickable ? 'pointer' : 'default' }}
            >
              {idx < stepsToRender.length - 1 && <span className="line"></span>}
              <span className="dr-step-num">
                {s.id < step ? <Ic.Check size={16} /> : idx + 1}
              </span>
              <span className="dr-step-meta">
                <span className="sl">{s.labelKey}</span>
                <span className="st">{s.titleKey}</span>
              </span>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
