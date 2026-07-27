import { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import PanelNav from '#common/ui/components/datarural/navbar-auth'
import PanelFooter from '#common/ui/components/datarural/footer-simple'
import MemberList from '../components/member-list'
import AddMemberDialog from '../components/add-member-dialog'
import * as Ic from '#common/ui/components/datarural/icons'

import type { InertiaProps } from '#core/ui/types'
import type { MemberItem } from '../components/member-list'

interface GroupDatasetItem {
  id: number
  title: string
  unit: string
  status: string
  version: string
  updated: string
  ownerName: string
}

type PageProps = InertiaProps<{
  group: {
    id: number
    name: string
    description: string | null
    ownerName: string
    createdAt: string
  }
  currentUserRole: string | null
  members: MemberItem[]
  datasets: GroupDatasetItem[]
}>

const STATUS_META: Record<string, { label: string; color: string }> = {
  published: { label: 'Publicado', color: 'var(--brand-green)' },
  review: { label: 'Em revisão', color: 'var(--brand-orange)' },
  draft: { label: 'Rascunho', color: 'var(--muted-foreground)' },
  unpublished: { label: 'Privado', color: 'var(--destructive)' },
}

export default function GroupShow({ group, currentUserRole, members = [], datasets = [] }: PageProps) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dr-theme') || 'light'
    }
    return 'light'
  })
  const [tab, setTab] = useState<'members' | 'datasets'>('members')
  const [showAddMember, setShowAddMember] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(group.name)
  const [editDesc, setEditDesc] = useState(group.description || '')

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('dr-theme', theme)
  }, [theme])

  const canManage = currentUserRole === 'owner' || currentUserRole === 'admin'
  const canManageDatasets = canManage || currentUserRole === 'editor'
  const isOwner = currentUserRole === 'owner'

  const handleSaveEdit = () => {
    router.put(`/groups/${group.id}`, { name: editName, description: editDesc || undefined }, {
      onSuccess: () => setEditing(false),
    })
  }

  const handleDelete = () => {
    if (!confirm('Tem certeza que deseja excluir este grupo? Todos os datasets serão desvinculados.')) return
    router.delete(`/groups/${group.id}`)
  }

  const handleRemoveDataset = (datasetId: number) => {
    if (!confirm('Remover este dataset do grupo?')) return
    router.delete(`/groups/${group.id}/datasets/${datasetId}`)
  }

  return (
    <div className="dr-app dr-panel-wrap">
      <PanelNav
        theme={theme}
        onToggleTheme={() => setTheme((p) => (p === 'dark' ? 'light' : 'dark'))}
        active="groups"
        hidePublishButton={true}
      />

      {/* Page header */}
      <div className="dr-page-head">
        <div className="dr-container">
          <div className="dr-page-head-inner">
            <div>
              <div className="dr-page-breadcrumb">
                <a href="/">Início</a>
                <span className="sep">
                  <Ic.Chevr size={13} style={{ display: 'inline', margin: '0 4px' }} />
                </span>
                <a href="/groups">Meus grupos</a>
                <span className="sep">
                  <Ic.Chevr size={13} style={{ display: 'inline', margin: '0 4px' }} />
                </span>
                <span>{group.name}</span>
              </div>

              {editing ? (
                <div style={{ marginTop: 8 }}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      padding: '6px 12px',
                      border: '1px solid var(--input)',
                      borderRadius: 'calc(var(--radius) - 2px)',
                      background: 'var(--background)',
                      color: 'var(--foreground)',
                      width: '100%',
                      maxWidth: 500,
                      outline: 'none',
                    }}
                  />
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Descrição do grupo (opcional)"
                    rows={2}
                    style={{
                      display: 'block',
                      marginTop: 8,
                      padding: '8px 12px',
                      border: '1px solid var(--input)',
                      borderRadius: 'calc(var(--radius) - 2px)',
                      background: 'var(--background)',
                      color: 'var(--foreground)',
                      fontSize: '14px',
                      width: '100%',
                      maxWidth: 500,
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button className="dr-btn dr-btn-primary" onClick={handleSaveEdit}>
                      <Ic.Check size={16} /> Salvar
                    </button>
                    <button className="dr-btn dr-btn-outline" onClick={() => setEditing(false)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                    {group.name}
                    {canManage && (
                      <button
                        className="dr-btn dr-btn-ghost"
                        style={{ padding: 4 }}
                        onClick={() => setEditing(true)}
                        title="Editar grupo"
                      >
                        <Ic.Edit size={18} />
                      </button>
                    )}
                  </h1>
                  {group.description && (
                    <p className="page-sub" style={{ marginTop: 4 }}>{group.description}</p>
                  )}
                  <p style={{ fontSize: '12.5px', color: 'var(--muted-foreground)', marginTop: 6 }}>
                    Criado por {group.ownerName} · {group.createdAt}
                  </p>
                </>
              )}
            </div>
            <div className="dr-page-head-actions">
              {isOwner && (
                <button className="dr-btn dr-btn-outline dr-btn-lg" onClick={handleDelete} style={{ color: 'var(--destructive)', borderColor: 'var(--destructive)' }}>
                  <Ic.Trash size={18} /> Excluir grupo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="dr-container">
        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 0,
            borderBottom: '2px solid var(--border)',
            marginBottom: 24,
            marginTop: 8,
          }}
        >
          {(['members', 'datasets'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: tab === t ? 700 : 500,
                color: tab === t ? 'var(--primary)' : 'var(--muted-foreground)',
                background: 'transparent',
                border: 'none',
                borderBottom: tab === t ? '2px solid var(--primary)' : '2px solid transparent',
                marginBottom: -2,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                transition: 'color .15s, border-color .15s',
              }}
            >
              {t === 'members' ? (
                <>
                  <Ic.Users size={16} /> Membros ({members.length})
                </>
              ) : (
                <>
                  <Ic.Database size={16} /> Datasets ({datasets.length})
                </>
              )}
            </button>
          ))}
        </div>

        {/* Members tab */}
        {tab === 'members' && (
          <div>
            {canManage && (
              <div style={{ marginBottom: 16 }}>
                <button className="dr-btn dr-btn-primary" onClick={() => setShowAddMember(true)}>
                  <Ic.Plus size={16} /> Adicionar membro
                </button>
              </div>
            )}
            <MemberList
              groupId={group.id}
              members={members}
              canManage={canManage}
              currentUserRole={currentUserRole}
            />
          </div>
        )}

        {/* Datasets tab */}
        {tab === 'datasets' && (
          <div>
            {datasets.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {datasets.map((d) => {
                  const statusMeta = STATUS_META[d.status] || STATUS_META.unpublished
                  return (
                    <div
                      key={d.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '14px 0',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 'calc(var(--radius) - 2px)',
                          background: 'var(--secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Ic.Database size={18} style={{ color: 'var(--primary)' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <a
                          href={`/datasets/${d.id}`}
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'var(--foreground)',
                            textDecoration: 'none',
                          }}
                        >
                          {d.title}
                        </a>
                        <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: 2 }}>
                          por {d.ownerName} · {d.version} · Atualizado {d.updated}
                        </div>
                      </div>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: '11.5px',
                          fontWeight: 700,
                          background: `color-mix(in srgb, ${statusMeta.color} 14%, transparent)`,
                          color: statusMeta.color,
                          border: `1px solid color-mix(in srgb, ${statusMeta.color} 24%, transparent)`,
                        }}
                      >
                        {statusMeta.label}
                      </span>
                      {canManageDatasets && (
                        <button
                          className="dr-btn dr-btn-ghost"
                          style={{ padding: '4px 8px', color: 'var(--destructive)' }}
                          onClick={() => handleRemoveDataset(d.id)}
                          title="Remover do grupo"
                        >
                          <Ic.X size={14} />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--muted-foreground)' }}>
                <Ic.Database size={42} style={{ margin: '0 auto 14px', opacity: 0.3 }} />
                <p style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 6px' }}>
                  Nenhum dataset neste grupo
                </p>
                <p style={{ fontSize: '13.5px', margin: 0 }}>
                  Adicione datasets existentes a este grupo no painel de publicação.
                </p>
              </div>
            )}
          </div>
        )}

        <div style={{ height: 56 }} />
      </div>

      <AddMemberDialog
        groupId={group.id}
        open={showAddMember}
        onClose={() => setShowAddMember(false)}
      />
      <PanelFooter />
    </div>
  )
}
