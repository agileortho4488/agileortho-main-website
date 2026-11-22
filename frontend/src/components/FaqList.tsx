import type { FaqItem } from '@/content/devices';

/** Visible FAQ. Its text is the same text the FAQPage JSON-LD carries. */
export default function FaqList({ items }: { items: FaqItem[] }) {
  // One question: show it open; an accordion of one looks empty.
  if (items.length === 1) return <div><h3 className="acc-one">{items[0].q}</h3><p>{items[0].a}</p></div>;
  return (
    <div>
      {items.map(f => (
        <details className="acc" key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
