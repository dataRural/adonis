import * as Ic from '#common/ui/components/datarural/icons'
import { THREADS } from './detail-data'

export default function DiscussionTab() {
  return (
    <div className="dr-panel">
      <div className="dr-panel-head">
        <h3>
          <Ic.Message size={17} className="ic" style={{ marginRight: 6 }} /> Discussão
        </h3>
        <div className="right">
          <button className="dr-btn dr-btn-primary dr-btn-sm" onClick={() => alert('Criar novo tópico')}>
            <Ic.Plus size={15} /> Novo tópico
          </button>
        </div>
      </div>
      <div className="dr-filelist">
        {THREADS.map((t) => (
          <div className="dr-thread" key={t.title}>
            <div className="dr-thread-votes">
              <Ic.Up size={15} className="ic" />
              <span className="n">{t.votes}</span>
            </div>
            <div className="dr-thread-main">
              <div className="dr-thread-title">
                {t.pinned && (
                  <span className="pin" title="Fixado" style={{ marginRight: 6 }}>
                    <Ic.Pin size={15} />
                  </span>
                )}
                {t.title}
              </div>
              <div className="dr-thread-meta">
                <span className="dr-thread-tag">{t.tag}</span>
                <span className="mi">
                  <Ic.Users size={13} style={{ marginRight: 4 }} />{' '}
                  <span className="who">{t.author}</span>
                </span>
                <span className="mi">
                  <Ic.Message size={13} style={{ marginRight: 4 }} /> {t.replies} respostas
                </span>
                <span className="mi">
                  <Ic.Clock size={13} style={{ marginRight: 4 }} /> {t.time}
                </span>
              </div>
            </div>
            <Ic.Chevr
              size={18}
              style={{ color: 'var(--muted-foreground)', alignSelf: 'center', flexShrink: 0 }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
