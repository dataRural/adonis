import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Database from '@adonisjs/lucid/services/db'

export default class LicenseSeeder extends BaseSeeder {
  public async run() {
    const existing = await Database.from('licenses').count('* as total')
    const total = Number((existing[0] as { total?: string | number } | undefined)?.total ?? 0)

    if (total > 0) {
      return
    }

    await Database.table('licenses').insert([
      {
        name: 'CC0-1.0',
        description: 'Public Domain Dedication (CC0 1.0 Universal).',
        created_at: new Date(),
      },
      {
        name: 'CC-BY-4.0',
        description: 'Creative Commons Attribution 4.0 International.',
        created_at: new Date(),
      },
      {
        name: 'CC-BY-SA-4.0',
        description: 'Creative Commons Attribution-ShareAlike 4.0 International.',
        created_at: new Date(),
      },
      {
        name: 'MIT',
        description: 'MIT License - permissive software license.',
        created_at: new Date(),
      },
      {
        name: 'Proprietary',
        description: 'All rights reserved. Contact owner for permission.',
        created_at: new Date(),
      },
    ])
  }
}