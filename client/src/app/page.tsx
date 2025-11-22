export default function HomePage() {
  return (
    <section className="flex w-full flex-col gap-4">
      <h1 className="text-2xl font-semibold">Welcome to Playable Shop</h1>
      <p className="max-w-xl text-sm text-slate-600">
        This is the ecommerce case study built with Next.js, TypeScript,
        Tailwind, Firebase and a separate Express backend.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-1 text-sm font-semibold">Browse products</h2>
          <p className="text-xs text-slate-600">
            The shop page will show categories, filters, and search.
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-1 text-sm font-semibold">Cart and checkout</h2>
          <p className="text-xs text-slate-600">
            Add products to cart and simulate checkout with a dummy payment.
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-1 text-sm font-semibold">Admin dashboard</h2>
          <p className="text-xs text-slate-600">
            Manage products and view orders and customers.
          </p>
        </div>
      </div>
    </section>
  );
}
