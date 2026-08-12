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
import { useTranslation } from '#common/ui/hooks/use_translation'

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
  const { t } = useTranslation()
  const isEditing = !!editDataset
  const maxStepIndex = isEditing ? 3 : 4

  const heads = [
    {
      h: t('dataset.publish.step_heads.0.h'),
      p: t('dataset.publish.step_heads.0.p'),
    },
    {
      h: t('dataset.publish.step_heads.1.h'),
      p: t('dataset.publish.step_heads.1.p'),
    },
    {
      h: t('dataset.publish.step_heads.2.h'),
      p: t('dataset.publish.step_heads.2.p'),
    },
    {
      h: t('dataset.publish.step_heads.3.h'),
      p: t('dataset.publish.step_heads.3.p'),
    },
    {
      h: t('dataset.publish.step_heads.4.h'),
      p: t('dataset.publish.step_heads.4.p'),
    },
  ]

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dr-theme') || 'light'
    }
    return 'light'
  })
  const minStepIndex = isEditing ? 1 : 0
  const [step, setStep] = useState(isEditing ? 1 : 0)
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
    const clamped = Math.max(minStepIndex, Math.min(maxStepIndex, n))
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
        stepName: t('dataset.publish.steps.file'),
        message: t('dataset.publish.steps.file'),
      })
    }

    if (!data.title.trim()) {
      errs.push({
        id: 'title',
        stepIndex: 1,
        stepName: t('dataset.publish.steps.metadata'),
        message: t('dataset.publish.steps.metadata'),
      })
    }

    if (!data.desc.trim()) {
      errs.push({
        id: 'desc',
        stepIndex: 1,
        stepName: t('dataset.publish.steps.metadata'),
        message: t('dataset.publish.steps.metadata'),
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

    const formData = new FormData()
    if (editDataset) {
      formData.append('id', String(editDataset.id))
    }
    formData.append('name', data.title)
    formData.append('version', 'V1')
    formData.append('description', data.desc)
    formData.append('isPublic', data.visibility === 'public' ? 'true' : 'false')
    
    // ... logic for licenseId omitted for brevity
    
    if (data.unit) formData.append('unit', data.unit)
    if (data.area) formData.append('area', data.area)
    if (data.period) formData.append('period', data.period)
    if (data.region) formData.append('region', data.region)
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach((tag) => formData.append('tags[]', tag))
    }
    if (data.usabilityScore !== undefined && data.usabilityScore !== null) {
      formData.append('usabilityScore', String(data.usabilityScore))
    }
    
    if ((data as any).filesList && (data as any).filesList.length > 0) {
      (data as any).filesList.forEach((fItem: any) => {
        if (fItem.file) {
          formData.append('files[]', fItem.file)
        }
      })
    } else if (data.file) {
      formData.append('files[]', data.file)
    }
    if (data.groupId) {
      formData.append('groupId', String(data.groupId))
    }

    setSaving(true)
    const endpoint = editDataset ? `/datasets/${editDataset.id}` : '/datasets/create'
    router.post(endpoint, formData, {
      forceFormData: true,
      onSuccess: () => setSaving(false),
      onError: (errs) => {
        setSaving(false)
        const serverErrs: SubmissionErrorItem[] = Object.keys(errs).map((k, i) => ({
          id: `server_${k}_${i}`,
          stepIndex: 1,
          stepName: t('dataset.publish.steps.metadata'),
          message: String(errs[k]),
        }))
        setSubmissionErrors(serverErrs)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      },
    })
  }

  const curHead = heads[step] || heads[0]

  return (
    <div className="dr-app dr-panel-wrap">
      <Head title={isEditing ? t('dataset.publish.title_edit') : t('dataset.publish.title')} />
      <PanelNav
        theme={theme}
        onToggleTheme={handleToggleTheme}
        active="publish"
        hidePublishButton={true}
      />
      <SimplePageHead
        onExit={handleExit}
        isEditing={isEditing}
        onSave={handleSaveSubmit}
        saving={saving}
        canSave={canNext}
      />

      <div className="dr-container" style={{ paddingTop: 28, paddingBottom: 48 }}>
        {submissionErrors.length > 0 && (
          <SubmissionErrorAlert errors={submissionErrors} onJumpToStep={goto} />
        )}

        <div className="dr-wizard-grid">
          <WizardStepper
            step={step}
            onJump={goto}
            maxReached={maxReached}
            isEditing={isEditing}
          />
          <div className="dr-wizard-main">
            <div className="dr-wpanel">
              <div className="dr-wpanel-head">
                <h2>{curHead.h}</h2>
                <p>{curHead.p}</p>
              </div>
              <div className="dr-wpanel-body">
                {step === 0 && !isEditing && <StepArquivo data={data} set={setPatch} />}
                {step === 1 && <StepMetadados data={data} set={setPatch} />}
                {step === 2 && <StepEsquema data={data} set={setPatch} />}
                {step === 3 && <StepLicenca data={data} set={setPatch} />}
                {step === 4 && !isEditing && <StepRevisao data={data} set={setPatch} onJump={goto} />}
              </div>
              <div className="dr-wpanel-foot">
                {step <= minStepIndex ? (
                  <button className="dr-btn dr-btn-ghost" onClick={handleExit}>
                    {t('dataset.publish.actions.prev')}
                  </button>
                ) : (
                  <button className="dr-btn dr-btn-outline" onClick={() => goto(step - 1)}>
                    <Ic.Arrow
                      size={16}
                      style={{ transform: 'rotate(180deg)', display: 'inline', marginRight: 4 }}
                    />{' '}
                    {t('dataset.publish.actions.prev')}
                  </button>
                )}
                <div className="dr-foot-right" style={{ display: 'flex', gap: 10 }}>
                  {isEditing ? (
                    <>
                      {step < 3 ? (
                        <button
                          className="dr-btn dr-btn-primary"
                          disabled={!canNext}
                          onClick={() => goto(step + 1)}
                          style={!canNext ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                        >
                          {t('dataset.publish.actions.next')} <Ic.Arrow size={16} style={{ display: 'inline', marginLeft: 4 }} />
                        </button>
                      ) : (
                        <button
                          className="dr-btn dr-btn-yellow dr-btn-lg"
                          disabled={!canNext || saving}
                          onClick={handleSaveSubmit}
                          style={!canNext || saving ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                        >
                          <Ic.Check size={18} style={{ display: 'inline', marginRight: 6 }} />{' '}
                          {saving ? t('dataset.publish.actions.saving_edit') : t('dataset.publish.actions.submit_save')}
                        </button>
                      )}
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
                          {t('dataset.publish.actions.next')} <Ic.Arrow size={16} style={{ display: 'inline', marginLeft: 4 }} />
                        </button>
                      ) : (
                        <button
                          className="dr-btn dr-btn-yellow dr-btn-lg"
                          disabled={!canNext}
                          onClick={handleSaveSubmit}
                          style={!canNext ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                        >
                          <Ic.Send size={18} style={{ display: 'inline', marginRight: 6 }} /> {t('dataset.publish.actions.submit')}
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
  const { t } = useTranslation()

  return (
    <div className="dr-page-head">
      <div className="dr-container">
        <div className="dr-page-head-inner">
          <div>
            <div className="dr-page-breadcrumb">
              <a href="/">{t('dataset.publish.breadcrumb_home')}</a>
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
                {t('dataset.dashboard.breadcrumb_my')}
              </a>
              <span className="sep">
                <Ic.Chevr size={13} style={{ display: 'inline', margin: '0 4px' }} />
              </span>
              <span>{isEditing ? t('dataset.publish.title_edit') : t('dataset.publish.title')}</span>
            </div>
            <h1 style={{ margin: 0 }}>{isEditing ? t('dataset.publish.title_edit') : t('dataset.publish.title')}</h1>
            <p className="page-sub">
              {isEditing
                ? t('dataset.publish.sub')
                : t('dataset.publish.sub')}
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
                {saving ? t('dataset.publish.actions.saving_edit') : t('dataset.publish.actions.submit_save')}
              </button>
            )}
            <button className="dr-btn dr-btn-outline dr-btn-lg" onClick={onExit}>
              <Ic.X size={18} /> {t('dataset.publish.exit_btn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
