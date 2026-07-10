import * as Ic from './icons'

export interface CategoryItem {
  id: string
  name: string
  count: number
  icon: string
  color: string
}

interface CategoriesProps {
  active: string | null
  onPick: (id: string | null) => void
  categories?: CategoryItem[]
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'agro', name: 'Agronomia', count: 214, icon: 'sprout', color: 'var(--brand-green)' },
  { id: 'vet', name: 'Veterinária', count: 168, icon: 'paw', color: 'var(--brand-orange)' },
  { id: 'clima', name: 'Clima & Meteorologia', count: 96, icon: 'cloud', color: 'var(--brand-sky)' },
  { id: 'bio', name: 'Ciências Biológicas', count: 143, icon: 'leaf', color: 'var(--brand-lightgreen)' },
  { id: 'flor', name: 'Florestas', count: 71, icon: 'tree', color: 'var(--brand-teal)' },
  { id: 'exatas', name: 'Ciências Exatas', count: 88, icon: 'chart', color: 'var(--brand-blue)' },
  { id: 'quim', name: 'Química', count: 64, icon: 'flask', color: 'var(--brand-purple)' },
  { id: 'zoo', name: 'Zootecnia', count: 102, icon: 'database', color: 'var(--brand-orange)' },
  { id: 'soc', name: 'Ciências Sociais', count: 79, icon: 'users', color: 'var(--brand-blue)' },
  { id: 'econ', name: 'Economia & Gestão', count: 58, icon: 'chart', color: 'var(--brand-green)' },
]

export default function Categories({ active, onPick, categories = DEFAULT_CATEGORIES }: CategoriesProps) {
  return (
    <section className="dr-section" id="categorias">
      <div className="dr-container">
        <div className="dr-section-head">
          <div>
            <h2>Explore por área de conhecimento</h2>
            <p>Dados organizados pelos institutos e unidades da Universidade.</p>
          </div>
          <a className="dr-link-more" href="#">
            Ver todas as áreas <Ic.Arrow size={16} style={{ display: 'inline', marginLeft: 4 }} />
          </a>
        </div>
        <div className="dr-cat-grid">
          {categories.map((c) => {
            const iconKey = c.icon.charAt(0).toUpperCase() + c.icon.slice(1)
            const Icon = (Ic as any)[iconKey] || Ic.Database
            const isActive = active === c.id

            return (
              <button
                key={c.id}
                className={`dr-cat-card ${isActive ? 'active' : ''}`}
                onClick={() => onPick(isActive ? null : c.id)}
              >
                <span className="dr-cat-ic" style={{ background: c.color }}>
                  <Icon size={22} />
                </span>
                <span>
                  <span className="dr-cat-name">{c.name}</span>
                  <span className="dr-cat-count">{c.count} datasets</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
