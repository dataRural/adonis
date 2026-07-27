import type User from '#users/models/user'
import type Group from '#app/groups/models/group'
import GroupMember from '#app/groups/models/group_member'
import GroupMemberRole, { GroupRoleWeights } from '#app/groups/enums/group_member_role'

export default class GroupPolicy {
  /**
   * Get the membership record for a user in a specific group.
   */
  private async getMembership(user: User, group: Group): Promise<GroupMember | null> {
    return GroupMember.query()
      .where('groupId', group.id)
      .where('userId', user.id)
      .first()
  }

  /**
   * Can the user view this group (must be a member)?
   */
  async view(user: User, group: Group): Promise<boolean> {
    const membership = await this.getMembership(user, group)
    return !!membership
  }

  /**
   * Can the user update the group's name/description?
   * Requires owner or admin role.
   */
  async update(user: User, group: Group): Promise<boolean> {
    const membership = await this.getMembership(user, group)
    if (!membership) return false
    return (
      membership.role === GroupMemberRole.OWNER ||
      membership.role === GroupMemberRole.ADMIN
    )
  }

  /**
   * Can the user delete the group?
   * Only the owner can delete it.
   */
  async destroy(user: User, group: Group): Promise<boolean> {
    const membership = await this.getMembership(user, group)
    if (!membership) return false
    return membership.role === GroupMemberRole.OWNER
  }

  /**
   * Can the user manage members (add/remove/change roles)?
   * Requires owner or admin role.
   */
  async manageMembers(user: User, group: Group): Promise<boolean> {
    const membership = await this.getMembership(user, group)
    if (!membership) return false
    return (
      membership.role === GroupMemberRole.OWNER ||
      membership.role === GroupMemberRole.ADMIN
    )
  }

  /**
   * Can the user change a target member's role?
   * The acting user must outrank the target member.
   */
  async changeRole(
    user: User,
    group: Group,
    targetMember: GroupMember
  ): Promise<boolean> {
    const membership = await this.getMembership(user, group)
    if (!membership) return false

    const actorWeight = GroupRoleWeights[membership.role]
    const targetWeight = GroupRoleWeights[targetMember.role]

    // Can only manage roles below your own rank
    return actorWeight > targetWeight
  }

  /**
   * Can the user add/edit datasets in this group?
   * Requires owner, admin, or editor role.
   */
  async manageDatasets(user: User, group: Group): Promise<boolean> {
    const membership = await this.getMembership(user, group)
    if (!membership) return false
    return (
      membership.role === GroupMemberRole.OWNER ||
      membership.role === GroupMemberRole.ADMIN ||
      membership.role === GroupMemberRole.EDITOR
    )
  }
}
