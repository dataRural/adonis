import { useState, useEffect } from 'react'
import { Head } from '@inertiajs/react'
import PanelNav from '#common/ui/components/datarural/navbar-auth'
import PanelFooter from '#common/ui/components/datarural/footer-simple'
import * as Ic from '#common/ui/components/datarural/icons'

import { UsersDialogs } from '#users/ui/components/users_dialogs'
import { UsersPrimaryButtons } from '#users/ui/components/users_primary_buttons'
import UsersTable from '#users/ui/components/users_table'
import { userRoles } from '#users/ui/components/users_types'
import UsersProvider from '#users/ui/context/users_context'
import AreasAdminTable from '#app/dataset/ui/components/admin/areas-admin-table'
import AuditsAdminTable from '#users/ui/components/audits_admin_table'
import { useTranslation } from '#common/ui/hooks/use_translation'

import type { InertiaProps } from '#core/ui/types'
import type { Data } from '@generated/data'

type PageProps = InertiaProps<{
  users: {
    data: Data.Users.User[]
    metadata: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
      firstPage: number
      firstPageUrl?: string
      lastPageUrl?: string
      nextPageUrl?: string | null
      previousPageUrl?: string | null
    }
  }
  q?: string
  selectedRoles: number[]
}>

export default function ListUsersPage({ users, q, selectedRoles }: PageProps) {
  const { t } = useTranslation()
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dr-theme') || 'light'
    }
    return 'light'
  })
  const [adminTab, setAdminTab] = useState<'users' | 'areas' | 'audits'>('users')

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('dr-theme', theme)
  }, [theme])

  const roles = userRoles(t)

  return (
    <div className="dr-app dr-panel-wrap">
      <Head title="Painel Administrativo — DataRural" />
      <PanelNav
        theme={theme}
        onToggleTheme={() => setTheme((p) => (p === 'dark' ? 'light' : 'dark'))}
        active="admin"
        hidePublishButton={true}
      />

      <div className="dr-page-head">
        <div className="dr-container">
          <div className="dr-page-head-inner">
            <div>
              <div className="dr-page-breadcrumb">
                <a href="/">Início</a>
                <span className="sep">
                  <Ic.Chevr size={13} style={{ display: 'inline', margin: '0 4px' }} />
                </span>
                <span>Administração</span>
              </div>
              <h1 style={{ margin: 0 }}>Painel Administrativo</h1>
              <p className="page-sub">
                Gerencie usuários, permissões, áreas de conhecimento e logs de auditoria da plataforma DataRural.
              </p>
            </div>
            <div className="dr-page-head-actions">
              {adminTab === 'users' && (
                <UsersProvider>
                  <UsersPrimaryButtons />
                </UsersProvider>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="dr-container" style={{ marginTop: 24, marginBottom: 56 }}>
        {/* Admin Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            borderBottom: '1px solid var(--border)',
            marginBottom: 24,
            paddingBottom: 2,
          }}
        >
          <button
            onClick={() => setAdminTab('users')}
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: adminTab === 'users' ? 700 : 500,
              background: 'none',
              border: 'none',
              borderBottom: adminTab === 'users' ? '3px solid var(--brand-green)' : '3px solid transparent',
              color: adminTab === 'users' ? 'var(--foreground)' : 'var(--muted-foreground)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Ic.Users size={16} /> Gestão de Usuários
          </button>
          <button
            onClick={() => setAdminTab('areas')}
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: adminTab === 'areas' ? 700 : 500,
              background: 'none',
              border: 'none',
              borderBottom: adminTab === 'areas' ? '3px solid var(--brand-green)' : '3px solid transparent',
              color: adminTab === 'areas' ? 'var(--foreground)' : 'var(--muted-foreground)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Ic.Grid size={16} /> Áreas do Conhecimento
          </button>
          <button
            onClick={() => setAdminTab('audits')}
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: adminTab === 'audits' ? 700 : 500,
              background: 'none',
              border: 'none',
              borderBottom: adminTab === 'audits' ? '3px solid var(--brand-green)' : '3px solid transparent',
              color: adminTab === 'audits' ? 'var(--foreground)' : 'var(--muted-foreground)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Ic.Activity size={16} /> Logs de Auditoria
          </button>
        </div>

        {adminTab === 'users' ? (
          <UsersProvider>
            <div className="dr-panel" style={{ padding: '24px 28px' }}>
              <UsersTable users={users} roles={roles} q={q} selectedRoles={selectedRoles} />
            </div>

            <UsersDialogs roles={roles} />
          </UsersProvider>
        ) : adminTab === 'areas' ? (
          <div className="dr-panel" style={{ padding: '24px 28px' }}>
            <AreasAdminTable />
          </div>
        ) : (
          <div className="dr-panel" style={{ padding: '24px 28px' }}>
            <AuditsAdminTable />
          </div>
        )}
      </div>

      <PanelFooter />
    </div>
  )
}
