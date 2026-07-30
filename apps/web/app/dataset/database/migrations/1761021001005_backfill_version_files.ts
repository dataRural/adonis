import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    const versions = await this.db.from('dataset_versions').select('id', 'name', 'path', 'created_at', 'updated_at')
    
    for (const v of versions) {
      if (v.path) {
        let pathObj: any = v.path
        if (typeof pathObj === 'string') {
          try { pathObj = JSON.parse(pathObj) } catch {}
        }
        const fileName = pathObj?.originalName || pathObj?.name || 'data.csv'

        await this.db.table('dataset_version_files').insert({
          dataset_version_id: v.id,
          name: fileName,
          path: typeof v.path === 'string' ? v.path : JSON.stringify(v.path),
          is_primary: true,
          sort_order: 0,
          created_at: v.created_at || new Date(),
          updated_at: v.updated_at || new Date(),
        })
      }
    }
  }

  async down() {
    await this.db.from('dataset_version_files').delete()
  }
}
