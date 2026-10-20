import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="empty-state card padded">
      <span className="eyebrow">404</span>
      <h1>Bu yol hələ açılmayıb.</h1>
      <p>This page doesn’t exist. Your next lesson is still waiting.</p>
      <Link className="button button-primary" href="/az">
        Öyrənməyə qayıt / Back to learning
      </Link>
    </div>
  );
}
