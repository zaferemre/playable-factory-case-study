"use client";

import { IconSparkles, IconCreditCard } from "@tabler/icons-react";

interface PaymentFormProps {
  error?: string | null;
}

export default function PaymentForm({ error }: PaymentFormProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
          <IconCreditCard size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Payment Information
          </h2>
          <p className="text-sm text-slate-600">
            Secure demo payment processing
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3">
          <IconSparkles size={24} className="text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-900">Demo Payment</h3>
            <p className="text-sm text-blue-700">
              This is a demonstration. No real payment will be processed.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
