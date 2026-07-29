import type { HttpContext } from '@adonisjs/core/http'
import type { UserResolver as UserResolverContract } from '@filipebraida/adonis-auditing/types'

export default class UserResolver implements UserResolverContract {
  async resolve(ctx: HttpContext) {
    if (!ctx || !ctx.auth) return null
    const user = ctx.auth.user
    if (!user) return null

    return {
      type: 'user',
      id: String(user.id),
    }
  }
}
