import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'marketing.show': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.invite.handle': { paramsTuple?: []; params?: {} }
    'users.impersonate.handle': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.search': { paramsTuple?: []; params?: {} }
    'user.profile': { paramsTuple?: []; params?: {} }
    'users.public_profile': { paramsTuple: [ParamValue]; params: {'username': ParamValue} }
    'settings.index': { paramsTuple?: []; params?: {} }
    'profile.update': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'tokens.index': { paramsTuple?: []; params?: {} }
    'tokens.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tokens.store': { paramsTuple?: []; params?: {} }
    'password.update': { paramsTuple?: []; params?: {} }
    'password.show': { paramsTuple?: []; params?: {} }
    'auth.sign_in.show': { paramsTuple?: []; params?: {} }
    'auth.sign_in.handle': { paramsTuple?: []; params?: {} }
    'auth.sign_out.handle': { paramsTuple?: []; params?: {} }
    'auth.sign_up.show': { paramsTuple?: []; params?: {} }
    'auth.sign_up.handle': { paramsTuple?: []; params?: {} }
    'auth.forgot_password.show': { paramsTuple?: []; params?: {} }
    'auth.forgot_password.handle': { paramsTuple?: []; params?: {} }
    'auth.reset_password.show': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'auth.reset_password.handle': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'social.create': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'social.callback': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'locale.switch': { paramsTuple: [ParamValue]; params: {'locale': ParamValue} }
    'areas.list': { paramsTuple?: []; params?: {} }
    'admin_areas.index': { paramsTuple?: []; params?: {} }
    'admin_areas.store': { paramsTuple?: []; params?: {} }
    'admin_areas.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_areas.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'datasets.viewer': { paramsTuple?: []; params?: {} }
    'licenses.index': { paramsTuple?: []; params?: {} }
    'datasets.privacy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'datasets.like.toggle': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'datasets.favorite.toggle': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'favorites.index': { paramsTuple?: []; params?: {} }
    'datasets.version.new': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'datasets.version.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'datasets.version.restore': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'versionId': ParamValue} }
    'datasets.version.delete': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'versionId': ParamValue} }
    'datasets.version.download': { paramsTuple: [ParamValue,ParamValue]; params: {'datasetId': ParamValue,'versionId': ParamValue} }
    'datasets.explore': { paramsTuple?: []; params?: {} }
    'datasets.store': { paramsTuple?: []; params?: {} }
    'datasets.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.show': { paramsTuple?: []; params?: {} }
    'dashboard.publish': { paramsTuple?: []; params?: {} }
    'groups.index': { paramsTuple?: []; params?: {} }
    'groups.store': { paramsTuple?: []; params?: {} }
    'groups.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.members.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.members.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'memberId': ParamValue} }
    'groups.members.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'memberId': ParamValue} }
    'groups.datasets.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.datasets.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'datasetId': ParamValue} }
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'marketing.show': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.search': { paramsTuple?: []; params?: {} }
    'user.profile': { paramsTuple?: []; params?: {} }
    'users.public_profile': { paramsTuple: [ParamValue]; params: {'username': ParamValue} }
    'settings.index': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'tokens.index': { paramsTuple?: []; params?: {} }
    'password.show': { paramsTuple?: []; params?: {} }
    'auth.sign_in.show': { paramsTuple?: []; params?: {} }
    'auth.sign_up.show': { paramsTuple?: []; params?: {} }
    'auth.forgot_password.show': { paramsTuple?: []; params?: {} }
    'auth.reset_password.show': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'social.create': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'social.callback': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'areas.list': { paramsTuple?: []; params?: {} }
    'admin_areas.index': { paramsTuple?: []; params?: {} }
    'datasets.viewer': { paramsTuple?: []; params?: {} }
    'licenses.index': { paramsTuple?: []; params?: {} }
    'favorites.index': { paramsTuple?: []; params?: {} }
    'datasets.version.new': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'datasets.version.download': { paramsTuple: [ParamValue,ParamValue]; params: {'datasetId': ParamValue,'versionId': ParamValue} }
    'datasets.explore': { paramsTuple?: []; params?: {} }
    'datasets.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.show': { paramsTuple?: []; params?: {} }
    'dashboard.publish': { paramsTuple?: []; params?: {} }
    'groups.index': { paramsTuple?: []; params?: {} }
    'groups.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'marketing.show': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.search': { paramsTuple?: []; params?: {} }
    'user.profile': { paramsTuple?: []; params?: {} }
    'users.public_profile': { paramsTuple: [ParamValue]; params: {'username': ParamValue} }
    'settings.index': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'tokens.index': { paramsTuple?: []; params?: {} }
    'password.show': { paramsTuple?: []; params?: {} }
    'auth.sign_in.show': { paramsTuple?: []; params?: {} }
    'auth.sign_up.show': { paramsTuple?: []; params?: {} }
    'auth.forgot_password.show': { paramsTuple?: []; params?: {} }
    'auth.reset_password.show': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'social.create': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'social.callback': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'areas.list': { paramsTuple?: []; params?: {} }
    'admin_areas.index': { paramsTuple?: []; params?: {} }
    'datasets.viewer': { paramsTuple?: []; params?: {} }
    'licenses.index': { paramsTuple?: []; params?: {} }
    'favorites.index': { paramsTuple?: []; params?: {} }
    'datasets.version.new': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'datasets.version.download': { paramsTuple: [ParamValue,ParamValue]; params: {'datasetId': ParamValue,'versionId': ParamValue} }
    'datasets.explore': { paramsTuple?: []; params?: {} }
    'datasets.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.show': { paramsTuple?: []; params?: {} }
    'dashboard.publish': { paramsTuple?: []; params?: {} }
    'groups.index': { paramsTuple?: []; params?: {} }
    'groups.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'users.store': { paramsTuple?: []; params?: {} }
    'users.invite.handle': { paramsTuple?: []; params?: {} }
    'users.impersonate.handle': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.update': { paramsTuple?: []; params?: {} }
    'tokens.store': { paramsTuple?: []; params?: {} }
    'auth.sign_in.handle': { paramsTuple?: []; params?: {} }
    'auth.sign_out.handle': { paramsTuple?: []; params?: {} }
    'auth.sign_up.handle': { paramsTuple?: []; params?: {} }
    'auth.forgot_password.handle': { paramsTuple?: []; params?: {} }
    'auth.reset_password.handle': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'locale.switch': { paramsTuple: [ParamValue]; params: {'locale': ParamValue} }
    'admin_areas.store': { paramsTuple?: []; params?: {} }
    'datasets.privacy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'datasets.like.toggle': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'datasets.favorite.toggle': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'datasets.version.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'datasets.version.restore': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'versionId': ParamValue} }
    'datasets.version.delete': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'versionId': ParamValue} }
    'datasets.store': { paramsTuple?: []; params?: {} }
    'groups.store': { paramsTuple?: []; params?: {} }
    'groups.members.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.datasets.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'password.update': { paramsTuple?: []; params?: {} }
    'admin_areas.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.members.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'memberId': ParamValue} }
  }
  PATCH: {
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_areas.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tokens.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_areas.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.members.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'memberId': ParamValue} }
    'groups.datasets.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'datasetId': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}