import { useState, useEffect, useRef } from 'react'
import { router } from '@inertiajs/react'
import * as Ic from '#common/ui/components/datarural/icons'

interface AddMemberDialogProps {
  groupId: number
  open: boolean
  onClose: () => void
}

interface UserSearchResult {
  id: number
  fullName: string
  username: string
  email: string
  avatarUrl: string | null
}

const ROLE_OPTIONS = [
  { value: 'viewer', label: 'Visualizador', desc: 'Pode ver datasets do grupo' },
  { value: 'editor', label: 'Editor', desc: 'Pode adicionar e editar datasets' },
  { value: 'admin', label: 'Admin', desc: 'Pode gerenciar membros e datasets' },
]

export default function AddMemberDialog({ groupId, open, onClose }: AddMemberDialogProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserSearchResult[]>([])
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null)
  const [searching, setSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [role, setRole] = useState('viewer')
  const [submitting, setSubmitting] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2 || selectedUser) {
      setResults([])
      setSearching(false)
      setShowDropdown(false)
      return
    }

    setSearching(true)
    const timer = setTimeout(() => {
      fetch(`/api/users/search?q=${encodeURIComponent(query.trim())}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(Array.isArray(data) ? data : [])
          setSearching(false)
          setShowDropdown(true)
        })
        .catch(() => {
          setResults([])
          setSearching(false)
        })
    }, 250)

    return () => clearTimeout(timer)
  }, [query, selectedUser])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!open) return null

  const handleSelectUser = (u: UserSearchResult) => {
    setSelectedUser(u)
    setQuery(u.username)
    setShowDropdown(false)
  }

  const handleClearSelected = () => {
    setSelectedUser(null)
    setQuery('')
    setResults([])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const targetHandle = selectedUser?.username || query.trim()
    if (!targetHandle) return

    setSubmitting(true)
    router.post(
      `/groups/${groupId}/members`,
      { username: targetHandle, role },
      {
        onSuccess: () => {
          setSelectedUser(null)
          setQuery('')
          setResults([])
          setRole('viewer')
          setSubmitting(false)
          onClose()
        },
        onError: () => {
          setSubmitting(false)
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
          maxWidth: 460,
          boxShadow: 'var(--shadow-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>Adicionar membro ao grupo</h3>
          <button className="dr-btn dr-btn-ghost" onClick={onClose} style={{ padding: 4 }}>
            <Ic.X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* User Search Input or Selected User Card */}
          <div style={{ marginBottom: 18, position: 'relative' }} ref={dropdownRef}>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Buscar usuário por nome, @username ou e-mail
            </label>

            {selectedUser ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 'calc(var(--radius) - 2px)',
                  border: '1.5px solid var(--brand-green)',
                  background: 'color-mix(in srgb, var(--brand-green) 8%, transparent)',
                }}
              >
                {selectedUser.avatarUrl ? (
                  <img
                    src={selectedUser.avatarUrl}
                    alt={selectedUser.fullName}
                    style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'var(--brand-green)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {selectedUser.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>{selectedUser.fullName}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>
                    @{selectedUser.username} · {selectedUser.email}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearSelected}
                  className="dr-btn dr-btn-ghost"
                  style={{ padding: 4, borderRadius: '50%' }}
                  title="Trocar usuário"
                >
                  <Ic.X size={16} />
                </button>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <Ic.Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--muted-foreground)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => {
                    if (results.length > 0) setShowDropdown(true)
                  }}
                  placeholder="Ex: @rafael, Helena ou rafael@ufrrj.br"
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 36px',
                    borderRadius: 'calc(var(--radius) - 2px)',
                    border: '1px solid var(--input)',
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                {searching && (
                  <span
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: 12,
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    Buscando…
                  </span>
                )}
              </div>
            )}

            {/* Dropdown search results */}
            {showDropdown && !selectedUser && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: 4,
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'var(--shadow-lg)',
                  maxHeight: 220,
                  overflowY: 'auto',
                  zIndex: 20,
                }}
              >
                {results.length > 0 ? (
                  results.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => handleSelectUser(u)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 14px',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--border)',
                        transition: 'background .15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'color-mix(in srgb, var(--primary) 8%, transparent)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      {u.avatarUrl ? (
                        <img
                          src={u.avatarUrl}
                          alt={u.fullName}
                          style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 13,
                          }}
                        >
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{u.fullName}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
                          @{u.username} · {u.email}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '14px', fontSize: 13, color: 'var(--muted-foreground)', textAlign: 'center' }}>
                    Nenhum usuário encontrado.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Role selection */}
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
              disabled={(!selectedUser && !query.trim()) || submitting}
              style={(!selectedUser && !query.trim()) || submitting ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
            >
              <Ic.Plus size={16} /> Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
