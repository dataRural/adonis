export function BrandMark({ size = 38 }: { size?: number }) {
  return (
    <svg className="brand-mark" width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* folha / arco (vesica) — verde */}
      <path
        d="M24 5 C33 12 33 24 24 31 C15 24 15 12 24 5 Z"
        stroke="var(--brand-green)"
        strokeWidth="2.4"
        fill="none"
        strokeLinejoin="round"
      />
      {/* haste */}
      <path
        d="M24 18 L24 33"
        stroke="var(--brand-green)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* camadas de dados (database) — azul */}
      <ellipse
        cx="24"
        cy="34"
        rx="13"
        ry="4.4"
        stroke="var(--brand-blue)"
        strokeWidth="2.4"
        fill="none"
      />
      <path
        d="M11 34 V40 C11 42.4 16.8 44 24 44 C31.2 44 37 42.4 37 40 V34"
        stroke="var(--brand-blue)"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      {/* nó amarelo (átomo/dado) */}
      <circle cx="24" cy="34" r="2.6" fill="var(--brand-yellow)" />
    </svg>
  )
}

export function leafPath(cx: number, cy: number, len: number, wid: number, angleDeg: number) {
  const hl = len / 2
  const hw = wid / 2
  return {
    d: `M ${-hl} 0 Q 0 ${-hw} ${hl} 0 Q 0 ${hw} ${-hl} 0 Z`,
    transform: `translate(${cx} ${cy}) rotate(${angleDeg})`,
  }
}

export function ArcosCluster({ palette }: { palette?: string[] }) {
  const cols = palette || [
    'var(--brand-blue)',
    'var(--brand-green)',
    'var(--brand-yellow)',
    'var(--brand-orange)',
    'var(--brand-sky)',
    'var(--brand-lightgreen)',
    'var(--brand-teal)',
    'var(--brand-purple)',
  ]

  const leaves = [
    [150, 60, 150, 64, 18],
    [232, 96, 132, 56, -32],
    [120, 150, 168, 70, 62],
    [210, 176, 150, 60, 6],
    [298, 140, 138, 58, 40],
    [96, 250, 150, 62, -18],
    [188, 262, 162, 66, 78],
    [276, 232, 130, 54, 22],
    [320, 300, 150, 60, -44],
    [150, 330, 140, 58, 50],
    [238, 350, 158, 64, -8],
    [70, 360, 130, 52, 30],
    [330, 200, 120, 50, -70],
    [108, 70, 120, 50, 100],
  ]

  const circles = [
    [300, 70, 46],
    [60, 180, 38],
    [360, 360, 40],
    [40, 300, 28],
  ]

  return (
    <svg viewBox="0 0 400 420" fill="none" aria-hidden="true">
      <g strokeWidth="2.4" fill="none" strokeLinejoin="round" strokeLinecap="round">
        {circles.map((c, i) => (
          <circle key={'c' + i} cx={c[0]} cy={c[1]} r={c[2]} stroke={cols[(i + 2) % cols.length]} />
        ))}
        {leaves.map((l, i) => {
          const p = leafPath(l[0], l[1], l[2], l[3], l[4])
          return (
            <path
              key={'l' + i}
              d={p.d}
              transform={p.transform}
              stroke={cols[i % cols.length]}
            />
          )
        })}
      </g>
    </svg>
  )
}

export function ArcosClusterMono({ color = 'rgba(255,255,255,0.9)' }: { color?: string }) {
  const leaves = [
    [150, 60, 150, 64, 18],
    [232, 96, 132, 56, -32],
    [120, 150, 168, 70, 62],
    [210, 176, 150, 60, 6],
    [298, 140, 138, 58, 40],
    [188, 262, 162, 66, 78],
    [276, 232, 130, 54, 22],
    [238, 350, 158, 64, -8],
  ]

  const circles = [
    [300, 70, 46],
    [120, 300, 40],
  ]

  return (
    <svg viewBox="0 0 400 420" fill="none" aria-hidden="true">
      <g strokeWidth="2.2" fill="none" strokeLinejoin="round" strokeLinecap="round" stroke={color}>
        {circles.map((c, i) => (
          <circle key={'c' + i} cx={c[0]} cy={c[1]} r={c[2]} />
        ))}
        {leaves.map((l, i) => {
          const p = leafPath(l[0], l[1], l[2], l[3], l[4])
          return <path key={'l' + i} d={p.d} transform={p.transform} />
        })}
      </g>
    </svg>
  )
}

export function CardArt({ tint }: { tint: string }) {
  const p1 = leafPath(248, 30, 120, 50, 24)
  const p2 = leafPath(286, 66, 100, 42, -30)
  const p3 = leafPath(40, 70, 110, 46, 50)

  return (
    <svg
      viewBox="0 0 320 96"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="320" height="96" fill={`color-mix(in srgb, ${tint} 9%, var(--card))`} />
      <g
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
        stroke={`color-mix(in srgb, ${tint} 55%, transparent)`}
      >
        <path d={p1.d} transform={p1.transform} />
        <path d={p2.d} transform={p2.transform} />
        <circle cx="300" cy="20" r="26" />
      </g>
      <g
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
        stroke={`color-mix(in srgb, ${tint} 30%, transparent)`}
      >
        <path d={p3.d} transform={p3.transform} />
      </g>
    </svg>
  )
}
