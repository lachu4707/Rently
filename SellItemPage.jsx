import React, { useState, useRef, useMemo } from "react";
import {
  Tag,
  ImagePlus,
  X,
  MapPin,
  Store,
  IndianRupee,
  CalendarDays,
  Truck,
  Phone,
  Upload,
  Camera,
  ShieldCheck,
  ArrowLeft
} from "lucide-react";
import { createProduct } from "./src/services/api.js";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const PALETTE = {
  blush: "#ECCBC9",
  roseLight: "#E0C5C4",
  roseDeep: "#D0A0A3",
  pale: "#F5E2E3",
  offwhite: "#ECEBE8",
  ink: "#4A3B3C",
  danger: "#c0575a",
};

const CATEGORIES = [
  "Electronics",
  "Furniture",
  "Vehicles",
  "Clothing",
  "Home Appliances",
  "Sports & Fitness",
  "Books",
  "Tools & Equipment",
  "Party & Events",
  "Other",
];

const CONDITIONS = ["New", "Like new", "Good", "Fair"];
const DEPOSIT_PERCENT = 50;
const MAX_PHOTOS = 6;

export default function SellItemPage({ onNavigate, onBack }) {
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [images, setImages] = useState([]); // [{file, preview}]
  const [pickupOption, setPickupOption] = useState("other"); // "shop" | "other"
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);

  const [form, setForm] = useState({
    category: "",
    title: "",
    description: "",
    rentRate: "",
    rentUnit: "day",
    condition: "",
    sampleDays: "4", // just for the live estimate preview
    shopName: "",
    pickupAddress: "",
    contactNumber: "",
    availableFrom: "",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: "" }));
  };

  const addImages = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const next = files.slice(0, MAX_PHOTOS - images.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...next]);
    setErrors((er) => ({ ...er, images: "" }));
  };

  const handleGallerySelected = (e) => {
    addImages(e.target.files);
    e.target.value = "";
  };

  const handleCameraCaptured = (e) => {
    addImages(e.target.files);
    e.target.value = "";
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // Live estimate: rent x sample days, deposit = 50% of that rent
  const estimate = useMemo(() => {
    const rate = Number(form.rentRate) || 0;
    const days = Number(form.sampleDays) || 0;
    const totalRent = rate * days;
    const deposit = totalRent * (DEPOSIT_PERCENT / 100);
    const totalPayable = totalRent + deposit;
    return { totalRent, deposit, totalPayable, days };
  }, [form.rentRate, form.sampleDays]);

  const validate = () => {
    const er = {};
    if (!form.category) er.category = "Pick a category";
    if (!form.title.trim()) er.title = "Give your item a title";
    if (!form.description.trim()) er.description = "Add a short description";
    if (images.length === 0) er.images = "At least one photo is required";
    if (!form.condition) er.condition = "Select the item's condition";
    if (!form.rentRate || Number(form.rentRate) <= 0)
      er.rentRate = "Enter a valid rent amount";
    if (pickupOption === "shop" && !form.shopName.trim())
      er.shopName = "Enter your shop name";
    if (!form.pickupAddress.trim())
      er.pickupAddress = "Pickup address is required";
    if (!/^[0-9+\-\s]{7,15}$/.test(form.contactNumber))
      er.contactNumber = "Enter a valid contact number";

    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setSavedMsg("");

    try {
      // Process images into base64 strings
      const imagePayloads = [];
      for (const img of images) {
        if (img.file) {
          const b64 = await fileToBase64(img.file);
          imagePayloads.push(b64);
        } else if (img.preview) {
          imagePayloads.push(img.preview);
        }
      }

      await createProduct({
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.rentRate),
        priceUnit: form.rentUnit || "day",
        tag: form.category,
        location:
          pickupOption === "shop" && form.shopName.trim()
            ? `${form.shopName.trim()}, ${form.pickupAddress.trim()}`
            : form.pickupAddress.trim(),
        images:
          imagePayloads.length > 0
            ? imagePayloads
            : ["https://picsum.photos/seed/item/700/500"],
      });

      setSavedMsg("Listing posted successfully to database!");
      setTimeout(() => {
        if (onNavigate) onNavigate("dashboard");
        else if (onBack) onBack();
      }, 1200);
    } catch (err) {
      console.error("Listing creation error:", err);
      setSavedMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleGoBack = () => {
    if (onBack) onBack();
    else if (onNavigate) onNavigate("dashboard");
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        background: `linear-gradient(180deg, ${PALETTE.pale} 0%, ${PALETTE.offwhite} 100%)`,
        fontFamily: "'Work Sans', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col min-h-screen w-full"
        style={{ background: "#FFFFFF" }}
      >
        {/* Header + Banner */}
        <div className="shrink-0">
          <div className="px-6 sm:px-10 lg:px-16 pt-8 pb-4 flex items-center justify-between">
            <div>
              <p
                className="text-xs tracking-[0.2em] uppercase mb-1"
                style={{ color: PALETTE.roseDeep }}
              >
                Rent out an item
              </p>
              <h1 className="text-3xl font-bold" style={{ color: PALETTE.ink }}>
                List your item for rent
              </h1>
            </div>
            {(onBack || onNavigate) && (
              <button
                type="button"
                onClick={handleGoBack}
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors hover:bg-[#F5E2E3]"
                style={{ borderColor: PALETTE.roseLight, color: PALETTE.ink }}
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </button>
            )}
          </div>

          <div
            className="px-6 sm:px-10 lg:px-16 py-6"
            style={{
              background: `linear-gradient(120deg, ${PALETTE.blush}, ${PALETTE.roseDeep})`,
            }}
          >
            <p className="text-sm font-semibold text-white">
              Every rental includes a refundable security deposit
            </p>
            <p className="text-xs text-white/90 mt-1">
              Deposit is automatically {DEPOSIT_PERCENT}% of the total rent for
              however many days the renter books.
            </p>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 sm:px-10 lg:px-16 py-8 space-y-7 max-w-3xl mx-auto">
            {/* Category */}
            <div>
              <SectionLabel icon={<Tag size={13} />}>Category</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setForm((f) => ({ ...f, category: cat }));
                      setErrors((er) => ({ ...er, category: "" }));
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors"
                    style={{
                      background: form.category === cat ? PALETTE.roseDeep : PALETTE.offwhite,
                      color: form.category === cat ? "#fff" : PALETTE.ink,
                      borderColor: form.category === cat ? PALETTE.roseDeep : PALETTE.roseLight,
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {errors.category && <ErrorText>{errors.category}</ErrorText>}
            </div>

            {/* Photos */}
            <div>
              <SectionLabel icon={<ImagePlus size={13} />}>
                Photos ({images.length}/{MAX_PHOTOS}) · required
              </SectionLabel>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden"
                    style={{ border: `1px solid ${PALETTE.roseLight}` }}
                  >
                    <img
                      src={img.preview}
                      alt={`Upload ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(74,59,60,0.75)" }}
                    >
                      <X size={11} color="#fff" />
                    </button>
                  </div>
                ))}

                {images.length < MAX_PHOTOS && (
                  <>
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-colors"
                      style={{
                        background: PALETTE.offwhite,
                        border: `1.5px dashed ${PALETTE.roseLight}`,
                        color: PALETTE.roseDeep,
                      }}
                    >
                      <Upload size={16} />
                      <span className="text-[10px] font-medium text-center px-1">
                        Upload
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-colors"
                      style={{
                        background: PALETTE.offwhite,
                        border: `1.5px dashed ${PALETTE.roseLight}`,
                        color: PALETTE.roseDeep,
                      }}
                    >
                      <Camera size={16} />
                      <span className="text-[10px] font-medium text-center px-1">
                        Take photo
                      </span>
                    </button>
                  </>
                )}
              </div>

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleGallerySelected}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleCameraCaptured}
              />

              {errors.images && <ErrorText>{errors.images}</ErrorText>}
            </div>

            {/* Title & description */}
            <Field
              label="Title"
              value={form.title}
              onChange={handleChange("title")}
              error={errors.title}
              placeholder="e.g. Canon EOS 200D DSLR Camera"
            />

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: PALETTE.ink }}>
                Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={handleChange("description")}
                placeholder="Describe the item's condition, what's included, why it's great..."
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                style={{
                  background: PALETTE.offwhite,
                  border: `1px solid ${errors.description ? PALETTE.danger : PALETTE.roseLight}`,
                  color: PALETTE.ink,
                }}
              />
              {errors.description && <ErrorText>{errors.description}</ErrorText>}
            </div>

            {/* Condition */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: PALETTE.ink }}>
                Condition
              </label>
              <select
                value={form.condition}
                onChange={handleChange("condition")}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{
                  background: PALETTE.offwhite,
                  border: `1px solid ${errors.condition ? PALETTE.danger : PALETTE.roseLight}`,
                  color: PALETTE.ink,
                }}
              >
                <option value="">Select condition</option>
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.condition && <ErrorText>{errors.condition}</ErrorText>}
            </div>

            {/* Rent rate */}
            <div>
              <SectionLabel icon={<IndianRupee size={13} />}>Rent</SectionLabel>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Field
                    value={form.rentRate}
                    onChange={handleChange("rentRate")}
                    error={errors.rentRate}
                    placeholder="Rent amount"
                    icon={<IndianRupee size={15} />}
                    type="number"
                  />
                </div>
                <select
                  value={form.rentUnit}
                  onChange={handleChange("rentUnit")}
                  className="px-3 rounded-xl text-sm outline-none"
                  style={{
                    background: PALETTE.offwhite,
                    border: `1px solid ${PALETTE.roseLight}`,
                    color: PALETTE.ink,
                  }}
                >
                  <option value="day">/ day</option>
                  <option value="week">/ week</option>
                  <option value="month">/ month</option>
                </select>
              </div>
            </div>

            {/* Auto-calculated deposit estimate */}
            <div
              className="rounded-2xl p-4 sm:p-5"
              style={{ background: PALETTE.pale, border: `1px solid ${PALETTE.roseLight}` }}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <ShieldCheck size={14} style={{ color: PALETTE.roseDeep }} />
                <p className="text-xs font-semibold" style={{ color: PALETTE.roseDeep }}>
                  Security deposit — calculated automatically ({DEPOSIT_PERCENT}% of rent)
                </p>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs" style={{ color: PALETTE.ink }}>
                  Preview for
                </span>
                <input
                  type="number"
                  min="1"
                  value={form.sampleDays}
                  onChange={handleChange("sampleDays")}
                  className="w-16 px-2 py-1 rounded-lg text-xs text-center outline-none"
                  style={{
                    background: "#FFFFFF",
                    border: `1px solid ${PALETTE.roseLight}`,
                    color: PALETTE.ink,
                  }}
                />
                <span className="text-xs" style={{ color: PALETTE.ink }}>
                  days rented
                </span>
              </div>

              <div className="space-y-1.5 text-sm">
                <Row label={`Rent (${estimate.days || 0} days × ₹${form.rentRate || 0})`} value={estimate.totalRent} />
                <Row label={`Security deposit (${DEPOSIT_PERCENT}%)`} value={estimate.deposit} />
                <div className="pt-2 mt-1" style={{ borderTop: `1px solid ${PALETTE.roseLight}` }}>
                  <Row label="Total payable by renter" value={estimate.totalPayable} bold />
                </div>
              </div>
              <p className="text-[11px] mt-3" style={{ color: PALETTE.ink, opacity: 0.75 }}>
                This is just a preview — the deposit is recalculated for the
                actual number of days each time someone books your item.
              </p>
            </div>

            {/* Pickup location */}
            <div>
              <SectionLabel icon={<MapPin size={13} />}>Pickup location</SectionLabel>

              <div className="inline-flex rounded-full p-1 mb-4" style={{ background: PALETTE.offwhite }}>
                {[
                  { key: "shop", label: "From my shop" },
                  { key: "other", label: "Other location" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setPickupOption(opt.key)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold transition-colors"
                    style={{
                      background: pickupOption === opt.key ? PALETTE.roseDeep : "transparent",
                      color: pickupOption === opt.key ? "#fff" : PALETTE.ink,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {pickupOption === "shop" && (
                <div className="mb-3">
                  <Field
                    label="Shop name"
                    value={form.shopName}
                    onChange={handleChange("shopName")}
                    error={errors.shopName}
                    placeholder="e.g. Raman Electronics"
                    icon={<Store size={15} />}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: PALETTE.ink }}>
                  {pickupOption === "shop" ? "Shop address" : "Pickup address"}
                </label>
                <textarea
                  rows={2}
                  value={form.pickupAddress}
                  onChange={handleChange("pickupAddress")}
                  placeholder="House/shop no, street, area, city, PIN"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{
                    background: PALETTE.offwhite,
                    border: `1px solid ${errors.pickupAddress ? PALETTE.danger : PALETTE.roseLight}`,
                    color: PALETTE.ink,
                  }}
                />
                {errors.pickupAddress && <ErrorText>{errors.pickupAddress}</ErrorText>}
              </div>

              <label className="flex items-center gap-2 mt-3 text-sm" style={{ color: PALETTE.ink }}>
                <input
                  type="checkbox"
                  checked={deliveryAvailable}
                  onChange={(e) => setDeliveryAvailable(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: PALETTE.roseDeep }}
                />
                <Truck size={15} style={{ color: PALETTE.roseDeep }} />
                Delivery available
              </label>
            </div>

            {/* Contact + availability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Contact number"
                value={form.contactNumber}
                onChange={handleChange("contactNumber")}
                error={errors.contactNumber}
                placeholder="+91 98765 43210"
                icon={<Phone size={15} />}
              />
              <Field
                label="Available from"
                type="date"
                value={form.availableFrom}
                onChange={handleChange("availableFrom")}
                icon={<CalendarDays size={15} />}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          className="shrink-0 px-6 sm:px-10 lg:px-16 py-4 flex items-center justify-between max-w-3xl mx-auto w-full"
          style={{ borderTop: `1px solid ${PALETTE.roseLight}` }}
        >
          <span
            className="text-xs min-h-[1rem]"
            style={{ color: savedMsg.startsWith("Something") ? PALETTE.danger : PALETTE.roseDeep }}
          >
            {savedMsg}
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleGoBack}
              className="px-5 py-2.5 rounded-full text-sm font-medium"
              style={{ color: PALETTE.ink, background: PALETTE.offwhite }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-full text-sm font-medium text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
              style={{ background: PALETTE.roseDeep }}
            >
              {saving ? "Posting..." : "Post listing"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function SectionLabel({ icon, children }) {
  return (
    <p
      className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5"
      style={{ color: PALETTE.roseDeep }}
    >
      {icon}
      {children}
    </p>
  );
}

function ErrorText({ children }) {
  return (
    <p className="text-xs mt-1" style={{ color: PALETTE.danger }}>
      {children}
    </p>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={bold ? "font-semibold" : ""}
        style={{ color: PALETTE.ink }}
      >
        {label}
      </span>
      <span
        className={bold ? "font-semibold" : ""}
        style={{ color: PALETTE.ink }}
      >
        ₹{value.toLocaleString("en-IN")}
      </span>
    </div>
  );
}

function Field({ label, icon, value, onChange, error, placeholder, type = "text" }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium mb-1.5" style={{ color: PALETTE.ink }}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: PALETTE.roseDeep }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${icon ? "pl-9" : "pl-3"} pr-3 py-2.5 rounded-xl text-sm outline-none transition-colors`}
          style={{
            background: PALETTE.offwhite,
            border: `1px solid ${error ? PALETTE.danger : PALETTE.roseLight}`,
            color: PALETTE.ink,
          }}
        />
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}
