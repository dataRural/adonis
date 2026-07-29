import * as Ic from '#common/ui/components/datarural/icons'

export interface SubmissionErrorItem {
  id: string
  stepIndex?: number
  stepName?: string
  field?: string
  message: string
}

interface SubmissionErrorAlertProps {
  errors: SubmissionErrorItem[]
  onDismiss?: () => void
  onJumpToStep?: (stepIndex: number) => void
}

export default function SubmissionErrorAlert({
  errors,
  onDismiss,
  onJumpToStep,
}: SubmissionErrorAlertProps) {
  if (!errors || errors.length === 0) return null

  return (
    <div
      style={{
        marginBottom: 24,
        padding: '16px 20px',
        borderRadius: 8,
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: 'var(--foreground)',
        animation: 'fadeIn 0.2s ease-in-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#ef4444',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            <Ic.Alert size={18} />
          </div>
          <div>
            <h4
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Não foi possível enviar o dataset ({errors.length}{' '}
              {errors.length === 1 ? 'pendência encontrada' : 'pendências encontradas'})
            </h4>
            <p style={{ margin: '4px 0 12px', fontSize: 13, color: 'var(--muted-foreground)' }}>
              Corrija os itens indicados abaixo antes de concluir a publicação:
            </p>

            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
              {errors.map((err) => (
                <li key={err.id} style={{ marginBottom: 6 }}>
                  <strong style={{ color: 'var(--foreground)' }}>{err.message}</strong>
                  {err.stepIndex !== undefined && onJumpToStep && (
                    <button
                      type="button"
                      onClick={() => onJumpToStep(err.stepIndex!)}
                      style={{
                        marginLeft: 10,
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: 'var(--brand-green)',
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      Ir para {err.stepName || `Passo ${err.stepIndex + 1}`}
                      <Ic.Arrow size={12} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--muted-foreground)',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 4,
            }}
            title="Fechar aviso"
          >
            <Ic.X size={18} />
          </button>
        )}
      </div>
    </div>
  )
}
