import type { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'

import User from '#users/models/user'
import Dataset from '#app/dataset/models/dataset'
import GroupMember from '#app/groups/models/group_member'

import UserTransformer from '#users/transformers/user_transformer'

import UserPolicy from '#users/policies/user_policy'

import { createUserValidator, editUserValidator, listUserValidator } from '#users/validators'

export default class UsersController {
  public async publicProfile({ auth, params, response, inertia }: HttpContext) {
    await auth.check()

    const username = params.username

    let targetUser: User | null = null

    if (username) {
      targetUser = await User.query().where('username', username).first()
    } else if (auth.user) {
      targetUser = auth.user
    }

    if (!targetUser) {
      return response.redirect().toRoute('dashboard.show')
    }

    if (auth.user && targetUser.id === auth.user.id) {
      return response.redirect().toPath('/profile')
    }

    await User.preComputeUrls(targetUser)

    const isOwnProfile = auth.user?.id === targetUser.id

    let datasetsQuery = Dataset.query().where('userId', targetUser.id)
    if (!isOwnProfile) {
      datasetsQuery = datasetsQuery.where('isPublic', true)
    }

    const datasets = await datasetsQuery
      .preload('versions', (q) => q.orderBy('id', 'desc'))
      .preload('license')
      .preload('likes')
      .orderBy('id', 'desc')

    const formattedDatasets = datasets.map((ds) => {
      const versions = ds.versions || []
      const latestVersion = versions[0]

      return {
        id: ds.id,
        title: ds.name,
        description: (ds as any).description || 'Conjunto de dados cadastrado no ecossistema DataRural.',
        area: ds.area || 'Geral',
        tags: Array.isArray(ds.tags) ? ds.tags : [],
        isPublic: ds.isPublic,
        downloadsCount: 0,
        likesCount: ds.likes ? ds.likes.length : 0,
        updatedAt: ds.updatedAt ? ds.updatedAt.toISO() : new Date().toISOString(),
        version: latestVersion ? latestVersion.name : 'v1.0.0',
        fileCount: 1,
        format: 'CSV',
        size: '1.2 MB',
      }
    })

    formattedDatasets.sort((a, b) => b.likesCount - a.likesCount)

    const memberships = await GroupMember.query()
      .where('userId', targetUser.id)
      .preload('group')

    const formattedGroups = memberships.map((m) => ({
      id: m.group.id,
      name: m.group.name,
      description: m.group.description,
      role: m.role,
      avatarUrl: null,
    }))

    const totalLikes = formattedDatasets.reduce((acc, d) => acc + d.likesCount, 0)
    const totalDownloads = formattedDatasets.reduce((acc, d) => acc + d.downloadsCount, 0)

    const userObject = new UserTransformer(targetUser).toObject()

    return inertia.render('users/public_profile', {
      userProfile: {
        ...userObject,
        createdAt: targetUser.createdAt ? targetUser.createdAt.toISO() : new Date().toISOString(),
      },
      isOwnProfile,
      datasets: formattedDatasets,
      groups: formattedGroups,
      stats: {
        datasetCount: formattedDatasets.length,
        likeCount: totalLikes,
        groupCount: formattedGroups.length,
        downloadCount: totalDownloads,
      },
    })
  }
  public async index({ bouncer, inertia, request }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('viewList')

    const payload = await request.validateUsing(listUserValidator)

    const limit = payload.perPage || 10
    const page = payload.page || 1
    const querySearch = payload.q || undefined
    const roleIds = payload.roleIds || []

    const query = User.query()

    if (querySearch) {
      query.where((subquery) => {
        subquery
          .where('full_name', 'ilike', `%${querySearch}%`)
          .orWhere('email', 'ilike', `%${querySearch}%`)
      })
    }

    if (Array.isArray(roleIds) && roleIds.length > 0) {
      query.andWhereIn('role_id', roleIds)
    }

    const users = await query.preload('role').paginate(page, limit)

    const usersData = users.all()

    await User.preComputeUrls(usersData)

    return inertia.render('users/index', {
      users: UserTransformer.paginate(usersData, users.getMeta()),
      q: querySearch,
      selectedRoles: roleIds,
    })
  }

  public async store({ bouncer, request, response }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('create')

    const payload = await request.validateUsing(createUserValidator)

    const user = new User()
    user.merge({
      ...payload,
      password: payload.password ? payload.password : randomUUID(),
    })

    await user.save()

    return response.redirect().toRoute('users.index')
  }

  public async update({ bouncer, params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await bouncer.with(UserPolicy).authorize('update', user)

    const payload = await request.validateUsing(editUserValidator, { meta: { userId: params.id } })
    user.merge({
      ...payload,
      password: payload.password ? payload.password : user.password,
    })

    await user.save()

    return response.redirect().toRoute('users.index')
  }

  public async destroy({ bouncer, params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await bouncer.with(UserPolicy).authorize('delete', user)

    await user.delete()

    return response.redirect().toRoute('users.index')
  }

  public async search({ auth, request, response }: HttpContext) {
    await auth.check()

    const q = (request.input('q') || '').trim()
    if (!q || q.length < 2) {
      return response.json([])
    }

    const cleanQ = q.startsWith('@') ? q.slice(1) : q

    const users = await User.query()
      .where((builder) => {
        builder
          .where('username', 'ilike', `%${cleanQ}%`)
          .orWhere('full_name', 'ilike', `%${cleanQ}%`)
          .orWhere('email', 'ilike', `%${cleanQ}%`)
      })
      .limit(8)

    await User.preComputeUrls(users)

    const results = users.map((u) => {
      const transformed = new UserTransformer(u).toObject()
      return {
        id: u.id,
        fullName: u.fullName || u.email,
        username: u.username || u.email.split('@')[0],
        email: u.email,
        avatarUrl: transformed.avatarUrl,
      }
    })

    return response.json(results)
  }
}
