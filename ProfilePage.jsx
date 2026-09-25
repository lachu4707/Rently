import React, { useState, useRef } from "react";
import { Camera, Phone, Mail, MapPin, User, Save, X, Plus, Trash2 } from "lucide-react";

/**
 * ProfilePage
 * -----------
 * A standalone MERN-stack profile page.
 *
 * This is the FRONTEND piece only (React). It's built so it drops straight
 * into a Create React App / Vite React project. Wire it up to your Express
 * + MongoDB backend later by filling in the two spots marked TODO below:
 *
 *   1. On mount -> GET  /api/profile        (load the logged-in user's data)
 *   2. On save  -> PUT  /api/profile        (persist edits, multipart/form-data
 *                                             if a new picture was chosen)
 *
 * Suggested Mongoose schema for reference:
 *
 *   const profileSchema = new mongoose.Schema({
 *     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
 *     profilePic: String,          // stored URL / path
 *     fullName: String,
 *     lastName: String,
 *     mainMobile: { type: String, required: true },
 *     backupMobile1: { type: String, required: true },
 *     backupMobile2: { type: String, required: true },
 *     email: String,
 *     address: String,
 *     dob: Date,
 *     gender: String,
 *     bio: String,
 *   }, { timestamps: true });
 */

const PALETTE = {
  blush: "#ECCBC9",
  roseLight: "#E0C5C4",
  roseDeep: "#D0A0A3",
  pale: "#F5E2E3",
  offwhite: "#ECEBE8",
  ink: "#4A3B3C",
};

// Glassmorphism tokens - translucent surfaces layered over the blurred
// background blobs, with brand-tinted borders so the glass still reads
// as "this app" rather than generic frosted UI.
const GLASS = {
  panel: "rgba(255,255,255,0.20)",
  panelBorder: "rgba(255,255,255,0.45)",
  field: "rgba(255,255,255,0.28)",
  fieldBorder: "rgba(255,255,255,0.4)",
};

// Custom cursors: a soft outlined ring for default, a filled glass dot for
// anything interactive. Encoded as base64 SVG data URIs.
const CURSOR_DEFAULT =
  "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNiIgaGVpZ2h0PSIyNiIgdmlld0JveD0iMCAwIDI2IDI2Ij4KPGNpcmNsZSBjeD0iMTMiIGN5PSIxMyIgcj0iOCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjI1KSIgc3Ryb2tlPSIjRDBBMEEzIiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iMTMiIGN5PSIxMyIgcj0iMiIgZmlsbD0iI0QwQTBBMyIvPgo8L3N2Zz4=') 13 13, auto";
const CURSOR_POINTER =
  "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNCIgaGVpZ2h0PSIzNCIgdmlld0JveD0iMCAwIDM0IDM0Ij4KPGNpcmNsZSBjeD0iMTciIGN5PSIxNyIgcj0iMTMiIGZpbGw9InJnYmEoMjA4LDE2MCwxNjMsMC4zMCkiIHN0cm9rZT0iI0QwQTBBMyIgc3Ryb2tlLXdpZHRoPSIyLjIiLz4KPGNpcmNsZSBjeD0iMTciIGN5PSIxNyIgcj0iMy4yIiBmaWxsPSIjRDBBMEEzIi8+Cjwvc3ZnPg==') 17 17, pointer";

export default function ProfilePage() {
  const fileInputRef = useRef(null);

  const [profilePic, setProfilePic] = useState(null); // preview URL
  const [form, setForm] = useState({
    fullName: "",
    lastName: "",
    mainMobile: "",
    backupMobile1: "",
    backupMobile2: "",
    email: "",
    address: "",
    dob: "",
    gender: "",
    bio: "",
  });

  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [errors, setErrors] = useState({});

  // TODO: on mount, fetch existing profile
  // useEffect(() => {
  //   axios.get("/api/profile").then(res => {
  //     setForm(res.data);
  //     setProfilePic(res.data.profilePic);
  //   });
  // }, []);

  const handlePicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfilePic(reader.result);
    reader.readAsDataURL(file);
    // Keep the raw file around for the actual upload:
    setForm((f) => ({ ...f, profilePicFile: file }));
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: "" }));
  };

  const validate = () => {
    const er = {};
    if (!form.fullName.trim()) er.fullName = "First name is required";
    if (!form.lastName.trim()) er.lastName = "Last name is required";
    if (!/^[0-9+\-\s]{7,15}$/.test(form.mainMobile))
      er.mainMobile = "Enter a valid mobile number";
    if (!/^[0-9+\-\s]{7,15}$/.test(form.backupMobile1))
      er.backupMobile1 = "Enter a valid mobile number";
    if (!/^[0-9+\-\s]{7,15}$/.test(form.backupMobile2))
      er.backupMobile2 = "Enter a valid mobile number";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Enter a valid email";
    if (!form.address.trim()) er.address = "Address is required";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setSavedMsg("");

    try {
      // TODO: replace with real API call
      // const data = new FormData();
      // Object.entries(form).forEach(([k, v]) => v && data.append(k, v));
      // await axios.put("/api/profile", data, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      await new Promise((res) => setTimeout(res, 700)); // fake latency
      setSavedMsg("Profile saved.");
    } catch (err) {
      setSavedMsg("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
      setTimeout(() => setSavedMsg(""), 3000);
    }
  };

  const initials =
    (form.fullName?.[0] || "") + (form.lastName?.[0] || "") || "?";

  return (
    <div
      className="glass-page relative min-h-screen w-full overflow-x-hidden flex items-start sm:items-center justify-center p-0 sm:p-8"
      style={{
        background: `linear-gradient(160deg, ${PALETTE.blush} 0%, ${PALETTE.pale} 45%, ${PALETTE.offwhite} 100%)`,
        fontFamily: "'Work Sans', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .glass-page, .glass-page * { cursor: ${CURSOR_DEFAULT}; }
        .glass-page button, .glass-page a, .glass-page input, .glass-page select,
        .glass-page textarea, .glass-page label, .glass-page [role="button"] {
          cursor: ${CURSOR_POINTER};
        }
        @keyframes drift1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(40px,30px); } }
        @keyframes drift2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-30px,40px); } }
        @keyframes drift3 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(25px,-35px); } }
        .blob-1 { animation: drift1 16s ease-in-out infinite; }
        .blob-2 { animation: drift2 20s ease-in-out infinite; }
        .blob-3 { animation: drift3 18s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .blob-1, .blob-2, .blob-3 { animation: none; }
        }
      `}</style>

      {/* Full-bleed decorative background blobs - fixed so they fill the entire viewport regardless of scroll */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div
          className="blob-1 absolute -top-32 -left-28 w-[30rem] h-[30rem] rounded-full"
          style={{ background: PALETTE.roseDeep, opacity: 0.5, filter: "blur(100px)" }}
        />
        <div
          className="blob-2 absolute top-1/4 -right-32 w-[34rem] h-[34rem] rounded-full"
          style={{ background: PALETTE.blush, opacity: 0.55, filter: "blur(110px)" }}
        />
        <div
          className="blob-3 absolute -bottom-40 left-1/4 w-[32rem] h-[32rem] rounded-full"
          style={{ background: PALETTE.roseLight, opacity: 0.5, filter: "blur(100px)" }}
        />
        <div
          className="blob-2 absolute bottom-10 right-1/4 w-72 h-72 rounded-full"
          style={{ background: "#FFFFFF", opacity: 0.3, filter: "blur(90px)" }}
        />
      </div>

      <div className="relative z-10 w-full sm:max-w-4xl min-h-screen sm:min-h-0 flex flex-col justify-center">
        {/* Header */}
        <div className="mb-6 px-6 pt-8 sm:px-0 sm:pt-0">
          <p
            className="text-xs tracking-[0.2em] uppercase mb-1"
            style={{ color: PALETTE.roseDeep }}
          >
            Account
          </p>
          <h1
            className="font-display text-3xl"
            style={{ color: PALETTE.ink }}
          >
            Your profile
          </h1>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSave}
          className="rounded-none sm:rounded-[2rem] overflow-hidden backdrop-blur-2xl flex-1 sm:flex-none"
          style={{
            background: GLASS.panel,
            border: `1px solid ${GLASS.panelBorder}`,
            boxShadow:
              "0 8px 32px rgba(74,59,60,0.18), inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -1px 1px rgba(255,255,255,0.15)",
          }}
        >
          {/* Top banner + avatar */}
          <div
            className="relative h-28 sm:h-32"
            style={{
              background: `linear-gradient(120deg, ${PALETTE.blush}, ${PALETTE.roseDeep})`,
            }}
          >
            <div className="absolute left-1/2 -bottom-12 -translate-x-1/2 flex flex-col items-center">
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center shadow-md"
                  style={{
                    background: PALETTE.pale,
                    border: `4px solid #FFFFFF`,
                  }}
                >
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span
                      className="font-display text-2xl"
                      style={{ color: PALETTE.roseDeep }}
                    >
                      {initials.toUpperCase()}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-transform hover:scale-105"
                  style={{ background: PALETTE.roseDeep }}
                  aria-label="Change profile picture"
                >
                  <Camera size={15} color="#fff" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePicChange}
                />
              </div>
            </div>
          </div>

          {/* Add/Edit photo label */}
          <div className="pt-16 pb-2 flex justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm font-medium hover:underline"
              style={{ color: PALETTE.roseDeep }}
            >
              {profilePic ? "Change photo" : "Add profile picture"}
            </button>
          </div>

          {/* Fields */}
          <div className="px-6 sm:px-10 pb-10 pt-4 space-y-6">
            {/* Name row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="First name"
                icon={<User size={15} />}
                value={form.fullName}
                onChange={handleChange("fullName")}
                error={errors.fullName}
                placeholder="Priya"
              />
              <Field
                label="Last name"
                icon={<User size={15} />}
                value={form.lastName}
                onChange={handleChange("lastName")}
                error={errors.lastName}
                placeholder="Raman"
              />
            </div>

            {/* Mobile numbers */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wide mb-3"
                style={{ color: PALETTE.roseDeep }}
              >
                Contact numbers
              </p>
              <div className="space-y-3">
                <Field
                  label="Main mobile number"
                  icon={<Phone size={15} />}
                  value={form.mainMobile}
                  onChange={handleChange("mainMobile")}
                  error={errors.mainMobile}
                  placeholder="+91 98765 43210"
                />
                <Field
                  label="Backup mobile number 1"
                  icon={<Phone size={15} />}
                  value={form.backupMobile1}
                  onChange={handleChange("backupMobile1")}
                  error={errors.backupMobile1}
                  placeholder="+91 90000 00001"
                />
                <Field
                  label="Backup mobile number 2"
                  icon={<Phone size={15} />}
                  value={form.backupMobile2}
                  onChange={handleChange("backupMobile2")}
                  error={errors.backupMobile2}
                  placeholder="+91 90000 00002"
                />
              </div>
            </div>

            {/* Email */}
            <Field
              label="Email address"
              icon={<Mail size={15} />}
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              error={errors.email}
              placeholder="priya@example.com"
            />

            {/* Address */}
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: PALETTE.ink }}
              >
                Address
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-3"
                  style={{ color: PALETTE.roseDeep }}
                >
                  <MapPin size={15} />
                </span>
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={handleChange("address")}
                  placeholder="House no, street, city, state, PIN"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none resize-none transition-colors backdrop-blur-md"
                  style={{
                    background: GLASS.field,
                    border: `1px solid ${errors.address ? "#c0575a" : GLASS.fieldBorder}`,
                    color: PALETTE.ink,
                  }}
                />
              </div>
              {errors.address && (
                <p className="text-xs mt-1" style={{ color: "#c0575a" }}>
                  {errors.address}
                </p>
              )}
            </div>

            {/* Extra optional details */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wide mb-3"
                style={{ color: PALETTE.roseDeep }}
              >
                A little more about you (optional)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Field
                  label="Date of birth"
                  type="date"
                  value={form.dob}
                  onChange={handleChange("dob")}
                />
                <div>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: PALETTE.ink }}
                  >
                    Gender
                  </label>
                  <select
                    value={form.gender}
                    onChange={handleChange("gender")}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none backdrop-blur-md"
                    style={{
                      background: GLASS.field,
                      border: `1px solid ${GLASS.fieldBorder}`,
                      color: PALETTE.ink,
                    }}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: PALETTE.ink }}
                >
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={handleChange("bio")}
                  placeholder="A short line about yourself"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none backdrop-blur-md"
                  style={{
                    background: GLASS.field,
                    border: `1px solid ${GLASS.fieldBorder}`,
                    color: PALETTE.ink,
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <span
                className="text-xs min-h-[1rem]"
                style={{ color: savedMsg.startsWith("Something") ? "#c0575a" : PALETTE.roseDeep }}
              >
                {savedMsg}
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors backdrop-blur-md"
                  style={{
                    color: PALETTE.ink,
                    background: GLASS.field,
                  }}
                >
                  <X size={15} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-1.5 text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
                  style={{ background: PALETTE.roseDeep }}
                >
                  <Save size={15} />
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, icon, value, onChange, error, placeholder, type = "text" }) {
  return (
    <div>
      <label
        className="block text-xs font-medium mb-1.5"
        style={{ color: PALETTE.ink }}
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: PALETTE.roseDeep }}
          >
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${icon ? "pl-9" : "pl-3"} pr-3 py-2.5 rounded-xl text-sm outline-none transition-colors backdrop-blur-md`}
          style={{
            background: GLASS.field,
            border: `1px solid ${error ? "#c0575a" : GLASS.fieldBorder}`,
            color: PALETTE.ink,
          }}
        />
      </div>
      {error && (
        <p className="text-xs mt-1" style={{ color: "#c0575a" }}>
          {error}
        </p>
      )}
    </div>
  );
}
