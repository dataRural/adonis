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
}

const WIZ_STEPS: StepMeta[] = [
  { id: 0, label: 'Etapa 1', title: 'Arquivo', icon: 'Uploadcloud' },
  { id: 1, label: 'Etapa 2', title: 'Metadados', icon: 'Info' },
  { id: 2, label: 'Etapa 3', title: 'Esquema', icon: 'Columns' },
  { id: 3, label: 'Etapa 4', title: 'Licença', icon: 'Scale' },
  { id: 4, label: 'Etapa 5', title: 'Revisão', icon: 'Verified' },
]

const STEP_HELP = [
  {
    h: 'Formatos aceitos',
    t: 'CSV, TSV, Parquet, XLSX e JSON até 2 GB. Para arquivos maiores, use a API de ingestão.',
  },
  {
    h: 'Bons metadados = mais uso',
    t: 'Datasets bem descritos recebem em média 3× mais downloads e melhor índice de usabilidade.',
  },
  {
    h: 'Descreva cada coluna',
    t: 'Nomes claros e unidades explícitas evitam dúvidas e elevam a nota de usabilidade.',
  },
  {
    h: 'Escolha consciente',
    t: 'A licença define como a comunidade pode reutilizar seus dados. CC BY 4.0 é o padrão aberto.',
  },
  {
    h: 'Quase lá',
    t: 'Revise os dados. Publicações passam por curadoria leve da equipe DataRural antes de irem ao ar.',
  },
]

export default function WizardStepper({ step, onJump, maxReached }: StepperProps) {
  return (
    <aside className="dr-stepper">
      <div className="dr-stepper-inner">
        <p className="dr-stepper-title">Publicar dataset</p>
        {WIZ_STEPS.map((s) => {
          const state = s.id === step ? 'active' : s.id < step ? 'done' : 'todo'
          const clickable = s.id <= maxReached

          return (
            <div
              key={s.id}
              className={`dr-step-item ${state} ${clickable ? '' : 'locked'}`}
              onClick={() => clickable && onJump(s.id)}
              style={{ cursor: clickable ? 'pointer' : 'default' }}
            >
              {s.id < WIZ_STEPS.length - 1 && <span className="line"></span>}
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
      <div className="dr-stepper-help">
        <span className="hh">
          <Ic.Info size={15} style={{ display: 'inline', marginRight: 4 }} /> {STEP_HELP[step].h}
        </span>
        <p style={{ margin: '8px 0 0' }}>{STEP_HELP[step].t}</p>
      </div>
    </aside>
  )
}
