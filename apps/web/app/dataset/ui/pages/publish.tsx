import { useState, useEffect } from 'react'
import { router, Head } from '@inertiajs/react'
import PanelNav from '#common/ui/components/datarural/navbar-auth'
import PanelFooter from '#common/ui/components/datarural/footer-simple'
import WizardStepper from '../components/dashboard/wizard-stepper'
import StepArquivo from '../components/dashboard/step-arquivo'
import StepMetadados from '../components/dashboard/step-metadados'
import StepEsquema from '../components/dashboard/step-esquema'
import StepLicenca from '../components/dashboard/step-licenca'
import StepRevisao from '../components/dashboard/step-revisao'
import SubmissionErrorAlert, { SubmissionErrorItem } from '../components/dashboard/submission-error-alert'
import * as Ic from '#common/ui/components/datarural/icons'
import { UNITS, CSV_COLUMNS } from '../components/dashboard/panel-data'

import type { InertiaProps } from '#core/ui/types'

type PageProps = InertiaProps<{
  editDataset?: {
    id: number
    title: string
    desc: string
    unit: string
    area: string
    period: string
    region: string
    tags: string[]
    license: string
    visibility: string
    usabilityScore: number
    fileName: string
    fileSize: string
    groupId?: number | null
  } | null
  userGroups?: { id: number; name: string }[]
}>

export default function PublishWizard({ editDataset, userGroups = [] }: PageProps) {
  const isEditing = !!editDataset
  const maxStepIndex = isEditing ? 3 : 4

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dr-theme') || 'light'
    }
    return 'light'
  })
  const [step, setStep] = useState(0)
  const [maxReached, setMaxReached] = useState(isEditing ? 3 : 0)
  const [saving, setSaving] = useState(false)
  const [submissionErrors, setSubmissionErrors] = useState<SubmissionErrorItem[]>([])

  const [data, setData] = useState({
    file: null as File | null,
    uploaded: editDataset ? true : false,
    uploading: false,
    progress: 0,
    fileName: editDataset ? editDataset.fileName : '',
    fileSize: editDataset ? editDataset.fileSize : '',
    title: editDataset ? editDataset.title : '',
    desc: editDataset ? editDataset.desc : '',
    unit: editDataset ? editDataset.unit : UNITS[0],
    area: editDataset ? editDataset.area : 'clima',
    period: editDataset ? editDataset.period : '',
    region: editDataset ? editDataset.region : '',
    tags: editDataset ? editDataset.tags : [],
    schema: CSV_COLUMNS.map((c) => ({ ...c })),
    license: editDataset ? editDataset.license : 'ccby',
    visibility: editDataset ? editDataset.visibility : 'public',
    confirm: false,
    rowCount: 0,
    colCount: 0,
    qaChecks: [] as any[],
    usabilityScore: editDataset ? Number(editDataset.usabilityScore) : 0,
    groupId: editDataset?.groupId || null as number | null,
    userGroups: userGroups,
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('dr-theme', theme)
  }, [theme])

  const setPatch = (patch: any) => {
    setSubmissionErrors([])
    setData((d) => ({ ...d, ...patch }))
  }

  const goto = (n: number) => {
    const clamped = Math.max(0, Math.min(maxStepIndex, n))
    setStep(clamped)
    setMaxReached((m) => Math.max(m, clamped))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const validateForm = (): SubmissionErrorItem[] => {
    const errs: SubmissionErrorItem[] = []

    if (!isEditing && !data.uploaded) {
      errs.push({
        id: 'file',
        stepIndex: 0,
        stepName: 'Passo 1: Arquivo',
        message: 'Você precisa selecionar e enviar um arquivo de dados CSV.',
      })
    }

    if (!data.title.trim()) {
      errs.push({
        id: 'title',
        stepIndex: 1,
        stepName: 'Passo 2: Metadados',
        message: 'O título do dataset é obrigatório.',
      })
    } else if (data.title.trim().length < 3) {
      errs.push({
        id: 'title_length',
        stepIndex: 1,
        stepName: 'Passo 2: Metadados',
        message: 'O título deve conter pelo menos 3 caracteres.',
      })
    }

    if (!data.desc.trim()) {
      errs.push({
        id: 'desc',
        stepIndex: 1,
        stepName: 'Passo 2: Metadados',
        message: 'A descrição do dataset é obrigatória.',
      })
    } else if (data.desc.trim().length < 10) {
      errs.push({
        id: 'desc_length',
        stepIndex: 1,
        stepName: 'Passo 2: Metadados',
        message: 'A descrição deve ter pelo menos 10 caracteres explicativos.',
      })
    }

    if (!data.unit || !data.unit.trim()) {
      errs.push({
        id: 'unit',
        stepIndex: 1,
        stepName: 'Passo 2: Metadados',
        message: 'Selecione a Unidade ou Instituto responsável.',
      })
    }

    if (!data.area || !data.area.trim()) {
      errs.push({
        id: 'area',
        stepIndex: 1,
        stepName: 'Passo 2: Metadados',
        message: 'Selecione a Área de Conhecimento do conjunto.',
      })
    }

    if (!isEditing && !data.confirm) {
      errs.push({
        id: 'confirm',
        stepIndex: 4,
        stepName: 'Passo 5: Revisão',
        message: 'Você precisa confirmar a declaração de autoria e termos antes de publicar.',
      })
    }

    return errs
  }

  const canNext = (() => {
    if (step === 0) return data.uploaded
    if (step === 1) return Boolean(data.title.trim() && data.desc.trim())
    if (step === 4 && !isEditing) return data.confirm
    return true
  })()

  const heads = [
    {
      h: 'Envie seu arquivo de dados',
      p: 'Faça o upload do conjunto. Detectamos colunas, tipos e qualidade automaticamente.',
    },
    {
      h: 'Descreva o dataset',
      p: 'Bons metadados tornam seus dados encontráveis e reutilizáveis pela comunidade.',
    },
    {
      h: 'Refine o esquema',
      p: 'Confirme os tipos e descreva cada coluna — isso eleva a nota de usabilidade.',
    },
    {
      h: 'Defina licença e acesso',
      p: 'Escolha como a comunidade pode reutilizar seus dados.',
    },
    {
      h: 'Revise e publique',
      p: 'Confira tudo antes de enviar para a curadoria DataRural.',
    },
  ]

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handleExit = () => {
    if (editDataset) {
      router.visit(`/datasets/${editDataset.id}`)
    } else {
      router.visit('/dashboard')
    }
  }

  const handleSaveSubmit = () => {
    const clientErrs = validateForm()
    if (clientErrs.length > 0) {
      setSubmissionErrors(clientErrs)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    let licenseId: number | null = 1
    if (data.license === 'ccbysa') licenseId = 2
    else if (data.license === 'ccbync') licenseId = 3
    else if (data.license === 'odbl') licenseId = 4
    else if (data.license === 'cc0') licenseId = 5
    else if (data.license === 'custom') licenseId = null

    const formData = new FormData()
    if (editDataset) {
      formData.append('id', String(editDataset.id))
    }
    formData.append('name', data.title)
    formData.append('version', 'V1')
    formData.append('description', data.desc)
    formData.append('isPublic', data.visibility === 'public' ? 'true' : 'false')
    if (licenseId !== null) {
      formData.append('licenseId', String(licenseId))
    }
    formData.append('unit', data.unit)
    formData.append('area', data.area)
    if (data.period) {
      formData.append('period', data.period)
    }
    if (data.region) {
      formData.append('region', data.region)
    }
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach((tag) => {
        formData.append('tags[]', tag)
      })
    }
    if (data.usabilityScore !== undefined && data.usabilityScore !== null) {
      formData.append('usabilityScore', String(data.usabilityScore))
    }
    if (data.file) {
      formData.append('file', data.file)
    }
    if (data.groupId) {
      formData.append('groupId', String(data.groupId))
    }

    setSaving(true)
    setSubmissionErrors([])

    router.post('/datasets', formData, {
      onSuccess: () => {
        setSaving(false)
      },
      onError: (errs) => {
        setSaving(false)
        console.error('Save errors:', errs)
        const mapped: SubmissionErrorItem[] = []

        if (typeof errs === 'object' && errs !== null) {
          const fieldNames: Record<string, string> = {
            name: 'Título do dataset',
            description: 'Descrição',
            file: 'Arquivo de dados',
            unit: 'Unidade / Instituto',
            area: 'Área de conhecimento',
            licenseId: 'Licença',
            groupId: 'Grupo de pesquisa',
          }

          Object.entries(errs).forEach(([key, val], idx) => {
            const label = fieldNames[key] || key
            const msg = Array.isArray(val) ? val.join(', ') : String(val)
            let stepIdx = 1
            if (key === 'file') stepIdx = 0
            if (key === 'licenseId') stepIdx = 3

            mapped.push({
              id: `server_${key}_${idx}`,
              stepIndex: stepIdx,
              stepName: `Passo ${stepIdx + 1}`,
              message: `${label}: ${msg}`,
            })
          })
        }

        if (mapped.length === 0) {
          mapped.push({
            id: 'server_generic',
            message: 'Ocorreu um erro no servidor ao salvar o dataset. Verifique os campos preenchidos e tente novamente.',
          })
        }

        setSubmissionErrors(mapped)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      },
    })
  }

  return (
    <div className="dr-app dr-panel-wrap">
      <Head title={isEditing ? "Editar Dataset" : "Publicar Dataset"} />
      <PanelNav
        theme={theme}
        onToggleTheme={handleToggleTheme}
        active=""
        hidePublishButton={true}
      />
      <SimplePageHead
        onExit={handleExit}
        isEditing={isEditing}
        onSave={handleSaveSubmit}
        saving={saving}
        canSave={Boolean(data.title.trim() && data.desc.trim())}
      />
      <div className="dr-container">
        <div className="dr-wizard">
          <div className="dr-wizard-grid">
            <WizardStepper step={step} onJump={goto} maxReached={maxReached} isEditing={isEditing} />
            <div className="dr-wpanel">
              <SubmissionErrorAlert
                errors={submissionErrors}
                onDismiss={() => setSubmissionErrors([])}
                onJumpToStep={goto}
              />
              <div className="dr-wpanel-head">
                <h2 style={{ margin: 0 }}>{heads[step].h}</h2>
                <p style={{ margin: '7px 0 0' }}>{heads[step].p}</p>
              </div>
              <div className="dr-wpanel-body">
                {step === 0 && <StepArquivo data={data} set={setPatch} />}
                {step === 1 && <StepMetadados data={data} set={setPatch} />}
                {step === 2 && <StepEsquema data={data} set={setPatch} />}
                {step === 3 && <StepLicenca data={data} set={setPatch} />}
                {step === 4 && !isEditing && <StepRevisao data={data} set={setPatch} onJump={goto} />}
              </div>
              <div className="dr-wpanel-foot">
                {step === 0 ? (
                  <button className="dr-btn dr-btn-ghost" onClick={handleExit}>
                    Cancelar
                  </button>
                ) : (
                  <button className="dr-btn dr-btn-outline" onClick={() => goto(step - 1)}>
                    <Ic.Arrow
                      size={16}
                      style={{ transform: 'rotate(180deg)', display: 'inline', marginRight: 4 }}
                    />{' '}
                    Voltar
                  </button>
                )}
                <div className="dr-foot-right" style={{ display: 'flex', gap: 10 }}>
                  {isEditing ? (
                    <>
                      {step < 3 && (
                        <button
                          className="dr-btn dr-btn-outline"
                          disabled={!canNext}
                          onClick={() => goto(step + 1)}
                          style={!canNext ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                        >
                          Continuar <Ic.Arrow size={16} style={{ display: 'inline', marginLeft: 4 }} />
                        </button>
                      )}
                      <button
                        className="dr-btn dr-btn-primary dr-btn-lg"
                        disabled={!canNext || saving}
                        onClick={handleSaveSubmit}
                        style={!canNext || saving ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                      >
                        <Ic.Check size={18} style={{ display: 'inline', marginRight: 6 }} />{' '}
                        {saving ? 'Salvando…' : 'Salvar alterações'}
                      </button>
                    </>
                  ) : (
                    <>
                      {step < 4 ? (
                        <button
                          className="dr-btn dr-btn-primary"
                          disabled={!canNext}
                          onClick={() => goto(step + 1)}
                          style={!canNext ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                        >
                          Continuar <Ic.Arrow size={16} style={{ display: 'inline', marginLeft: 4 }} />
                        </button>
                      ) : (
                        <button
                          className="dr-btn dr-btn-yellow dr-btn-lg"
                          disabled={!canNext}
                          onClick={handleSaveSubmit}
                          style={!canNext ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                        >
                          <Ic.Send size={18} style={{ display: 'inline', marginRight: 6 }} /> Publicar
                          dataset
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PanelFooter />
    </div>
  )
}

function SimplePageHead({
  onExit,
  isEditing,
  onSave,
  saving,
  canSave = true,
}: {
  onExit: () => void
  isEditing?: boolean
  onSave?: () => void
  saving?: boolean
  canSave?: boolean
}) {
  return (
    <div className="dr-page-head">
      <div className="dr-container">
        <div className="dr-page-head-inner">
          <div>
            <div className="dr-page-breadcrumb">
              <a href="/">Início</a>
              <span className="sep">
                <Ic.Chevr size={13} style={{ display: 'inline', margin: '0 4px' }} />
              </span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onExit()
                }}
              >
                Meus datasets
              </a>
              <span className="sep">
                <Ic.Chevr size={13} style={{ display: 'inline', margin: '0 4px' }} />
              </span>
              <span>{isEditing ? 'Editar' : 'Publicar'}</span>
            </div>
            <h1 style={{ margin: 0 }}>{isEditing ? 'Editar dataset' : 'Publicar dataset'}</h1>
            <p className="page-sub">
              {isEditing
                ? 'Atualize as informações, metadados, esquema e licença do seu dataset.'
                : 'Em 5 etapas seu conjunto fica documentado, versionado e pronto para a comunidade.'}
            </p>
          </div>
          <div className="dr-page-head-actions" style={{ display: 'flex', gap: 10 }}>
            {isEditing && onSave && (
              <button
                className="dr-btn dr-btn-primary dr-btn-lg"
                onClick={onSave}
                disabled={!canSave || saving}
                style={!canSave || saving ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
              >
                <Ic.Check size={18} style={{ display: 'inline', marginRight: 6 }} />{' '}
                {saving ? 'Salvando…' : 'Salvar alterações'}
              </button>
            )}
            <button className="dr-btn dr-btn-outline dr-btn-lg" onClick={onExit}>
              <Ic.X size={18} /> {isEditing ? 'Cancelar' : 'Sair do envio'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
