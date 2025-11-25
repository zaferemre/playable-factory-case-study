interface ProductInfoProps {
  description?: string;
  inStock: boolean;
}

export default function ProductInfo({
  description,
  inStock,
}: ProductInfoProps) {
  return (
    <div className="space-y-6">
      {/* Stock Status */}
      <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50">
        <div
          className={`flex h-3 w-3 rounded-full ${
            inStock ? "bg-emerald-400" : "bg-red-400"
          }`}
        />
        <span
          className={`font-medium ${
            inStock ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {inStock ? "In Stock - Ready to Ship" : "Currently Out of Stock"}
        </span>
      </div>

      {/* Description */}
      <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50">
        <h3 className="text-lg font-bold text-slate-900 mb-3">
          About This Product
        </h3>
        <p className="text-slate-700 leading-relaxed">
          {description ||
            "This premium cereal offers exceptional taste and quality, crafted with the finest ingredients for your enjoyment."}
        </p>
      </div>
    </div>
  );
}
