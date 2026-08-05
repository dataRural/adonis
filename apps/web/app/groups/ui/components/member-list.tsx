import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import * as Ic from '#common/ui/components/datarural/icons'
import { useTranslation } from '#common/ui/hooks/use_translation'

export interface MemberItem {
  id: number
  userId: number
  fullName: string
  email: string
  role: string
  joinedAt: string
  avatarUrl?: string | null
}

interface MemberListProps {
  groupId: number
  members: MemberItem[]
  canManage: boolean
  currentUserRole?: string | null
}

export default function MemberList({ groupId, members, canManage }: MemberListProps) {
  const { t } = useTranslation()
  const [changingRole, setChangingRole] = useState<number | null>(null)

  const roleLabelsMap: Record<string, { label: string; color: string }> = {
    owner: { label: t('groups.card.owner'), color: 'var(--brand-blue)' },
    admin: { label: t('groups.card.admin'), color: 'var(--brand-purple)' },
    editor: { label: t('groups.card.editor'), color: 'var(--brand-green)' },
    viewer: { label: t('groups.card.viewer'), color: 'var(--brand-sky)' },
  }

  const roleOptions = [
    { value: 'admin', label: t('groups.card.admin') },
    { value: 'editor', label: t('groups.card.editor') },
    { value: 'viewer', label: t('groups.card.viewer') },
  ]

  const handleRoleChange = (memberId: number, newRole: string) => {
    router.put(`/groups/${groupId}/members/${memberId}`, { role: newRole }, {
      onSuccess: () => setChangingRole(null),
      onError: () => setChangingRole(null),
    })
  }

  const handleRemove = (member: MemberItem) => {
    if (!confirm(t('groups.show.remove_member_confirm', { name: member.fullName }))) return
    router.delete(`/groups/${groupId}/members/${member.id}`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {members.map((m) => {
        const roleMeta = roleLabelsMap[m.role] || roleLabelsMap.viewer
        const initials = (m.fullName || 'U')
          .split(' ')
          .slice(0, 2)
          .map((n) => n[0])
          .join('')
          .toUpperCase()

        const isOwner = m.role === 'owner'
        const canChangeThis = canManage && !isOwner

        return (
          <div
            key={m.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 0',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <Link
              href={`/u/${(m as any).username || m.email.split('@')[0]}`}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                flexShrink: 0,
                textDecoration: 'none',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={m.fullName}
            >
              {m.avatarUrl ? (
                <img
                  src={m.avatarUrl}
                  alt={m.fullName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${roleMeta.color}, var(--primary))`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  {initials}
                </div>
              )}
            </Link>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Link
                href={`/u/${(m as any).username || m.email.split('@')[0]}`}
                style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.3, color: 'var(--foreground)', textDecoration: 'none' }}
              >
                {m.fullName}
              </Link>
              <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                {m.email} · {m.joinedAt}
              </div>
            </div>

            {changingRole === m.id ? (
              <div style={{ display: 'flex', gap: 6 }}>
                {roleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleRoleChange(m.id, opt.value)}
                    className="dr-btn dr-btn-outline"
                    style={{
                      fontSize: '11px',
                      padding: '4px 10px',
                      borderColor: opt.value === m.role ? roleMeta.color : undefined,
                      fontWeight: opt.value === m.role ? 700 : 500,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
                <button
                  className="dr-btn dr-btn-ghost"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                  onClick={() => setChangingRole(null)}
                >
                  <Ic.X size={14} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontSize: '11.5px',
                    fontWeight: 700,
                    letterSpacing: '0.03em',
                    background: `color-mix(in srgb, ${roleMeta.color} 14%, transparent)`,
                    color: roleMeta.color,
                    border: `1px solid color-mix(in srgb, ${roleMeta.color} 24%, transparent)`,
                  }}
                >
                  {roleMeta.label}
                </span>

                {canChangeThis && (
                  <>
                    <button
                      className="dr-btn dr-btn-ghost"
                      style={{ fontSize: '12px', padding: '4px 8px' }}
                      onClick={() => setChangingRole(m.id)}
                      title={t('groups.show.edit')}
                    >
                      <Ic.Edit size={14} />
                    </button>
                    <button
                      className="dr-btn dr-btn-ghost"
                      style={{ fontSize: '12px', padding: '4px 8px', color: 'var(--destructive)' }}
                      onClick={() => handleRemove(m)}
                      title={t('groups.show.delete')}
                    >
                      <Ic.Trash size={14} />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )
      })}

      {members.length === 0 && (
        <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '14px' }}>
          {t('common.table.filters.no_results')}
        </div>
      )}
    </div>
  )
}
