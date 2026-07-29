import { BaseSeeder } from '@adonisjs/lucid/seeders'
import DatasetArea from '#app/dataset/models/dataset_area'

export default class extends BaseSeeder {
  async run() {
    const defaultAreas = [
      { code: 'agro', name: 'Agronomia', icon: 'sprout', color: 'var(--brand-green)', description: 'Dados de agricultura, solos, safras e cultivo.' },
      { code: 'vet', name: 'Veterinária', icon: 'paw', color: 'var(--brand-orange)', description: 'Medicina veterinária e saúde animal.' },
      { code: 'clima', name: 'Clima & Meteorologia', icon: 'cloud', color: 'var(--brand-sky)', description: 'Dados meteorológicos, precipitação e temperatura.' },
      { code: 'bio', name: 'Ciências Biológicas', icon: 'leaf', color: 'var(--brand-lightgreen)', description: 'Biodiversidade, botânica e ecologia.' },
      { code: 'flor', name: 'Florestas', icon: 'tree', color: 'var(--brand-teal)', description: 'Engenharia florestal, biomas e recursos florestais.' },
      { code: 'exatas', name: 'Ciências Exatas', icon: 'chart', color: 'var(--brand-blue)', description: 'Matemática, física, estatística e computação.' },
      { code: 'quim', name: 'Química', icon: 'flask', color: 'var(--brand-purple)', description: 'Química orgânica, inorgânica e analítica.' },
      { code: 'zoo', name: 'Zootecnia', icon: 'database', color: 'var(--brand-amber)', description: 'Produção animal e nutrição de rebanhos.' },
      { code: 'soc', name: 'Ciências Sociais', icon: 'users', color: 'var(--brand-rose)', description: 'Sociologia, desenvolvimento rural e comunidade.' },
      { code: 'econ', name: 'Economia & Gestão', icon: 'chart', color: 'var(--brand-indigo)', description: 'Agronegócio, economia rural e gestão.' },
    ]

    for (const area of defaultAreas) {
      await DatasetArea.firstOrCreate({ code: area.code }, area)
    }
  }
}
