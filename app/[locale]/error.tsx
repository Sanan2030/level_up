'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="card padded empty-state" role="alert">
      <h1>Yenidən sınayaq / Let’s try again</h1>
      <p>Bu səhifə yüklənmədi. / This page couldn’t load.</p>
      <button className="button button-primary" onClick={reset}>
        Yenidən sına / Try again
      </button>
    </div>
  );
}
