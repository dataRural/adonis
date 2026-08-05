import type { InertiaProps } from '#core/ui/types'
import { ProfileForm } from '#users/ui/components/profile_form'
import SettingsLayout from '#users/ui/components/settings_layout'
import type { Data } from '@generated/data'
import { useTranslation } from '#common/ui/hooks/use_translation'

type PageProps = InertiaProps<{ profile: Data.Users.User }>

export default function ProfilePage({ profile }: PageProps) {
  const { t } = useTranslation()
  const currentPath = '/settings/profile'

  return (
    <SettingsLayout currentPath={currentPath}>
      <div style={{ maxWidth: 640 }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>{t('users.profile.title')}</h2>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '13.5px', margin: '0 0 24px' }}>
          {t('users.profile.description')}
        </p>

        <ProfileForm user={profile} />
      </div>
    </SettingsLayout>
  )
}
