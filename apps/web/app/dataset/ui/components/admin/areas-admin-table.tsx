import { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import * as Ic from '#common/ui/components/datarural/icons'
import { getCookie } from '#common/ui/utils/cookie_helper'

export interface AreaAdminItem {
  id: number
  code: string
  name: string
  icon: string
  color: string
  description: string | null
  datasetCount: number
}

const AVAILABLE_ICONS = [
  { id: 'sprout', label: 'Brotos (Agronomia)' },
  { id: 'paw', label: 'Patas (Veterinária)' },
  { id: 'cloud', label: 'Nuvem (Clima)' },
  { id: 'leaf', label: 'Folha (Biologia)' },
  { id: 'tree', label: 'Árvore (Florestas)' },
  { id: 'chart', label: 'Gráfico (Exatas/Econ)' },
  { id: 'flask', label: 'Frasco (Química)' },
  { id: 'database', label: 'Banco de Dados (Zootec)' },
  { id: 'users', label: 'Pessoas (Sociais)' },
  { id: 'book', label: 'Livro' },
  { id: 'globe', label: 'Globo' },
  { id: 'sun', label: 'Sol' },
  { id: 'layers', label: 'Camadas' },
]

const COLOR_SWATCHES = [
  { name: 'Verde Rural', value: 'var(--brand-green)', hex: '#059669' },
  { name: 'Laranja', value: 'var(--brand-orange)', hex: '#ea580c' },
  { name: 'Céu (Azul Claro)', value: 'var(--brand-sky)', hex: '#0284c7' },
  { name: 'Folha Verde', value: 'var(--brand-lightgreen)', hex: '#16a34a' },
  { name: 'Teal (Verde Água)', value: 'var(--brand-teal)', hex: '#0d9488' },
  { name: 'Azul', value: 'var(--brand-blue)', hex: '#2563eb' },
  { name: 'Roxo (Química)', value: 'var(--brand-purple)', hex: '#7c3aed' },
  { name: 'Âmbar (Zootecnia)', value: 'var(--brand-amber)', hex: '#d97706' },
  { name: 'Rosa (Sociais)', value: 'var(--brand-rose)', hex: '#e11d48' },
  { name: 'Índigo', value: 'var(--brand-indigo)', hex: '#4f46e5' },
]

export default function AreasAdminTable() {
  const page = usePage()
  const [areas, setAreas] = useState<AreaAdminItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const [editingArea, setEditingArea] = useState<AreaAdminItem | null>(null)
  const [deletingArea, setDeletingArea] = useState<AreaAdminItem | null>(null)

  const getCsrfToken = () => {
    const fromProps = (page.props as any)?.csrf || (page.props as any)?.csrfToken
    if (fromProps) return fromProps
    return getCookie('XSRF-TOKEN') || getCookie('X-CSRF-TOKEN') || ''
  }

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    icon: 'sprout',
    color: 'var(--brand-green)',
    customHex: '#059669',
    description: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAreas = async () => {
    setLoading(true)
    try {
      const res = await fetch('/admin/areas')
      if (res.ok) {
        const data = await res.json()
        setAreas(data || [])
      }
    } catch (e) {
      console.error('Erro ao buscar áreas:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAreas()
  }, [])

  const handleOpenCreate = () => {
    setEditingArea(null)
    setFormData({
      name: '',
      code: '',
      icon: 'sprout',
      color: 'var(--brand-green)',
      customHex: '#059669',
      description: '',
    })
    setError(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (area: AreaAdminItem) => {
    setEditingArea(area)
    setFormData({
      name: area.name,
      code: area.code,
      icon: area.icon || 'database',
      color: area.color || 'var(--brand-blue)',
      customHex: area.color.startsWith('#') ? area.color : '#2563eb',
      description: area.description || '',
    })
    setError(null)
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('O nome da área é obrigatório.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const url = editingArea ? `/admin/areas/${editingArea.id}` : '/admin/areas'
      const method = editingArea ? 'PUT' : 'POST'
      const token = getCsrfToken()

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        body: JSON.stringify({
          name: formData.name,
          code: formData.code,
          icon: formData.icon,
          color: formData.color,
          description: formData.description,
        }),
      })

      if (res.ok) {
        setModalOpen(false)
        fetchAreas()
      } else {
        const errData = await res.json().catch(() => ({}))
        setError(errData.error || `Erro ${res.status}: não foi possível salvar a área.`)
      }
    } catch (err) {
      console.error(err)
      setError('Erro de conexão ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingArea) return
    setSaving(true)
    try {
      const token = getCsrfToken()
      const res = await fetch(`/admin/areas/${deletingArea.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': token,
        },
      })
      if (res.ok) {
        setDeleteModalOpen(false)
        setDeletingArea(null)
        fetchAreas()
      } else {
        alert('Erro ao excluir área.')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Áreas de Conhecimento Cadastradas</h2>
          <p style={{ fontSize: '13.5px', color: 'var(--muted-foreground)', margin: '4px 0 0' }}>
            Gerencie as categorias de dados disponíveis para os pesquisadores ao publicar e filtrar datasets.
          </p>
        </div>
        <button className="dr-btn dr-btn-primary" onClick={handleOpenCreate}>
          <Ic.Plus size={16} /> Nova Área
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted-foreground)' }}>
          Carregando áreas…
        </div>
      ) : areas.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted-foreground)', background: 'var(--muted)', borderRadius: 'var(--radius)' }}>
          Nenhuma área cadastrada. Clique em "Nova Área" para criar a primeira.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>
                <th style={{ padding: '12px 16px' }}>Ícone / Cor</th>
                <th style={{ padding: '12px 16px' }}>Nome da Área</th>
                <th style={{ padding: '12px 16px' }}>Código (Slug)</th>
                <th style={{ padding: '12px 16px' }}>Descrição</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Datasets</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => {
                const iconKey = area.icon ? area.icon.charAt(0).toUpperCase() + area.icon.slice(1) : 'Database'
                const IconComp = (Ic as any)[iconKey] || Ic.Database

                return (
                  <tr key={area.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            background: area.color,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <IconComp size={18} />
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{area.name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--muted-foreground)', fontFamily: 'monospace', fontSize: '13px' }}>
                      {area.code}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--muted-foreground)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {area.description || '—'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span
                        style={{
                          background: 'var(--muted)',
                          padding: '2px 8px',
                          borderRadius: 12,
                          fontWeight: 600,
                          fontSize: '12px',
                        }}
                      >
                        {area.datasetCount}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 8 }}>
                        <button
                          className="dr-btn dr-btn-outline"
                          style={{ padding: '4px 10px', fontSize: '13px' }}
                          onClick={() => handleOpenEdit(area)}
                        >
                          <Ic.Edit size={14} /> Editar
                        </button>
                        <button
                          className="dr-btn dr-btn-ghost"
                          style={{ padding: '4px 10px', fontSize: '13px', color: '#e11d48' }}
                          onClick={() => {
                            setDeletingArea(area)
                            setDeleteModalOpen(true)
                          }}
                        >
                          <Ic.Trash size={14} /> Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Nova / Editar Área */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            style={{
              background: 'var(--card)',
              color: 'var(--foreground)',
              borderRadius: 'var(--radius)',
              width: '100%',
              maxWidth: 520,
              padding: 24,
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                {editingArea ? 'Editar Área do Conhecimento' : 'Nova Área do Conhecimento'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}>
                <Ic.X size={20} />
              </button>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(225,29,72,0.1)', color: '#e11d48', borderRadius: 8, fontSize: '13px', marginBottom: 16 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="dr-field" style={{ marginBottom: 14 }}>
                <label className="dr-field-label">Nome da área *</label>
                <input
                  type="text"
                  className="dr-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex.: Biotecnologia, Engenharia Agrícola…"
                  required
                />
              </div>

              <div className="dr-field" style={{ marginBottom: 14 }}>
                <label className="dr-field-label">Código identificador (Slug)</label>
                <input
                  type="text"
                  className="dr-input"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ex.: biotec (deixe em branco para gerar automático)"
                  disabled={!!editingArea}
                />
              </div>

              <div className="dr-field" style={{ marginBottom: 14 }}>
                <label className="dr-field-label">Ícone</label>
                <select
                  className="dr-select"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                >
                  {AVAILABLE_ICONS.map((ic) => (
                    <option key={ic.id} value={ic.id}>
                      {ic.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="dr-field" style={{ marginBottom: 14 }}>
                <label className="dr-field-label">Cor / Tema da Área</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 6, marginBottom: 10 }}>
                  {COLOR_SWATCHES.map((swatch) => {
                    const isSelected = formData.color === swatch.value
                    return (
                      <button
                        key={swatch.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: swatch.value })}
                        style={{
                          height: 36,
                          borderRadius: 8,
                          background: swatch.value,
                          border: isSelected ? '3px solid var(--foreground)' : '1px solid rgba(0,0,0,0.1)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                        }}
                        title={swatch.name}
                      >
                        {isSelected && <Ic.Check size={16} />}
                      </button>
                    )
                  })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Ou cor customizada (HEX):</span>
                  <input
                    type="color"
                    value={formData.color.startsWith('#') ? formData.color : formData.customHex}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value, customHex: e.target.value })}
                    style={{ width: 36, height: 30, padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                  />
                  <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{formData.color}</span>
                </div>
              </div>

              <div className="dr-field" style={{ marginBottom: 20 }}>
                <label className="dr-field-label">Descrição (Opcional)</label>
                <textarea
                  className="dr-textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve resumo sobre o conteúdo desta área de conhecimento…"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="dr-btn dr-btn-ghost" onClick={() => setModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="dr-btn dr-btn-primary" disabled={saving}>
                  {saving ? 'Salvando…' : editingArea ? 'Salvar alterações' : 'Criar área'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Excluir Área */}
      {deleteModalOpen && deletingArea && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            style={{
              background: 'var(--card)',
              color: 'var(--foreground)',
              borderRadius: 'var(--radius)',
              width: '100%',
              maxWidth: 440,
              padding: 24,
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border)',
            }}
          >
            <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 700 }}>Excluir Área do Conhecimento</h3>
            <p style={{ fontSize: '14px', color: 'var(--muted-foreground)', margin: '0 0 20px' }}>
              Tem certeza que deseja excluir a área <strong>{deletingArea.name}</strong> ({deletingArea.code})?
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" className="dr-btn dr-btn-ghost" onClick={() => setDeleteModalOpen(false)}>
                Cancelar
              </button>
              <button
                type="button"
                className="dr-btn dr-btn-primary"
                style={{ background: '#e11d48', borderColor: '#e11d48' }}
                onClick={handleDelete}
                disabled={saving}
              >
                {saving ? 'Excluindo…' : 'Sim, excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
