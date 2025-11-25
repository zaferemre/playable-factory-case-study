"use client";

import type { Category } from "@/lib/types/types";
import { IconStarFilled } from "@tabler/icons-react";
import { Range } from "react-range";

type PriceRange = {
  min: string;
  max: string;
};

interface ShopSidebarFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categories: Category[];
  selectedCategoryId: string;
  onCategoryChange: (id: string) => void;
  priceRange: PriceRange;
  onPriceRangeChange: (range: PriceRange) => void;
  ratingMin: number | null;
  onRatingMinChange: (value: number | null) => void;
  onClearAllFilters: () => void;
  maxPrice: number; // new: maximum product price in cents or your unit
  currency?: string; // optional, default TRY
}

const ratingOptions = [
  { value: 4, label: "4 stars and up" },
  { value: 3, label: "3 stars and up" },
  { value: 2, label: "2 stars and up" },
  { value: 1, label: "1 star and up" },
];

export default function ShopSidebarFilters({
  search,
  onSearchChange,
  categories,
  selectedCategoryId,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  ratingMin,
  onRatingMinChange,
  onClearAllFilters,
  maxPrice,
  currency = "TRY",
}: ShopSidebarFiltersProps) {
  const handlePriceInputChange = (field: keyof PriceRange, value: string) => {
    if (value === "") {
      onPriceRangeChange({ ...priceRange, [field]: "" });
    } else if (/^\d*$/.test(value)) {
      onPriceRangeChange({ ...priceRange, [field]: value });
    }
  };

  const sliderMax = Math.max(0, Math.ceil(maxPrice || 0));

  const rawMin = priceRange.min === "" ? 0 : Number(priceRange.min);
  const rawMax = priceRange.max === "" ? sliderMax : Number(priceRange.max);

  const numericMin = Number.isFinite(rawMin)
    ? Math.min(Math.max(0, rawMin), sliderMax)
    : 0;

  const numericMax = Number.isFinite(rawMax)
    ? Math.min(Math.max(numericMin, rawMax), sliderMax)
    : sliderMax;

  const handleMinSliderChange = (value: string) => {
    const next = Number(value);
    const clamped = Math.min(next, numericMax);
    onPriceRangeChange({
      min: String(clamped),
      max: String(numericMax),
    });
  };

  const handleMaxSliderChange = (value: string) => {
    const next = Number(value);
    const clamped = Math.max(next, numericMin);
    onPriceRangeChange({
      min: String(numericMin),
      max: String(clamped),
    });
  };

  const formatAmount = (value: number) =>
    new Intl.NumberFormat("tr-TR").format(value);

  return (
    <div className="flex h-full flex-col gap-4 text-sm text-slate-800">
      {/* search */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Search
        </h3>
        <div className="mt-1 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-[4px]">
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search cereals"
            className="h-7 w-full bg-transparent text-xs text-slate-800 outline-none"
          />
        </div>
      </div>

      {/* categories */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Category
        </h3>
        <ul className="mt-1 space-y-1 text-xs">
          <li>
            <button
              type="button"
              onClick={() => onCategoryChange("")}
              className={`rounded-full px-2 py-[3px] ${
                selectedCategoryId === ""
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              All categories
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat._id}>
              <button
                type="button"
                onClick={() => onCategoryChange(cat._id)}
                className={`rounded-full px-2 py-[3px] text-left ${
                  selectedCategoryId === cat._id
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* price range with dual slider */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Price
        </h3>

        {sliderMax > 0 ? (
          <>
            <p className="mt-1 text-xs text-slate-600">
              {formatAmount(numericMin)} {currency} to{" "}
              {formatAmount(numericMax)} {currency}
            </p>

            <div className="mt-4 px-1">
              <Range
                step={10}
                min={0}
                max={sliderMax}
                values={[numericMin, numericMax]}
                onChange={(values) => {
                  onPriceRangeChange({
                    min: String(values[0]),
                    max: String(values[1]),
                  });
                }}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="relative h-[4px] w-full rounded bg-slate-200"
                  >
                    <div
                      className="absolute h-full bg-slate-900 rounded"
                      style={{
                        left: `${(numericMin / sliderMax) * 100}%`,
                        width: `${
                          ((numericMax - numericMin) / sliderMax) * 100
                        }%`,
                      }}
                    />
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="h-4 w-4 rounded-full bg-white border border-slate-400 shadow"
                  />
                )}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
              <span>
                Min {formatAmount(numericMin)} {currency}
              </span>
              <span>
                Max {formatAmount(numericMax)} {currency}
              </span>
            </div>
          </>
        ) : (
          <p className="mt-1 text-xs text-slate-500">
            Price filter will appear when products are loaded.
          </p>
        )}
      </div>

      {/* rating */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Customer reviews
        </h3>
        <ul className="mt-1 space-y-1 text-xs">
          {ratingOptions.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() =>
                  onRatingMinChange(ratingMin === opt.value ? null : opt.value)
                }
                className={`flex items-center gap-1 rounded-full px-2 py-[3px] ${
                  ratingMin === opt.value
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="flex">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <IconStarFilled
                      key={idx}
                      size={10}
                      stroke={1.7}
                      className={
                        idx < opt.value
                          ? ratingMin === opt.value
                            ? "text-yellow-300"
                            : "text-yellow-400"
                          : "text-slate-300"
                      }
                    />
                  ))}
                </span>
                <span>{opt.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* clear all */}
      <button
        type="button"
        onClick={onClearAllFilters}
        className="mt-2 self-start rounded-full border border-slate-200 px-3 py-[5px] text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        Clear all filters
      </button>
    </div>
  );
}
