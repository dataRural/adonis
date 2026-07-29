import type { HttpContext } from '@adonisjs/core/http'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import Dataset from '#app/dataset/models/dataset'
import DatasetArea from '#app/dataset/models/dataset_area'
import GroupMember from '#app/groups/models/group_member'
import Group from '#app/groups/models/group'
import User from '#users/models/user'

export default class MarketingController {
  public async handle({ inertia, auth }: HttpContext) {
    await auth.check()
    const currentUserId = auth.user?.id ?? null

    let query = Dataset.query().preload('versions').preload('license').preload('likes').orderBy('updatedAt', 'desc')

    if (currentUserId) {
      const userGroupIds = (
        await GroupMember.query().where('userId', currentUserId).select('groupId')
      ).map((m) => m.groupId)

      query = query.where((q) => {
        q.where('is_public', true).orWhere('user_id', currentUserId)
        if (userGroupIds.length > 0) {
          q.orWhereIn('group_id', userGroupIds)
        }
      })
    } else {
      query = query.where('is_public', true)
    }

    const publicDatasets = await query

    const dbAreas = await DatasetArea.query().orderBy('name', 'asc')
    const AREA_COLORS: Record<string, string> = {}
    dbAreas.forEach((a) => {
      AREA_COLORS[a.code] = a.color
    })

    const datasetsPayload = await Promise.all(
      publicDatasets.map(async (d, index) => {
        const latestVersion = d.versions[d.versions.length - 1]
        const versionName = latestVersion ? latestVersion.name : 'V1'

        let format = 'CSV'
        let size = '0 B'
        if (latestVersion && latestVersion.path) {
          const fileExt = latestVersion.path.name?.split('.').pop()?.toUpperCase()
          if (fileExt) format = fileExt

          const fileBytes = latestVersion.path.size
          if (fileBytes) {
            if (fileBytes > 1024 * 1024) {
              size = `${(fileBytes / (1024 * 1024)).toFixed(1)} MB`
            } else {
              size = `${(fileBytes / 1024).toFixed(1)} KB`
            }
          }
        }

        let desc = 'Nenhuma descrição fornecida.'
        if (latestVersion && d.path) {
          try {
            const readmePath = join(d.path, versionName, 'README.md')
            const readmeContent = await readFile(readmePath, 'utf8')
            const lines = readmeContent.split('\n').map(l => l.trim()).filter(l => l.length > 0)
            if (lines.length > 1) {
              desc = lines.slice(1).join(' ')
            } else if (lines.length === 1 && !lines[0].startsWith('#')) {
              desc = lines[0]
            }
          } catch {}
        }

        const usability = d.usabilityScore !== null && d.usabilityScore !== undefined ? String(d.usabilityScore) : '8.5'
        const tint = (d.area && AREA_COLORS[d.area]) ? AREA_COLORS[d.area] : 'var(--brand-blue)'

        const likesCount = d.likes ? d.likes.length : 0
        const isLiked = currentUserId ? d.likes.some((l) => Number(l.userId) === Number(currentUserId)) : false

        return {
          id: d.id,
          title: d.name,
          unit: d.unit,
          desc,
          tags: d.tags || [],
          cat: d.area,
          format,
          tint,
          size,
          rows: '---',
          downloads: likesCount,
          dl: String(likesCount),
          likesCount,
          isLiked,
          updated: d.updatedAt ? d.updatedAt.toRelative() || 'recentemente' : 'recentemente',
          license: d.license ? d.license.name : 'CC BY 4.0',
          usability,
          featured: true,
          recent: index < 3,
          order: index + 1,
        }
      })
    )

    const publicCountRes = await Dataset.query().where('is_public', true).count('* as total')
    const publicDatasetsCount = Number((publicCountRes[0] as any)?.$extras?.total || 0)

    const groupsCountRes = await Group.query().count('* as total')
    const groupsCount = Number((groupsCountRes[0] as any)?.$extras?.total || 0)

    const usersCountRes = await User.query().count('* as total')
    const usersCount = Number((usersCountRes[0] as any)?.$extras?.total || 0)

    const statsPayload = [
      { val: String(publicDatasetsCount), label: 'Datasets públicos', color: 'var(--brand-blue)' },
      { val: String(dbAreas.length), label: 'Áreas do conhecimento', color: 'var(--brand-green)' },
      { val: String(groupsCount), label: 'Grupos de pesquisa', color: 'var(--brand-yellow)' },
      { val: String(usersCount), label: 'Pesquisadores', color: 'var(--brand-orange)' },
    ]

    const areaCountsMap: Record<string, number> = {}
    publicDatasets.forEach((d) => {
      if (d.area) {
        areaCountsMap[d.area] = (areaCountsMap[d.area] || 0) + 1
      }
    })

    const categoriesPayload = dbAreas.map((a) => ({
      id: a.code,
      name: a.name,
      count: areaCountsMap[a.code] || 0,
      icon: a.icon || 'database',
      color: a.color || 'var(--brand-blue)',
    }))

    return inertia.render('marketing/show' as any, {
      datasets: datasetsPayload,
      stats: statsPayload,
      categories: categoriesPayload,
    })
  }
}
