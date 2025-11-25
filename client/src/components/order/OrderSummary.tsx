"use client";

import Image from "next/image";
import type { OrderDraft } from "@/lib/orderDraftClient";

interface OrderSummaryProps {
  draft: OrderDraft;
  clientOrderId: string;
  placing: boolean;
  onPlaceOrder: () => void;
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("tr-TR").format(amount);
}

export default function OrderSummary({
  draft,
  clientOrderId,
  placing,
  onPlaceOrder,
}: OrderSummaryProps) {
  const itemCount = draft.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 md:text-base">
            Order summary
          </h2>
          <p className="text-xs text-slate-500">
            Temporary order id{" "}
            <span className="font-mono text-[11px] text-slate-700">
              {clientOrderId}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
          <span className="text-[11px] font-medium text-slate-700">
            Secure checkout
          </span>
        </div>
      </div>

      {/* Items list */}
      <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 md:p-4">
        <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </span>
          <span>Review your basket</span>
        </div>

        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
          {draft.items.map((item) => {
            const anyItem = item as any;
            const imageUrl: string | undefined =
              anyItem.imageUrl || anyItem.imageUrls?.[0];

            return (
              <div
                key={item.productId}
                className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 text-xs shadow-[0_1px_0_rgba(15,23,42,0.04)]"
              >
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 md:h-14 md:w-14">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="line-clamp-2 text-[11px] font-semibold text-slate-900 md:text-xs">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>Qty {item.quantity}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>
                      {formatAmount(item.unitPrice)} {item.currency} each
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-slate-900 md:text-xs">
                  {formatAmount(item.unitPrice * item.quantity)} {item.currency}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Totals */}
      <div className="space-y-2 border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between text-xs md:text-sm">
          <span className="text-slate-600">Subtotal</span>
          <span className="text-slate-900">
            {formatAmount(draft.totalAmount)} {draft.currency}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs md:text-sm">
          <span className="text-slate-600">Shipping</span>
          <span className="text-slate-500">Included in this case study</span>
        </div>
        <div className="flex items-center justify-between text-sm font-semibold md:text-base">
          <span className="text-slate-900">Total</span>
          <span className="text-slate-900">
            {formatAmount(draft.totalAmount)} {draft.currency}
          </span>
        </div>

        <p className="text-[11px] text-slate-500 md:text-xs">
          This checkout is for a demo case study. Taxes and shipping are not
          applied.
        </p>
      </div>

      {/* Call to action */}
      <button
        disabled={placing}
        onClick={onPlaceOrder}
        type="button"
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-red-500 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
      >
        {placing && (
          <span className="h-4 w-4 animate-spin rounded-full border-[2px] border-white border-b-transparent" />
        )}
        <span>{placing ? "Placing your order" : "Place order"}</span>
      </button>

      <p className="text-center text-[10px] text-slate-400 md:text-[11px]">
        By placing your order you confirm that your details are correct for this
        test shop experience.
      </p>
    </aside>
  );
}
