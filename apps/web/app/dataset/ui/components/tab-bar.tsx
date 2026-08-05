import * as Ic from '#common/ui/components/datarural/icons'
import { useTranslation } from '#common/ui/hooks/use_translation'

interface TabBarProps {
  tab: string
  onTab: (tab: string) => void
  filesCount?: number
  versionsCount?: number
}

export default function TabBar({
  tab,
  onTab,
  filesCount = 2,
  versionsCount,
}: TabBarProps) {
  const { t } = useTranslation()

  const tabs = [
    { id: 'overview', label: t('dataset.show.tabs.overview'), icon: 'Book' },
    { id: 'viewer', label: t('dataset.show.tabs.viewer'), icon: 'Table' },
    { id: 'files', label: t('dataset.show.tabs.files'), icon: 'Folder', badge: filesCount },
    { id: 'versions', label: t('dataset.show.tabs.versions'), icon: 'History', badge: versionsCount },
  ]

  return (
    <div className="dr-ds-tabbar">
      <div className="dr-container dr-ds-tabbar-inner">
        {tabs.map((tabItem) => {
          const Icon = (Ic as any)[tabItem.icon] || Ic.Book
          const isActive = tab === tabItem.id

          return (
            <button
              key={tabItem.id}
              className={`dr-ds-tab ${isActive ? 'active' : ''}`}
              onClick={() => onTab(tabItem.id)}
            >
              <Icon size={16} /> {tabItem.label}
              {tabItem.badge !== undefined && tabItem.badge !== null && (
                <span className="badge">{tabItem.badge}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
