import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="empty-state card padded">
      <span className="eyebrow">404</span>
      <h1>Page not found</h1>
      <Link className="button button-primary" href="/en">
        Home
      </Link>
    </div>
  );
}
