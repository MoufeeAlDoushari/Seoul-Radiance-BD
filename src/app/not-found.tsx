import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-x py-28 text-center">
      <p className="font-display text-7xl font-semibold text-rose">404</p>
      <h1 className="font-display mt-4 text-4xl font-semibold">We could not find that page</h1>
      <p className="mx-auto mt-3 max-w-sm text-sm text-plum-soft">
        The link may be old, or the product may have sold out and been removed.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">Back home</Link>
        <Link href="/shop" className="btn btn-outline">Browse the shop</Link>
      </div>
    </div>
  );
}
