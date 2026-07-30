import vine from '@vinejs/vine'

const csvFileSchema = vine.file({
  extnames: ['csv'],
  size: 25 * 1024 * 1024,
})

export const createDatasetValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255).unique({ table: 'datasets', column: 'name' }),
    version: vine.string().trim().minLength(1).maxLength(32).optional(),
    description: vine.string().trim().maxLength(2000).optional(),
    isPublic: vine.boolean().optional(),
    licenseId: vine.number().optional(),
    unit: vine.string().trim().minLength(3).maxLength(255),
    area: vine.string().trim().minLength(3).maxLength(255),
    period: vine.string().trim().maxLength(255).optional(),
    region: vine.string().trim().maxLength(255).optional(),
    tags: vine.array(vine.string().trim()).optional(),
    usabilityScore: vine.number().min(0).max(10).optional(),
    status: vine.string().trim().optional(),
    groupId: vine.number().optional(),
    file: csvFileSchema.optional(),
    files: vine.array(csvFileSchema).optional(),
  })
)

export const addDatasetVersionValidator = vine.compile(
  vine.object({
    version: vine.string().trim().minLength(1).maxLength(32).optional(),
    description: vine.string().trim().maxLength(2000).optional(),
    usabilityScore: vine.number().min(0).max(10).optional(),
    file: csvFileSchema.optional(),
    files: vine.array(csvFileSchema).optional(),
  })
)

export const updateDatasetValidator = vine.withMetaData<{ datasetId: number }>().compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(255)
      .unique(async (db, value, field) => {
        const row = await db
          .from('datasets')
          .where('name', value)
          .whereNot('id', field.meta.datasetId)
          .first()
        return row ? false : true
      }),
    version: vine.string().trim().minLength(1).maxLength(32).optional(),
    description: vine.string().trim().maxLength(2000).optional(),
    isPublic: vine.boolean().optional(),
    licenseId: vine.number().optional(),
    unit: vine.string().trim().minLength(3).maxLength(255),
    area: vine.string().trim().minLength(3).maxLength(255),
    period: vine.string().trim().maxLength(255).optional(),
    region: vine.string().trim().maxLength(255).optional(),
    tags: vine.array(vine.string().trim()).optional(),
    usabilityScore: vine.number().min(0).max(10).optional(),
    status: vine.string().trim().optional(),
    groupId: vine.number().optional(),
    file: csvFileSchema.optional(),
    files: vine.array(csvFileSchema).optional(),
  })
)

