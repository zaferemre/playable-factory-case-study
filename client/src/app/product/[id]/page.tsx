interface ProductPageProps {
  params: { id: string };
}

export default function ProductDetailsPage({ params }: ProductPageProps) {
  const { id } = params;

  return (
    <section className="flex w-full flex-col gap-4">
      <h1 className="text-2xl font-semibold">Product Details</h1>
      <p className="text-sm text-slate-600">
        This page will show details for product with id {id}.
      </p>
    </section>
  );
}
