import type { HttpContext } from '@adonisjs/core/http'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import Dataset from '#app/dataset/models/dataset'

import GroupMember from '#app/groups/models/group_member'

export default class MarketingController {
  public async handle({ inertia, auth }: HttpContext) {
    await auth.check()
    const currentUserId = auth.user?.id ?? null

    let query = Dataset.query().preload('versions').preload('license').orderBy('updatedAt', 'desc')

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

        const usability = d.usabilityScore !== null && d.usabilityScore !== undefined ? String(d.usabilityScore) : '8.5'

        return {
          id: d.id,
          title: d.name,
          unit: d.unit,
          desc,
          tags: d.tags || [],
          cat: d.area,
          format,
          tint: 'var(--brand-sky)',
          size,
          rows: '---',
          downloads: 0,
          dl: '0',
          updated: d.updatedAt ? d.updatedAt.toRelative() || 'recentemente' : 'recentemente',
          license: d.license ? d.license.name : 'CC BY 4.0',
          usability,
          featured: true,
          recent: index < 3,
          order: index + 1,
        }
      })
    )

    return inertia.render('marketing/show', { datasets: datasetsPayload })
  }
}
