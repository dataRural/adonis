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
    'auth/forgot_password': ExtractProps<(typeof import('../../app/auth/ui/pages/forgot_password.tsx'))['default']>
    'auth/reset_password': ExtractProps<(typeof import('../../app/auth/ui/pages/reset_password.tsx'))['default']>
    'auth/sign_in': ExtractProps<(typeof import('../../app/auth/ui/pages/sign_in.tsx'))['default']>
    'auth/sign_up': ExtractProps<(typeof import('../../app/auth/ui/pages/sign_up.tsx'))['default']>
    'core/errors/not_found': ExtractProps<(typeof import('../../app/core/ui/pages/errors/not_found.tsx'))['default']>
    'core/errors/server_error': ExtractProps<(typeof import('../../app/core/ui/pages/errors/server_error.tsx'))['default']>
    'dataset/dashboard': ExtractProps<(typeof import('../../app/dataset/ui/pages/dashboard.tsx'))['default']>
    'dataset/favorites': ExtractProps<(typeof import('../../app/dataset/ui/pages/favorites.tsx'))['default']>
    'dataset/index': ExtractProps<(typeof import('../../app/dataset/ui/pages/index.tsx'))['default']>
    'dataset/new_version': ExtractProps<(typeof import('../../app/dataset/ui/pages/new_version.tsx'))['default']>
    'dataset/publish': ExtractProps<(typeof import('../../app/dataset/ui/pages/publish.tsx'))['default']>
    'dataset/show': ExtractProps<(typeof import('../../app/dataset/ui/pages/show.tsx'))['default']>
    'dataset/view': ExtractProps<(typeof import('../../app/dataset/ui/pages/view.tsx'))['default']>
    'groups/index': ExtractProps<(typeof import('../../app/groups/ui/pages/index.tsx'))['default']>
    'groups/show': ExtractProps<(typeof import('../../app/groups/ui/pages/show.tsx'))['default']>
    'marketing/show': ExtractProps<(typeof import('../../app/marketing/ui/pages/show.tsx'))['default']>
    'users/index': ExtractProps<(typeof import('../../app/users/ui/pages/index.tsx'))['default']>
    'users/password': ExtractProps<(typeof import('../../app/users/ui/pages/password.tsx'))['default']>
    'users/profile': ExtractProps<(typeof import('../../app/users/ui/pages/profile.tsx'))['default']>
    'users/public_profile': ExtractProps<(typeof import('../../app/users/ui/pages/public_profile.tsx'))['default']>
    'users/tokens': ExtractProps<(typeof import('../../app/users/ui/pages/tokens.tsx'))['default']>
    'audit_resolvers/ip_address_resolver': ExtractProps<(typeof import('../../app/audit_resolvers/ip_address_resolver.ts'))['default']>
    'audit_resolvers/url_resolver': ExtractProps<(typeof import('../../app/audit_resolvers/url_resolver.ts'))['default']>
    'audit_resolvers/user_agent_resolver': ExtractProps<(typeof import('../../app/audit_resolvers/user_agent_resolver.ts'))['default']>
    'audit_resolvers/user_resolver': ExtractProps<(typeof import('../../app/audit_resolvers/user_resolver.ts'))['default']>
    'common/database/migrations/1715000000000_create_audits_table': ExtractProps<(typeof import('../../app/common/database/migrations/1715000000000_create_audits_table.ts'))['default']>
    'dataset/database/migrations/1761021001004_create_dataset_version_files_table': ExtractProps<(typeof import('../../app/dataset/database/migrations/1761021001004_create_dataset_version_files_table.ts'))['default']>
    'dataset/database/migrations/1761021001005_backfill_version_files': ExtractProps<(typeof import('../../app/dataset/database/migrations/1761021001005_backfill_version_files.ts'))['default']>
    'dataset/models/dataset_version_file': ExtractProps<(typeof import('../../app/dataset/models/dataset_version_file.ts'))['default']>
    'users/controllers/audits_controller': ExtractProps<(typeof import('../../app/users/controllers/audits_controller.ts'))['default']>
  }
}
