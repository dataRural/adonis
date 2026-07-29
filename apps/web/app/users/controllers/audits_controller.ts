import type { HttpContext } from '@adonisjs/core/http'
import { Audit } from '@filipebraida/adonis-auditing'
import Roles from '#users/enums/role'
import User from '#users/models/user'

export default class AuditsController {
  async index({ request, response, auth }: HttpContext) {
    const user = auth.user!
    if (Number(user.roleId) !== Roles.ADMIN) {
      return response.forbidden({ error: 'Apenas administradores podem visualizar os logs de auditoria.' })
    }

    const page = request.input('page', 1)
    const limit = request.input('limit', 15)
    const event = request.input('event')
    const auditableType = request.input('auditableType')
    const search = request.input('search')

    const query = Audit.query().orderBy('id', 'desc')

    if (event && event !== 'all') {
      query.where('event', event)
    }

    if (auditableType && auditableType !== 'all') {
      query.where('auditableType', auditableType)
    }

    if (search) {
      query.where((q) => {
        q.whereILike('event', `%${search}%`)
          .orWhereILike('auditableType', `%${search}%`)
          .orWhereILike('userId', `%${search}%`)
          .orWhereILike('auditComment', `%${search}%`)
      })
    }

    const audits = await query.paginate(page, limit)
    const auditList = audits.all()

    const userIds = [...new Set(auditList.map((a) => a.userId).filter(Boolean))]
    const usersMap: Record<string, string> = {}
    if (userIds.length > 0) {
      const validIds = userIds.map((id) => Number(id)).filter((id) => !isNaN(id))
      if (validIds.length > 0) {
        const users = await User.query().whereIn('id', validIds)
        users.forEach((u) => {
          usersMap[String(u.id)] = u.fullName || u.username || u.email
        })
      }
    }

    const rows = auditList.map((audit) => {
      const json = audit.toJSON()
      const meta = (json.metadata as Record<string, any>) || {}
      return {
        ...json,
        ipAddress: json.ipAddress || meta.ip_address || meta.ipAddress || null,
        userAgent: json.userAgent || meta.user_agent || meta.userAgent || null,
        url: json.url || meta.url || null,
        userName: json.userId ? usersMap[String(json.userId)] || `Usuário #${json.userId}` : 'Sistema / Anônimo',
      }
    })

    return response.ok({
      data: rows,
      meta: audits.getMeta(),
    })
  }
}
