import * as Ic from '#common/ui/components/datarural/icons'

interface StepMeta {
  id: number
  label: string
  title: string
  icon: string
}

interface StepperProps {
  step: number
  onJump: (n: number) => void
  maxReached: number
  isEditing?: boolean
}

const WIZ_STEPS: StepMeta[] = [
  { id: 0, label: 'Etapa 1', title: 'Arquivo', icon: 'Uploadcloud' },
  { id: 1, label: 'Etapa 2', title: 'Metadados', icon: 'Info' },
  { id: 2, label: 'Etapa 3', title: 'Esquema', icon: 'Columns' },
  { id: 3, label: 'Etapa 4', title: 'Licença', icon: 'Scale' },
  { id: 4, label: 'Etapa 5', title: 'Revisão', icon: 'Verified' },
]


export default function WizardStepper({ step, onJump, maxReached, isEditing }: StepperProps) {
  const stepsToRender = isEditing ? WIZ_STEPS.slice(0, 4) : WIZ_STEPS

  return (
    <aside className="dr-stepper">
      <div className="dr-stepper-inner">
        <p className="dr-stepper-title">{isEditing ? 'Editar dataset' : 'Publicar dataset'}</p>
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
                {s.id < step ? <Ic.Check size={16} /> : s.id + 1}
              </span>
              <span className="dr-step-meta">
                <span className="sl">{s.label}</span>
                <span className="st">{s.title}</span>
              </span>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
