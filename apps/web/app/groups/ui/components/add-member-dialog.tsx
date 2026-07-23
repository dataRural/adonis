import { useState } from 'react'
import { router } from '@inertiajs/react'
import * as Ic from '#common/ui/components/datarural/icons'

interface AddMemberDialogProps {
  groupId: number
  open: boolean
  onClose: () => void
}

const ROLE_OPTIONS = [
  { value: 'viewer', label: 'Visualizador', desc: 'Pode ver datasets do grupo' },
  { value: 'editor', label: 'Editor', desc: 'Pode adicionar e editar datasets' },
  { value: 'admin', label: 'Admin', desc: 'Pode gerenciar membros e datasets' },
]

export default function AddMemberDialog({ groupId, open, onClose }: AddMemberDialogProps) {
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState('viewer')
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId.trim()) return

    setLoading(true)
    router.post(
      `/groups/${groupId}/members`,
      { userId: Number(userId), role },
      {
        onSuccess: () => {
          setUserId('')
          setRole('viewer')
          setLoading(false)
          onClose()
        },
        onError: () => {
          setLoading(false)
        },
      }
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          padding: '28px 32px',
          width: '100%',
          maxWidth: 440,
          boxShadow: 'var(--shadow-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>Adicionar membro</h3>
          <button className="dr-btn dr-btn-ghost" onClick={onClose} style={{ padding: 4 }}>
            <Ic.X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              ID do usuário
            </label>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Ex: 42"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'calc(var(--radius) - 2px)',
                border: '1px solid var(--input)',
                background: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: 8 }}>
              Papel no grupo
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ROLE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '10px 14px',
                    borderRadius: 'calc(var(--radius) - 2px)',
                    border: `1.5px solid ${role === opt.value ? 'var(--primary)' : 'var(--border)'}`,
                    background: role === opt.value ? 'color-mix(in srgb, var(--primary) 6%, transparent)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'border-color .15s, background .15s',
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value={opt.value}
                    checked={role === opt.value}
                    onChange={() => setRole(opt.value)}
                    style={{ marginTop: 2 }}
                  />
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600 }}>{opt.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: 2 }}>{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="dr-btn dr-btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="dr-btn dr-btn-primary"
              disabled={!userId.trim() || loading}
              style={!userId.trim() || loading ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
            >
              <Ic.Plus size={16} /> Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
