import '@adonisjs/inertia/types'

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'auth/forgot_password': any
    'auth/reset_password': any
    'auth/sign_in': any
    'auth/sign_up': any
    'core/errors/not_found': any
    'core/errors/server_error': any
    'dataset/dashboard': any
    'dataset/index': any
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
