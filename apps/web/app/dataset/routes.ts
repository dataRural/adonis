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

const DatasetsController = () => import('#app/dataset/controllers/datasets_controller')
const LicensesController = () => import('#app/dataset/controllers/licenses_controller')

router
  .get('/datasets/view', [DatasetsController, 'viewer'])
  .middleware(middleware.auth())
  .as('datasets.viewer')

router.get('/licenses', [LicensesController, 'index']).as('licenses.index')

router
  .post('/datasets/:id/privacy', [DatasetsController, 'togglePrivacy'])
  .middleware(middleware.auth())
  .as('datasets.privacy');

router
  .post('/datasets/:id/like', [DatasetsController, 'toggleLike'])
  .middleware(middleware.auth())
  .as('datasets.like.toggle');

router
  .get('/datasets/:id/version/new', [DatasetsController, 'newVersion'])
  .middleware(middleware.auth())
  .as('datasets.version.new');

router
  .post('/datasets/:id/version', [DatasetsController, 'addVersion'])
  .middleware(middleware.auth())
  .as('datasets.version.store');

router
  .post('/datasets/:id/version/:versionId/restore', [DatasetsController, 'restoreVersion'])
  .middleware(middleware.auth())
  .as('datasets.version.restore');

router
  .post('/datasets/:id/version/:versionId/delete', [DatasetsController, 'deleteVersion'])
  .middleware(middleware.auth())
  .as('datasets.version.delete');

router
  .get('/datasets/:datasetId/version/:versionId/download', [DatasetsController, 'downloadVersion'])
  .as('datasets.version.download')

router
  .get('/datasets', [DatasetsController, 'explore'])
  .as('datasets.explore')

router
  .post('/datasets', [DatasetsController, 'store'])
  .middleware(middleware.auth())
  .as('datasets.store')

router
  .get('/datasets/:id', [DatasetsController, 'show'])
  .as('datasets.show')

router
  .get('/dashboard', [DatasetsController, 'dashboard'])
  .middleware(middleware.auth())
  .as('dashboard.show')

router
  .get('/dashboard/publish', [DatasetsController, 'publish'])
  .middleware(middleware.auth())
  .as('dashboard.publish')
