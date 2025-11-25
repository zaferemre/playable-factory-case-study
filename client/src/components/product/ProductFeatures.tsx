import { IconTruckDelivery, IconShieldCheck } from "@tabler/icons-react";

export default function ProductFeatures() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex items-center gap-3 p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-slate-200/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
          <IconTruckDelivery size={20} className="text-emerald-600" />
        </div>
        <div>
          <div className="font-semibold text-slate-900">Free Shipping</div>
          <div className="text-sm text-slate-600">On orders over 500 TRY</div>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-slate-200/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <IconShieldCheck size={20} className="text-blue-600" />
        </div>
        <div>
          <div className="font-semibold text-slate-900">Quality Guarantee</div>
          <div className="text-sm text-slate-600">30-day return policy</div>
        </div>
      </div>
    </div>
  );
}
