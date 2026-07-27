import * as Ic from '#common/ui/components/datarural/icons'

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
  const filters = [
    { id: 'all', label: 'Todos', n: counts.all },
    { id: 'published', label: 'Publicados', n: counts.published },
    { id: 'draft', label: 'Rascunhos', n: counts.draft },
    { id: 'unpublished', label: 'Privados', n: counts.unpublished },
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
          placeholder="Buscar nos meus datasets…"
        />
      </div>
      <button className="dr-btn dr-btn-outline" onClick={() => alert('Ordenar datasets')}>
        <Ic.Sort size={16} /> Ordenar
      </button>
    </div>
  )
}
