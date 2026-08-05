/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  drive: {
    fs: {
      serve: typeof routes['drive.fs.serve']
    }
  }
  marketing: {
    show: typeof routes['marketing.show']
  }
  auth: {
    signIn: {
      show: typeof routes['auth.sign_in.show']
      handle: typeof routes['auth.sign_in.handle']
    }
    signOut: {
      handle: typeof routes['auth.sign_out.handle']
    }
    signUp: {
      show: typeof routes['auth.sign_up.show']
      handle: typeof routes['auth.sign_up.handle']
    }
    forgotPassword: {
      show: typeof routes['auth.forgot_password.show']
      handle: typeof routes['auth.forgot_password.handle']
    }
    resetPassword: {
      show: typeof routes['auth.reset_password.show']
      handle: typeof routes['auth.reset_password.handle']
    }
  }
  social: {
    create: typeof routes['social.create']
    callback: typeof routes['social.callback']
  }
  locale: {
    switch: typeof routes['locale.switch']
  }
  admin: {
    index: typeof routes['admin.index']
    store: typeof routes['admin.store']
    update: typeof routes['admin.update']
    destroy: typeof routes['admin.destroy']
    audits: typeof routes['admin.audits']
  }
  users: {
    invite: {
      handle: typeof routes['users.invite.handle']
    }
    impersonate: {
      handle: typeof routes['users.impersonate.handle']
    }
    search: typeof routes['users.search']
    publicProfile: typeof routes['users.public_profile']
  }
  user: {
    profile: typeof routes['user.profile']
  }
  settings: {
    index: typeof routes['settings.index']
  }
  profile: {
    update: typeof routes['profile.update']
    show: typeof routes['profile.show']
  }
  tokens: {
    index: typeof routes['tokens.index']
    destroy: typeof routes['tokens.destroy']
    store: typeof routes['tokens.store']
  }
  password: {
    update: typeof routes['password.update']
    show: typeof routes['password.show']
  }
  groups: {
    index: typeof routes['groups.index']
    store: typeof routes['groups.store']
    show: typeof routes['groups.show']
    update: typeof routes['groups.update']
    destroy: typeof routes['groups.destroy']
    members: {
      store: typeof routes['groups.members.store']
      update: typeof routes['groups.members.update']
      destroy: typeof routes['groups.members.destroy']
    }
    datasets: {
      store: typeof routes['groups.datasets.store']
      destroy: typeof routes['groups.datasets.destroy']
    }
  }
  areas: {
    list: typeof routes['areas.list']
  }
  adminAreas: {
    index: typeof routes['admin_areas.index']
    store: typeof routes['admin_areas.store']
    update: typeof routes['admin_areas.update']
    destroy: typeof routes['admin_areas.destroy']
  }
  datasets: {
    viewer: typeof routes['datasets.viewer']
    privacy: typeof routes['datasets.privacy']
    like: {
      toggle: typeof routes['datasets.like.toggle']
    }
    favorite: {
      toggle: typeof routes['datasets.favorite.toggle']
    }
    version: {
      new: typeof routes['datasets.version.new']
      store: typeof routes['datasets.version.store']
      restore: typeof routes['datasets.version.restore']
      delete: typeof routes['datasets.version.delete']
      download: typeof routes['datasets.version.download']
      downloadAll: typeof routes['datasets.version.download_all']
      readme: {
        download: typeof routes['datasets.version.readme.download']
      }
      file: {
        download: typeof routes['datasets.version.file.download']
      }
    }
    explore: typeof routes['datasets.explore']
    store: typeof routes['datasets.store']
    show: typeof routes['datasets.show']
    destroy: typeof routes['datasets.destroy']
  }
  licenses: {
    index: typeof routes['licenses.index']
  }
  favorites: {
    index: typeof routes['favorites.index']
  }
  dashboard: {
    show: typeof routes['dashboard.show']
    publish: typeof routes['dashboard.publish']
  }
}
