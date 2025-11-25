"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCartItems, selectCartTotal } from "@/lib/store/cartSlice";
import {
  IconShoppingCart,
  IconCreditCard,
  IconTruck,
  IconShieldCheck,
  IconArrowRight,
  IconArrowLeft,
  IconMapPin,
  IconUser,
  IconMail,
  IconPhone,
  IconSparkles,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { firebaseUser } = useAuth();
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: firebaseUser?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Turkey",
  });

  // Redirect to shop if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      router.push("/shop");
    }
  }, [cartItems.length, router, orderComplete]);

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setOrderComplete(true);
    setCurrentStep(4);
  };

  const steps = [
    { id: 1, title: "Shipping", icon: IconTruck },
    { id: 2, title: "Payment", icon: IconCreditCard },
    { id: 3, title: "Review", icon: IconShieldCheck },
  ];

  if (cartItems.length === 0 && !orderComplete) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-red-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            {orderComplete ? "Order Complete!" : "Secure Checkout"}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {orderComplete
              ? "Thank you for your order. You'll receive an email confirmation shortly."
              : "Complete your purchase securely with our streamlined checkout process"}
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
                        currentStep >= step.id
                          ? "text-red-600"
                          : "text-slate-400"
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
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Order Successfully Placed!
                </h2>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  Your order has been confirmed and will be processed shortly.
                  We'll send you tracking information once your items ship.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-400 transition-colors"
                  >
                    Continue Shopping
                    <IconArrowRight size={18} />
                  </Link>
                  <Link
                    href="/profile"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-2xl font-semibold hover:bg-slate-50 transition-colors"
                  >
                    View Orders
                  </Link>
                </div>
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
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <IconTruck size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Shipping Information
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          First Name
                        </label>
                        <div className="relative">
                          <IconUser
                            size={18}
                            className="absolute left-3 top-3 text-slate-400"
                          />
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                            placeholder="Enter your first name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Last Name
                        </label>
                        <div className="relative">
                          <IconUser
                            size={18}
                            className="absolute left-3 top-3 text-slate-400"
                          />
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <IconMail
                            size={18}
                            className="absolute left-3 top-3 text-slate-400"
                          />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <IconPhone
                            size={18}
                            className="absolute left-3 top-3 text-slate-400"
                          />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Address
                        </label>
                        <div className="relative">
                          <IconMapPin
                            size={18}
                            className="absolute left-3 top-3 text-slate-400"
                          />
                          <input
                            type="text"
                            value={formData.address}
                            onChange={(e) =>
                              handleInputChange("address", e.target.value)
                            }
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                            placeholder="Enter your full address"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                          placeholder="Enter your city"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={formData.postalCode}
                          onChange={(e) =>
                            handleInputChange("postalCode", e.target.value)
                          }
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                          placeholder="Enter postal code"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-8">
                      <motion.button
                        onClick={handleNextStep}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-400 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Continue to Payment
                        <IconArrowRight size={20} />
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment Information */}
                {currentStep === 2 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <IconCreditCard size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Payment Information
                      </h2>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
                      <div className="flex items-center gap-3">
                        <IconShieldCheck size={24} className="text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-blue-900">
                            Demo Payment
                          </h3>
                          <p className="text-sm text-blue-700">
                            This is a demonstration. No real payment will be
                            processed.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                          disabled
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                            disabled
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-8">
                      <motion.button
                        onClick={handlePrevStep}
                        className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-2xl font-semibold hover:bg-slate-50 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <IconArrowLeft size={18} />
                        Back to Shipping
                      </motion.button>
                      <motion.button
                        onClick={handleNextStep}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-400 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Review Order
                        <IconArrowRight size={20} />
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Step 3: Order Review */}
                {currentStep === 3 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <IconShieldCheck size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Review Your Order
                      </h2>
                    </div>

                    <div className="space-y-6">
                      {/* Shipping Details */}
                      <div className="bg-slate-50 rounded-2xl p-6">
                        <h3 className="font-semibold text-slate-900 mb-4">
                          Shipping Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600">Name</p>
                            <p className="font-semibold">
                              {formData.firstName} {formData.lastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-600">Email</p>
                            <p className="font-semibold">{formData.email}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-slate-600">Address</p>
                            <p className="font-semibold">
                              {formData.address}, {formData.city}{" "}
                              {formData.postalCode}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="bg-slate-50 rounded-2xl p-6">
                        <h3 className="font-semibold text-slate-900 mb-4">
                          Order Items
                        </h3>
                        <div className="space-y-4">
                          {cartItems.map((item) => {
                            const prod =
                              typeof item.product === "object"
                                ? item.product
                                : null;
                            return (
                              <div
                                key={
                                  typeof item.product === "string"
                                    ? item.product
                                    : item.product._id
                                }
                                className="flex items-center gap-4 bg-white rounded-xl p-4"
                              >
                                <div className="h-16 w-16 bg-slate-100 rounded-xl flex items-center justify-center">
                                  {prod?.imageUrls?.[0] ? (
                                    <img
                                      src={prod.imageUrls[0]}
                                      alt={prod.name}
                                      className="h-full w-full object-contain rounded-lg"
                                    />
                                  ) : (
                                    <IconShoppingCart
                                      className="text-slate-400"
                                      size={24}
                                    />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-slate-900">
                                    {prod?.name || "Product"}
                                  </h4>
                                  <p className="text-sm text-slate-600">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                                <div className="text-lg font-bold text-slate-900">
                                  {(
                                    (prod?.price || 0) * item.quantity
                                  ).toLocaleString()}{" "}
                                  {prod?.currency || "TRY"}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-8">
                      <motion.button
                        onClick={handlePrevStep}
                        className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-2xl font-semibold hover:bg-slate-50 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <IconArrowLeft size={18} />
                        Back to Payment
                      </motion.button>
                      <motion.button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                        whileHover={!isProcessing ? { scale: 1.02 } : {}}
                        whileTap={!isProcessing ? { scale: 0.98 } : {}}
                      >
                        {isProcessing ? "Processing..." : "Place Order"}
                        <IconCheck size={20} />
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {!orderComplete && (
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-6 h-fit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => {
                  const prod =
                    typeof item.product === "object" ? item.product : null;
                  return (
                    <div
                      key={
                        typeof item.product === "string"
                          ? item.product
                          : item.product._id
                      }
                      className="flex items-center gap-3 py-2"
                    >
                      <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                        {prod?.imageUrls?.[0] ? (
                          <img
                            src={prod.imageUrls[0]}
                            alt={prod.name}
                            className="h-full w-full object-contain rounded"
                          />
                        ) : (
                          <IconShoppingCart
                            className="text-slate-400"
                            size={20}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-900 truncate">
                          {prod?.name || "Product"}
                        </p>
                        <p className="text-xs text-slate-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-sm text-slate-900">
                        {((prod?.price || 0) * item.quantity).toLocaleString()}{" "}
                        {prod?.currency || "TRY"}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold">
                    {cartTotal.toLocaleString()} TRY
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax</span>
                  <span className="font-semibold">
                    {(cartTotal * 0.18).toLocaleString()} TRY
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-bold text-xl text-red-600">
                      {(cartTotal * 1.18).toLocaleString()} TRY
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <IconShieldCheck size={18} className="text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    Secure Checkout
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Your payment information is protected with industry-standard
                  encryption.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
