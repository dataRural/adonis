import type { HttpContext } from '@adonisjs/core/http'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import Dataset from '#app/dataset/models/dataset'
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

        const AREA_COLORS: Record<string, string> = {
          agro: 'var(--brand-green)',
          vet: 'var(--brand-orange)',
          clima: 'var(--brand-sky)',
          bio: 'var(--brand-lightgreen)',
          flor: 'var(--brand-teal)',
          exatas: 'var(--brand-blue)',
          quim: 'var(--brand-purple)',
          zoo: 'var(--brand-amber)',
          soc: 'var(--brand-rose)',
          econ: 'var(--brand-indigo)',
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
      { val: '10', label: 'Áreas do conhecimento', color: 'var(--brand-green)' },
      { val: String(groupsCount), label: 'Grupos de pesquisa', color: 'var(--brand-yellow)' },
      { val: String(usersCount), label: 'Pesquisadores', color: 'var(--brand-orange)' },
    ]

    const areaCountsMap: Record<string, number> = {}
    publicDatasets.forEach((d) => {
      if (d.area) {
        areaCountsMap[d.area] = (areaCountsMap[d.area] || 0) + 1
      }
    })

    const categoriesPayload = [
      { id: 'agro', name: 'Agronomia', count: areaCountsMap['agro'] || 0, icon: 'sprout', color: 'var(--brand-green)' },
      { id: 'vet', name: 'Veterinária', count: areaCountsMap['vet'] || 0, icon: 'paw', color: 'var(--brand-orange)' },
      { id: 'clima', name: 'Clima & Meteorologia', count: areaCountsMap['clima'] || 0, icon: 'cloud', color: 'var(--brand-sky)' },
      { id: 'bio', name: 'Ciências Biológicas', count: areaCountsMap['bio'] || 0, icon: 'leaf', color: 'var(--brand-lightgreen)' },
      { id: 'flor', name: 'Florestas', count: areaCountsMap['flor'] || 0, icon: 'tree', color: 'var(--brand-teal)' },
      { id: 'exatas', name: 'Ciências Exatas', count: areaCountsMap['exatas'] || 0, icon: 'chart', color: 'var(--brand-blue)' },
      { id: 'quim', name: 'Química', count: areaCountsMap['quim'] || 0, icon: 'flask', color: 'var(--brand-purple)' },
      { id: 'zoo', name: 'Zootecnia', count: areaCountsMap['zoo'] || 0, icon: 'database', color: 'var(--brand-amber)' },
      { id: 'soc', name: 'Ciências Sociais', count: areaCountsMap['soc'] || 0, icon: 'users', color: 'var(--brand-rose)' },
      { id: 'econ', name: 'Economia & Gestão', count: areaCountsMap['econ'] || 0, icon: 'chart', color: 'var(--brand-indigo)' },
    ]

    return inertia.render('marketing/show', {
      datasets: datasetsPayload,
      stats: statsPayload,
      categories: categoriesPayload,
    })
  }
}
