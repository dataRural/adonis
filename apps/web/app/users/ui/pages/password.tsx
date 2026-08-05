import { PasswordForm } from '#users/ui/components/password_form'
import SettingsLayout from '#users/ui/components/settings_layout'
import { useTranslation } from '#common/ui/hooks/use_translation'

export default function PasswordPage() {
  const { t } = useTranslation()
  const currentPath = '/settings/password'

  return (
    <SettingsLayout currentPath={currentPath}>
      <div style={{ maxWidth: 640 }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>{t('users.password.title')}</h2>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '13.5px', margin: '0 0 24px' }}>
          {t('users.password.description')}
        </p>

        <PasswordForm />
      </div>
    </SettingsLayout>
  )
}
