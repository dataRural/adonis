import { useState, useEffect, useRef } from 'react'
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
}: {
  d: UserDatasetItem
  onEdit: (d: UserDatasetItem) => void
  onClose: () => void
}) {
  const isPub = d.status === 'published'
  return (
    <div className="dr-row-menu" role="menu">
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
      <button onClick={onClose}>
        <Ic.Eye size={16} /> Ver página pública
      </button>
      <button onClick={onClose}>
        <Ic.Chart size={16} /> Estatísticas de uso
      </button>
      <div className="sep"></div>
      {isPub ? (
        <button onClick={onClose}>
          <Ic.Eyeoff size={16} /> Despublicar
        </button>
      ) : (
        <button onClick={onClose}>
          <Ic.Send size={16} /> Publicar agora
        </button>
      )}
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
    <div className="dr-mds-row">
      <div className="dr-mds-name">
        <span className="dr-mds-thumb" style={{ background: d.tint }}>
          <Ic.Table size={20} />
          <span className="fmt">{d.format}</span>
        </span>
        <span className="nm">
          <span className="t" title={d.title}>
            {d.title}
          </span>
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
        <span className={'dr-status-badge ' + d.status}>
          <span className="d" style={{ background: sm.color }}></span>
          {sm.label}
        </span>
      </div>

      <div className="col-dl dr-mds-metric">
        <span className="num">{d.downloads}</span>
        <span className="lbl">downloads</span>
      </div>

      <div className="col-views dr-mds-metric">
        <span className="num">{d.views}</span>
        <span className="lbl">visualizações</span>
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
        {open && <RowMenu d={d} onEdit={onEdit} onClose={onCloseMenu} />}
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
        <span>Downloads</span>
        <span>Visualizações</span>
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
