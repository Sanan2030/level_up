'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="card padded empty-state" role="alert">
      <h1>This page couldn’t load</h1>
      <button className="button button-primary" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
