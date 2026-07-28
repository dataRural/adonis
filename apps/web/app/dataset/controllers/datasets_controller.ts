import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import Database from '@adonisjs/lucid/services/db'

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import Dataset from '../models/dataset.js'
import DatasetVersion from '../models/dataset_version.js'
import DatasetLike from '../models/dataset_like.js'
import { addDatasetVersionValidator, createDatasetValidator, updateDatasetValidator } from '#app/dataset/validators'
import { attachmentManager } from '@jrmc/adonis-attachment'
import { marked } from 'marked'
import GroupMember from '#app/groups/models/group_member'
import GroupMemberRole from '#app/groups/enums/group_member_role'
import User from '#users/models/user'
import UserTransformer from '#users/transformers/user_transformer'

function sanitizePathSegment(value: string) {
  return value
    .trim()
    .replace(/[\\/]+/g, '-')
    .replace(/[:*?"<>|]+/g, '')
    .replace(/\s+/g, ' ')
}

function parseCsvLine(line: string) {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index++) {
    const char = line[index]
    const nextChar = line[index + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        index++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
      continue
    }

    current += char
  }

  values.push(current)
  return values
}

function parseCsvPreview(content: string, maxRows = 30) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (lines.length === 0) {
    return { headers: [] as string[], rows: [] as string[][] }
  }

  const headers = parseCsvLine(lines[0])
  const rows = lines.slice(1, maxRows + 1).map((line) => parseCsvLine(line))

  return { headers, rows }
}

function calculateColumnHistogram(rows: string[][], colIndex: number, binsCount = 8): number[] {
  const values: number[] = []

  for (const row of rows) {
    const val = row[colIndex]
    if (val !== undefined && val !== null) {
      const num = Number(val.trim())
      if (!Number.isNaN(num)) {
        values.push(num)
      }
    }
  }

  if (values.length === 0) {
    const freqs: Record<string, number> = {}
    for (const row of rows) {
      const val = row[colIndex] || ''
      freqs[val] = (freqs[val] || 0) + 1
    }
    const counts = Object.values(freqs).sort((a, b) => b - a).slice(0, binsCount)
    const maxCount = Math.max(...counts, 1)
    const result = counts.map((c) => c / maxCount)
    while (result.length < binsCount) {
      result.push(0)
    }
    return result
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min

  const bins = new Array(binsCount).fill(0)
  if (range === 0) {
    bins[0] = values.length
  } else {
    for (const val of values) {
      let binIdx = Math.floor(((val - min) / range) * binsCount)
      if (binIdx >= binsCount) {
        binIdx = binsCount - 1
      }
      bins[binIdx]++
    }
  }

  const maxBinCount = Math.max(...bins, 1)
  return bins.map((count) => count / maxBinCount)
}

function calculateColumnStats(rows: string[][], colIndex: number) {
  const values: number[] = []
  let nullsCount = 0

  for (const row of rows) {
    const val = row[colIndex]
    if (val === undefined || val === null || val.trim() === '') {
      nullsCount++
    } else {
      const num = Number(val.trim())
      if (!Number.isNaN(num)) {
        values.push(num)
      }
    }
  }

  const uniqueValues = new Set(rows.map((row) => row[colIndex]?.trim()).filter(Boolean))
  const distinct = uniqueValues.size

  const totalCount = rows.length || 1
  const valid = Math.round(((totalCount - nullsCount) / totalCount) * 100)

  if (values.length === 0) {
    return {
      kind: 'category' as const,
      icon: 'fileText',
      desc: `Coluna de texto com ${distinct} valores únicos.`,
      min: '---',
      mean: '---',
      max: '---',
      std: '---',
      range: '---',
      valid,
      distinct,
    }
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const sum = values.reduce((acc, val) => acc + val, 0)
  const mean = sum / values.length

  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length
  const std = Math.sqrt(variance)

  return {
    kind: 'number' as const,
    icon: 'sigma',
    desc: `Variável numérica contínua.`,
    min: min.toFixed(1),
    mean: mean.toFixed(1),
    max: max.toFixed(1),
    std: std.toFixed(1),
    range: `${min.toFixed(1)} a ${max.toFixed(1)}`,
    valid,
    distinct,
  }
}

function getNextVersionName(versionNames: string[]) {
  const maxVersion = versionNames.reduce((acc, versionName) => {
    const match = /^V(\d+)$/i.exec(versionName.trim())
    if (!match) {
      return acc
    }

    const value = Number(match[1])
    return Number.isFinite(value) ? Math.max(acc, value) : acc
  }, 0)

  return `V${maxVersion + 1}`
}

export default class DatasetsController {
  public async index({ inertia }: HttpContext) {
    return inertia.render('dataset/index', {})
  }

  public async viewer({ inertia, request, auth }: HttpContext) {
    const currentUserId = auth?.user?.id ?? null

    let datasetsQuery = Dataset.query()
      .preload('versions', (query) => {
        query.orderBy('id', 'desc')
      })
      .preload('license')
      .orderBy('id', 'desc')

    if (currentUserId) {
      const userGroupIds = (await GroupMember.query()
        .where('userId', currentUserId)
        .select('groupId')
      ).map((m) => m.groupId)

      datasetsQuery = datasetsQuery.where((q) => {
        q.where('is_public', true)
          .orWhere('user_id', currentUserId)
        if (userGroupIds.length > 0) {
          q.orWhereIn('group_id', userGroupIds)
        }
      })
    } else {
      datasetsQuery = datasetsQuery.where('is_public', true)
    }

    const datasets = await datasetsQuery

    const datasetId = Number(request.input('datasetId')) || null
    const versionId = Number(request.input('versionId')) || null

    const selectedDataset = datasetId
      ? datasets.find((dataset) => dataset.id === datasetId) || datasets[0]
      : datasets[0]

    const selectedVersion = selectedDataset
      ? versionId
        ? selectedDataset.versions.find((version) => version.id === versionId) || selectedDataset.versions[0]
        : selectedDataset.versions[0]
      : null

    const suggestedVersionName = selectedDataset
      ? getNextVersionName(selectedDataset.versions.map((version) => version.name))
      : 'V1'

    let previewHeaders: string[] = []
    let previewRows: string[][] = []
    let previewError: string | null = null
    let readmeContent: string | null = null
    let readmeError: string | null = null

    if (selectedVersion) {
      try {
        const buffer = await selectedVersion.path.getBuffer()
        const csvContent = buffer.toString('utf8')
        const parsed = parseCsvPreview(csvContent)
        previewHeaders = parsed.headers
        previewRows = parsed.rows
      } catch {
        previewError = 'Unable to read dataset file from disk.'
      }

      try {
        const candidate1 = selectedDataset ? join(selectedDataset.path, selectedVersion.name, 'README.md') : null

        if (candidate1) {
          try {
            readmeContent = await readFile(candidate1, 'utf8')
          } catch { }
        }

        if (!readmeContent) {
          try {
            const attachPath = (selectedVersion.path && (selectedVersion.path.path || selectedVersion.path)) as string
            const readmePath = join(dirname(attachPath), 'README.md')
            readmeContent = await readFile(readmePath, 'utf8')
          } catch { }
        }

        if (!readmeContent) {
          readmeError = 'Unable to read README.md for this version.'
        }
      } catch {
        readmeError = 'Unable to read README.md for this version.'
      }
    }

    const datasetsPayload = await Promise.all(
      datasets.map(async (dataset) => ({
        id: dataset.id,
        name: dataset.name,
        path: dataset.path,
        isPublic: dataset.isPublic,
        userId: dataset.userId,
        unit: dataset.unit,
        area: dataset.area,
        period: dataset.period,
        region: dataset.region,
        tags: dataset.tags,
        license: dataset.license
          ? {
              id: dataset.license.id,
              name: dataset.license.name,
              description: dataset.license.description,
            }
          : null,
        versions: await Promise.all(
          dataset.versions.map(async (version) => ({
            id: version.id,
            name: version.name,
            path: await version.path.getUrl(),
            originalName: version.path.originalName ?? null,
          }))
        ),
      }))
    )

    return inertia.render('dataset/view', {
      datasets: datasetsPayload,
      selectedDatasetId: selectedDataset ? selectedDataset.id : null,
      selectedVersionId: selectedVersion ? selectedVersion.id : null,
      suggestedVersionName,
      previewPath: selectedVersion ? await selectedVersion.path.getUrl() : null,
      previewHeaders,
      previewRows,
      previewError,
      readmeContent,
      readmeError,
    })
  }

  public async addVersion({ params, request, response, session, auth }: HttpContext) {
    const dataset = await Dataset.query().where('id', params.id).preload('versions').firstOrFail()

    await auth.check()
    const currentUserId = auth.user?.id ?? null
    let canAddVersion = currentUserId ? Number(currentUserId) === Number(dataset.userId) : false

    if (!canAddVersion && currentUserId && dataset.groupId) {
      const membership = await GroupMember.query()
        .where('groupId', dataset.groupId)
        .where('userId', currentUserId)
        .whereIn('role', [GroupMemberRole.OWNER, GroupMemberRole.ADMIN, GroupMemberRole.EDITOR])
        .first()
      canAddVersion = !!membership
    }

    if (!canAddVersion) {
      session.flash('error', 'You are not authorized to update this dataset.')
      return response.redirect().toPath(`/datasets/view?datasetId=${dataset.id}`)
    }

    const payload = await request.validateUsing(addDatasetVersionValidator)
    const datasetFile = request.file('file')

    if (!datasetFile) {
      session.flash('error', 'Please select a CSV file to upload.')
      return response.redirect().toPath(`/datasets/view?datasetId=${dataset.id}`)
    }

    const suggestedVersionName = getNextVersionName(dataset.versions.map((version) => version.name))
    const versionName = sanitizePathSegment(payload.version || suggestedVersionName)

    const existingVersion = await DatasetVersion.query()
      .where('dataset_id', dataset.id)
      .where('name', versionName)
      .first()

    if (existingVersion) {
      session.flash('error', `Version ${versionName} already exists for this dataset.`)
      return response.redirect().toPath(`/datasets/view?datasetId=${dataset.id}`)
    }

    try {
      const attachment = await attachmentManager.createFromFile(datasetFile)

      const rootPath = app.makePath('storage/datasets')
      const versionPath = join(dataset.path || rootPath, versionName)
      await mkdir(versionPath, { recursive: true })

      const readmePath = join(versionPath, 'README.md')
      const readmeLines = [
        `# ${dataset.name}`,
        '',
        payload.description ? payload.description : 'No description provided.',
      ]

      await writeFile(readmePath, `${readmeLines.join('\n')}\n`, 'utf8')

      const version = await DatasetVersion.create({
        datasetId: dataset.id,
        name: versionName,
        path: attachment,
      })

      session.flash('success', `Version ${versionName} saved successfully.`)
      return response.redirect().toPath(`/datasets/view?datasetId=${dataset.id}&versionId=${version.id}`)
    } catch (err) {
      console.error('Error saving dataset version (addVersion):', err)
      session.flash('error', `Unable to save the dataset version. ${err && (err as any).message ? (err as any).message : ''}`)
      return response.redirect().toPath(`/datasets/view?datasetId=${dataset.id}`)
    }
  }

  public async togglePrivacy({ params, request, response, session, auth }: HttpContext) {
    const dataset = await Dataset.findOrFail(params.id)

    await auth.check()
    const currentUserId = auth.user?.id ?? null
    let canToggle = currentUserId ? Number(currentUserId) === Number(dataset.userId) : false

    if (!canToggle && currentUserId && dataset.groupId) {
      const membership = await GroupMember.query()
        .where('groupId', dataset.groupId)
        .where('userId', currentUserId)
        .whereIn('role', [GroupMemberRole.OWNER, GroupMemberRole.ADMIN])
        .first()
      canToggle = !!membership
    }

    if (!canToggle) {
      session.flash('error', 'You are not authorized to change dataset privacy.')
      return response.redirect().toPath(`/datasets/view?datasetId=${dataset.id}`)
    }

    try {
      const bodyVal = request.input('isPublic')
      if (typeof bodyVal === 'undefined') {
        dataset.isPublic = !dataset.isPublic
      } else {
        dataset.isPublic = Boolean(bodyVal)
      }

      if (dataset.isPublic) {
        dataset.status = 'published'
      } else {
        dataset.status = 'unpublished'
      }

      await dataset.save()
      session.flash('success', dataset.isPublic ? 'Dataset publicado com sucesso.' : 'Dataset tornado privado.')
      return response.redirect().back()
    } catch (err) {
      session.flash('error', `Não foi possível alterar a visibilidade. ${err && (err as any).message ? (err as any).message : ''}`)
      return response.redirect().back()
    }
  }

  public async downloadVersion({ params, response, auth, session }: HttpContext) {
    const datasetId = Number(params.datasetId)
    const versionId = Number(params.versionId)

    const dataset = await Dataset.query().where('id', datasetId).firstOrFail()
    const version = await DatasetVersion.query().where('id', versionId).where('dataset_id', datasetId).firstOrFail()

    await auth.check()
    const currentUserId = auth.user?.id ?? null
    if (!dataset.isPublic && Number(currentUserId) !== Number(dataset.userId)) {
      // Check if user is a member of the dataset's group
      let hasGroupAccess = false
      if (currentUserId && dataset.groupId) {
        const membership = await GroupMember.query()
          .where('groupId', dataset.groupId)
          .where('userId', currentUserId)
          .first()
        hasGroupAccess = !!membership
      }
      if (!hasGroupAccess) {
        session.flash('error', 'You are not authorized to download this dataset.')
        return response.redirect().toPath(`/datasets/view?datasetId=${dataset.id}`)
      }
    }

    try {
      const buffer = await version.path.getBuffer()
      const originalName = version.path.originalName || null
      const filename = originalName || `${dataset.name}.csv`

      response.header('Content-Type', 'text/csv')
      response.header('Content-Disposition', `attachment; filename="${filename.replace(/\"/g, '')}"`)
      return response.send(buffer)
    } catch {
      session.flash('error', 'Unable to download file.')
      return response.redirect().toPath(`/datasets/view?datasetId=${dataset.id}`)
    }
  }

  public async store({ auth, request, response, session }: HttpContext) {
    const datasetId = request.input('id')

    if (datasetId) {
      const dataset = await Dataset.query()
        .where('id', datasetId)
        .preload('versions')
        .firstOrFail()

      let canEdit = dataset.userId === auth.user!.id
      if (!canEdit && dataset.groupId) {
        const membership = await GroupMember.query()
          .where('groupId', dataset.groupId)
          .where('userId', auth.user!.id)
          .whereIn('role', [GroupMemberRole.OWNER, GroupMemberRole.ADMIN, GroupMemberRole.EDITOR])
          .first()
        canEdit = !!membership
      }

      if (!canEdit) {
        session.flash('error', 'You are not authorized to edit this dataset.')
        return response.redirect().toPath('/dashboard')
      }

      const payload = await request.validateUsing(updateDatasetValidator, {
        meta: { datasetId: dataset.id },
      })

      if (payload.groupId) {
        const groupMembership = await GroupMember.query()
          .where('groupId', payload.groupId)
          .where('userId', auth.user!.id)
          .whereIn('role', [GroupMemberRole.OWNER, GroupMemberRole.ADMIN, GroupMemberRole.EDITOR])
          .first()

        if (!groupMembership) {
          session.flash('error', 'You are not authorized to assign datasets to this group.')
          return response.redirect().back()
        }
      }

      const datasetFile = request.file('file')
      const datasetName = sanitizePathSegment(payload.name)
      const licenseId = typeof payload.licenseId === 'number' ? payload.licenseId : null

      try {
        await Database.transaction(async (trx) => {
          dataset.merge({
            name: payload.name,
            isPublic: payload.isPublic ? true : false,
            licenseId,
            unit: payload.unit,
            area: payload.area,
            period: payload.period || null,
            region: payload.region || null,
            tags: payload.tags || [],
            usabilityScore: payload.usabilityScore !== undefined ? payload.usabilityScore : dataset.usabilityScore,
            status: payload.status || (payload.isPublic ? 'published' : 'unpublished'),
            groupId: payload.groupId || null,
          })
          await dataset.useTransaction(trx).save()

          if (datasetFile) {
            const attachment = await attachmentManager.createFromFile(datasetFile)
            const rootPath = app.makePath('storage/datasets')
            const datasetPath = join(rootPath, datasetName)
            const latestVersion = dataset.versions[dataset.versions.length - 1]
            const versionName = latestVersion ? latestVersion.name : 'V1'
            const versionPath = join(datasetPath, versionName)
            await mkdir(versionPath, { recursive: true })

            const readmePath = join(versionPath, 'README.md')
            const readmeLines = [
              `# ${payload.name}`,
              '',
              payload.description ? payload.description : 'No description provided.',
            ]
            await writeFile(readmePath, `${readmeLines.join('\n')}\n`, 'utf8')

            if (latestVersion) {
              latestVersion.merge({
                path: attachment,
              })
              await latestVersion.useTransaction(trx).save()
            } else {
              await DatasetVersion.create(
                {
                  datasetId: dataset.id,
                  name: versionName,
                  path: attachment,
                },
                { client: trx }
              )
            }
          } else {
            const latestVersion = dataset.versions[dataset.versions.length - 1]
            if (latestVersion) {
              const rootPath = app.makePath('storage/datasets')
              const datasetPath = dataset.path || join(rootPath, datasetName)
              const versionPath = join(datasetPath, latestVersion.name)
              await mkdir(versionPath, { recursive: true })

              const readmePath = join(versionPath, 'README.md')
              const readmeLines = [
                `# ${payload.name}`,
                '',
                payload.description ? payload.description : 'No description provided.',
              ]
              await writeFile(readmePath, `${readmeLines.join('\n')}\n`, 'utf8')
            }
          }
        })

        session.flash('success', 'Dataset updated successfully')
        return response.redirect().toPath('/dashboard')
      } catch (err) {
        console.error('Error updating dataset (store):', err)
        session.flash('error', `Unable to update the dataset. ${err && (err as any).message ? (err as any).message : ''}`)
        return response.redirect().back()
      }
    }

    const payload = await request.validateUsing(createDatasetValidator)
    const datasetFile = request.file('file')

    if (payload.groupId) {
      const groupMembership = await GroupMember.query()
        .where('groupId', payload.groupId)
        .where('userId', auth.user!.id)
        .whereIn('role', [GroupMemberRole.OWNER, GroupMemberRole.ADMIN, GroupMemberRole.EDITOR])
        .first()

      if (!groupMembership) {
        session.flash('error', 'You are not authorized to assign datasets to this group.')
        return response.redirect().back()
      }
    }

    if (!datasetFile) {
      session.flash('error', 'Please select a CSV file to upload.')
      return response.redirect().back()
    }

    const datasetName = sanitizePathSegment(payload.name)
    const versionName = sanitizePathSegment(payload.version || 'V1')
    const licenseId = typeof payload.licenseId === 'number' ? payload.licenseId : null

    try {
      const attachment = await attachmentManager.createFromFile(datasetFile)

      const rootPath = app.makePath('storage/datasets')
      const datasetPath = join(rootPath, datasetName)
      const versionPath = join(datasetPath, versionName)
      await mkdir(versionPath, { recursive: true })

      const readmePath = join(versionPath, 'README.md')
      const readmeLines = [
        `# ${payload.name}`,
        '',
        payload.description ? payload.description : 'No description provided.',
      ]

      await writeFile(readmePath, `${readmeLines.join('\n')}\n`, 'utf8')

      await Database.transaction(async (trx) => {
        const dataset = await Dataset.create(
          {
            name: payload.name,
            path: datasetPath,
            isPublic: payload.isPublic ? true : false,
            userId: auth.user!.id,
            licenseId,
            unit: payload.unit,
            area: payload.area,
            period: payload.period || null,
            region: payload.region || null,
            tags: payload.tags || [],
            usabilityScore: payload.usabilityScore !== undefined ? payload.usabilityScore : 8.5,
            status: payload.status || (payload.isPublic ? 'published' : 'unpublished'),
            groupId: payload.groupId || null,
          },
          { client: trx }
        )

        await DatasetVersion.create(
          {
            datasetId: dataset.id,
            name: versionName,
            path: attachment,
          },
          { client: trx }
        )
      })

      session.flash('success', 'Dataset saved successfully')
      return response.redirect().back()
    } catch (err) {
      console.error('Error saving dataset (store):', err)
      session.flash('error', `Unable to save the dataset. ${err && (err as any).message ? (err as any).message : ''}`)
      return response.redirect().back()
    }
  }

  public async show({ params, inertia, auth, response, session }: HttpContext) {
    const datasetId = Number(params.id)
    if (Number.isNaN(datasetId)) {
      return response.redirect().toPath('/dashboard')
    }

    const dataset = await Dataset.query()
      .where('id', datasetId)
      .preload('versions', (query) => {
        query.orderBy('id', 'desc')
      })
      .preload('license')
      .preload('likes')
      .preload('user')
      .preload('group')
      .first()

    if (!dataset) {
      return response.redirect().toPath('/dashboard')
    }

    await auth.check()
    const currentUserId = auth.user?.id ?? null
    const votesCount = dataset.likes ? dataset.likes.length : 0
    const isLiked = currentUserId ? dataset.likes.some(l => Number(l.userId) === Number(currentUserId)) : false
    if (!dataset.isPublic && Number(currentUserId) !== Number(dataset.userId)) {
      // Check if user is a member of the dataset's group
      let hasGroupAccess = false
      if (currentUserId && dataset.groupId) {
        const membership = await GroupMember.query()
          .where('groupId', dataset.groupId)
          .where('userId', currentUserId)
          .first()
        hasGroupAccess = !!membership
      }
      if (!hasGroupAccess) {
        session.flash('error', 'You are not authorized to view this dataset.')
        return response.redirect().back()
      }
    }

    const latestVersion = dataset.versions[0]

    let description = '<p>Nenhuma descrição fornecida.</p>'
    if (latestVersion && dataset.path) {
      try {
        const readmePath = join(dataset.path, latestVersion.name, 'README.md')
        const readmeContent = await readFile(readmePath, 'utf8')
        const lines = readmeContent.split('\n').map(l => l.trim()).filter(l => l.length > 0)
        let markdownText = ''
        if (lines.length > 1) {
          markdownText = lines.slice(1).join('\n')
        } else if (lines.length === 1 && !lines[0].startsWith('#')) {
          markdownText = lines[0]
        }
        if (markdownText) {
          description = await marked.parse(markdownText)
        }
      } catch {}
    }

    let previewHeaders: string[] = []
    let previewRows: string[][] = []
    let format = 'CSV'
    let sizeStr = '0 B'
    let totalRowCount = 0

    if (latestVersion && latestVersion.path) {
      try {
        const buffer = await latestVersion.path.getBuffer()
        const csvContent = buffer.toString('utf8')
        const preview = parseCsvPreview(csvContent, 100)
        previewHeaders = preview.headers
        previewRows = preview.rows

        // Count total lines in the CSV (excluding header and empty lines)
        const allLines = csvContent.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0)
        totalRowCount = Math.max(0, allLines.length - 1) // subtract header

        const fileBytes = latestVersion.path.size
        if (fileBytes) {
          if (fileBytes > 1024 * 1024) {
            sizeStr = `${(fileBytes / (1024 * 1024)).toFixed(1)} MB`
          } else {
            sizeStr = `${(fileBytes / 1024).toFixed(1)} KB`
          }
        }

        const fileExt = latestVersion.path.name?.split('.').pop()?.toUpperCase()
        if (fileExt) format = fileExt
      } catch (err) {
        console.error('Error reading csv preview in show action:', err)
      }
    }

    const previewColumns = previewHeaders.map((header, idx) => {
      const stats = calculateColumnStats(previewRows, idx)
      const hist = calculateColumnHistogram(previewRows, idx, 8)
      return {
        key: header,
        label: header,
        ...stats,
        hist,
      }
    })

    const areaNames: Record<string, string> = {
      clima: 'Clima & Meteorologia',
      agro: 'Agronomia',
      vet: 'Veterinária',
      bio: 'Ciências Biológicas',
      flor: 'Florestas',
      exatas: 'Ciências Exatas',
      quim: 'Química',
      zoo: 'Zootecnia',
      soc: 'Ciências Sociais',
      econ: 'Economia & Gestão',
    }

    const publisherName = dataset.user?.fullName || dataset.user?.email || 'Usuário UFRRJ'
    const publisherInitials = publisherName.split(/\s+/).filter(w => w.length > 0).map(w => w[0].toUpperCase()).join('').slice(0, 2)
    const isOwner = currentUserId ? Number(currentUserId) === Number(dataset.userId) : false

    let maintainerName = publisherName
    if (dataset.group) {
      maintainerName = dataset.group.name
    }

    let authors: any[] = []

    if (dataset.groupId) {
      const groupMemberships = await GroupMember.query()
        .where('groupId', dataset.groupId)
        .preload('user')

      if (groupMemberships.length > 0) {
        await Promise.all(groupMemberships.map((m) => User.preComputeUrls(m.user)))

        authors = groupMemberships.map((m) => {
          const transformed = m.user ? new UserTransformer(m.user).toObject() : null
          const uName = transformed?.fullName || m.user.fullName || m.user.email
          const uInitials = uName.split(/\s+/).filter((w) => w.length > 0).map((w) => w[0].toUpperCase()).join('').slice(0, 2)
          const roleLabel = m.role === 'owner' ? 'Dono do Grupo' : m.role === 'admin' ? 'Admin' : 'Membro'
          return {
            userId: m.user.id,
            name: uName,
            role: roleLabel,
            inst: dataset.unit || 'UFRRJ',
            color: 'var(--brand-sky)',
            initials: uInitials,
            profileUrl: `/users/${m.user.id}/profile`,
            avatarUrl: transformed?.avatarUrl || null,
          }
        })
      }
    }

    if (authors.length === 0) {
      if (dataset.user) {
        await User.preComputeUrls(dataset.user)
      }
      const transformedOwner = dataset.user ? new UserTransformer(dataset.user).toObject() : null
      authors = [
        {
          userId: dataset.userId,
          name: publisherName,
          role: 'Publicador',
          inst: dataset.unit || 'UFRRJ',
          color: 'var(--brand-sky)',
          initials: publisherInitials,
          profileUrl: `/users/${dataset.userId}/profile`,
          avatarUrl: transformedOwner?.avatarUrl || null,
        },
      ]
    }

    const datasetPayload = {
      id: dataset.id,
      title: dataset.name,
      slug: `dataset/${dataset.id}`,
      unit: dataset.unit,
      unitShort: dataset.unit ? dataset.unit.split(/\s+/).filter(w => w.length > 2).map(w => w[0].toUpperCase()).join('').slice(0, 4) : 'UFRRJ',
      cat: dataset.area,
      catName: areaNames[dataset.area] || dataset.area,
      tint: 'var(--brand-sky)',
      format,
      license: dataset.license?.name || 'CC BY 4.0',
      licenseUrl: '#',
      usability: dataset.usabilityScore !== null && dataset.usabilityScore !== undefined ? String(dataset.usabilityScore) : '8.5',
      doi: '10.5281/datarural.local',
      version: latestVersion?.name || 'V1',
      updated: dataset.updatedAt ? dataset.updatedAt.toRelative() || 'Recém atualizado' : 'Recém atualizado',
      published: dataset.createdAt ? dataset.createdAt.toRelative() || 'Recentemente' : 'Recentemente',
      size: sizeStr,
      rows: String(totalRowCount),
      cols: previewHeaders.length,
      files: dataset.versions.length,
      downloads: '0',
      views: '0',
      votes: votesCount,
      isLiked,
      isOwner,
      watchers: 0,
      freq: 'Mensal',
      coverageTime: dataset.period || '—',
      coverageGeo: dataset.region || '—',
      collection: 'Leituras coletadas pelo sistema local.',
      tags: dataset.tags || [],
      publisherName: maintainerName,
      authors,
      description,
    }

    const versionsPayload = dataset.versions.map((v, index) => {
      let sizeStr = '0 B'
      const fileBytes = v.path?.size
      if (fileBytes) {
        if (fileBytes > 1024 * 1024) {
          sizeStr = `${(fileBytes / (1024 * 1024)).toFixed(1)} MB`
        } else {
          sizeStr = `${(fileBytes / 1024).toFixed(1)} KB`
        }
      }

      return {
        id: v.id,
        name: v.name,
        filename: v.path?.originalName || v.path?.name || `${dataset.name}.csv`,
        size: sizeStr,
        createdAt: v.createdAt ? v.createdAt.toRelative() || 'recentemente' : 'recentemente',
        isLatest: index === 0,
      }
    })

    let relatedDatasetsQuery = await Dataset.query()
      .where('is_public', true)
      .whereNot('id', dataset.id)
      .where('area', dataset.area)
      .preload('versions', (q) => q.orderBy('id', 'desc'))
      .preload('license')
      .preload('likes')
      .orderBy('updatedAt', 'desc')
      .limit(3)

    if (relatedDatasetsQuery.length < 3) {
      const existingIds = [dataset.id, ...relatedDatasetsQuery.map((d) => d.id)]
      const fallbackDatasets = await Dataset.query()
        .where('is_public', true)
        .whereNotIn('id', existingIds)
        .preload('versions', (q) => q.orderBy('id', 'desc'))
        .preload('license')
        .preload('likes')
        .orderBy('updatedAt', 'desc')
        .limit(3 - relatedDatasetsQuery.length)

      relatedDatasetsQuery = [...relatedDatasetsQuery, ...fallbackDatasets]
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

    const relatedPayload = relatedDatasetsQuery.map((rd) => {
      const latestVer = rd.versions[0]
      let rdFormat = 'CSV'
      let rdSize = '0 B'
      if (latestVer && latestVer.path) {
        const fileBytes = latestVer.path.size
        if (fileBytes) {
          if (fileBytes > 1024 * 1024) {
            rdSize = `${(fileBytes / (1024 * 1024)).toFixed(1)} MB`
          } else {
            rdSize = `${(fileBytes / 1024).toFixed(1)} KB`
          }
        }
        const fileExt = latestVer.path.name?.split('.').pop()?.toUpperCase()
        if (fileExt) rdFormat = fileExt
      }

      const rdVotes = rd.likes ? rd.likes.length : 0
      const rdIsLiked = currentUserId ? rd.likes.some((l) => Number(l.userId) === Number(currentUserId)) : false
      const rdTint = rd.area && AREA_COLORS[rd.area] ? AREA_COLORS[rd.area] : 'var(--brand-blue)'

      return {
        id: rd.id,
        title: rd.name,
        unit: rd.unit,
        tint: rdTint,
        format: rdFormat,
        size: rdSize,
        tags: rd.tags || [],
        likesCount: rdVotes,
        isLiked: rdIsLiked,
        updated: rd.updatedAt ? rd.updatedAt.toRelative() || 'recentemente' : 'recentemente',
        usability: rd.usabilityScore !== null && rd.usabilityScore !== undefined ? String(rd.usabilityScore) : '8.5',
      }
    })

    return inertia.render('dataset/show', {
      dataset: datasetPayload,
      previewColumns,
      previewRows,
      versions: versionsPayload,
      related: relatedPayload,
    })
  }

  public async dashboard({ auth, inertia }: HttpContext) {
    const user = auth.user!

    const userGroupIds = (
      await GroupMember.query().where('userId', user.id).select('groupId')
    ).map((m) => m.groupId)

    const userDatasets = await Dataset.query()
      .where((q) => {
        q.where('user_id', user.id)
        if (userGroupIds.length > 0) {
          q.orWhereIn('group_id', userGroupIds)
        }
      })
      .preload('versions')
      .preload('license')
      .preload('likes')
      .orderBy('updatedAt', 'desc')

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

    const datasetsPayload = userDatasets.map((d) => {
      const latestVersion = d.versions[d.versions.length - 1]
      const versionName = latestVersion ? latestVersion.name : 'V1'

      let format = 'CSV'
      if (latestVersion && latestVersion.path) {
        const fileExt = latestVersion.path.name?.split('.').pop()?.toUpperCase()
        if (fileExt) format = fileExt
      }

      const status = (d.status || (d.isPublic ? 'published' : 'unpublished')) as 'published' | 'unpublished' | 'review' | 'draft'
      const usability = d.usabilityScore !== null && d.usabilityScore !== undefined ? String(d.usabilityScore) : '8.5'
      const likesCount = d.likes ? d.likes.length : 0
      const tint = (d.area && AREA_COLORS[d.area]) ? AREA_COLORS[d.area] : 'var(--brand-blue)'

      return {
        id: d.id,
        title: d.name,
        unit: d.unit,
        format,
        tint,
        status,
        version: versionName,
        updated: d.updatedAt ? d.updatedAt.toRelative() || 'recentemente' : 'recentemente',
        likes: String(likesCount),
        likesCount,
        usability,
        rows: '---',
        groupId: d.groupId,
      }
    })

    const totalLikesCount = userDatasets.reduce((sum, d) => sum + (d.likes ? d.likes.length : 0), 0)

    const memberships = await auth.user!.related('groupMemberships').query().preload('group')
    const userGroups = memberships.map((m) => ({
      id: m.group.id,
      name: m.group.name,
    }))

    return inertia.render('dataset/dashboard', { datasets: datasetsPayload, userGroups, totalLikesCount })
  }

  public async publish({ inertia, request, auth, response, session }: HttpContext) {
    const datasetId = request.input('id')
    let editDataset: any = null

    if (datasetId) {
      const dataset = await Dataset.query()
        .where('id', datasetId)
        .preload('versions', (query) => {
          query.orderBy('id', 'desc')
        })
        .preload('license')
        .first()

      if (dataset) {
        let canEdit = dataset.userId === auth.user!.id
        if (!canEdit && dataset.groupId) {
          const membership = await GroupMember.query()
            .where('groupId', dataset.groupId)
            .where('userId', auth.user!.id)
            .whereIn('role', [GroupMemberRole.OWNER, GroupMemberRole.ADMIN, GroupMemberRole.EDITOR])
            .first()
          canEdit = !!membership
        }

        if (!canEdit) {
          session.flash('error', 'You are not authorized to edit this dataset.')
          return response.redirect().toPath('/dashboard')
        }
        let description = ''
        const latestVersion = dataset.versions[0]
        if (latestVersion && dataset.path) {
          try {
            const readmePath = join(dataset.path, latestVersion.name, 'README.md')
            const readmeContent = await readFile(readmePath, 'utf8')
            const lines = readmeContent.split('\n').map(l => l.trim()).filter(l => l.length > 0)
            if (lines.length > 1) {
              description = lines.slice(1).join('\n')
            } else if (lines.length === 1 && !lines[0].startsWith('#')) {
              description = lines[0]
            }
          } catch {}
        }

        let licenseKey = 'custom'
        if (dataset.licenseId === 1) licenseKey = 'cc0'
        else if (dataset.licenseId === 2) licenseKey = 'ccby'
        else if (dataset.licenseId === 3) licenseKey = 'ccbysa'

        let fileName = ''
        let fileSize = '0 MB'
        if (latestVersion && latestVersion.path) {
          fileName = latestVersion.path.originalName || latestVersion.path.name || ''
          const sizeBytes = latestVersion.path.size || 0
          fileSize = `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`
        }

        editDataset = {
          id: dataset.id,
          title: dataset.name,
          desc: description,
          unit: dataset.unit,
          area: dataset.area,
          period: dataset.period || '',
          region: dataset.region || '',
          tags: dataset.tags || [],
          license: licenseKey,
          visibility: dataset.isPublic ? 'public' : 'private',
          usabilityScore: dataset.usabilityScore ? Number(dataset.usabilityScore) : 0,
          fileName,
          fileSize,
          groupId: dataset.groupId,
        }
      }
    }

    const memberships = await auth.user!.related('groupMemberships').query().preload('group')
    const userGroups = memberships.map((m) => ({
      id: m.group.id,
      name: m.group.name,
    }))

    return inertia.render('dataset/publish', { editDataset, userGroups })
  }

  public async toggleLike({ params, response, session, auth, request }: HttpContext) {
    const datasetId = Number(params.id)
    const dataset = await Dataset.find(datasetId)

    if (!dataset) {
      return response.notFound({ error: 'Dataset não encontrado' })
    }

    await auth.check()
    const user = auth.user
    if (!user) {
      const isJson = request.accepts(['html', 'json']) === 'json' || request.ajax()
      if (isJson) {
        return response.unauthorized({ error: 'Você precisa estar autenticado para curtir.' })
      }
      session.flash('error', 'Você precisa estar autenticado para curtir.')
      return response.redirect().toPath('/login')
    }

    const existingLike = await DatasetLike.query()
      .where('datasetId', dataset.id)
      .where('userId', user.id)
      .first()

    if (existingLike) {
      await existingLike.delete()
    } else {
      await DatasetLike.create({
        datasetId: dataset.id,
        userId: user.id,
      })
    }

    const isJson = !request.header('x-inertia') && (request.accepts(['html', 'json']) === 'json' || request.ajax())
    if (isJson) {
      const likesRes = await DatasetLike.query().where('datasetId', dataset.id).count('* as total')
      const count = Number((likesRes[0] as any)?.$extras?.total || 0)
      return response.ok({ liked: !existingLike, count })
    }

    return response.redirect().back()
  }
}
