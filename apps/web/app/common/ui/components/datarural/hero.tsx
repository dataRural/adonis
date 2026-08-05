import { ArcosCluster } from './brand'
import * as Ic from './icons'
import { useTranslation } from '#common/ui/hooks/use_translation'

interface HeroProps {
  query: string
  onQuery: (val: string) => void
  onChip?: (val: string) => void
  onSearch?: () => void
}

export default function Hero({ query, onQuery, onChip: _onChip, onSearch }: HeroProps) {
  const { t } = useTranslation()

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
            <span className="dot"></span>{t('marketing.hero.eyebrow')}
          </span>
          <h1>
            {t('marketing.hero.title_prefix')}<span className="hl">{t('marketing.hero.title_hl')}</span>
          </h1>
          <p className="dr-hero-lead">
            {t('marketing.hero.lead')}
          </p>

          <div className="dr-search">
            <Ic.Search size={21} />
            <input
              type="text"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('marketing.hero.search_placeholder')}
              aria-label={t('marketing.hero.search_button')}
            />
            <button className="dr-btn dr-btn-primary" onClick={onSearch}>
              {t('marketing.hero.search_button')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
