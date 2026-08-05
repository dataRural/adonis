import * as Ic from '#common/ui/components/datarural/icons'
import { useTranslation } from '#common/ui/hooks/use_translation'

interface ToolbarProps {
  filter: string
  onFilterChange: (filter: string) => void
  query: string
  onQueryChange: (query: string) => void
  counts: {
    all: number
    published: number
    review?: number
    draft: number
    unpublished: number
  }
}

export default function Toolbar({
  filter,
  onFilterChange,
  query,
  onQueryChange,
  counts,
}: ToolbarProps) {
  const { t } = useTranslation()

  const filters = [
    { id: 'all', label: t('dataset.dashboard.filter_all'), n: counts.all },
    { id: 'published', label: t('dataset.dashboard.filter_published'), n: counts.published },
    { id: 'draft', label: t('dataset.dashboard.filter_draft'), n: counts.draft },
    { id: 'unpublished', label: t('dataset.dashboard.filter_private'), n: counts.unpublished },
  ]

  return (
    <div className="dr-mgmt-toolbar">
      <div className="dr-seg">
        {filters.map((f) => (
          <button
            key={f.id}
            className={filter === f.id ? 'on' : ''}
            onClick={() => onFilterChange(f.id)}
          >
            {f.label} <span className="cnt">{f.n}</span>
          </button>
        ))}
      </div>
      <span className="grow"></span>
      <div className="dr-mgmt-search">
        <Ic.Search size={17} />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t('dataset.dashboard.search_placeholder')}
        />
      </div>
      <button className="dr-btn dr-btn-outline" onClick={() => alert(t('dataset.dashboard.sort_btn'))}>
        <Ic.Sort size={16} /> {t('dataset.dashboard.sort_btn')}
      </button>
    </div>
  )
}
