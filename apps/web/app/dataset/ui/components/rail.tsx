import * as Ic from '#common/ui/components/datarural/icons'
import { DatasetDetail } from './detail-data'

interface RailProps {
  ds: DatasetDetail
}

export default function Rail({ ds }: RailProps) {

  const meta = [
    { k: 'Formato', v: ds.format, icon: 'File' },
    { k: 'Tamanho', v: ds.size, icon: 'Database' },
    { k: 'Linhas × Colunas', v: `${ds.rows} × ${ds.cols}`, icon: 'Table' },
  ]

  return (
    <aside className="dr-ds-rail">
      {/* licença */}
      <div className="dr-rail-card">
        <div className="dr-rail-card-head">
          <h4>
            <Ic.Scale size={13} style={{ marginRight: 6 }} /> Licença
          </h4>
        </div>
        <div className="dr-rail-card-body">
          <a className="dr-license-pill" href={ds.licenseUrl}>
            <span className="lic-ic">
              <Ic.Scale size={16} />
            </span>
            <span style={{ minWidth: 0 }}>
              <span className="lt">{ds.license}</span>
              <span className="ld">Atribuição · uso livre com crédito</span>
            </span>
            <span className="ext">
              <Ic.External size={15} />
            </span>
          </a>
        </div>
      </div>

      {/* metadados */}
      <div className="dr-rail-card">
        <div className="dr-rail-card-head">
          <h4>
            <Ic.Info size={13} style={{ marginRight: 6 }} /> Metadados
          </h4>
        </div>
        <div className="dr-rail-card-body">
          <div className="dr-meta-list">
            {meta.map((m) => {
              const Icon = (Ic as any)[m.icon] || Ic.Info
              return (
                <div className="dr-meta-item" key={m.k}>
                  <span className="mic">
                    <Icon size={15} />
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span className="mk">{m.k}</span>
                    <span className="mv">{m.v}</span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* proveniência */}
      <div className="dr-rail-card">
        <div className="dr-rail-card-head">
          <h4>
            <Ic.Pin size={13} style={{ marginRight: 6 }} /> Proveniência
          </h4>
        </div>
        <div className="dr-rail-card-body">
          <div className="dr-prov-list">
            <div className="dr-prov-item">
              <span className="pic">
                <Ic.Calendar size={16} />
              </span>
              <span>
                <span className="pk">Cobertura temporal</span>
                <span className="pv">{ds.coverageTime}</span>
              </span>
            </div>
            <div className="dr-prov-item">
              <span className="pic">
                <Ic.Globe size={16} />
              </span>
              <span>
                <span className="pk">Cobertura geográfica</span>
                <span className="pv">{ds.coverageGeo}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* autores */}
      <div className="dr-rail-card">
        <div className="dr-rail-card-head">
          <h4>
            <Ic.Users size={13} style={{ marginRight: 6 }} /> Mantenedores
          </h4>
        </div>
        <div className="dr-rail-card-body">
          {ds.authors.map((a) => (
            <div className="dr-author-item" key={a.name}>
              <span className="dr-author-av" style={{ background: a.color }}>
                {a.initials}
              </span>
              <span style={{ minWidth: 0 }}>
                <span className="an">{a.name}</span>
                <span className="ar">
                  {a.role} · {a.inst}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* tags */}
      <div className="dr-rail-card">
        <div className="dr-rail-card-head">
          <h4>
            <Ic.Hash size={13} style={{ marginRight: 6 }} /> Tags
          </h4>
        </div>
        <div className="dr-rail-card-body">
          <div className="dr-rail-tags">
            {ds.tags.map((t) => (
              <span className="dr-rail-tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
