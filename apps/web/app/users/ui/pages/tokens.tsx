import type { InertiaProps } from '#core/ui/types'
import type { Data } from '@generated/data'
import SettingsLayout from '#users/ui/components/settings_layout'
import { TokensDialogs } from '#users/ui/components/tokens_dialogs'
import { TokensPrimaryButtons } from '#users/ui/components/tokens_primary_buttons'
import TokensTable from '#users/ui/components/tokens_table'
import TokensProvider from '#users/ui/context/tokens_context'

type PageProps = InertiaProps<{ tokens: Data.Users.Token[] }>

export default function TokensPage({ tokens }: PageProps) {
  const currentPath = '/settings/tokens'

  return (
    <SettingsLayout currentPath={currentPath}>
      <TokensProvider>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>Chaves de Acesso (API Tokens)</h2>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '13.5px', margin: 0 }}>
                Gerencie seus tokens de acesso pessoal para interagir com a API do DataRural de forma segura.
              </p>
            </div>
            <TokensPrimaryButtons />
          </div>

          <div style={{ marginTop: 20 }}>
            <TokensTable tokens={tokens} />
          </div>
        </div>

        <TokensDialogs />
      </TokensProvider>
    </SettingsLayout>
  )
}
