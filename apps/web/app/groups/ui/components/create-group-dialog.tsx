import { useState } from 'react'
import { router } from '@inertiajs/react'
import * as Ic from '#common/ui/components/datarural/icons'

interface CreateGroupDialogProps {
  open: boolean
  onClose: () => void
}

export default function CreateGroupDialog({ open, onClose }: CreateGroupDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    router.post(
      '/groups',
      { name: name.trim(), description: description.trim() || undefined },
      {
        onSuccess: () => {
          setName('')
          setDescription('')
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
          maxWidth: 480,
          boxShadow: 'var(--shadow-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>
            <Ic.Users size={20} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
            Criar grupo
          </h3>
          <button className="dr-btn dr-btn-ghost" onClick={onClose} style={{ padding: 4 }}>
            <Ic.X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Nome do grupo *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Laboratório de Climatologia"
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
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descrição do propósito do grupo (opcional)"
              rows={3}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'calc(var(--radius) - 2px)',
                border: '1px solid var(--input)',
                background: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="dr-btn dr-btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="dr-btn dr-btn-primary"
              disabled={!name.trim() || loading}
              style={!name.trim() || loading ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
            >
              <Ic.Plus size={16} /> Criar grupo
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
