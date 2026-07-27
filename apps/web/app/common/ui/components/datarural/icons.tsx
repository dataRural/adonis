export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'stroke'> {
  size?: number
  stroke?: number
}

function createIcon(
  name: string,
  children: React.ReactNode,
  viewBox = '0 0 24 24'
): React.FC<IconProps> {
  const Component: React.FC<IconProps> = ({ size = 18, stroke = 2, ...props }) => (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  )
  Component.displayName = `Ic${name.charAt(0).toUpperCase() + name.slice(1)}`
  return Component
}

export const Search = createIcon('search', (
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </>
))

export const Download = createIcon('download', (
  <>
    <path d="M12 3v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M5 21h14" />
  </>
))

export const Database = createIcon('database', (
  <>
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
    <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
  </>
))

export const Users = createIcon('users', (
  <>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20a6 6 0 0 1 11 0" />
    <path d="M16 5.5a3.2 3.2 0 0 1 0 5" />
    <path d="M17 14.4a6 6 0 0 1 3.5 5.6" />
  </>
))

export const Building = createIcon('building', (
  <>
    <rect x="5" y="3" width="14" height="18" rx="1.5" />
    <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
  </>
))

export const Arrow = createIcon('arrow', (
  <>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </>
))

export const Sun = createIcon('sun', (
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </>
))

export const Moon = createIcon('moon', (
  <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z" />
))

export const Clock = createIcon('clock', (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>
))

export const Star = createIcon('star', (
  <path d="m12 3 2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9 6.7 19.2l1-5.8-4.2-4.1 5.9-.9Z" />
))

export const Grid = createIcon('grid', (
  <>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </>
))

export const Rows = createIcon('rows', (
  <>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </>
))

export const Sprout = createIcon('sprout', (
  <>
    <path d="M12 20v-8" />
    <path d="M12 12c0-3 2.5-5 6-5 0 3-2.5 5-6 5Z" />
    <path d="M12 13c0-2.6-2.2-4.4-5.5-4.4 0 2.6 2.2 4.4 5.5 4.4Z" />
  </>
))

export const Flask = createIcon('flask', (
  <>
    <path d="M9 3h6M10 3v6l-5 8.5A2 2 0 0 0 6.7 21h10.6a2 2 0 0 0 1.7-3.5L14 9V3" />
    <path d="M8 15h8" />
  </>
))

export const Leaf = createIcon('leaf', (
  <>
    <path d="M4 20c0-9 7-15 16-15 0 9-7 15-16 15Z" />
    <path d="M4 20c4-6 8-9 12-10" />
  </>
))

export const Cloud = createIcon('cloud', (
  <>
    <path d="M7 18a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.5 1.5A3.5 3.5 0 0 1 17 18" />
  </>
))

export const Paw = createIcon('paw', (
  <>
    <circle cx="6.5" cy="11" r="1.8" />
    <circle cx="10" cy="7.5" r="1.8" />
    <circle cx="14" cy="7.5" r="1.8" />
    <circle cx="17.5" cy="11" r="1.8" />
    <path d="M8 16.5c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5-1.8 3-4 3-4-1-4-3Z" />
  </>
))

export const Tree = createIcon('tree', (
  <>
    <path d="M12 22v-5" />
    <path d="M12 17a6 6 0 0 0 6-6 5 5 0 0 0-1-3 5 5 0 0 0-10 0 5 5 0 0 0-1 3 6 6 0 0 0 6 6Z" />
  </>
))

export const Chart = createIcon('chart', (
  <>
    <path d="M3 3v18h18" />
    <path d="M7 14l3-4 3 3 4-6" />
  </>
))

export const Scale = createIcon('scale', (
  <>
    <path d="M12 3v18" />
    <path d="M5 7h14" />
    <path d="m5 7-2.5 6a3 3 0 0 0 5 0L5 7Z" />
    <path d="m19 7-2.5 6a3 3 0 0 0 5 0L19 7Z" />
    <path d="M8 21h8" />
  </>
))

export const Book = createIcon('book', (
  <>
    <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" />
    <path d="M4 19a2 2 0 0 0 2 2h13" />
  </>
))

export const Verified = createIcon('verified', (
  <>
    <path d="m9 12 2 2 4-4" />
    <path d="M12 2.5 14.5 5l3.5-.3.3 3.5L21 12l-2.7 3.5-.3 3.5-3.5-.3L12 21.5 9 19l-3.5.3-.3-3.5L2.5 12 5.2 8.5 5.5 5 9 5.3 12 2.5Z" />
  </>
))

export const File = createIcon('file', (
  <>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
    <path d="M14 3v5h5" />
  </>
))

export const Dot = ({ size = 18, fill = 'currentColor', ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} {...props}>
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export const Share = createIcon('share', (
  <>
    <circle cx="18" cy="5" r="2.6" />
    <circle cx="6" cy="12" r="2.6" />
    <circle cx="18" cy="19" r="2.6" />
    <path d="m8.3 10.7 7.4-4.4M8.3 13.3l7.4 4.4" />
  </>
))

export const Link = createIcon('link', (
  <>
    <path d="M10 13a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 1 0-5.7-5.7L11 6.3" />
    <path d="M14 11a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 1 0 5.7 5.7L13 17.7" />
  </>
))

export const Copy = createIcon('copy', (
  <>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2" />
  </>
))

export const Code = createIcon('code', (
  <>
    <path d="m9 8-4 4 4 4" />
    <path d="m15 8 4 4-4 4" />
  </>
))

export const History = createIcon('history', (
  <>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 4v4h4" />
    <path d="M12 8v4l3 2" />
  </>
))

export const Calendar = createIcon('calendar', (
  <>
    <rect x="3.5" y="5" width="17" height="16" rx="2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </>
))

export const Pin = createIcon('pin', (
  <>
    <path d="M12 21s7-6.3 7-11a7 7 0 0 0-14 0c0 4.7 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </>
))

export const Message = createIcon('message', (
  <>
    <path d="M21 12a8 8 0 0 1-11.5 7.2L4 20.5l1.3-5.4A8 8 0 1 1 21 12Z" />
  </>
))

export const Eye = createIcon('eye', (
  <>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </>
))

export const Heart = createIcon('heart', (
  <path d="M12 20s-7-4.4-9.2-9A4.7 4.7 0 0 1 12 6.5 4.7 4.7 0 0 1 21.2 11C19 15.6 12 20 12 20Z" />
))

export const Up = createIcon('up', (
  <>
    <path d="M12 19V5" />
    <path d="m6 11 6-6 6 6" />
  </>
))

export const Chevd = createIcon('chevd', (
  <path d="m6 9 6 6 6-6" />
))

export const Chevr = createIcon('chevr', (
  <path d="m9 6 6 6-6 6" />
))

export const External = createIcon('external', (
  <>
    <path d="M14 4h6v6" />
    <path d="M20 4 10 14" />
    <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
  </>
))

export const Hash = createIcon('hash', (
  <>
    <path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16" />
  </>
))

export const Type = createIcon('type', (
  <>
    <path d="M4 7V5h16v2" />
    <path d="M12 5v14" />
    <path d="M9 19h6" />
  </>
))

export const Sigma = createIcon('sigma', (
  <>
    <path d="M18 5H6l6 7-6 7h12" />
  </>
))

export const Sort = createIcon('sort', (
  <>
    <path d="M7 4v16" />
    <path d="m4 8 3-4 3 4" />
    <path d="M17 20V4" />
    <path d="m14 16 3 4 3-4" />
  </>
))

export const Check = createIcon('check', (
  <path d="m5 12 5 5L20 7" />
))

export const Info = createIcon('info', (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </>
))

export const Spark = createIcon('spark', (
  <>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <path d="m6 6 2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  </>
))

export const Folder = createIcon('folder', (
  <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h6a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
))

export const Columns = createIcon('columns', (
  <>
    <rect x="3.5" y="4" width="17" height="16" rx="2" />
    <path d="M9.5 4v16M14.5 4v16" />
  </>
))

export const Bookmark = createIcon('bookmark', (
  <path d="M6 4h12v16l-6-4-6 4Z" />
))

export const Plus = createIcon('plus', (
  <>
    <path d="M12 5v14M5 12h14" />
  </>
))

export const Quote = createIcon('quote', (
  <>
    <path d="M7 7H4v6h6V7H7Zm0 0c0 4-1 5-3 6" />
    <path d="M17 7h-3v6h6V7h-3Zm0 0c0 4-1 5-3 6" />
  </>
))

export const Table = createIcon('table', (
  <>
    <rect x="3.5" y="4" width="17" height="16" rx="2" />
    <path d="M3.5 9.5h17M3.5 15h17M9.5 9.5V20M14.5 9.5V20" />
  </>
))

export const Filter = createIcon('filter', (
  <path d="M3 5h18l-7 8v5l-4 2v-7Z" />
))

export const Globe = createIcon('globe', (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
  </>
))

export const Flag = createIcon('flag', (
  <>
    <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
  </>
))

export const Thermometer = createIcon('thermometer', (
  <>
    <path d="M12 4a2 2 0 0 1 2 2v8.5a4 4 0 1 1-4 0V6a2 2 0 0 1 2-2Z" />
  </>
))

export const More = createIcon('more', (
  <>
    <circle cx="12" cy="5" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="12" cy="19" r="1.6" fill="currentColor" stroke="none" />
  </>
))

export const Edit = createIcon('edit', (
  <>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </>
))

export const Trash = createIcon('trash', (
  <>
    <path d="M4 7h16" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
    <path d="M10 11v6M14 11v6" />
  </>
))

export const Eyeoff = createIcon('eyeoff', (
  <>
    <path d="M10.6 6.2A9.7 9.7 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3 3.5M6.6 6.6A17 17 0 0 0 2 12s3.6 6 10 6a9.4 9.4 0 0 0 4.5-1.1" />
    <path d="m9.9 9.9a3 3 0 0 0 4.2 4.2" />
    <path d="M2 2l20 20" />
  </>
))

export const Branch = createIcon('branch', (
  <>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="8" r="2.5" />
    <path d="M6 8.5v7M18 10.5a6 6 0 0 1-6 6H6" />
  </>
))

export const X = createIcon('x', (
  <>
    <path d="M6 6l12 12M18 6 6 18" />
  </>
))

export const Alert = createIcon('alert', (
  <>
    <path d="M12 3 2.5 19.5a1 1 0 0 0 .9 1.5h17.2a1 1 0 0 0 .9-1.5L12 3Z" />
    <path d="M12 9v5M12 17.5h.01" />
  </>
))

export const Uploadcloud = createIcon('uploadcloud', (
  <>
    <path d="M7 18a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.5 1.5A3.5 3.5 0 0 1 17 18" />
    <path d="M12 13v7" />
    <path d="m9 16 3-3 3 3" />
  </>
))

export const Save = createIcon('save', (
  <>
    <path d="M5 3h11l3 3v15H5Z" />
    <path d="M8 3v5h7M8 21v-7h8v7" />
  </>
))

export const Send = createIcon('send', (
  <>
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4Z" />
  </>
))

export const Layers = createIcon('layers', (
  <>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5M3 18l9 5 9-5" />
  </>
))

export const Lock = createIcon('lock', (
  <>
    <rect x="4.5" y="11" width="15" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </>
))

export const Settings = createIcon('settings', (
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 0 1-4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 0 1 0-4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 2.9-1.2V3a2 2 0 0 1 4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9H21a2 2 0 0 1 0 4h-.2a1.7 1.7 0 0 0-1.4.9Z" />
  </>
))

export const User = createIcon('user', (
  <>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </>
))

export const Logout = createIcon('logout', (
  <>
    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
    <path d="M10 17l-5-5 5-5" />
    <path d="M5 12h11" />
  </>
))
