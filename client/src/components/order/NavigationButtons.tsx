"use client";

import { motion } from "motion/react";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";

interface NavigationButtonsProps {
  currentStep: number;
  isProcessing?: boolean;
  placing?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  showPrev?: boolean;
  nextLabel?: string;
  submitLabel?: string;
}

export default function NavigationButtons({
  currentStep,
  isProcessing = false,
  placing = false,
  onPrev,
  onNext,
  onSubmit,
  showPrev = true,
  nextLabel,
  submitLabel = "Complete Order",
}: NavigationButtonsProps) {
  const getNextLabel = () => {
    if (nextLabel) return nextLabel;
    switch (currentStep) {
      case 1:
        return "Continue to Review";
      case 2:
        return "Continue to Payment";
      default:
        return "Continue";
    }
  };

  const getPrevLabel = () => {
    switch (currentStep) {
      case 2:
        return "Back to Shipping";
      case 3:
        return "Back to Review";
      default:
        return "Back";
    }
  };

  const isSubmitStep = currentStep === 3;
  const isDisabled = isProcessing || placing;

  return (
    <div className="flex justify-between mt-8">
      {showPrev && onPrev && (
        <motion.button
          onClick={onPrev}
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-2xl font-semibold hover:bg-slate-50 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <IconArrowRight size={18} className="rotate-180" />
          {getPrevLabel()}
        </motion.button>
      )}

      {/* Spacer when no prev button */}
      {(!showPrev || !onPrev) && <div></div>}

      {isSubmitStep ? (
        <motion.button
          onClick={onSubmit}
          disabled={isDisabled}
          className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-400 disabled:opacity-50 transition-colors"
          whileHover={!isDisabled ? { scale: 1.02 } : {}}
          whileTap={!isDisabled ? { scale: 0.98 } : {}}
        >
          {isDisabled ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              {submitLabel}
              <IconCheck size={20} />
            </>
          )}
        </motion.button>
      ) : (
        <motion.button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-8 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-400 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {getNextLabel()}
          <IconArrowRight size={20} />
        </motion.button>
      )}
    </div>
  );
}
