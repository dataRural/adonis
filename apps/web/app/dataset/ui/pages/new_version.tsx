import { useState, useEffect } from 'react'
import { router, Head } from '@inertiajs/react'
import PanelNav from '#common/ui/components/datarural/navbar-auth'
import PanelFooter from '#common/ui/components/datarural/footer-simple'
import StepArquivo from '../components/dashboard/step-arquivo'
import * as Ic from '#common/ui/components/datarural/icons'
import { CSV_COLUMNS } from '../components/dashboard/panel-data'

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
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dr-theme') || 'light'
    }
    return 'light'
  })
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
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

  const setPatch = (patch: any) => setData((d) => ({ ...d, ...patch }))

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handleExit = () => {
    router.visit(`/datasets/${dataset.id}`)
  }

  const handleSubmit = () => {
    if (!data.file || !data.version.trim()) return
    setSubmitting(true)

    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('version', data.version.trim())
    if (data.description.trim()) {
      formData.append('description', data.description.trim())
    }
    if ((data as any).usabilityScore !== undefined && (data as any).usabilityScore !== null) {
      formData.append('usabilityScore', String((data as any).usabilityScore))
    }

    router.post(`/datasets/${dataset.id}/version`, formData, {
      onSuccess: () => {
        router.visit(`/datasets/${dataset.id}`)
      },
      onError: (errs) => {
        console.error('Version upload errors:', errs)
        setSubmitting(false)
        alert('Erro ao enviar nova versão. Verifique o arquivo e tente novamente.')
      },
    })
  }

  const canGoToStep2 = data.uploaded
  const canSubmit = data.uploaded && data.version.trim().length > 0 && !submitting

  return (
    <div className="dr-app dr-panel-wrap">
      <Head title={`Nova versão — ${dataset.name}`} />
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
                <a href="/">Início</a>
                <span className="sep">
                  <Ic.Chevr size={13} style={{ display: 'inline', margin: '0 4px' }} />
                </span>
                <a href={`/datasets/${dataset.id}`}>{dataset.name}</a>
                <span className="sep">
                  <Ic.Chevr size={13} style={{ display: 'inline', margin: '0 4px' }} />
                </span>
                <span>Nova versão</span>
              </div>
              <h1 style={{ margin: 0 }}>Nova versão</h1>
              <p className="page-sub">
                Envie um novo arquivo CSV para criar a versão {data.version || dataset.suggestedVersion} do dataset <strong>{dataset.name}</strong>.
              </p>
            </div>
            <div className="dr-page-head-actions">
              <button className="dr-btn dr-btn-outline dr-btn-lg" onClick={handleExit}>
                <Ic.X size={18} /> Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dr-container">
        <div className="dr-wizard">
          <div style={{ maxWidth: 860, margin: '0 auto' }}>

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
                Enviar arquivo
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
                Detalhes e publicar
              </button>
            </div>

            {/* Step Content */}
            <div className="dr-wpanel">
              {step === 0 && (
                <>
                  <div className="dr-wpanel-head">
                    <h2 style={{ margin: 0 }}>Envie o novo arquivo CSV</h2>
                    <p style={{ margin: '7px 0 0' }}>Faça o upload do conjunto de dados atualizado. Detectamos colunas, tipos e qualidade automaticamente.</p>
                  </div>
                  <div className="dr-wpanel-body">
                    <StepArquivo data={data} set={setPatch} />
                  </div>
                  <div className="dr-wpanel-foot">
                    <button className="dr-btn dr-btn-ghost" onClick={handleExit}>
                      Cancelar
                    </button>
                    <div className="dr-foot-right">
                      <button
                        className="dr-btn dr-btn-primary"
                        disabled={!canGoToStep2}
                        onClick={() => setStep(1)}
                        style={!canGoToStep2 ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                      >
                        Continuar <Ic.Arrow size={16} style={{ display: 'inline', marginLeft: 4 }} />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="dr-wpanel-head">
                    <h2 style={{ margin: 0 }}>Detalhes da versão</h2>
                    <p style={{ margin: '7px 0 0' }}>Defina o nome da versão e adicione notas sobre as alterações.</p>
                  </div>
                  <div className="dr-wpanel-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                      {/* Version Name */}
                      <div>
                        <label
                          htmlFor="versionName"
                          style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--foreground)' }}
                        >
                          Nome da versão
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
                          Versão atual: <strong>{dataset.currentVersion}</strong> → Nova: <strong>{data.version || dataset.suggestedVersion}</strong>
                        </p>
                      </div>

                      {/* Description */}
                      <div>
                        <label
                          htmlFor="versionDesc"
                          style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--foreground)' }}
                        >
                          Notas da versão <span style={{ fontWeight: 400, color: 'var(--muted-foreground)' }}>(opcional)</span>
                        </label>
                        <textarea
                          id="versionDesc"
                          className="dr-input"
                          value={data.description}
                          onChange={(e) => setPatch({ description: e.target.value })}
                          placeholder="Descreva as alterações feitas nesta versão..."
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
                            {data.fileSize} • {data.colCount} colunas • {data.rowCount} linhas
                          </div>
                        </div>
                        <button
                          className="dr-btn dr-btn-ghost"
                          onClick={() => {
                            setPatch({
                              file: null,
                              uploaded: false,
                              uploading: false,
                              progress: 0,
                              fileName: '',
                              fileSize: '',
                              rowCount: 0,
                              colCount: 0,
                              qaChecks: [],
                              schema: CSV_COLUMNS.map((c) => ({ ...c })),
                            })
                            setStep(0)
                          }}
                          style={{ fontSize: 13 }}
                        >
                          <Ic.X size={14} /> Trocar arquivo
                        </button>
                      </div>

                      {/* Existing Versions */}
                      {versions.length > 0 && (
                        <div>
                          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--foreground)' }}>
                            Versões existentes
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
                                    {new Date(v.createdAt).toLocaleDateString('pt-BR')}
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
                      <Ic.Arrow size={16} style={{ transform: 'rotate(180deg)', display: 'inline', marginRight: 4 }} /> Voltar
                    </button>
                    <div className="dr-foot-right">
                      <button
                        className="dr-btn dr-btn-yellow dr-btn-lg"
                        disabled={!canSubmit}
                        onClick={handleSubmit}
                        style={!canSubmit ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                      >
                        {submitting ? (
                          <>Enviando...</>
                        ) : (
                          <>
                            <Ic.Send size={18} style={{ display: 'inline', marginRight: 6 }} /> Publicar versão {data.version}
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
