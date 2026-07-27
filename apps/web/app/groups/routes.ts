/*
|--------------------------------------------------------------------------
| Groups Routes
|--------------------------------------------------------------------------
|
| Routes for group management, membership, and dataset assignment.
|
*/
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const GroupsController = () => import('#app/groups/controllers/groups_controller')
const GroupMembersController = () => import('#app/groups/controllers/group_members_controller')
const GroupDatasetsController = () => import('#app/groups/controllers/group_datasets_controller')

// Group CRUD
router
  .resource('/groups', GroupsController)
  .only(['index', 'store', 'show', 'update', 'destroy'])
  .use('*', middleware.auth())
  .as('groups')

// Group members management
router
  .post('/groups/:id/members', [GroupMembersController, 'store'])
  .middleware(middleware.auth())
  .as('groups.members.store')

router
  .put('/groups/:id/members/:memberId', [GroupMembersController, 'update'])
  .middleware(middleware.auth())
  .as('groups.members.update')

router
  .delete('/groups/:id/members/:memberId', [GroupMembersController, 'destroy'])
  .middleware(middleware.auth())
  .as('groups.members.destroy')

// Group datasets management
router
  .post('/groups/:id/datasets', [GroupDatasetsController, 'store'])
  .middleware(middleware.auth())
  .as('groups.datasets.store')

router
  .delete('/groups/:id/datasets/:datasetId', [GroupDatasetsController, 'destroy'])
  .middleware(middleware.auth())
  .as('groups.datasets.destroy')
