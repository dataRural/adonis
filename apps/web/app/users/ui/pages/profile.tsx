import type { InertiaProps } from '#core/ui/types'
import { ProfileForm } from '#users/ui/components/profile_form'
import SettingsLayout from '#users/ui/components/settings_layout'
import type { Data } from '@generated/data'

type PageProps = InertiaProps<{ profile: Data.Users.User }>

export default function ProfilePage({ profile }: PageProps) {
  const currentPath = '/settings/profile'

  return (
    <SettingsLayout currentPath={currentPath}>
      <div style={{ maxWidth: 640 }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>Informações do Perfil</h2>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '13.5px', margin: '0 0 24px' }}>
          Atualize suas informações pessoais e foto de perfil.
        </p>

        <ProfileForm user={profile} />
      </div>
    </SettingsLayout>
  )
}
