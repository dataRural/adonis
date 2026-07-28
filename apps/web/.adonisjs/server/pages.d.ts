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
    'dataset/index': ExtractProps<(typeof import('../../app/dataset/ui/pages/index.tsx'))['default']>
    'dataset/new_version': any
    'dataset/publish': any
    'dataset/show': any
    'dataset/view': any
    'groups/index': any
    'groups/show': any
    'marketing/show': any
    'users/index': any
    'users/password': any
    'users/profile': any
    'users/public_profile': any
    'users/tokens': any
  }
}
