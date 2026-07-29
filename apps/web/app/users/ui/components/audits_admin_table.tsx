import React, { useState, useEffect } from 'react'
import * as Ic from '#common/ui/components/datarural/icons'

export interface AuditRecord {
  id: number
  userType: string | null
  userId: string | null
  userName?: string
  event: string
  auditableType: string
  auditableId: number | string
  oldValues: Record<string, any> | null
  newValues: Record<string, any> | null
  url: string | null
  ipAddress: string | null
  userAgent: string | null
  tags: string[] | null
  metadata: Record<string, any> | null
  auditComment: string | null
  requestId: string | null
  createdAt: string
}

interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
}

export default function AuditsAdminTable() {
  const [audits, setAudits] = useState<AuditRecord[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)

  // Filters
  const [page, setPage] = useState(1)
  const [eventFilter, setEventFilter] = useState<string>('all')
  const [entityFilter, setEntityFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal detail state
  const [selectedAudit, setSelectedAudit] = useState<AuditRecord | null>(null)

  const fetchAudits = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '15',
      })
      if (eventFilter !== 'all') params.append('event', eventFilter)
      if (entityFilter !== 'all') params.append('auditableType', entityFilter)
      if (searchQuery.trim()) params.append('search', searchQuery.trim())

      const res = await fetch(`/api/admin/audits?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setAudits(json.data || [])
        setMeta(json.meta || null)
      }
    } catch (err) {
      console.error('Erro ao carregar auditorias:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAudits()
  }, [page, eventFilter, entityFilter])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchAudits()
  }

  const formatBadge = (event: string) => {
    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: 600,
      letterSpacing: '0.01em',
      lineHeight: '1.2',
    }

    switch (event.toLowerCase()) {
      case 'create':
      case 'created':
        return (
          <span style={{ ...baseStyle, background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            Criação
          </span>
        )
      case 'update':
      case 'updated':
        return (
          <span style={{ ...baseStyle, background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            Atualização
          </span>
        )
      case 'delete':
      case 'deleted':
        return (
          <span style={{ ...baseStyle, background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            Exclusão
          </span>
        )
      case 'published':
        return (
          <span style={{ ...baseStyle, background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            Publicação
          </span>
        )
      default:
        return (
          <span style={{ ...baseStyle, background: 'rgba(156, 163, 175, 0.15)', color: 'var(--muted-foreground)', border: '1px solid rgba(156, 163, 175, 0.3)' }}>
            {event}
          </span>
        )
    }
  }

  const formatEntityName = (type: string) => {
    switch (type.toLowerCase()) {
      case 'dataset':
        return 'Dataset'
      case 'dataset_version':
        return 'Versão do Dataset'
      case 'dataset_area':
        return 'Área do Conhecimento'
      case 'user':
        return 'Usuário'
      case 'group':
        return 'Grupo de Pesquisa'
      case 'group_member':
        return 'Membro de Grupo'
      default:
        return type
    }
  }

  const formatDate = (isoString: string) => {
    if (!isoString) return '—'
    try {
      const d = new Date(isoString)
      return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    } catch {
      return isoString
    }
  }

  return (
    <div>
      {/* Filters Header */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center', justifyContent: 'space-between' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 260, maxWidth: 400 }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              placeholder="Buscar em comentários, usuários..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="dr-input"
              style={{ width: '100%', paddingLeft: 36, height: 38 }}
            />
            <span style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted-foreground)' }}>
              <Ic.Search size={16} />
            </span>
          </div>
          <button type="submit" className="dr-btn dr-btn-primary" style={{ height: 38, padding: '0 16px' }}>
            Buscar
          </button>
        </form>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Evento:</span>
            <select
              value={eventFilter}
              onChange={(e) => { setEventFilter(e.target.value); setPage(1) }}
              className="dr-input"
              style={{ height: 38, padding: '0 10px' }}
            >
              <option value="all">Todos os eventos</option>
              <option value="create">Criação</option>
              <option value="update">Atualização</option>
              <option value="delete">Exclusão</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Entidade:</span>
            <select
              value={entityFilter}
              onChange={(e) => { setEntityFilter(e.target.value); setPage(1) }}
              className="dr-input"
              style={{ height: 38, padding: '0 10px' }}
            >
              <option value="all">Todas as entidades</option>
              <option value="dataset">Dataset</option>
              <option value="dataset_version">Versão do Dataset</option>
              <option value="dataset_area">Área do Conhecimento</option>
              <option value="user">Usuário</option>
              <option value="group">Grupo</option>
              <option value="group_member">Membro de Grupo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted-foreground)' }}>
          Carregando histórico de auditoria...
        </div>
      ) : audits.length === 0 ? (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted-foreground)' }}>
          Nenhum registro de auditoria encontrado.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="dr-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px' }}>Data / Hora</th>
                <th style={{ padding: '12px 14px' }}>Evento</th>
                <th style={{ padding: '12px 14px' }}>Entidade</th>
                <th style={{ padding: '12px 14px' }}>ID</th>
                <th style={{ padding: '12px 14px' }}>Usuário</th>
                <th style={{ padding: '12px 14px' }}>Comentário / Detalhes</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {audits.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 14px', whiteSpace: 'nowrap', color: 'var(--muted-foreground)' }}>
                    {formatDate(item.createdAt)}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {formatBadge(item.event)}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 500 }}>
                    {formatEntityName(item.auditableType)}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--muted-foreground)' }}>
                    #{item.auditableId}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 500 }}>
                    {item.userName}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--muted-foreground)', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.auditComment || (item.oldValues && item.newValues ? 'Alteração de propriedades' : item.event)}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedAudit(item)}
                      className="dr-btn dr-btn-ghost"
                      style={{ padding: '6px 12px', fontSize: 13 }}
                    >
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {meta && meta.lastPage > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
            Mostrando página {meta.currentPage} de {meta.lastPage} ({meta.total} registros)
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="dr-btn dr-btn-ghost"
              style={{ padding: '6px 12px', fontSize: 13 }}
            >
              Anterior
            </button>
            <button
              disabled={page >= meta.lastPage}
              onClick={() => setPage((p) => p + 1)}
              className="dr-btn dr-btn-ghost"
              style={{ padding: '6px 12px', fontSize: 13 }}
            >
              Próxima
            </button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedAudit && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: 20,
          }}
          onClick={() => setSelectedAudit(null)}
        >
          <div
            className="dr-panel"
            style={{
              maxWidth: 720,
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: 28,
              background: 'var(--background)',
              borderRadius: 12,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                Detalhes da Auditoria #{selectedAudit.id}
                {formatBadge(selectedAudit.event)}
              </h3>
              <button
                onClick={() => setSelectedAudit(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24, fontSize: 13, background: 'var(--muted)', padding: 16, borderRadius: 8 }}>
              <div><strong>Entidade:</strong> {formatEntityName(selectedAudit.auditableType)} (#{selectedAudit.auditableId})</div>
              <div><strong>Usuário:</strong> {selectedAudit.userName}</div>
              <div><strong>Data / Hora:</strong> {formatDate(selectedAudit.createdAt)}</div>
              <div><strong>IP:</strong> {selectedAudit.ipAddress || '—'}</div>
              {selectedAudit.url && <div style={{ gridColumn: 'span 2' }}><strong>URL:</strong> {selectedAudit.url}</div>}
              {selectedAudit.auditComment && <div style={{ gridColumn: 'span 2' }}><strong>Comentário:</strong> {selectedAudit.auditComment}</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedAudit.oldValues && selectedAudit.newValues ? '1fr 1fr' : '1fr', gap: 16 }}>
              {selectedAudit.oldValues && (
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#b91c1c' }}>Valores Anteriores (Antes)</h4>
                  <pre
                    style={{
                      background: 'var(--muted)',
                      padding: 12,
                      borderRadius: 6,
                      fontSize: 12,
                      overflowX: 'auto',
                      maxHeight: 250,
                    }}
                  >
                    {JSON.stringify(selectedAudit.oldValues, null, 2)}
                  </pre>
                </div>
              )}

              {selectedAudit.newValues && (
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#15803d' }}>Novos Valores (Depois)</h4>
                  <pre
                    style={{
                      background: 'var(--muted)',
                      padding: 12,
                      borderRadius: 6,
                      fontSize: 12,
                      overflowX: 'auto',
                      maxHeight: 250,
                    }}
                  >
                    {JSON.stringify(selectedAudit.newValues, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <button onClick={() => setSelectedAudit(null)} className="dr-btn dr-btn-primary">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
