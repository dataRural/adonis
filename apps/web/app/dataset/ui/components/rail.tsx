import { useState } from 'react'
import { Link } from '@inertiajs/react'
import * as Ic from '#common/ui/components/datarural/icons'
import { DatasetDetail } from './detail-data'
import LicenseModal from './license-modal'
import { useTranslation } from '#common/ui/hooks/use_translation'

interface RailProps {
  ds: DatasetDetail
}

export default function Rail({ ds }: RailProps) {
  const { t } = useTranslation()
  const [licenseModalOpen, setLicenseModalOpen] = useState(false)

  const meta = [
    { k: t('dataset.rail.format'), v: ds.format, icon: 'File' },
    { k: t('dataset.rail.size'), v: ds.size, icon: 'Database' },
    { k: t('dataset.rail.rows_cols'), v: `${ds.rows} × ${ds.cols}`, icon: 'Table' },
  ]

  return (
    <aside className="dr-ds-rail">
      {/* licença */}
      <div className="dr-rail-card">
        <div className="dr-rail-card-head">
          <h4>
            <Ic.Scale size={13} style={{ marginRight: 6 }} /> {t('dataset.rail.license')}
          </h4>
        </div>
        <div className="dr-rail-card-body">
          <button
            type="button"
            className="dr-license-pill"
            onClick={() => setLicenseModalOpen(true)}
            style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            <span className="lic-ic">
              <Ic.Scale size={16} />
            </span>
            <span style={{ minWidth: 0 }}>
              <span className="lt">{ds.license}</span>
              <span className="ld">{t('dataset.rail.click_terms')}</span>
            </span>
            <span className="ext">
              <Ic.Info size={15} />
            </span>
          </button>
        </div>
      </div>

      {/* metadados */}
      <div className="dr-rail-card">
        <div className="dr-rail-card-head">
          <h4>
            <Ic.Info size={13} style={{ marginRight: 6 }} /> {t('dataset.rail.metadata')}
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
            <Ic.Pin size={13} style={{ marginRight: 6 }} /> {t('dataset.rail.provenance')}
          </h4>
        </div>
        <div className="dr-rail-card-body">
          <div className="dr-prov-list">
            <div className="dr-prov-item">
              <span className="pic">
                <Ic.Calendar size={16} />
              </span>
              <span>
                <span className="pk">{t('dataset.rail.temp_coverage')}</span>
                <span className="pv">{ds.coverageTime}</span>
              </span>
            </div>
            <div className="dr-prov-item">
              <span className="pic">
                <Ic.Globe size={16} />
              </span>
              <span>
                <span className="pk">{t('dataset.rail.geo_coverage')}</span>
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
            <Ic.Users size={13} style={{ marginRight: 6 }} /> {t('dataset.rail.maintainers')}
          </h4>
        </div>
        <div className="dr-rail-card-body">
          {ds.authors.map((a) => {
            const href = a.profileUrl || '/profile'
            return (
              <Link href={href} className="dr-author-item" key={a.userId || a.name}>
                {a.avatarUrl ? (
                  <img
                    src={a.avatarUrl}
                    alt={a.name}
                    className="dr-author-av"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <span className="dr-author-av" style={{ background: a.color }}>
                    {a.initials}
                  </span>
                )}
                <span style={{ minWidth: 0 }}>
                  <span className="an">{a.name}</span>
                  <span className="ar">
                    {a.role} · {a.inst}
                  </span>
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* tags */}
      <div className="dr-rail-card">
        <div className="dr-rail-card-head">
          <h4>
            <Ic.Hash size={13} style={{ marginRight: 6 }} /> {t('dataset.rail.tags')}
          </h4>
        </div>
        <div className="dr-rail-card-body">
          <div className="dr-rail-tags">
            {ds.tags.map((tTag) => (
              <span className="dr-rail-tag" key={tTag}>
                {tTag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <LicenseModal
        isOpen={licenseModalOpen}
        onClose={() => setLicenseModalOpen(false)}
        licenseName={ds.license}
      />
    </aside>
  )
}
