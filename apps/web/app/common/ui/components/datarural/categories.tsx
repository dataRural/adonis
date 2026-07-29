import { useState } from 'react'
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
  limit?: number
}

export const BASE_CATEGORIES: CategoryItem[] = [
  { id: 'agro', name: 'Agronomia', count: 0, icon: 'sprout', color: 'var(--brand-green)' },
  { id: 'vet', name: 'Veterinária', count: 0, icon: 'paw', color: 'var(--brand-orange)' },
  { id: 'clima', name: 'Clima & Meteorologia', count: 0, icon: 'cloud', color: 'var(--brand-sky)' },
  { id: 'bio', name: 'Ciências Biológicas', count: 0, icon: 'leaf', color: 'var(--brand-lightgreen)' },
  { id: 'flor', name: 'Florestas', count: 0, icon: 'tree', color: 'var(--brand-teal)' },
  { id: 'exatas', name: 'Ciências Exatas', count: 0, icon: 'chart', color: 'var(--brand-blue)' },
  { id: 'quim', name: 'Química', count: 0, icon: 'flask', color: 'var(--brand-purple)' },
  { id: 'zoo', name: 'Zootecnia', count: 0, icon: 'database', color: 'var(--brand-amber)' },
  { id: 'soc', name: 'Ciências Sociais', count: 0, icon: 'users', color: 'var(--brand-rose)' },
  { id: 'econ', name: 'Economia & Gestão', count: 0, icon: 'chart', color: 'var(--brand-indigo)' },
]

export default function Categories({
  active,
  onPick,
  categories = BASE_CATEGORIES,
  limit = 10,
}: CategoriesProps) {
  const [expanded, setExpanded] = useState(false)

  const hasMore = Boolean(limit && categories.length > limit)
  const visibleCategories = hasMore && !expanded ? categories.slice(0, limit) : categories

  return (
    <section className="dr-section" id="categorias">
      <div className="dr-container">
        <div className="dr-section-head">
          <div>
            <h2>Explore por área de conhecimento</h2>
            <p>Dados organizados pelos institutos e unidades da Universidade.</p>
          </div>
        </div>
        <div className="dr-cat-grid">
          {visibleCategories.map((c) => {
            const iconKey = c.icon ? c.icon.charAt(0).toUpperCase() + c.icon.slice(1) : 'Database'
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
                  <span className="dr-cat-count">
                    {c.count} {c.count === 1 ? 'dataset' : 'datasets'}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {hasMore && (
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button
              onClick={() => setExpanded(!expanded)}
              className="dr-btn dr-btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 24px',
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 20,
                cursor: 'pointer',
              }}
            >
              {expanded ? (
                <>
                  Ver menos áreas{' '}
                  <Ic.Chevd
                    size={16}
                    style={{ transform: 'rotate(180deg)', transition: 'transform 0.2s ease' }}
                  />
                </>
              ) : (
                <>
                  Ver mais áreas{' '}
                  <Ic.Chevd
                    size={16}
                    style={{ transform: 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                  />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
