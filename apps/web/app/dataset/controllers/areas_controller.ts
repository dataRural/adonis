import type { HttpContext } from '@adonisjs/core/http'
import DatasetArea from '../models/dataset_area.js'
import Dataset from '../models/dataset.js'
import Roles from '#users/enums/role'

export default class AreasController {
  /**
   * List all areas (JSON endpoint for public / authenticated forms)
   */
  public async list({ response }: HttpContext) {
    const areas = await DatasetArea.query().orderBy('name', 'asc')
    return response.ok(areas)
  }

  /**
   * List all areas for admin management with dataset counts
   */
  public async index({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user || Number(user.roleId) !== Roles.ADMIN) {
      return response.forbidden({ error: 'Acesso restrito a administradores.' })
    }

    const areas = await DatasetArea.query().orderBy('name', 'asc')
    
    // Count datasets per area
    const counts = await Dataset.query()
      .select('area')
      .count('* as total')
      .groupBy('area')

    const countMap: Record<string, number> = {}
    counts.forEach((c: any) => {
      countMap[c.area] = Number(c.$extras.total || 0)
    })

    const payload = areas.map((a) => ({
      id: a.id,
      code: a.code,
      name: a.name,
      icon: a.icon,
      color: a.color,
      description: a.description,
      datasetCount: countMap[a.code] || 0,
    }))

    return response.ok(payload)
  }

  /**
   * Store a new dataset area (Admin only)
   */
  public async store({ auth, request, response }: HttpContext) {
    const user = auth.user
    if (!user || Number(user.roleId) !== Roles.ADMIN) {
      return response.forbidden({ error: 'Acesso restrito a administradores.' })
    }

    const name = request.input('name')
    let code = request.input('code')
    const icon = request.input('icon') || 'database'
    const color = request.input('color') || 'var(--brand-blue)'
    const description = request.input('description') || null

    if (!name || !name.trim()) {
      return response.badRequest({ error: 'O nome da área é obrigatório.' })
    }

    if (!code || !code.trim()) {
      code = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
    } else {
      code = code.toLowerCase().trim()
    }

    const existing = await DatasetArea.findBy('code', code)
    if (existing) {
      return response.badRequest({ error: 'Já existe uma área com este código.' })
    }

    const area = await DatasetArea.create({
      code,
      name: name.trim(),
      icon,
      color,
      description,
    })

    return response.created(area)
  }

  /**
   * Update an existing dataset area (Admin only)
   */
  public async update({ auth, request, response, params }: HttpContext) {
    const user = auth.user
    if (!user || Number(user.roleId) !== Roles.ADMIN) {
      return response.forbidden({ error: 'Acesso restrito a administradores.' })
    }

    const area = await DatasetArea.find(params.id)
    if (!area) {
      return response.notFound({ error: 'Área não encontrada.' })
    }

    const name = request.input('name')
    const icon = request.input('icon')
    const color = request.input('color')
    const description = request.input('description')

    if (name && name.trim()) area.name = name.trim()
    if (icon) area.icon = icon
    if (color) area.color = color
    if (description !== undefined) area.description = description

    await area.save()

    return response.ok(area)
  }

  /**
   * Delete a dataset area (Admin only)
   */
  public async destroy({ auth, response, params }: HttpContext) {
    const user = auth.user
    if (!user || Number(user.roleId) !== Roles.ADMIN) {
      return response.forbidden({ error: 'Acesso restrito a administradores.' })
    }

    const area = await DatasetArea.find(params.id)
    if (!area) {
      return response.notFound({ error: 'Área não encontrada.' })
    }

    await area.delete()

    return response.ok({ success: true })
  }
}
