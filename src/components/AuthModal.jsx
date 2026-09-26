import React, { useState } from "react";
import { X, Mail, Lock, User, Phone, MapPin, Loader2, ArrowRight } from "lucide-react";
import { loginUser, registerUser } from "../services/api.js";

const PALETTE = {
  cream: "#ECEBE8",
  blush: "#F5E2E3",
  petal: "#ECCBC9",
  mauve: "#E0C5C4",
  rose: "#D0A0A3",
  ink: "#4A3335",
  inkSoft: "#8A6668",
};

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        if (!formData.email || !formData.password) {
          throw new Error("Please enter both email and password.");
        }
        const user = await loginUser(formData.email, formData.password);
        if (onAuthSuccess) onAuthSuccess(user);
        onClose();
      } else {
        if (!formData.name || !formData.email || !formData.password) {
          throw new Error("Name, email, and password are required.");
        }
        const user = await registerUser(formData);
        if (onAuthSuccess) onAuthSuccess(user);
        onClose();
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl transition-all"
        style={{
          background: PALETTE.cream,
          border: `1.5px solid ${PALETTE.mauve}`,
          boxShadow: "0 25px 50px -12px rgba(74, 51, 53, 0.25)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#ECCBC9] transition-colors"
          style={{ color: PALETTE.ink }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.2rem",
              color: PALETTE.ink,
            }}
          >
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-xs sm:text-sm mt-1" style={{ color: PALETTE.inkSoft }}>
            {mode === "login"
              ? "Sign in to manage your rentals and listings"
              : "Join RentalHub to start renting and listing items"}
          </p>

          {/* Mode Switcher Tabs */}
          <div
            className="flex p-1 rounded-2xl mt-5"
            style={{ background: PALETTE.blush, border: `1px solid ${PALETTE.mauve}` }}
          >
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                mode === "login"
                  ? "bg-[#D0A0A3] text-white shadow-sm"
                  : "text-[#4A3335] hover:opacity-80"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                mode === "register"
                  ? "bg-[#D0A0A3] text-white shadow-sm"
                  : "text-[#4A3335] hover:opacity-80"
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl text-xs font-medium text-red-700 bg-red-100 border border-red-300">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: PALETTE.ink }}>
                Full Name *
              </label>
              <div
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all"
                style={{
                  background: PALETTE.blush,
                  border: `1px solid ${PALETTE.mauve}`,
                }}
              >
                <User size={16} color={PALETTE.rose} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  required
                  className="bg-transparent text-sm w-full outline-none"
                  style={{ color: PALETTE.ink }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: PALETTE.ink }}>
              Email Address *
            </label>
            <div
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all"
              style={{
                background: PALETTE.blush,
                border: `1px solid ${PALETTE.mauve}`,
              }}
            >
              <Mail size={16} color={PALETTE.rose} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="bg-transparent text-sm w-full outline-none"
                style={{ color: PALETTE.ink }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: PALETTE.ink }}>
              Password *
            </label>
            <div
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all"
              style={{
                background: PALETTE.blush,
                border: `1px solid ${PALETTE.mauve}`,
              }}
            >
              <Lock size={16} color={PALETTE.rose} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="bg-transparent text-sm w-full outline-none"
                style={{ color: PALETTE.ink }}
              />
            </div>
          </div>

          {mode === "register" && (
            <>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: PALETTE.ink }}>
                  Phone Number (optional)
                </label>
                <div
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all"
                  style={{
                    background: PALETTE.blush,
                    border: `1px solid ${PALETTE.mauve}`,
                  }}
                >
                  <Phone size={16} color={PALETTE.rose} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 890"
                    className="bg-transparent text-sm w-full outline-none"
                    style={{ color: PALETTE.ink }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: PALETTE.ink }}>
                  City / Location (optional)
                </label>
                <div
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all"
                  style={{
                    background: PALETTE.blush,
                    border: `1px solid ${PALETTE.mauve}`,
                  }}
                >
                  <MapPin size={16} color={PALETTE.rose} />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. San Francisco, CA"
                    className="bg-transparent text-sm w-full outline-none"
                    style={{ color: PALETTE.ink }}
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-70 cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${PALETTE.rose}, #C08386)`,
              boxShadow: `0 6px 16px ${PALETTE.rose}66`,
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Demo login quick helper */}
        {mode === "login" && (
          <div className="mt-5 text-center pt-4 border-t border-[#E0C5C4]/60">
            <p className="text-xs" style={{ color: PALETTE.inkSoft }}>
              Demo account available:
            </p>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  email: "test_lachu@example.com",
                  password: "Password123",
                });
              }}
              className="text-xs font-semibold underline mt-1"
              style={{ color: PALETTE.rose }}
            >
              Fill Demo Credentials (Lachu User)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
