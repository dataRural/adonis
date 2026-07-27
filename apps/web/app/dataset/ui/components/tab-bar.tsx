import * as Ic from '#common/ui/components/datarural/icons'

interface TabBarProps {
  tab: string
  onTab: (tab: string) => void
  filesCount?: number
  notebooksCount?: number
  discussionCount?: number
}

export default function TabBar({
  tab,
  onTab,
  filesCount = 3,
  notebooksCount = 3,
  discussionCount = 4,
}: TabBarProps) {
  const tabs = [
    { id: 'overview', label: 'Visão geral', icon: 'Book' },
    { id: 'viewer', label: 'Visualizador', icon: 'Table' },
    { id: 'files', label: 'Arquivos', icon: 'Folder', badge: filesCount },
  ]

  return (
    <div className="dr-ds-tabbar">
      <div className="dr-container dr-ds-tabbar-inner">
        {tabs.map((t) => {
          const Icon = (Ic as any)[t.icon] || Ic.Book
          const isActive = tab === t.id

          return (
            <button
              key={t.id}
              className={`dr-ds-tab ${isActive ? 'active' : ''}`}
              onClick={() => onTab(t.id)}
            >
              <Icon size={16} /> {t.label}
              {t.badge !== undefined && t.badge !== null && (
                <span className="badge">{t.badge}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
