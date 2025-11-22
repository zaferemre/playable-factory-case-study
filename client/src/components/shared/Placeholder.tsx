"use client";

export default function Placeholder({ label }: { label: string }) {
  return (
    <div className="mb-2 rounded border border-slate-200 bg-white p-3 text-xs text-slate-700">
      {label} placeholder
    </div>
  );
}
