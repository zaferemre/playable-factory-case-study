"use client";

import { IconFilter } from "@tabler/icons-react";

type SortOptionKey =
  | "featured"
  | "priceAsc"
  | "priceDesc"
  | "ratingDesc"
  | "ordersDesc";

interface ShopHeaderBarProps {
  totalCount: number;
  shownCount: number;
  sortKey: SortOptionKey;
  onSortKeyChange: (key: SortOptionKey) => void;
  hasActiveFilters: boolean;
  onOpenMobileFilters: () => void;
  sortLabelMap: Record<SortOptionKey, string>;
}

export default function ShopHeaderBar({
  totalCount,
  shownCount,
  sortKey,
  onSortKeyChange,
  hasActiveFilters,
  onOpenMobileFilters,
  sortLabelMap,
}: ShopHeaderBarProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-slate-100 pb-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">All cereals</h1>
        <p className="text-xs text-slate-500 md:text-sm">
          Browse and filter products from the PlayableFactory shelf.
        </p>
        {totalCount > 0 && (
          <p className="mt-1 text-xs text-slate-500">
            Showing <span className="font-semibold">{shownCount}</span> of{" "}
            <span className="font-semibold">{totalCount}</span> products
          </p>
        )}
      </div>

      {/* right side: filters button and sort */}
      <div className="flex flex-col items-stretch gap-2 text-xs md:flex-row md:items-center md:justify-end">
        {/* mobile filter button */}
        <div className="flex justify-end md:hidden">
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-[6px] text-slate-700 hover:bg-slate-50"
          >
            <IconFilter size={14} stroke={1.7} />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                !
              </span>
            )}
          </button>
        </div>

        {/* desktop sort */}
        <div className="hidden items-center gap-2 md:flex">
          <span className="text-[11px] text-slate-500">Sort</span>
          <select
            value={sortKey}
            onChange={(e) => onSortKeyChange(e.target.value as SortOptionKey)}
            className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-700"
          >
            {(Object.entries(sortLabelMap) as [SortOptionKey, string][]).map(
              ([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              )
            )}
          </select>
        </div>

        {/* mobile sort */}
        <div className="flex items-center justify-end gap-2 md:hidden">
          <span className="text-[11px] text-slate-500">Sort</span>
          <select
            value={sortKey}
            onChange={(e) => onSortKeyChange(e.target.value as SortOptionKey)}
            className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-700"
          >
            {(Object.entries(sortLabelMap) as [SortOptionKey, string][]).map(
              ([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              )
            )}
          </select>
        </div>
      </div>
    </div>
  );
}
