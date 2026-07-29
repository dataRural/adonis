import { BaseTransformer } from '@adonisjs/core/transformers'
import type User from '#users/models/user'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    const user = this.resource
    const url = user.avatar?.url
    const thumbnail = user.avatar?.getVariant('thumbnail')?.url

    return {
      id: user.id,
      roleId: user.roleId,
      fullName: user.fullName,
      username: user.username || user.email.split('@')[0],
      email: user.email,
      bio: user.bio ?? null,
      institution: user.institution ?? null,
      location: user.location ?? null,
      avatarUrl: thumbnail ? thumbnail : (url ? url : user.avatarUrl),
      createdAt: user.createdAt.toISO()!,
      updatedAt: user.updatedAt ? user.updatedAt.toISO()! : '',
    }
  }
}
