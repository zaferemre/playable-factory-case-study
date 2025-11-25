"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  IconCreditCard,
  IconShieldCheck,
  IconInfoCircle,
  IconPlus,
} from "@tabler/icons-react";

export default function ProfilePaymentMethodsCard() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <motion.div
      className="rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 p-6 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-900">
              <IconCreditCard size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Payment Methods
              </h2>
              <p className="text-sm text-slate-600">Secure payment options</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-xl">
            <IconInfoCircle size={16} />
            <span className="text-sm font-medium">Demo Mode</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <IconCreditCard size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No Payment Methods
          </h3>
          <p className="text-slate-600 mb-6">
            This is a demo environment. In production, you would manage your
            payment methods here.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <IconShieldCheck size={20} className="text-blue-600 mt-0.5" />
              <div className="text-left">
                <h4 className="font-semibold text-blue-900 mb-1">
                  Secure Payment Processing
                </h4>
                <p className="text-sm text-blue-700">
                  In the live version, all payment data would be encrypted and
                  processed securely through trusted payment providers.
                </p>
              </div>
            </div>
          </div>

          <motion.button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled
          >
            <IconPlus size={20} />
            Add Payment Method (Demo)
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
