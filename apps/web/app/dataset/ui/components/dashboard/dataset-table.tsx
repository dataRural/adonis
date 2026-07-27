import { useState, useEffect, useRef } from 'react'
import { Link } from '@adonisjs/inertia/react'
import { router } from '@inertiajs/react'
import * as Ic from '#common/ui/components/datarural/icons'
import { UserDatasetItem, STATUS_META } from './panel-data'

interface DatasetTableProps {
  list: UserDatasetItem[]
  onEdit: (d: UserDatasetItem) => void
  onPublish: () => void
}

function RowMenu({
  d,
  onEdit,
  onClose,
  openUpwards,
}: {
  d: UserDatasetItem
  onEdit: (d: UserDatasetItem) => void
  onClose: () => void
  openUpwards?: boolean
}) {
  const isPub = d.status === 'published'
  return (
    <div
      className="dr-row-menu"
      role="menu"
      style={openUpwards ? { top: 'auto', bottom: 'calc(100% + 6px)' } : undefined}
    >
      <button
        onClick={() => {
          onEdit(d)
          onClose()
        }}
      >
        <Ic.Edit size={16} /> Editar metadados
      </button>
      <button
        onClick={() => {
          onEdit(d)
          onClose()
        }}
      >
        <Ic.Branch size={16} /> Enviar nova versão
      </button>
      <button
        onClick={() => {
          router.visit(`/datasets/${d.id}`)
          onClose()
        }}
      >
        <Ic.Eye size={16} /> Ver página pública
      </button>
      <button onClick={onClose}>
        <Ic.Chart size={16} /> Estatísticas de uso
      </button>
      <div className="sep"></div>
      <button
        className="danger"
        onClick={() => {
          alert(`Excluir dataset ${d.title}`)
          onClose()
        }}
      >
        <Ic.Trash size={16} /> Excluir
      </button>
    </div>
  )
}

function DatasetRow({
  d,
  open,
  onToggleMenu,
  onEdit,
  onCloseMenu,
}: {
  d: UserDatasetItem
  open: boolean
  onToggleMenu: (id: number) => void
  onEdit: (d: UserDatasetItem) => void
  onCloseMenu: () => void
}) {
  const sm = STATUS_META[d.status] || { label: d.status, color: 'var(--muted-foreground)' }
  const ref = useRef<HTMLDivElement>(null)
  const [openUpwards, setOpenUpwards] = useState(false)

  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setOpenUpwards(spaceBelow < 280)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onCloseMenu()
      }
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [open, onCloseMenu])

  return (
    <div className="dr-mds-row" style={open ? { zIndex: 50 } : undefined}>
      <div className="dr-mds-name">
        <span className="dr-mds-thumb" style={{ background: d.tint }}>
          <Ic.Table size={20} />
          <span className="fmt">{d.format}</span>
        </span>
        <span className="nm">
          <Link className="t" href={`/datasets/${d.id}`} title={d.title}>
            {d.title}
          </Link>
          <span className="sub">
            <span className="v">
              <Ic.History size={12} /> {d.version}
            </span>
            <span className="dotsep"></span>
            <span className="v">
              <Ic.Rows size={12} /> {d.rows} linhas
            </span>
            <span className="dotsep"></span>
            <span className="v">
              <Ic.Clock size={12} /> {d.updated}
            </span>
          </span>
        </span>
      </div>

      <div className="col-status">
        <span
          className={'dr-status-badge ' + d.status}
          onClick={(e) => {
            e.stopPropagation()
            router.post(`/datasets/${d.id}/privacy`, {}, { preserveScroll: true })
          }}
          title={d.status === 'published' ? 'Clique para tornar Privado' : 'Clique para tornar Público'}
          style={{ cursor: 'pointer' }}
        >
          <span className="d" style={{ background: sm.color }}></span>
          {sm.label}
        </span>
      </div>

      <div className="col-dl dr-mds-metric">
        <span className="num">{d.likes ?? d.downloads ?? '0'}</span>
        <span className="lbl">curtidas</span>
      </div>

      <div className="col-usab">
        {d.usability ? (
          <span className="dr-mds-usab">
            <Ic.Verified size={15} /> {d.usability}
          </span>
        ) : (
          <span className="dr-mds-usab na">—</span>
        )}
      </div>

      <div style={{ position: 'relative' }} ref={ref}>
        <button
          className={'dr-row-menu-btn' + (open ? ' open' : '')}
          onClick={(e) => {
            e.stopPropagation()
            onToggleMenu(d.id)
          }}
          aria-label="Ações"
        >
          <Ic.More size={18} />
        </button>
        {open && <RowMenu d={d} onEdit={onEdit} onClose={onCloseMenu} openUpwards={openUpwards} />}
      </div>
    </div>
  )
}

export default function DatasetTable({ list, onEdit, onPublish }: DatasetTableProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  return (
    <div className="dr-mds">
      <div className="dr-mds-head">
        <span>Dataset</span>
        <span>Status</span>
        <span>Curtidas</span>
        <span>Usabilidade</span>
        <span></span>
      </div>
      {list.length === 0 ? (
        <div className="dr-mds-empty">
          <span className="ic">
            <Ic.Folder size={28} />
          </span>
          <strong>Nenhum dataset nesta visão</strong>
          <p>Ajuste os filtros ou publique um novo conjunto de dados.</p>
          <button className="dr-btn dr-btn-primary" onClick={onPublish}>
            <Ic.Plus size={17} /> Publicar dataset
          </button>
        </div>
      ) : (
        list.map((d) => (
          <DatasetRow
            key={d.id}
            d={d}
            open={openMenuId === d.id}
            onToggleMenu={(id) => setOpenMenuId(openMenuId === id ? null : id)}
            onCloseMenu={() => setOpenMenuId(null)}
            onEdit={onEdit}
          />
        ))
      )}
    </div>
  )
}
