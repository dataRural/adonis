import { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import PanelNav from '#common/ui/components/datarural/navbar-auth'
import PanelFooter from '#common/ui/components/datarural/footer-simple'
import WizardStepper from '../components/dashboard/wizard-stepper'
import StepArquivo from '../components/dashboard/step-arquivo'
import StepMetadados from '../components/dashboard/step-metadados'
import StepEsquema from '../components/dashboard/step-esquema'
import StepLicenca from '../components/dashboard/step-licenca'
import StepRevisao from '../components/dashboard/step-revisao'
import PublishSuccess from '../components/dashboard/publish-success'
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
  } | null
}>

export default function PublishWizard({ editDataset }: PageProps) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dr-theme') || 'light'
    }
    return 'light'
  })
  const [step, setStep] = useState(0)
  const [maxReached, setMaxReached] = useState(editDataset ? 4 : 0) // allow jumping to review step if editing!
  const [published, setPublished] = useState(false)
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
    tags: editDataset ? editDataset.tags : ['clima', 'séries temporais'],
    schema: CSV_COLUMNS.map((c) => ({ ...c })),
    license: editDataset ? editDataset.license : 'ccby',
    visibility: editDataset ? editDataset.visibility : 'public',
    confirm: false,
    rowCount: 0,
    colCount: 0,
    qaChecks: [] as any[],
    usabilityScore: editDataset ? Number(editDataset.usabilityScore) : 0,
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('dr-theme', theme)
  }, [theme])

  const setPatch = (patch: any) => setData((d) => ({ ...d, ...patch }))

  const goto = (n: number) => {
    const clamped = Math.max(0, Math.min(4, n))
    setStep(clamped)
    setMaxReached((m) => Math.max(m, clamped))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const canNext = (() => {
    if (step === 0) return data.uploaded
    if (step === 1) return data.title.trim() && data.desc.trim()
    if (step === 4) return data.confirm
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
    const isEditing = !!editDataset
    const hasActiveFile = data.file || (isEditing && data.uploaded)

    if (data.uploaded && hasActiveFile && data.title.trim().length >= 3) {
      let licenseId: number | null = 1
      if (data.license === 'ccbysa') licenseId = 2
      else if (data.license === 'ccbync') licenseId = 3
      else if (data.license === 'odbl') licenseId = 4
      else if (data.license === 'cc0') licenseId = 5
      else if (data.license === 'custom') licenseId = null

      const formData = new FormData()
      if (isEditing) {
        formData.append('id', String(editDataset.id))
      }
      formData.append('name', data.title)
      formData.append('version', 'V1')
      formData.append('description', data.desc || '')
      formData.append('isPublic', 'false')
      formData.append('status', 'draft')
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

      router.post('/datasets', formData, {
        onSuccess: () => {
          router.visit('/dashboard')
        },
        onError: (errs) => {
          console.error('Draft save errors:', errs)
          router.visit('/dashboard')
        }
      })
    } else {
      router.visit('/dashboard')
    }
  }

  const handlePublishSubmit = () => {
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

    router.post('/datasets', formData, {
      onSuccess: () => {
        setPublished(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      },
      onError: (errs) => {
        console.error('Publish errors:', errs)
        alert('Erro ao publicar dataset. Por favor, verifique os campos obrigatórios.')
      }
    })
  }

  if (published) {
    return (
      <div className="dr-app dr-panel-wrap">
        <SimplePageHead onExit={handleExit} />
        <div className="dr-container">
          <div className="dr-wizard">
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              <PublishSuccess data={data} onDashboard={handleExit} />
            </div>
          </div>
        </div>
        <PanelFooter />
      </div>
    )
  }

  return (
    <div className="dr-app dr-panel-wrap">
      <PanelNav
        theme={theme}
        onToggleTheme={handleToggleTheme}
        active=""
        hidePublishButton={true}
      />
      <SimplePageHead onExit={handleExit} />
      <div className="dr-container">
        <div className="dr-wizard">
          <div className="dr-wizard-grid">
            <WizardStepper step={step} onJump={goto} maxReached={maxReached} />
            <div className="dr-wpanel">
              <div className="dr-wpanel-head">
                <h2 style={{ margin: 0 }}>{heads[step].h}</h2>
                <p style={{ margin: '7px 0 0' }}>{heads[step].p}</p>
              </div>
              <div className="dr-wpanel-body">
                {step === 0 && <StepArquivo data={data} set={setPatch} />}
                {step === 1 && <StepMetadados data={data} set={setPatch} />}
                {step === 2 && <StepEsquema data={data} set={setPatch} />}
                {step === 3 && <StepLicenca data={data} set={setPatch} />}
                {step === 4 && <StepRevisao data={data} set={setPatch} onJump={goto} />}
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
                <span className="save-note">
                  <Ic.Check size={14} style={{ display: 'inline', marginRight: 4 }} /> Rascunho
                  salvo automaticamente
                </span>
                <div className="dr-foot-right">
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
                      onClick={handlePublishSubmit}
                      style={!canNext ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                    >
                      <Ic.Send size={18} style={{ display: 'inline', marginRight: 6 }} /> Publicar
                      dataset
                    </button>
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

function SimplePageHead({ onExit }: { onExit: () => void }) {
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
              <span>Publicar</span>
            </div>
            <h1 style={{ margin: 0 }}>Publicar dataset</h1>
            <p className="page-sub">
              Em 5 etapas seu conjunto fica documentado, versionado e pronto para a comunidade.
            </p>
          </div>
          <div className="dr-page-head-actions">
            <button className="dr-btn dr-btn-outline dr-btn-lg" onClick={onExit}>
              <Ic.X size={18} /> Sair do envio
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
