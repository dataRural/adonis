import { useState, useEffect } from 'react'
import { router, Head } from '@inertiajs/react'
import PanelNav from '#common/ui/components/datarural/navbar-auth'
import PanelFooter from '#common/ui/components/datarural/footer-simple'
import StepArquivo from '../components/dashboard/step-arquivo'
import SubmissionErrorAlert, { SubmissionErrorItem } from '../components/dashboard/submission-error-alert'
import * as Ic from '#common/ui/components/datarural/icons'
import { CSV_COLUMNS } from '../components/dashboard/panel-data'
import { useTranslation } from '#common/ui/hooks/use_translation'

import type { InertiaProps } from '#core/ui/types'

interface VersionItem {
  id: number
  name: string
  createdAt: string | null
}

type PageProps = InertiaProps<{
  dataset: {
    id: number
    name: string
    description?: string
    currentVersion: string
    suggestedVersion: string
  }
  versions: VersionItem[]
}>

export default function NewVersionPage({ dataset, versions }: PageProps) {
  const { t } = useTranslation()
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dr-theme') || 'light'
    }
    return 'light'
  })
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submissionErrors, setSubmissionErrors] = useState<SubmissionErrorItem[]>([])

  const [data, setData] = useState({
    file: null as File | null,
    uploaded: false,
    uploading: false,
    progress: 0,
    fileName: '',
    fileSize: '',
    schema: CSV_COLUMNS.map((c) => ({ ...c })),
    rowCount: 0,
    colCount: 0,
    qaChecks: [] as any[],
    version: dataset.suggestedVersion,
    description: dataset.description || '',
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('dr-theme', theme)
  }, [theme])

  const setPatch = (patch: Partial<typeof data>) => {
    setData((prev) => ({ ...prev, ...patch }))
  }

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handleExit = () => {
    if (confirm(t('dataset.new_version.cancel') + '?')) {
      router.visit(`/datasets/${dataset.id}`)
    }
  }

  const handleSubmit = () => {
    const errs: SubmissionErrorItem[] = []
    if (!data.uploaded) {
      errs.push({
        id: 'no_file',
        stepIndex: 0,
        stepName: t('dataset.new_version.step1_indicator'),
        field: 'file',
        message: 'Por favor, envie o arquivo CSV da nova versão.',
      })
    }
    if (!data.version.trim()) {
      errs.push({
        id: 'no_version',
        stepIndex: 1,
        stepName: t('dataset.new_version.step2_indicator'),
        field: 'version',
        message: 'Informe o identificador da versão (ex: v1.1.0).',
      })
    }

    if (errs.length > 0) {
      setSubmissionErrors(errs)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSubmissionErrors([])
    setSubmitting(true)

    const formData = new FormData()
    if (data.file) {
      formData.append('file', data.file)
    }
    formData.append('version', data.version.trim())
    if (data.description.trim()) {
      formData.append('changelog', data.description.trim())
    }

    router.post(`/datasets/${dataset.id}/versions`, formData, {
      onError: (errsObj) => {
        setSubmitting(false)
        const mapped: SubmissionErrorItem[] = Object.entries(errsObj).map(([field, msg], i) => ({
          id: `backend_${field}_${i}`,
          stepIndex: 1,
          stepName: t('dataset.new_version.step2_indicator'),
          field,
          message: Array.isArray(msg) ? msg.join(', ') : String(msg),
        }))

        if (mapped.length === 0) {
          mapped.push({
            id: 'server_generic',
            message: 'Erro ao enviar nova versão. Verifique o arquivo enviado e as informações fornecidas.',
          })
        }

        setSubmissionErrors(mapped)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      },
    })
  }

  const canGoToStep2 = data.uploaded
  const canSubmit = data.uploaded && data.version.trim().length > 0 && !submitting

  return (
    <div className="dr-app dr-panel-wrap">
      <Head title={`${t('dataset.new_version.title')} — ${dataset.name}`} />
      <PanelNav
        theme={theme}
        onToggleTheme={handleToggleTheme}
        active=""
        hidePublishButton={true}
      />

      {/* Page Header */}
      <div className="dr-page-head">
        <div className="dr-container">
          <div className="dr-page-head-inner">
            <div>
              <div className="dr-page-breadcrumb">
                <a href="/">{t('dataset.new_version.breadcrumb_home')}</a>
                <span className="sep">
                  <Ic.Chevr size={13} style={{ display: 'inline', margin: '0 4px' }} />
                </span>
                <a href={`/datasets/${dataset.id}`}>{dataset.name}</a>
                <span className="sep">
                  <Ic.Chevr size={13} style={{ display: 'inline', margin: '0 4px' }} />
                </span>
                <span>{t('dataset.new_version.breadcrumb_new_version')}</span>
              </div>
              <h1 style={{ margin: 0 }}>{t('dataset.new_version.title')}</h1>
              <p className="page-sub">
                {t('dataset.new_version.page_sub', { version: data.version || dataset.suggestedVersion })} <strong>{dataset.name}</strong>.
              </p>
            </div>
            <div className="dr-page-head-actions">
              <button className="dr-btn dr-btn-outline dr-btn-lg" onClick={handleExit}>
                <Ic.X size={18} /> {t('dataset.new_version.cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dr-container">
        <div className="dr-wizard">
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <SubmissionErrorAlert
              errors={submissionErrors}
              onDismiss={() => setSubmissionErrors([])}
              onJumpToStep={(s) => setStep(s)}
            />

            {/* Step Indicators */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
              <button
                onClick={() => setStep(0)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: step === 0 ? 700 : 500,
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: step === 0 ? 'color-mix(in srgb, var(--brand-green) 12%, transparent)' : 'var(--card)',
                  color: step === 0 ? 'var(--brand-green)' : 'var(--muted-foreground)',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700,
                  background: step === 0 ? 'var(--brand-green)' : 'var(--muted)',
                  color: step === 0 ? '#fff' : 'var(--muted-foreground)',
                }}>
                  {data.uploaded ? <Ic.Check size={14} /> : '1'}
                </span>
                {t('dataset.new_version.step1_indicator')}
              </button>
              <button
                onClick={() => canGoToStep2 && setStep(1)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  cursor: canGoToStep2 ? 'pointer' : 'not-allowed',
                  fontWeight: step === 1 ? 700 : 500,
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  opacity: canGoToStep2 ? 1 : 0.5,
                  background: step === 1 ? 'color-mix(in srgb, var(--brand-green) 12%, transparent)' : 'var(--card)',
                  color: step === 1 ? 'var(--brand-green)' : 'var(--muted-foreground)',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700,
                  background: step === 1 ? 'var(--brand-green)' : 'var(--muted)',
                  color: step === 1 ? '#fff' : 'var(--muted-foreground)',
                }}>
                  2
                </span>
                {t('dataset.new_version.step2_indicator')}
              </button>
            </div>

            {/* Step Content */}
            <div className="dr-wpanel">
              {step === 0 && (
                <>
                  <div className="dr-wpanel-head">
                    <h2 style={{ margin: 0 }}>{t('dataset.new_version.step1_title')}</h2>
                    <p style={{ margin: '7px 0 0' }}>{t('dataset.new_version.step1_desc')}</p>
                  </div>
                  <div className="dr-wpanel-body">
                    <StepArquivo data={data} set={setPatch} />
                  </div>
                  <div className="dr-wpanel-foot">
                    <button className="dr-btn dr-btn-ghost" onClick={handleExit}>
                      {t('dataset.new_version.cancel')}
                    </button>
                    <div className="dr-foot-right">
                      <button
                        className="dr-btn dr-btn-primary"
                        disabled={!canGoToStep2}
                        onClick={() => setStep(1)}
                        style={!canGoToStep2 ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                      >
                        {t('dataset.new_version.continue')} <Ic.Arrow size={16} style={{ display: 'inline', marginLeft: 4 }} />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="dr-wpanel-head">
                    <h2 style={{ margin: 0 }}>{t('dataset.new_version.step2_title')}</h2>
                    <p style={{ margin: '7px 0 0' }}>{t('dataset.new_version.step2_desc')}</p>
                  </div>
                  <div className="dr-wpanel-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                      {/* Version Name */}
                      <div>
                        <label
                          htmlFor="versionName"
                          style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--foreground)' }}
                        >
                          {t('dataset.new_version.version_name_label')}
                        </label>
                        <input
                          id="versionName"
                          type="text"
                          className="dr-input"
                          value={data.version}
                          onChange={(e) => setPatch({ version: e.target.value })}
                          placeholder={dataset.suggestedVersion}
                          style={{ width: '100%', maxWidth: 240 }}
                        />
                        <p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 6 }}>
                          {t('dataset.new_version.version_change', { current: dataset.currentVersion, next: data.version || dataset.suggestedVersion })}
                        </p>
                      </div>

                      {/* Description */}
                      <div>
                        <label
                          htmlFor="versionDesc"
                          style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--foreground)' }}
                        >
                          {t('dataset.new_version.version_notes_label')}
                        </label>
                        <textarea
                          id="versionDesc"
                          className="dr-input"
                          value={data.description}
                          onChange={(e) => setPatch({ description: e.target.value })}
                          placeholder={t('dataset.new_version.version_notes_placeholder')}
                          rows={4}
                          style={{ width: '100%', resize: 'vertical' }}
                        />
                      </div>

                      {/* File Summary */}
                      <div className="dr-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                          background: 'color-mix(in srgb, var(--brand-green) 12%, transparent)',
                          color: 'var(--brand-green)',
                          padding: 10,
                          borderRadius: 'var(--radius)',
                        }}>
                          <Ic.File size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{data.fileName}</div>
                          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>
                            {t('dataset.new_version.cols_rows', { size: data.fileSize, cols: data.colCount, rows: data.rowCount })}
                          </div>
                        </div>
                      </div>

                      {/* Existing Versions */}
                      {versions.length > 0 && (
                        <div>
                          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--foreground)' }}>
                            {t('dataset.new_version.existing_versions')}
                          </label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {versions.map((v) => (
                              <div
                                key={v.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10,
                                  padding: '8px 12px',
                                  borderRadius: 'var(--radius)',
                                  background: 'var(--muted)',
                                  fontSize: 13,
                                }}
                              >
                                <Ic.Branch size={14} style={{ color: 'var(--muted-foreground)' }} />
                                <span style={{ fontWeight: 600 }}>{v.name}</span>
                                {v.createdAt && (
                                  <span style={{ color: 'var(--muted-foreground)', marginLeft: 'auto' }}>
                                    {new Date(v.createdAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="dr-wpanel-foot">
                    <button className="dr-btn dr-btn-outline" onClick={() => setStep(0)}>
                      <Ic.Arrow size={16} style={{ transform: 'rotate(180deg)', display: 'inline', marginRight: 4 }} /> {t('dataset.new_version.back')}
                    </button>
                    <div className="dr-foot-right">
                      <button
                        className="dr-btn dr-btn-yellow dr-btn-lg"
                        disabled={!canSubmit}
                        onClick={handleSubmit}
                        style={!canSubmit ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                      >
                        {submitting ? (
                          <>{t('dataset.new_version.publishing')}</>
                        ) : (
                          <>
                            <Ic.Send size={18} style={{ display: 'inline', marginRight: 6 }} /> {t('dataset.new_version.publish_btn', { version: data.version })}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <PanelFooter />
    </div>
  )
}
