import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'analytics/dashboard': ExtractProps<(typeof import('../../app/analytics/ui/pages/dashboard.tsx'))['default']>
    'auth/forgot_password': ExtractProps<(typeof import('../../app/auth/ui/pages/forgot_password.tsx'))['default']>
    'auth/reset_password': ExtractProps<(typeof import('../../app/auth/ui/pages/reset_password.tsx'))['default']>
    'auth/sign_in': ExtractProps<(typeof import('../../app/auth/ui/pages/sign_in.tsx'))['default']>
    'auth/sign_up': ExtractProps<(typeof import('../../app/auth/ui/pages/sign_up.tsx'))['default']>
    'core/errors/not_found': ExtractProps<(typeof import('../../app/core/ui/pages/errors/not_found.tsx'))['default']>
    'core/errors/server_error': ExtractProps<(typeof import('../../app/core/ui/pages/errors/server_error.tsx'))['default']>
    'dataset/dashboard': ExtractProps<(typeof import('../../app/dataset/ui/pages/dashboard.tsx'))['default']>
    'dataset/index': ExtractProps<(typeof import('../../app/dataset/ui/pages/index.tsx'))['default']>
    'dataset/publish': ExtractProps<(typeof import('../../app/dataset/ui/pages/publish.tsx'))['default']>
    'dataset/show': ExtractProps<(typeof import('../../app/dataset/ui/pages/show.tsx'))['default']>
    'dataset/view': ExtractProps<(typeof import('../../app/dataset/ui/pages/view.tsx'))['default']>
    'groups/index': ExtractProps<(typeof import('../../app/groups/ui/pages/index.tsx'))['default']>
    'groups/show': ExtractProps<(typeof import('../../app/groups/ui/pages/show.tsx'))['default']>
    'marketing/show': ExtractProps<(typeof import('../../app/marketing/ui/pages/show.tsx'))['default']>
    'users/appearance': ExtractProps<(typeof import('../../app/users/ui/pages/appearance.tsx'))['default']>
    'users/index': ExtractProps<(typeof import('../../app/users/ui/pages/index.tsx'))['default']>
    'users/password': ExtractProps<(typeof import('../../app/users/ui/pages/password.tsx'))['default']>
    'users/profile': ExtractProps<(typeof import('../../app/users/ui/pages/profile.tsx'))['default']>
    'users/tokens': ExtractProps<(typeof import('../../app/users/ui/pages/tokens.tsx'))['default']>
    'dataset/models/dataset_like': ExtractProps<(typeof import('../../app/dataset/models/dataset_like.ts'))['default']>
    'dataset/database/migrations/1761021001001_create_licenses_table': ExtractProps<(typeof import('../../app/dataset/database/migrations/1761021001001_create_licenses_table.ts'))['default']>
    'dataset/database/migrations/1761021001002_create_datasets_table': ExtractProps<(typeof import('../../app/dataset/database/migrations/1761021001002_create_datasets_table.ts'))['default']>
    'dataset/database/migrations/1761021001003_create_dataset_version_table': ExtractProps<(typeof import('../../app/dataset/database/migrations/1761021001003_create_dataset_version_table.ts'))['default']>
    'dataset/database/migrations/1761021001004_create_dataset_likes_table': ExtractProps<(typeof import('../../app/dataset/database/migrations/1761021001004_create_dataset_likes_table.ts'))['default']>
    'dataset/database/seeders/dataset_seeder': ExtractProps<(typeof import('../../app/dataset/database/seeders/dataset_seeder.ts'))['default']>
    'dataset/database/seeders/license_seeder': ExtractProps<(typeof import('../../app/dataset/database/seeders/license_seeder.ts'))['default']>
  }
}
