enum GroupMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

/**
 * Ordered from most to least privileged.
 * Useful for comparisons like "can this role manage that role?"
 */
export const GroupRoleWeights: Record<GroupMemberRole, number> = {
  [GroupMemberRole.OWNER]: 40,
  [GroupMemberRole.ADMIN]: 30,
  [GroupMemberRole.EDITOR]: 20,
  [GroupMemberRole.VIEWER]: 10,
}

export default GroupMemberRole
