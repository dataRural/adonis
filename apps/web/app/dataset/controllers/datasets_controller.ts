import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import Database from '@adonisjs/lucid/services/db'

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import Dataset from '../models/dataset.js'
import DatasetVersion from '../models/dataset_version.js'
import { addDatasetVersionValidator, createDatasetValidator } from '#app/dataset/validators'
import { attachmentManager } from '@jrmc/adonis-attachment'

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
      datasetsQuery = datasetsQuery.where((q) => {
        q.where('is_public', true).orWhere('user_id', currentUserId)
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

    const currentUserId = auth?.user?.id
    if (!currentUserId || Number(currentUserId) !== Number(dataset.userId)) {
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

    const currentUserId = auth?.user?.id
    if (!currentUserId || Number(currentUserId) !== Number(dataset.userId)) {
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

      await dataset.save()
      session.flash('success', 'Dataset privacy updated.')
      return response.redirect().toPath(`/datasets/view?datasetId=${dataset.id}`)
    } catch (err) {
      session.flash('error', `Unable to update privacy. ${err && (err as any).message ? (err as any).message : ''}`)
      return response.redirect().toPath(`/datasets/view?datasetId=${dataset.id}`)
    }
  }

  public async downloadVersion({ params, response, auth, session }: HttpContext) {
    const datasetId = Number(params.datasetId)
    const versionId = Number(params.versionId)

    const dataset = await Dataset.query().where('id', datasetId).firstOrFail()
    const version = await DatasetVersion.query().where('id', versionId).where('dataset_id', datasetId).firstOrFail()

    const currentUserId = auth?.user?.id ?? null
    if (!dataset.isPublic && Number(currentUserId) !== Number(dataset.userId)) {
      session.flash('error', 'You are not authorized to download this dataset.')
      return response.redirect().toPath(`/datasets/view?datasetId=${dataset.id}`)
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
    const payload = await request.validateUsing(createDatasetValidator)
    const datasetFile = request.file('file')

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
      return inertia.render('dataset/show', {})
    }

    const dataset = await Dataset.query()
      .where('id', datasetId)
      .preload('versions', (query) => {
        query.orderBy('id', 'desc')
      })
      .preload('license')
      .first()

    if (!dataset) {
      return inertia.render('dataset/show', {})
    }

    const currentUserId = auth?.user?.id ?? null
    if (!dataset.isPublic && Number(currentUserId) !== Number(dataset.userId)) {
      session.flash('error', 'You are not authorized to view this dataset.')
      return response.redirect().back()
    }

    const latestVersion = dataset.versions[0]
    const datasetPayload = {
      id: dataset.id,
      title: dataset.name,
      slug: `dataset/${dataset.id}`,
      unit: 'Instituto de Ciências Exatas',
      unitShort: 'ICE',
      cat: 'clima',
      catName: 'Clima & Meteorologia',
      tint: 'var(--brand-sky)',
      format: 'CSV',
      license: dataset.license?.name || 'CC BY 4.0',
      licenseUrl: '#',
      usability: '8.5',
      doi: '10.5281/datarural.local',
      version: latestVersion?.name || 'V1',
      updated: 'Recém atualizado',
      published: 'Recentemente',
      size: '12.4 MB',
      rows: '84.216',
      cols: 8,
      files: dataset.versions.length,
      downloads: '0',
      views: '0',
      votes: 0,
      watchers: 0,
      freq: 'Mensal',
      coverageTime: '2026',
      coverageGeo: 'Campus Seropédica',
      collection: 'Leituras coletadas pelo sistema local.',
      tags: ['geral'],
      authors: [
        { name: 'Pesquisador UFRRJ', role: 'Mantenedor', inst: 'UFRRJ', color: 'var(--brand-sky)', initials: 'PR' }
      ]
    }

    return inertia.render('dataset/show', { dataset: datasetPayload })
  }

  public async dashboard({ auth, inertia }: HttpContext) {
    const user = auth.user!

    const userDatasets = await Dataset.query()
      .where('userId', user.id)
      .preload('versions')
      .preload('license')
      .orderBy('updatedAt', 'desc')

    const datasetsPayload = userDatasets.map((d) => {
      const latestVersion = d.versions[d.versions.length - 1]
      const versionName = latestVersion ? latestVersion.name : 'V1'

      let format = 'CSV'
      if (latestVersion && latestVersion.path) {
        const fileExt = latestVersion.path.name?.split('.').pop()?.toUpperCase()
        if (fileExt) format = fileExt
      }

      const status: 'published' | 'unpublished' = d.isPublic ? 'published' : 'unpublished'
      const usability = '8.5'

      return {
        id: d.id,
        title: d.name,
        unit: 'Instituto de Ciências Exatas',
        format,
        tint: 'var(--brand-sky)',
        status,
        version: versionName,
        updated: d.updatedAt ? d.updatedAt.toRelative() || 'recentemente' : 'recentemente',
        downloads: '0',
        views: '0',
        usability,
        rows: '---',
      }
    })

    return inertia.render('dataset/dashboard', { datasets: datasetsPayload })
  }

  public async publish({ inertia }: HttpContext) {
    return inertia.render('dataset/publish', {})
  }
}
