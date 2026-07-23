import type { HttpContext } from '@adonisjs/core/http'

import Group from '#app/groups/models/group'
import GroupMember from '#app/groups/models/group_member'
import GroupMemberRole from '#app/groups/enums/group_member_role'
import GroupPolicy from '#app/groups/policies/group_policy'
import { createGroupValidator, updateGroupValidator } from '#app/groups/validators'

export default class GroupsController {
  /**
   * List all groups the current user belongs to.
   */
  public async index({ auth, inertia }: HttpContext) {
    const user = auth.user!

    const memberships = await GroupMember.query()
      .where('userId', user.id)
      .preload('group', (query) => {
        query.preload('owner')
      })

    const groupsPayload = await Promise.all(
      memberships.map(async (m) => {
        const memberCount = await GroupMember.query()
          .where('groupId', m.groupId)
          .count('* as total')
          .first()

        const datasetCount = await m.group
          .related('datasets')
          .query()
          .count('* as total')
          .first()

        return {
          id: m.group.id,
          name: m.group.name,
          description: m.group.description,
          role: m.role,
          ownerName: m.group.owner?.fullName || m.group.owner?.email || 'Desconhecido',
          memberCount: Number(memberCount?.$extras.total || 0),
          datasetCount: Number(datasetCount?.$extras.total || 0),
          createdAt: m.group.createdAt.toRelative() || 'recentemente',
        }
      })
    )

    return inertia.render('groups/index', { groups: groupsPayload })
  }

  /**
   * Show a single group with members and datasets.
   */
  public async show({ auth, params, inertia, response }: HttpContext) {
    const user = auth.user!
    const group = await Group.findOrFail(params.id)

    const policy = new GroupPolicy()
    if (!(await policy.view(user, group))) {
      return response.forbidden('Você não tem acesso a este grupo.')
    }

    // Get current user's membership to know their role
    const currentMembership = await GroupMember.query()
      .where('groupId', group.id)
      .where('userId', user.id)
      .first()

    // Load members
    const memberships = await GroupMember.query()
      .where('groupId', group.id)
      .preload('user')
      .orderBy('createdAt', 'asc')

    const membersPayload = memberships.map((m) => ({
      id: m.id,
      userId: m.userId,
      fullName: m.user?.fullName || m.user?.email || 'Desconhecido',
      email: m.user?.email || '',
      role: m.role,
      joinedAt: m.createdAt.toRelative() || 'recentemente',
    }))

    // Load group datasets
    const datasets = await group.related('datasets').query()
      .preload('user')
      .preload('versions')
      .orderBy('updatedAt', 'desc')

    const datasetsPayload = datasets.map((d) => {
      const latestVersion = d.versions[d.versions.length - 1]
      return {
        id: d.id,
        title: d.name,
        unit: d.unit,
        status: d.status || (d.isPublic ? 'published' : 'unpublished'),
        version: latestVersion?.name || 'V1',
        updated: d.updatedAt ? d.updatedAt.toRelative() || 'recentemente' : 'recentemente',
        ownerName: d.user?.fullName || d.user?.email || 'Desconhecido',
      }
    })

    await group.load('owner')

    return inertia.render('groups/show', {
      group: {
        id: group.id,
        name: group.name,
        description: group.description,
        ownerName: group.owner?.fullName || group.owner?.email || 'Desconhecido',
        createdAt: group.createdAt.toRelative() || 'recentemente',
      },
      currentUserRole: currentMembership?.role || null,
      members: membersPayload,
      datasets: datasetsPayload,
    })
  }

  /**
   * Create a new group. The creator becomes the owner.
   */
  public async store({ auth, request, response, session }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(createGroupValidator)

    const group = await Group.create({
      name: payload.name,
      description: payload.description || null,
      ownerId: user.id,
    })

    // Add the creator as the owner member
    await GroupMember.create({
      groupId: group.id,
      userId: user.id,
      role: GroupMemberRole.OWNER,
    })

    session.flash('success', 'Grupo criado com sucesso!')
    return response.redirect().toPath(`/groups/${group.id}`)
  }

  /**
   * Update group name/description.
   */
  public async update({ auth, params, request, response, session }: HttpContext) {
    const user = auth.user!
    const group = await Group.findOrFail(params.id)

    const policy = new GroupPolicy()
    if (!(await policy.update(user, group))) {
      return response.forbidden('Você não tem permissão para editar este grupo.')
    }

    const payload = await request.validateUsing(updateGroupValidator)

    group.name = payload.name
    group.description = payload.description || null
    await group.save()

    session.flash('success', 'Grupo atualizado com sucesso!')
    return response.redirect().toPath(`/groups/${group.id}`)
  }

  /**
   * Delete a group. Only the owner can do this.
   */
  public async destroy({ auth, params, response, session }: HttpContext) {
    const user = auth.user!
    const group = await Group.findOrFail(params.id)

    const policy = new GroupPolicy()
    if (!(await policy.destroy(user, group))) {
      return response.forbidden('Apenas o dono pode excluir o grupo.')
    }

    // Unlink all datasets from this group (set group_id to null)
    const { default: Dataset } = await import('#app/dataset/models/dataset')
    await Dataset.query().where('groupId', group.id).update({ groupId: null })

    await group.delete()

    session.flash('success', 'Grupo excluído com sucesso!')
    return response.redirect().toPath('/groups')
  }
}
