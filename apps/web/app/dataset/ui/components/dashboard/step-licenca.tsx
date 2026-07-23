import * as Ic from '#common/ui/components/datarural/icons'
import { LICENSES, ME } from './panel-data'

interface Step4Props {
  data: any
  set: (patch: any) => void
}

export default function StepLicenca({ data, set }: Step4Props) {
  const lic = LICENSES.find((l) => l.id === data.license) || LICENSES[0]
  const year = new Date().getFullYear()
  const randomDoiSuffix = 4729

  return (
    <div>
      <div className="dr-subhead" style={{ marginTop: 0 }}>
        <span className="ic">
          <Ic.Scale size={16} />
        </span>{' '}
        Licença de uso
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
                <span className={l.commercial ? 'yes' : 'no'}>
                  {l.commercial ? <Ic.Check size={13} /> : <Ic.X size={13} />} Uso comercial
                </span>
                <span className={l.derivatives ? 'yes' : 'no'}>
                  {l.derivatives ? <Ic.Check size={13} /> : <Ic.X size={13} />} Derivações
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
        Visibilidade
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
            <div className="vt">Público</div>
            <div className="vd" style={{ margin: '3px 0 0' }}>Qualquer pessoa pode encontrar, visualizar e baixar.</div>
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
            <div className="vt">Restrito</div>
            <div className="vd" style={{ margin: '3px 0 0' }}>Acesso mediante solicitação aprovada pelo autor.</div>
          </div>
        </div>
      </div>

      {data.visibility === 'restricted' && data.userGroups && data.userGroups.length > 0 && (
        <>
          <div className="dr-subhead">
            <span className="ic">
              <Ic.Users size={16} />
            </span>{' '}
            Grupo (opcional)
          </div>
          <div style={{ maxWidth: 420 }}>
            <select
              className="dr-select"
              value={data.groupId || ''}
              onChange={(e) => set({ groupId: e.target.value ? Number(e.target.value) : null })}
            >
              <option value="">Nenhum grupo — somente você</option>
              {data.userGroups.map((g: { id: number; name: string }) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <span className="dr-field-hint" style={{ display: 'block', marginTop: 6 }}>
              <Ic.Info size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
              Membros do grupo selecionado poderão ver este dataset.
            </span>
          </div>
        </>
      )}

      <div className="dr-wiz-cite-box">
        <div className="ch">
          <Ic.Quote size={14} style={{ display: 'inline', marginRight: 4 }} /> Como será citado
        </div>
        <div className="ctext">
          {data.unit ? ME.name + ' (' + year + '). ' : ''}
          <em>{data.title || 'Título do dataset'}</em> ({lic.name}). DataRural — UFRRJ.{' '}
          <span className="doi">https://doi.org/10.5281/datarural.{randomDoiSuffix}</span>
        </div>
      </div>
    </div>
  )
}
