/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'drive.fs.serve': {
    methods: ["GET","HEAD"],
    pattern: '/uploads/*',
    tokens: [{"old":"/uploads/*","type":0,"val":"uploads","end":""},{"old":"/uploads/*","type":2,"val":"*","end":""}],
    types: placeholder as Registry['drive.fs.serve']['types'],
  },
  'marketing.show': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['marketing.show']['types'],
  },
  'admin.index': {
    methods: ["GET","HEAD"],
    pattern: '/admin',
    tokens: [{"old":"/admin","type":0,"val":"admin","end":""}],
    types: placeholder as Registry['admin.index']['types'],
  },
  'admin.store': {
    methods: ["POST"],
    pattern: '/admin',
    tokens: [{"old":"/admin","type":0,"val":"admin","end":""}],
    types: placeholder as Registry['admin.store']['types'],
  },
  'admin.update': {
    methods: ["PUT","PATCH"],
    pattern: '/admin/:id',
    tokens: [{"old":"/admin/:id","type":0,"val":"admin","end":""},{"old":"/admin/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.update']['types'],
  },
  'admin.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/:id',
    tokens: [{"old":"/admin/:id","type":0,"val":"admin","end":""},{"old":"/admin/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.destroy']['types'],
  },
  'admin.audits': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/audits',
    tokens: [{"old":"/api/admin/audits","type":0,"val":"api","end":""},{"old":"/api/admin/audits","type":0,"val":"admin","end":""},{"old":"/api/admin/audits","type":0,"val":"audits","end":""}],
    types: placeholder as Registry['admin.audits']['types'],
  },
  'users.invite.handle': {
    methods: ["POST"],
    pattern: '/users/invite',
    tokens: [{"old":"/users/invite","type":0,"val":"users","end":""},{"old":"/users/invite","type":0,"val":"invite","end":""}],
    types: placeholder as Registry['users.invite.handle']['types'],
  },
  'users.impersonate.handle': {
    methods: ["POST"],
    pattern: '/users/impersonate/:id',
    tokens: [{"old":"/users/impersonate/:id","type":0,"val":"users","end":""},{"old":"/users/impersonate/:id","type":0,"val":"impersonate","end":""},{"old":"/users/impersonate/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.impersonate.handle']['types'],
  },
  'users.search': {
    methods: ["GET","HEAD"],
    pattern: '/api/users/search',
    tokens: [{"old":"/api/users/search","type":0,"val":"api","end":""},{"old":"/api/users/search","type":0,"val":"users","end":""},{"old":"/api/users/search","type":0,"val":"search","end":""}],
    types: placeholder as Registry['users.search']['types'],
  },
  'user.profile': {
    methods: ["GET","HEAD"],
    pattern: '/profile',
    tokens: [{"old":"/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['user.profile']['types'],
  },
  'users.public_profile': {
    methods: ["GET","HEAD"],
    pattern: '/u/:username',
    tokens: [{"old":"/u/:username","type":0,"val":"u","end":""},{"old":"/u/:username","type":1,"val":"username","end":""}],
    types: placeholder as Registry['users.public_profile']['types'],
  },
  'settings.index': {
    methods: ["GET","HEAD"],
    pattern: '/settings',
    tokens: [{"old":"/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['settings.index']['types'],
  },
  'profile.update': {
    methods: ["POST"],
    pattern: '/settings/profile',
    tokens: [{"old":"/settings/profile","type":0,"val":"settings","end":""},{"old":"/settings/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.update']['types'],
  },
  'profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/settings/profile',
    tokens: [{"old":"/settings/profile","type":0,"val":"settings","end":""},{"old":"/settings/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.show']['types'],
  },
  'tokens.index': {
    methods: ["GET","HEAD"],
    pattern: '/settings/tokens',
    tokens: [{"old":"/settings/tokens","type":0,"val":"settings","end":""},{"old":"/settings/tokens","type":0,"val":"tokens","end":""}],
    types: placeholder as Registry['tokens.index']['types'],
  },
  'tokens.destroy': {
    methods: ["DELETE"],
    pattern: '/settings/tokens/:id',
    tokens: [{"old":"/settings/tokens/:id","type":0,"val":"settings","end":""},{"old":"/settings/tokens/:id","type":0,"val":"tokens","end":""},{"old":"/settings/tokens/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tokens.destroy']['types'],
  },
  'tokens.store': {
    methods: ["POST"],
    pattern: '/api/tokens',
    tokens: [{"old":"/api/tokens","type":0,"val":"api","end":""},{"old":"/api/tokens","type":0,"val":"tokens","end":""}],
    types: placeholder as Registry['tokens.store']['types'],
  },
  'password.update': {
    methods: ["PUT"],
    pattern: '/settings/password',
    tokens: [{"old":"/settings/password","type":0,"val":"settings","end":""},{"old":"/settings/password","type":0,"val":"password","end":""}],
    types: placeholder as Registry['password.update']['types'],
  },
  'password.show': {
    methods: ["GET","HEAD"],
    pattern: '/settings/password',
    tokens: [{"old":"/settings/password","type":0,"val":"settings","end":""},{"old":"/settings/password","type":0,"val":"password","end":""}],
    types: placeholder as Registry['password.show']['types'],
  },
  'areas.list': {
    methods: ["GET","HEAD"],
    pattern: '/api/areas',
    tokens: [{"old":"/api/areas","type":0,"val":"api","end":""},{"old":"/api/areas","type":0,"val":"areas","end":""}],
    types: placeholder as Registry['areas.list']['types'],
  },
  'admin_areas.index': {
    methods: ["GET","HEAD"],
    pattern: '/admin/areas',
    tokens: [{"old":"/admin/areas","type":0,"val":"admin","end":""},{"old":"/admin/areas","type":0,"val":"areas","end":""}],
    types: placeholder as Registry['admin_areas.index']['types'],
  },
  'admin_areas.store': {
    methods: ["POST"],
    pattern: '/admin/areas',
    tokens: [{"old":"/admin/areas","type":0,"val":"admin","end":""},{"old":"/admin/areas","type":0,"val":"areas","end":""}],
    types: placeholder as Registry['admin_areas.store']['types'],
  },
  'admin_areas.update': {
    methods: ["PUT","PATCH"],
    pattern: '/admin/areas/:id',
    tokens: [{"old":"/admin/areas/:id","type":0,"val":"admin","end":""},{"old":"/admin/areas/:id","type":0,"val":"areas","end":""},{"old":"/admin/areas/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin_areas.update']['types'],
  },
  'admin_areas.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/areas/:id',
    tokens: [{"old":"/admin/areas/:id","type":0,"val":"admin","end":""},{"old":"/admin/areas/:id","type":0,"val":"areas","end":""},{"old":"/admin/areas/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin_areas.destroy']['types'],
  },
  'datasets.viewer': {
    methods: ["GET","HEAD"],
    pattern: '/datasets/view',
    tokens: [{"old":"/datasets/view","type":0,"val":"datasets","end":""},{"old":"/datasets/view","type":0,"val":"view","end":""}],
    types: placeholder as Registry['datasets.viewer']['types'],
  },
  'licenses.index': {
    methods: ["GET","HEAD"],
    pattern: '/licenses',
    tokens: [{"old":"/licenses","type":0,"val":"licenses","end":""}],
    types: placeholder as Registry['licenses.index']['types'],
  },
  'datasets.privacy': {
    methods: ["POST"],
    pattern: '/datasets/:id/privacy',
    tokens: [{"old":"/datasets/:id/privacy","type":0,"val":"datasets","end":""},{"old":"/datasets/:id/privacy","type":1,"val":"id","end":""},{"old":"/datasets/:id/privacy","type":0,"val":"privacy","end":""}],
    types: placeholder as Registry['datasets.privacy']['types'],
  },
  'datasets.like.toggle': {
    methods: ["POST"],
    pattern: '/datasets/:id/like',
    tokens: [{"old":"/datasets/:id/like","type":0,"val":"datasets","end":""},{"old":"/datasets/:id/like","type":1,"val":"id","end":""},{"old":"/datasets/:id/like","type":0,"val":"like","end":""}],
    types: placeholder as Registry['datasets.like.toggle']['types'],
  },
  'datasets.favorite.toggle': {
    methods: ["POST"],
    pattern: '/datasets/:id/favorite',
    tokens: [{"old":"/datasets/:id/favorite","type":0,"val":"datasets","end":""},{"old":"/datasets/:id/favorite","type":1,"val":"id","end":""},{"old":"/datasets/:id/favorite","type":0,"val":"favorite","end":""}],
    types: placeholder as Registry['datasets.favorite.toggle']['types'],
  },
  'favorites.index': {
    methods: ["GET","HEAD"],
    pattern: '/favorites',
    tokens: [{"old":"/favorites","type":0,"val":"favorites","end":""}],
    types: placeholder as Registry['favorites.index']['types'],
  },
  'datasets.version.new': {
    methods: ["GET","HEAD"],
    pattern: '/datasets/:id/version/new',
    tokens: [{"old":"/datasets/:id/version/new","type":0,"val":"datasets","end":""},{"old":"/datasets/:id/version/new","type":1,"val":"id","end":""},{"old":"/datasets/:id/version/new","type":0,"val":"version","end":""},{"old":"/datasets/:id/version/new","type":0,"val":"new","end":""}],
    types: placeholder as Registry['datasets.version.new']['types'],
  },
  'datasets.version.store': {
    methods: ["POST"],
    pattern: '/datasets/:id/version',
    tokens: [{"old":"/datasets/:id/version","type":0,"val":"datasets","end":""},{"old":"/datasets/:id/version","type":1,"val":"id","end":""},{"old":"/datasets/:id/version","type":0,"val":"version","end":""}],
    types: placeholder as Registry['datasets.version.store']['types'],
  },
  'datasets.version.restore': {
    methods: ["POST"],
    pattern: '/datasets/:id/version/:versionId/restore',
    tokens: [{"old":"/datasets/:id/version/:versionId/restore","type":0,"val":"datasets","end":""},{"old":"/datasets/:id/version/:versionId/restore","type":1,"val":"id","end":""},{"old":"/datasets/:id/version/:versionId/restore","type":0,"val":"version","end":""},{"old":"/datasets/:id/version/:versionId/restore","type":1,"val":"versionId","end":""},{"old":"/datasets/:id/version/:versionId/restore","type":0,"val":"restore","end":""}],
    types: placeholder as Registry['datasets.version.restore']['types'],
  },
  'datasets.version.delete': {
    methods: ["POST"],
    pattern: '/datasets/:id/version/:versionId/delete',
    tokens: [{"old":"/datasets/:id/version/:versionId/delete","type":0,"val":"datasets","end":""},{"old":"/datasets/:id/version/:versionId/delete","type":1,"val":"id","end":""},{"old":"/datasets/:id/version/:versionId/delete","type":0,"val":"version","end":""},{"old":"/datasets/:id/version/:versionId/delete","type":1,"val":"versionId","end":""},{"old":"/datasets/:id/version/:versionId/delete","type":0,"val":"delete","end":""}],
    types: placeholder as Registry['datasets.version.delete']['types'],
  },
  'datasets.version.download': {
    methods: ["GET","HEAD"],
    pattern: '/datasets/:datasetId/version/:versionId/download',
    tokens: [{"old":"/datasets/:datasetId/version/:versionId/download","type":0,"val":"datasets","end":""},{"old":"/datasets/:datasetId/version/:versionId/download","type":1,"val":"datasetId","end":""},{"old":"/datasets/:datasetId/version/:versionId/download","type":0,"val":"version","end":""},{"old":"/datasets/:datasetId/version/:versionId/download","type":1,"val":"versionId","end":""},{"old":"/datasets/:datasetId/version/:versionId/download","type":0,"val":"download","end":""}],
    types: placeholder as Registry['datasets.version.download']['types'],
  },
  'datasets.explore': {
    methods: ["GET","HEAD"],
    pattern: '/datasets',
    tokens: [{"old":"/datasets","type":0,"val":"datasets","end":""}],
    types: placeholder as Registry['datasets.explore']['types'],
  },
  'datasets.store': {
    methods: ["POST"],
    pattern: '/datasets',
    tokens: [{"old":"/datasets","type":0,"val":"datasets","end":""}],
    types: placeholder as Registry['datasets.store']['types'],
  },
  'datasets.show': {
    methods: ["GET","HEAD"],
    pattern: '/datasets/:id',
    tokens: [{"old":"/datasets/:id","type":0,"val":"datasets","end":""},{"old":"/datasets/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['datasets.show']['types'],
  },
  'dashboard.show': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard.show']['types'],
  },
  'dashboard.publish': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/publish',
    tokens: [{"old":"/dashboard/publish","type":0,"val":"dashboard","end":""},{"old":"/dashboard/publish","type":0,"val":"publish","end":""}],
    types: placeholder as Registry['dashboard.publish']['types'],
  },
  'groups.index': {
    methods: ["GET","HEAD"],
    pattern: '/groups',
    tokens: [{"old":"/groups","type":0,"val":"groups","end":""}],
    types: placeholder as Registry['groups.index']['types'],
  },
  'groups.store': {
    methods: ["POST"],
    pattern: '/groups',
    tokens: [{"old":"/groups","type":0,"val":"groups","end":""}],
    types: placeholder as Registry['groups.store']['types'],
  },
  'groups.show': {
    methods: ["GET","HEAD"],
    pattern: '/groups/:id',
    tokens: [{"old":"/groups/:id","type":0,"val":"groups","end":""},{"old":"/groups/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['groups.show']['types'],
  },
  'groups.update': {
    methods: ["PUT","PATCH"],
    pattern: '/groups/:id',
    tokens: [{"old":"/groups/:id","type":0,"val":"groups","end":""},{"old":"/groups/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['groups.update']['types'],
  },
  'groups.destroy': {
    methods: ["DELETE"],
    pattern: '/groups/:id',
    tokens: [{"old":"/groups/:id","type":0,"val":"groups","end":""},{"old":"/groups/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['groups.destroy']['types'],
  },
  'groups.members.store': {
    methods: ["POST"],
    pattern: '/groups/:id/members',
    tokens: [{"old":"/groups/:id/members","type":0,"val":"groups","end":""},{"old":"/groups/:id/members","type":1,"val":"id","end":""},{"old":"/groups/:id/members","type":0,"val":"members","end":""}],
    types: placeholder as Registry['groups.members.store']['types'],
  },
  'groups.members.update': {
    methods: ["PUT"],
    pattern: '/groups/:id/members/:memberId',
    tokens: [{"old":"/groups/:id/members/:memberId","type":0,"val":"groups","end":""},{"old":"/groups/:id/members/:memberId","type":1,"val":"id","end":""},{"old":"/groups/:id/members/:memberId","type":0,"val":"members","end":""},{"old":"/groups/:id/members/:memberId","type":1,"val":"memberId","end":""}],
    types: placeholder as Registry['groups.members.update']['types'],
  },
  'groups.members.destroy': {
    methods: ["DELETE"],
    pattern: '/groups/:id/members/:memberId',
    tokens: [{"old":"/groups/:id/members/:memberId","type":0,"val":"groups","end":""},{"old":"/groups/:id/members/:memberId","type":1,"val":"id","end":""},{"old":"/groups/:id/members/:memberId","type":0,"val":"members","end":""},{"old":"/groups/:id/members/:memberId","type":1,"val":"memberId","end":""}],
    types: placeholder as Registry['groups.members.destroy']['types'],
  },
  'groups.datasets.store': {
    methods: ["POST"],
    pattern: '/groups/:id/datasets',
    tokens: [{"old":"/groups/:id/datasets","type":0,"val":"groups","end":""},{"old":"/groups/:id/datasets","type":1,"val":"id","end":""},{"old":"/groups/:id/datasets","type":0,"val":"datasets","end":""}],
    types: placeholder as Registry['groups.datasets.store']['types'],
  },
  'groups.datasets.destroy': {
    methods: ["DELETE"],
    pattern: '/groups/:id/datasets/:datasetId',
    tokens: [{"old":"/groups/:id/datasets/:datasetId","type":0,"val":"groups","end":""},{"old":"/groups/:id/datasets/:datasetId","type":1,"val":"id","end":""},{"old":"/groups/:id/datasets/:datasetId","type":0,"val":"datasets","end":""},{"old":"/groups/:id/datasets/:datasetId","type":1,"val":"datasetId","end":""}],
    types: placeholder as Registry['groups.datasets.destroy']['types'],
  },
  'auth.sign_in.show': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.sign_in.show']['types'],
  },
  'auth.sign_in.handle': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.sign_in.handle']['types'],
  },
  'auth.sign_out.handle': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.sign_out.handle']['types'],
  },
  'auth.sign_up.show': {
    methods: ["GET","HEAD"],
    pattern: '/sign-up',
    tokens: [{"old":"/sign-up","type":0,"val":"sign-up","end":""}],
    types: placeholder as Registry['auth.sign_up.show']['types'],
  },
  'auth.sign_up.handle': {
    methods: ["POST"],
    pattern: '/sign-up',
    tokens: [{"old":"/sign-up","type":0,"val":"sign-up","end":""}],
    types: placeholder as Registry['auth.sign_up.handle']['types'],
  },
  'auth.forgot_password.show': {
    methods: ["GET","HEAD"],
    pattern: '/forgot-password',
    tokens: [{"old":"/forgot-password","type":0,"val":"forgot-password","end":""}],
    types: placeholder as Registry['auth.forgot_password.show']['types'],
  },
  'auth.forgot_password.handle': {
    methods: ["POST"],
    pattern: '/forgot-password',
    tokens: [{"old":"/forgot-password","type":0,"val":"forgot-password","end":""}],
    types: placeholder as Registry['auth.forgot_password.handle']['types'],
  },
  'auth.reset_password.show': {
    methods: ["GET","HEAD"],
    pattern: '/reset-password/:token',
    tokens: [{"old":"/reset-password/:token","type":0,"val":"reset-password","end":""},{"old":"/reset-password/:token","type":1,"val":"token","end":""}],
    types: placeholder as Registry['auth.reset_password.show']['types'],
  },
  'auth.reset_password.handle': {
    methods: ["POST"],
    pattern: '/reset-password/:token',
    tokens: [{"old":"/reset-password/:token","type":0,"val":"reset-password","end":""},{"old":"/reset-password/:token","type":1,"val":"token","end":""}],
    types: placeholder as Registry['auth.reset_password.handle']['types'],
  },
  'social.create': {
    methods: ["GET","HEAD"],
    pattern: '/:provider/redirect',
    tokens: [{"old":"/:provider/redirect","type":1,"val":"provider","end":""},{"old":"/:provider/redirect","type":0,"val":"redirect","end":""}],
    types: placeholder as Registry['social.create']['types'],
  },
  'social.callback': {
    methods: ["GET","HEAD"],
    pattern: '/:provider/callback',
    tokens: [{"old":"/:provider/callback","type":1,"val":"provider","end":""},{"old":"/:provider/callback","type":0,"val":"callback","end":""}],
    types: placeholder as Registry['social.callback']['types'],
  },
  'locale.switch': {
    methods: ["POST"],
    pattern: '/switch/:locale',
    tokens: [{"old":"/switch/:locale","type":0,"val":"switch","end":""},{"old":"/switch/:locale","type":1,"val":"locale","end":""}],
    types: placeholder as Registry['locale.switch']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
