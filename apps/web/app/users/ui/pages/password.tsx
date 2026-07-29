import { PasswordForm } from '#users/ui/components/password_form'
import SettingsLayout from '#users/ui/components/settings_layout'

export default function PasswordPage() {
  const currentPath = '/settings/password'

  return (
    <SettingsLayout currentPath={currentPath}>
      <div style={{ maxWidth: 640 }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>Alterar Senha</h2>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '13.5px', margin: '0 0 24px' }}>
          Certifique-se de que sua conta esteja usando uma senha longa e aleatória para se manter segura.
        </p>

        <PasswordForm />
      </div>
    </SettingsLayout>
  )
}
