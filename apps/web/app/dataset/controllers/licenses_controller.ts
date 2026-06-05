import type { HttpContext } from '@adonisjs/core/http'
import License from '#app/dataset/models/license'

export default class LicensesController {
  public async index({ response }: HttpContext) {
    const licenses = await License.query().orderBy('id', 'asc')
    return response.json(licenses)
  }
}
