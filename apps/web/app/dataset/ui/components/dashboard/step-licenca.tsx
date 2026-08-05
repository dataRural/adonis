import * as Ic from '#common/ui/components/datarural/icons'
import { LICENSES } from './panel-data'
import { useTranslation } from '#common/ui/hooks/use_translation'

interface Step4Props {
  data: any
  set: (patch: any) => void
}

export default function StepLicenca({ data, set }: Step4Props) {
  const { t } = useTranslation()

  return (
    <div>
      <div className="dr-subhead" style={{ marginTop: 0 }}>
        <span className="ic">
          <Ic.Scale size={16} />
        </span>{' '}
        {t('dataset.step_license.license_subhead')}
      </div>
      <div className="dr-lic-grid">
        {LICENSES.map((l) => (
          <div
            key={l.id}
            className={'dr-lic-card' + (data.license === l.id ? ' sel' : '')}
            onClick={() => set({ license: l.id })}
          >
            <span className="dr-lic-radio"></span>
            <div className="lc-main">
              <div className="lc-name">
                {l.name}{' '}
                <span className={'lc-tag' + (l.rec ? ' rec' : '')}>{l.tag}</span>
              </div>
              <div className="lc-desc">{l.desc}</div>
              <div className="lc-perms">
                <span className={l.commercial ? 'yes' : 'no'} style={{ display: l.id === 'custom' ? 'none' : undefined }}>
                  {l.commercial ? <Ic.Check size={13} /> : <Ic.X size={13} />} {t('dataset.step_license.commercial_use')}
                </span>
                <span className={l.derivatives ? 'yes' : 'no'} style={{ display: l.id === 'custom' ? 'none' : undefined }}>
                  {l.derivatives ? <Ic.Check size={13} /> : <Ic.X size={13} />} {t('dataset.step_license.derivatives')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dr-subhead">
        <span className="ic">
          <Ic.Eye size={16} />
        </span>{' '}
        {t('dataset.step_license.visibility_subhead')}
      </div>
      <div className="dr-vis-row">
        <div
          className={'dr-vis-card' + (data.visibility === 'public' ? ' sel' : '')}
          onClick={() => set({ visibility: 'public' })}
        >
          <span className="vic" style={{ background: 'var(--brand-green)' }}>
            <Ic.Globe size={20} />
          </span>
          <div>
            <div className="vt">{t('dataset.step_license.public_title')}</div>
            <div className="vd" style={{ margin: '3px 0 0' }}>{t('dataset.step_license.public_desc')}</div>
          </div>
        </div>
        <div
          className={'dr-vis-card' + (data.visibility === 'restricted' ? ' sel' : '')}
          onClick={() => set({ visibility: 'restricted' })}
        >
          <span className="vic" style={{ background: 'var(--brand-orange)' }}>
            <Ic.Lock size={20} />
          </span>
          <div>
            <div className="vt">{t('dataset.step_license.restricted_title')}</div>
            <div className="vd" style={{ margin: '3px 0 0' }}>{t('dataset.step_license.restricted_desc')}</div>
          </div>
        </div>
      </div>

      {data.visibility === 'restricted' && data.userGroups && data.userGroups.length > 0 && (
        <>
          <div className="dr-subhead">
            <span className="ic">
              <Ic.Users size={16} />
            </span>{' '}
            {t('dataset.step_license.group_subhead')}
          </div>
          <div style={{ maxWidth: 420 }}>
            <select
              className="dr-select"
              value={data.groupId || ''}
              onChange={(e) => set({ groupId: e.target.value ? Number(e.target.value) : null })}
            >
              <option value="">{t('dataset.step_license.no_group')}</option>
              {data.userGroups.map((g: { id: number; name: string }) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <span className="dr-field-hint" style={{ display: 'block', marginTop: 6 }}>
              <Ic.Info size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
              {t('dataset.step_license.group_hint')}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
