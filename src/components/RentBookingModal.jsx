import React, { useState } from "react";
import { X, Calendar, MapPin, CheckCircle, Clock, ShieldCheck, DollarSign, ArrowRight } from "lucide-react";
import { getAuthUser } from "../services/api.js";

const PALETTE = {
  cream: "#ECEBE8",
  blush: "#F5E2E3",
  petal: "#ECCBC9",
  mauve: "#E0C5C4",
  rose: "#D0A0A3",
  ink: "#4A3335",
  inkSoft: "#8A6668",
};

export default function RentBookingModal({ product, isOpen, onClose, onBookingSuccess }) {
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [days, setDays] = useState(3);
  const [deliveryType, setDeliveryType] = useState("pickup");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !product) return null;

  const currentUser = getAuthUser();
  const unitPrice = Number(product.price) || 0;
  const unit = product.priceUnit || "day";
  const totalPrice = unitPrice * (Number(days) || 1);
  const deposit = Math.round(totalPrice * 0.2);

  const handleConfirm = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      if (onBookingSuccess) {
        onBookingSuccess({
          productId: product.id || product._id,
          productTitle: product.title,
          totalPrice,
          days,
          startDate,
        });
      }
    }, 600);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl"
        style={{
          background: PALETTE.cream,
          border: `1.5px solid ${PALETTE.mauve}`,
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#ECCBC9] transition-colors"
          style={{ color: PALETTE.ink }}
        >
          <X size={20} />
        </button>

        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="mb-6">
              <span
                className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2"
                style={{ background: PALETTE.petal, color: PALETTE.ink }}
              >
                Instant Rental Request
              </span>
              <h2
                className="text-2xl sm:text-3xl font-bold"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: PALETTE.ink }}
              >
                Rent “{product.title}”
              </h2>
              <p className="text-xs sm:text-sm mt-1" style={{ color: PALETTE.inkSoft }}>
                Confirm your rental duration and request pickup from the owner.
              </p>
            </div>

            {/* Product Snapshot */}
            <div
              className="flex gap-4 items-center p-3 rounded-2xl mb-5"
              style={{ background: PALETTE.blush, border: `1px solid ${PALETTE.mauve}` }}
            >
              {product.images && product.images[0] && (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-sm truncate" style={{ color: PALETTE.ink }}>
                  {product.title}
                </h4>
                <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: PALETTE.inkSoft }}>
                  <MapPin size={12} /> {product.location || "Local pickup"}
                </p>
                <p className="text-sm font-bold mt-1" style={{ color: PALETTE.rose }}>
                  ₹{unitPrice} / {unit}
                </p>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleConfirm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: PALETTE.ink }}>
                    Start Date
                  </label>
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                    style={{ background: PALETTE.blush, border: `1px solid ${PALETTE.mauve}` }}
                  >
                    <Calendar size={16} color={PALETTE.rose} />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="bg-transparent text-xs sm:text-sm w-full outline-none font-medium"
                      style={{ color: PALETTE.ink }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: PALETTE.ink }}>
                    Duration ({unit}s)
                  </label>
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                    style={{ background: PALETTE.blush, border: `1px solid ${PALETTE.mauve}` }}
                  >
                    <Clock size={16} color={PALETTE.rose} />
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={days}
                      onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                      required
                      className="bg-transparent text-xs sm:text-sm w-full outline-none font-medium"
                      style={{ color: PALETTE.ink }}
                    />
                  </div>
                </div>
              </div>

              {/* Delivery / Pickup method */}
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: PALETTE.ink }}>
                  Handover Option
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("pickup")}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      deliveryType === "pickup"
                        ? "bg-[#D0A0A3] text-white shadow-sm"
                        : "bg-[#F5E2E3] text-[#4A3335] hover:opacity-80"
                    }`}
                  >
                    Self Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("delivery")}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      deliveryType === "delivery"
                        ? "bg-[#D0A0A3] text-white shadow-sm"
                        : "bg-[#F5E2E3] text-[#4A3335] hover:opacity-80"
                    }`}
                  >
                    Doorstep Delivery
                  </button>
                </div>
              </div>

              {/* Message to Owner */}
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: PALETTE.ink }}>
                  Note to Owner (optional)
                </label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Can pick up Saturday morning around 10 AM"
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm outline-none resize-none"
                  style={{
                    background: PALETTE.blush,
                    border: `1px solid ${PALETTE.mauve}`,
                    color: PALETTE.ink,
                  }}
                />
              </div>

              {/* Price Breakdown */}
              <div
                className="p-4 rounded-2xl space-y-1.5 text-xs"
                style={{ background: PALETTE.petal, color: PALETTE.ink }}
              >
                <div className="flex justify-between">
                  <span>
                    Rental Fee ({days} {unit}{days > 1 ? "s" : ""} × ₹{unitPrice}):
                  </span>
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between opacity-80">
                  <span>Refundable Security Deposit (20%):</span>
                  <span>₹{deposit}</span>
                </div>
                <div className="pt-2 border-t border-[#D0A0A3]/50 flex justify-between text-sm font-bold">
                  <span>Total Payable:</span>
                  <span style={{ color: PALETTE.ink }}>₹{totalPrice + deposit}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-semibold text-white transition-transform active:scale-[0.98] cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${PALETTE.rose}, #C08386)`,
                  boxShadow: `0 6px 16px ${PALETTE.rose}66`,
                }}
              >
                {loading ? (
                  <span>Reserving...</span>
                ) : (
                  <>
                    <span>Confirm Rental Request</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Confirmation State */
          <div className="text-center py-6">
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
              style={{ background: "#D1FAE5", color: "#059669" }}
            >
              <CheckCircle size={36} />
            </div>
            <h3
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: PALETTE.ink }}
            >
              Rental Request Confirmed!
            </h3>
            <p className="text-xs sm:text-sm mb-6 max-w-sm mx-auto" style={{ color: PALETTE.inkSoft }}>
              Your reservation for <strong>{product.title}</strong> has been sent to the owner.
              You will receive a notification once accepted.
            </p>

            <div
              className="p-4 rounded-2xl text-left text-xs mb-6 space-y-2"
              style={{ background: PALETTE.blush, border: `1px solid ${PALETTE.mauve}` }}
            >
              <div className="flex justify-between">
                <span className="opacity-70">Booking Reference:</span>
                <span className="font-mono font-bold">RH-{(Math.random() * 90000 + 10000).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Start Date:</span>
                <span className="font-semibold">{startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Duration:</span>
                <span className="font-semibold">{days} {unit}(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Estimated Total:</span>
                <span className="font-bold text-[#4A3335]">₹{totalPrice}</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 px-4 rounded-2xl text-sm font-semibold text-white"
              style={{ background: PALETTE.rose }}
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
