import s from './info.module.css';

/** Privacy and Terms: the About/Contact dark strip, then heading-left, text-right rows. */
export default function LegalPage({ eyebrow, title, lead, updated, sections }: {
  eyebrow: string;
  title: string;
  lead: React.ReactNode;
  updated?: string;
  sections: { h: string; body: React.ReactNode }[];
}) {
  return (
    <>
      <section aria-labelledby="legal-h1" className={s.hero}>
        <div className={s.glow} aria-hidden="true" />
        <div className={s.grain} aria-hidden="true" />
        <div className={`wrap ${s.rise}`} style={{ position: 'relative' }}>
          <p className={s.eyebrow}>{eyebrow}</p>
          <h1 id="legal-h1" className={s.display} style={{ maxWidth: '18ch' }}>{title}</h1>
          <p className={s.lead} style={{ maxWidth: 620 }}>{lead}</p>
          {updated && <p className={s.updated}>Last updated {updated}.</p>}
        </div>
      </section>
      <div className={`wrap ${s.legal}`}>
        {sections.map(x => (
          <section className={s.row} key={x.h}>
            <h2>{x.h}</h2>
            <div>{x.body}</div>
          </section>
        ))}
      </div>
    </>
  );
}
