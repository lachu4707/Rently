import React from "react";

/**
 * About.jsx
 * Standalone "About Us" page — paste directly into your MERN project.
 * No external imports (no Navbar/Footer/Header), no images, Tailwind only.
 *
 * Palette (exact, from reference):
 *   #ECCBC9  blush pink
 *   #E0C5C4  dusty pink
 *   #D0A0A3  deep rose (primary accent)
 *   #F5E2E3  pale pink (backgrounds)
 *   #ECEBE8  warm off-white (neutral)
 *   Text colors are custom dark rose-browns chosen for contrast against the palette.
 */
export default function About() {
  const features = [
    {
      title: "Reliable & Secure",
      desc: "Built on a robust MERN stack with best practices for security, stability, and uptime.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: "Fast Performance",
      desc: "Optimized front-end and back-end architecture that keeps things quick and responsive.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.8">
          <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: "Customer Focused",
      desc: "Every decision starts with the people using our product — simple, honest, and helpful.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5 20c1.2-3.5 4-5.2 7-5.2s5.8 1.7 7 5.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: "Always Improving",
      desc: "We continuously refine our platform based on feedback, data, and evolving needs.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 4v6h6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 20v-6h-6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 14a8 8 0 0014.9 3M19 10A8 8 0 004.1 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full font-sans" style={{ backgroundColor: "#ECEBE8", color: "#4A2E30" }}>
      {/* ---------- HERO ---------- */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #F5E2E3 0%, #ECCBC9 55%, #E0C5C4 100%)" }}
      >
        <div
          className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(208,160,163,0.35)" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(208,160,163,0.25)" }}
          aria-hidden="true"
        />
        <div className="relative max-w-5xl mx-auto px-6 py-24 sm:py-28 text-center">
          <span
            className="inline-block text-xs sm:text-sm tracking-widest uppercase font-semibold mb-4"
            style={{ color: "#8C4E52" }}
          >
            Who we are
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4" style={{ color: "#3D2426" }}>
            About Us
          </h1>
          {/* Text below the heading — solid dark rose-brown for guaranteed visibility on the light palette */}
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium"
            style={{ color: "#5C3336" }}
          >
            We build thoughtful, reliable digital products — combining clean
            design with solid engineering to help people get things done.
          </p>
        </div>
      </section>

      {/* ---------- INTRO ---------- */}
      <section className="max-w-4xl mx-auto px-6 py-16 sm:py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4" style={{ color: "#3D2426" }}>
          Our Story
        </h2>
        <p className="leading-relaxed text-base sm:text-lg" style={{ color: "#6B4D4F" }}>
          We started this project with a simple goal — to create a platform
          that's genuinely useful, easy to use, and built with care. Powered
          by a modern MERN stack, our team focuses on writing clean code,
          designing intuitive interfaces, and delivering an experience people
          can rely on every day.
        </p>
      </section>

      {/* ---------- MISSION & VISION ---------- */}
      <section className="max-w-5xl mx-auto px-6 pb-16 sm:pb-20">
        <div className="grid sm:grid-cols-2 gap-6">
          <div
            className="rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E0C5C4" }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
              style={{ backgroundColor: "#F5E2E3", color: "#8C4E52" }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5L12 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "#3D2426" }}>
              Our Mission
            </h3>
            <p className="leading-relaxed" style={{ color: "#6B4D4F" }}>
              To design and build practical, well-crafted software that
              genuinely solves problems — without unnecessary complexity or
              friction for the people who use it.
            </p>
          </div>

          <div
            className="rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E0C5C4" }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
              style={{ backgroundColor: "#ECCBC9", color: "#8C4E52" }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "#3D2426" }}>
              Our Vision
            </h3>
            <p className="leading-relaxed" style={{ color: "#6B4D4F" }}>
              To grow into a platform trusted by thousands of users — known
              for reliability, simplicity, and a genuine focus on the people
              we serve.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- WHY CHOOSE US ---------- */}
      <section style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #E0C5C4", borderBottom: "1px solid #E0C5C4" }}>
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3" style={{ color: "#3D2426" }}>
              Why Choose Us
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: "#8C6668" }}>
              A few reasons people trust our platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ backgroundColor: "#F5E2E3", border: "1px solid #ECCBC9" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                  style={{ backgroundColor: "#D0A0A3", color: "#FFFFFF" }}
                >
                  {f.icon}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: "#3D2426" }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B4D4F" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CALL TO ACTION / CONTACT ---------- */}
      <section style={{ background: "linear-gradient(135deg, #E0C5C4 0%, #D0A0A3 100%)" }}>
        <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3" style={{ color: "#3D2426" }}>
            Let's Work Together
          </h2>
          <p className="mb-8 max-w-xl mx-auto font-medium" style={{ color: "#4A2E30" }}>
            Have a question or want to get in touch? We'd love to hear from
            you.
          </p>
          <a
            href="mailto:hubrental04@gmail.com"
            className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl hover:-translate-y-0.5 transition-all duration-300 shadow-md"
            style={{ backgroundColor: "#FFFFFF", color: "#8C4E52" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            hubrental04@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
}
