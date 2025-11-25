"use client";

import { motion } from "motion/react";
import {
  IconTruck,
  IconCheck,
  IconCreditCard,
  IconSparkles,
  IconShoppingCart,
} from "@tabler/icons-react";

interface Step {
  id: number;
  title: string;
  icon: React.ComponentType<{ size?: number; stroke?: number }>;
}

interface CheckoutStepsProps {
  currentStep: number;
  orderComplete: boolean;
  backendUserId?: string | null;
}

const steps: Step[] = [
  { id: 1, title: "Shipping", icon: IconTruck },
  { id: 2, title: "Review", icon: IconCheck },
  { id: 3, title: "Payment", icon: IconCreditCard },
];

export default function CheckoutSteps({
  currentStep,
  orderComplete,
  backendUserId,
}: CheckoutStepsProps) {
  return (
    <>
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <IconShoppingCart size={24} stroke={2} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
            <IconSparkles size={14} />
            <span>Playable Factory</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          {orderComplete ? "Order Confirmed!" : "Complete Your Order"}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          {orderComplete
            ? "Thank you for your order. We'll start preparing your package right away!"
            : backendUserId
            ? `Welcome back! Complete your order with saved details.`
            : "Just a few quick steps to get your products delivered to you."}
        </p>
      </motion.div>

      {!orderComplete && (
        // Progress Steps
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      currentStep >= step.id
                        ? "bg-red-500 border-red-500 text-white"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    <step.icon size={20} stroke={2} />
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      currentStep >= step.id ? "text-red-600" : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-4 transition-colors duration-300 ${
                      currentStep > step.id ? "bg-red-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
