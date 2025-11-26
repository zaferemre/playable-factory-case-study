"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { IconCheck, IconShoppingCart } from "@tabler/icons-react";
import type { User } from "@/lib/types/types";
import { useCheckout } from "@/components/order/useCheckout";
import CheckoutOrderSummary from "@/components/order/CheckoutOrderSummary";
import CheckoutSteps from "@/components/order/CheckoutSteps";
import AddressForm from "@/components/order/AddressForm";
import OrderReview from "@/components/order/OrderReview";
import PaymentForm from "@/components/order/PaymentForm";
import NavigationButtons from "@/components/order/NavigationButtons";

interface FirebaseUserLike {
  email?: string | null;
}

interface ModernCheckoutLayoutProps {
  clientOrderId: string;
  backendUserId?: string | null;
  backendUser?: User | null;
  firebaseUser?: FirebaseUserLike | null;
  authLoading: boolean;
}

export default function ModernCheckoutLayout({
  clientOrderId,
  backendUserId,
  backendUser,
  firebaseUser,
  authLoading,
}: ModernCheckoutLayoutProps) {
  const {
    loading,
    placing,
    draft,
    error,
    address,
    savedAddresses,
    handleAddressChange,
    handleUseSavedAddress,
    handlePlaceOrder,
  } = useCheckout({
    clientOrderId,
    backendUserId,
    backendUser,
    firebaseUser,
    authLoading,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleNext = () =>
    setCurrentStep((prev: number) => Math.min(prev + 1, 3));
  const handlePrev = () =>
    setCurrentStep((prev: number) => Math.max(prev - 1, 1));

  const handleSubmitOrder = async () => {
    try {
      await handlePlaceOrder();
      setOrderComplete(true);
    } catch (err) {}
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-red-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-red-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CheckoutSteps
          currentStep={currentStep}
          orderComplete={orderComplete}
          backendUserId={backendUserId}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {orderComplete ? (
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-8 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto mb-6">
                  <IconCheck size={32} stroke={2} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Order Placed Successfully!
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Your order has been received and is being processed. You will
                  receive a confirmation email shortly.
                </p>
                <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                  <p className="text-sm text-slate-600 mb-1">Order ID</p>
                  <p className="text-lg font-mono font-semibold text-slate-900">
                    {clientOrderId}
                  </p>
                </div>
                <motion.button
                  onClick={() => (window.location.href = "/shop")}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-400 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconShoppingCart size={20} />
                  Continue Shopping
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <IconShoppingCart size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          Shipping Information
                        </h2>
                        <p className="text-sm text-slate-600">
                          Enter your delivery address with Turkish address
                          standards in mind
                        </p>
                      </div>
                    </div>

                    {address && (
                      <AddressForm
                        addressData={address}
                        savedAddresses={savedAddresses}
                        onAddressChange={handleAddressChange}
                        onSelectSavedAddress={handleUseSavedAddress}
                      />
                    )}

                    <NavigationButtons
                      currentStep={currentStep}
                      onNext={handleNext}
                      showPrev={false}
                    />
                  </div>
                )}

                {/* Step 2: Order Review */}
                {currentStep === 2 && (
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <IconCheck size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          Review Your Order
                        </h2>
                        <p className="text-sm text-slate-600">
                          Confirm your details and items before payment
                        </p>
                      </div>
                    </div>

                    {draft && address && (
                      <OrderReview addressData={address} draft={draft} />
                    )}

                    <NavigationButtons
                      currentStep={currentStep}
                      onPrev={handlePrev}
                      onNext={handleNext}
                    />
                  </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <div>
                    <PaymentForm error={error} />

                    <NavigationButtons
                      currentStep={currentStep}
                      isProcessing={placing}
                      placing={placing}
                      onPrev={handlePrev}
                      onSubmit={handleSubmitOrder}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {!orderComplete && draft && <CheckoutOrderSummary draft={draft} />}
        </div>
      </div>
    </div>
  );
}
