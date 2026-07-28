import { ArcosCluster } from './brand'
import * as Ic from './icons'

interface HeroProps {
  query: string
  onQuery: (val: string) => void
  onChip?: (val: string) => void
  onSearch?: () => void
}

export default function Hero({ query, onQuery, onChip: _onChip, onSearch }: HeroProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch()
    }
  }

  return (
    <section className="dr-hero" id="top">
      <div className="dr-hero-arcos">
        <div className="strand strand-right">
          <ArcosCluster />
        </div>
        <div className="strand strand-left">
          <ArcosCluster />
        </div>
      </div>
      <div className="dr-container">
        <div className="dr-hero-inner">
          <span className="dr-hero-eyebrow">
            <span className="dot"></span>Repositório institucional de dados abertos
          </span>
          <h1>
            Encontre, explore e reutilize os <span className="hl">dados da Rural</span>
          </h1>
          <p className="dr-hero-lead">
            Uma plataforma para publicar, versionar e consumir conjuntos de dados acadêmicos
            e administrativos da UFRRJ — com metadados ricos, licenças explícitas e estatísticas de uso.
          </p>

          <div className="dr-search">
            <Ic.Search size={21} />
            <input
              type="text"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar datasets — ex.: produção agrícola, clima, solos…"
              aria-label="Buscar datasets"
            />
            <button className="dr-btn dr-btn-primary" onClick={onSearch}>
              Buscar
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
