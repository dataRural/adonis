import vine from '@vinejs/vine'

export const createGroupValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    description: vine.string().trim().maxLength(2000).optional(),
  })
)

export const updateGroupValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    description: vine.string().trim().maxLength(2000).optional(),
  })
)

export const addGroupMemberValidator = vine.compile(
  vine.object({
    username: vine.string().trim().optional(),
    userId: vine.number().optional(),
    role: vine.enum(['admin', 'editor', 'viewer']),
  })
)

export const updateGroupMemberValidator = vine.compile(
  vine.object({
    role: vine.enum(['admin', 'editor', 'viewer']),
  })
)

export const assignDatasetToGroupValidator = vine.compile(
  vine.object({
    datasetId: vine.number(),
  })
)
