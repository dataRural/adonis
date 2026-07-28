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

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('dr-theme', theme)
  }, [theme])

  const roles = userRoles(t)

  return (
    <div className="dr-app dr-panel-wrap">
      <Head title={`${t('users.index.page.title')} — DataRural`} />
      <PanelNav
        theme={theme}
        onToggleTheme={() => setTheme((p) => (p === 'dark' ? 'light' : 'dark'))}
        active="users"
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
                <span>Gestão de Usuários</span>
              </div>
              <h1 style={{ margin: 0 }}>{t('users.index.page.title')}</h1>
              <p className="page-sub">
                {t('users.index.page.description')}
              </p>
            </div>
            <div className="dr-page-head-actions">
              <UsersProvider>
                <UsersPrimaryButtons />
              </UsersProvider>
            </div>
          </div>
        </div>
      </div>

      <div className="dr-container" style={{ marginTop: 24, marginBottom: 56 }}>
        <UsersProvider>
          <div className="dr-panel" style={{ padding: '24px 28px' }}>
            <UsersTable users={users} roles={roles} q={q} selectedRoles={selectedRoles} />
          </div>

          <UsersDialogs roles={roles} />
        </UsersProvider>
      </div>

      <PanelFooter />
    </div>
  )
}
