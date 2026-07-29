/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const UsersController = () => import('#users/controllers/users_controller')
const AuditsController = () => import('#users/controllers/audits_controller')
const ProfileController = () => import('#users/controllers/profile_controller')
const PasswordController = () => import('#users/controllers/password_controller')
const InviteController = () => import('#users/controllers/invite_controller')
const ImpersonatesController = () => import('#users/controllers/impersonates_controller')
const TokensController = () => import('#users/controllers/tokens_controller')

router
  .get('/users', ({ response }) => response.redirect().toPath('/admin'))
  .middleware(middleware.auth())

router
  .resource('/admin', UsersController)
  .only(['index', 'store', 'update', 'destroy'])
  .use('*', middleware.auth())
  .as('admin')

router
  .get('/api/admin/audits', [AuditsController, 'index'])
  .middleware(middleware.auth())
  .as('admin.audits')

router
  .post('/users/invite', [InviteController])
  .middleware(middleware.auth())
  .as('users.invite.handle')
router
  .post('/users/impersonate/:id', [ImpersonatesController, 'store'])
  .middleware(middleware.auth())
  .as('users.impersonate.handle')

router
  .get('/api/users/search', [UsersController, 'search'])
  .middleware(middleware.auth())
  .as('users.search')

router
  .get('/profile', [UsersController, 'publicProfile'])
  .middleware(middleware.auth())
  .as('user.profile')

router
  .get('/u/:username', [UsersController, 'publicProfile'])
  .as('users.public_profile')

router
  .get('/settings', ({ response }) => {
    return response.redirect().toRoute('profile.show')
  })
  .middleware(middleware.auth())
  .as('settings.index')

router
  .post('/settings/profile', [ProfileController])
  .middleware(middleware.auth())
  .as('profile.update')
router
  .get('/settings/profile', [ProfileController, 'show'])
  .middleware(middleware.auth())
  .as('profile.show')

router
  .resource('/settings/tokens', TokensController)
  .only(['index', 'destroy'])
  .middleware('*', middleware.auth())
  .as('tokens')

router
  .post('/api/tokens', [TokensController, 'store'])
  .middleware(middleware.auth())
  .as('tokens.store')

router
  .put('/settings/password', [PasswordController])
  .middleware(middleware.auth())
  .as('password.update')
router
  .get('/settings/password', [PasswordController, 'show'])
  .middleware(middleware.auth())
  .as('password.show')
