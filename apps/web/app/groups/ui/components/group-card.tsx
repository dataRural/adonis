import { Link } from '@inertiajs/react'
import * as Ic from '#common/ui/components/datarural/icons'

export interface GroupCardItem {
  id: number
  name: string
  description: string | null
  role: string
  ownerName: string
  memberCount: number
  datasetCount: number
  createdAt: string
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  owner: { label: 'Dono', color: 'var(--brand-blue)' },
  admin: { label: 'Admin', color: 'var(--brand-purple)' },
  editor: { label: 'Editor', color: 'var(--brand-green)' },
  viewer: { label: 'Visualizador', color: 'var(--brand-sky)' },
}

interface GroupCardProps {
  group: GroupCardItem
}

export default function GroupCard({ group }: GroupCardProps) {
  const roleMeta = ROLE_LABELS[group.role] || ROLE_LABELS.viewer

  return (
    <Link
      href={`/groups/${group.id}`}
      className="dr-group-card"
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '22px 24px',
        transition: 'box-shadow .18s ease, border-color .18s ease, transform .18s ease',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${roleMeta.color}, var(--primary))`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Ic.Users size={18} style={{ color: '#fff' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                {group.name}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                Criado por {group.ownerName} · {group.createdAt}
              </span>
            </div>
          </div>
          {group.description && (
            <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--muted-foreground)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {group.description}
            </p>
          )}
        </div>
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
            flexShrink: 0,
          }}
        >
          {roleMeta.label}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 20,
          marginTop: 16,
          paddingTop: 14,
          borderTop: '1px solid var(--border)',
          fontSize: '12.5px',
          color: 'var(--muted-foreground)',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <Ic.Users size={14} /> {group.memberCount} {group.memberCount === 1 ? 'membro' : 'membros'}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <Ic.Database size={14} /> {group.datasetCount} {group.datasetCount === 1 ? 'dataset' : 'datasets'}
        </span>
      </div>
    </Link>
  )
}
