import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section">
      <div className="col">
        <h1>Page not found</h1>
        <p>This page does not exist, or it has moved.</p>
        <p>
          <Link href="/devices">Devices A to Z</Link> lists every device we supply. Or go to the{' '}
          <Link href="/">home page</Link>.
        </p>
      </div>
    </section>
  );
}
