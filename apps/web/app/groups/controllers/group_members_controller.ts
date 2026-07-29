import type { HttpContext } from '@adonisjs/core/http'

import Group from '#app/groups/models/group'
import GroupMember from '#app/groups/models/group_member'
import GroupMemberRole, { GroupRoleWeights } from '#app/groups/enums/group_member_role'
import GroupPolicy from '#app/groups/policies/group_policy'
import { addGroupMemberValidator, updateGroupMemberValidator } from '#app/groups/validators'
import User from '#users/models/user'

export default class GroupMembersController {
  /**
   * Add a new member to the group.
   */
  public async store({ auth, params, request, response, session }: HttpContext) {
    const currentUser = auth.user!
    const group = await Group.findOrFail(params.id)

    const policy = new GroupPolicy()
    if (!(await policy.manageMembers(currentUser, group))) {
      return response.forbidden('Você não tem permissão para gerenciar membros.')
    }

    const payload = await request.validateUsing(addGroupMemberValidator)

    let targetUser: User | null = null

    if (payload.username) {
      const cleanUsername = payload.username.startsWith('@') ? payload.username.slice(1) : payload.username
      targetUser = await User.query().where('username', cleanUsername).first()
      if (!targetUser) {
        targetUser = await User.query().where('email', cleanUsername).first()
      }
    } else if (payload.userId) {
      targetUser = await User.find(payload.userId)
    }

    if (!targetUser) {
      session.flash('error', 'Usuário não encontrado com este nome de usuário.')
      return response.redirect().back()
    }

    // Check if already a member
    const existing = await GroupMember.query()
      .where('groupId', group.id)
      .where('userId', targetUser.id)
      .first()

    if (existing) {
      session.flash('error', 'Este usuário já é membro do grupo.')
      return response.redirect().back()
    }

    // Cannot assign owner role through this endpoint
    if ((payload.role as string) === 'owner') {
      return response.forbidden('Não é possível atribuir o papel de dono.')
    }

    await GroupMember.create({
      groupId: group.id,
      userId: targetUser.id,
      role: payload.role as GroupMemberRole,
    })

    session.flash('success', `${targetUser.fullName || targetUser.email} adicionado ao grupo!`)
    return response.redirect().back()
  }

  /**
   * Update a member's role.
   */
  public async update({ auth, params, request, response, session }: HttpContext) {
    const currentUser = auth.user!
    const group = await Group.findOrFail(params.id)

    const member = await GroupMember.query()
      .where('id', params.memberId)
      .where('groupId', group.id)
      .firstOrFail()

    // Cannot change the owner's role
    if (member.role === GroupMemberRole.OWNER) {
      return response.forbidden('Não é possível alterar o papel do dono do grupo.')
    }

    const policy = new GroupPolicy()
    if (!(await policy.changeRole(currentUser, group, member))) {
      return response.forbidden('Você não tem permissão para alterar o papel deste membro.')
    }

    const payload = await request.validateUsing(updateGroupMemberValidator)

    // Verify the actor has higher rank than the target role
    const actorMembership = await GroupMember.query()
      .where('groupId', group.id)
      .where('userId', currentUser.id)
      .firstOrFail()

    const actorWeight = GroupRoleWeights[actorMembership.role]
    const newRoleWeight = GroupRoleWeights[payload.role as GroupMemberRole]

    if (newRoleWeight >= actorWeight) {
      return response.forbidden('Você não pode atribuir um papel igual ou superior ao seu.')
    }

    member.role = payload.role as GroupMemberRole
    await member.save()

    session.flash('success', 'Papel atualizado com sucesso!')
    return response.redirect().back()
  }

  /**
   * Remove a member from the group (or self-leave).
   */
  public async destroy({ auth, params, response, session }: HttpContext) {
    const currentUser = auth.user!
    const group = await Group.findOrFail(params.id)

    const member = await GroupMember.query()
      .where('id', params.memberId)
      .where('groupId', group.id)
      .firstOrFail()

    // Owner cannot be removed
    if (member.role === GroupMemberRole.OWNER) {
      return response.forbidden('O dono não pode ser removido do grupo.')
    }

    // Self-leave: any member can remove themselves (except owner)
    if (member.userId === currentUser.id) {
      await member.delete()
      session.flash('success', 'Você saiu do grupo.')
      return response.redirect().toPath('/groups')
    }

    // Otherwise, must have manageMembers permission
    const policy = new GroupPolicy()
    if (!(await policy.manageMembers(currentUser, group))) {
      return response.forbidden('Você não tem permissão para remover membros.')
    }

    // Check rank: actor must outrank the target
    if (!(await policy.changeRole(currentUser, group, member))) {
      return response.forbidden('Você não pode remover um membro de mesmo nível ou superior.')
    }

    await member.delete()

    session.flash('success', 'Membro removido do grupo.')
    return response.redirect().back()
  }
}
