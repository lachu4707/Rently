import React, { useState } from "react";

// ---- Design tokens (Dessert Rose palette) ----
const C = {
  blush: "#ECCBC9",
  rose: "#E0C5C4",
  mauve: "#D0A0A3",
  cream: "#F5E2E3",
  offwhite: "#ECEBE8",
  text: "#4A4544",
  textSoft: "#8A7F7E",
};

// ---- Mock data ----
const ORDERS = [
  {
    id: "RH-20824",
    name: "Sony A6400 Mirrorless Camera",
    category: "Camera",
    owner: "Arjun Mehta",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
    dates: "Aug 15 – Aug 18",
    days: 3,
    pricePerDay: 600,
    deposit: 3000,
    total: 4800,
    status: "Confirmed",
  },
  {
    id: "RH-20831",
    name: "DJI Mini 4 Pro Drone",
    category: "Drone",
    owner: "Priya Raman",
    image:
      "https://images.unsplash.com/photo-1508614999368-9260051292e5?w=400&q=80",
    dates: "Aug 20 – Aug 22",
    days: 2,
    pricePerDay: 1200,
    deposit: 5000,
    total: 7400,
    status: "Active",
  },
  {
    id: "RH-20779",
    name: "Epson Home Projector",
    category: "Electronics",
    owner: "Karthik Iyer",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80",
    dates: "Aug 05 – Aug 06",
    days: 1,
    pricePerDay: 800,
    deposit: 2000,
    total: 2800,
    status: "Completed",
  },
  {
    id: "RH-20692",
    name: "Canon EF 24-70mm Lens",
    category: "Camera",
    owner: "Sneha Pillai",
    image:
      "https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=400&q=80",
    dates: "Jul 28 – Jul 30",
    days: 2,
    pricePerDay: 950,
    deposit: 4000,
    total: 5900,
    status: "Cancelled",
  },
];

const STATUS_STYLES = {
  Confirmed: { bg: "#F6E4E3", text: "#A9585B", label: "Confirmed" },
  Active: { bg: "#E4EFE2", text: "#5C8358", label: "Active" },
  Completed: { bg: "#ECEBE8", text: "#7A7570", label: "Completed" },
  Cancelled: { bg: "#F8E9EA", text: "#B98488", label: "Cancelled" },
};

const FILTERS = ["All", "Active", "Upcoming", "Completed"];

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Completed;
  return (
    <span
      className="text-xs font-medium px-3 py-1 rounded-full inline-block"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div
      className="rounded-2xl p-4 flex-1 min-w-[130px]"
      style={{ backgroundColor: "#FFFFFF", border: `1px solid ${C.offwhite}` }}
    >
      <p className="text-xs mb-1" style={{ color: C.textSoft }}>
        {label}
      </p>
      <p className="text-2xl font-semibold" style={{ color: C.text }}>
        {value}
      </p>
    </div>
  );
}

function OrderCard({ order }) {
  return (
    <div
      className="rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4"
      style={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${C.offwhite}`,
        boxShadow: "0 2px 10px rgba(208,160,163,0.08)",
      }}
    >
      <img
        src={order.image}
        alt={order.name}
        className="w-full sm:w-32 h-32 object-cover rounded-xl flex-shrink-0"
      />

      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-medium text-base" style={{ color: C.text }}>
              {order.name}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: C.textSoft }}>
              {order.category} · Owner: {order.owner}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm mt-1" style={{ color: C.text }}>
          <span>
            <span style={{ color: C.textSoft }}>Dates: </span>
            {order.dates}
          </span>
          <span>
            <span style={{ color: C.textSoft }}>Duration: </span>
            {order.days} day{order.days > 1 ? "s" : ""}
          </span>
          <span>
            <span style={{ color: C.textSoft }}>Booking ID: </span>
            {order.id}
          </span>
        </div>

        <div
          className="flex flex-wrap items-center justify-between gap-3 mt-2 pt-3"
          style={{ borderTop: `1px solid ${C.offwhite}` }}
        >
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <span style={{ color: C.textSoft }}>
              Rent: <span style={{ color: C.text }}>₹{order.pricePerDay}/day</span>
            </span>
            <span style={{ color: C.textSoft }}>
              Deposit: <span style={{ color: C.text }}>₹{order.deposit}</span>
            </span>
            <span style={{ color: C.textSoft }}>
              Total: <span className="font-semibold" style={{ color: C.mauve }}>₹{order.total}</span>
            </span>
          </div>

          <button
            className="text-sm font-medium px-4 py-2 rounded-full transition-opacity hover:opacity-90"
            style={{ backgroundColor: C.mauve, color: "#FFFFFF" }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RecentlyViewed() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = ORDERS.filter((o) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Upcoming") return o.status === "Confirmed";
    return o.status === activeFilter;
  });

  const summary = {
    total: ORDERS.length,
    active: ORDERS.filter((o) => o.status === "Active").length,
    upcoming: ORDERS.filter((o) => o.status === "Confirmed").length,
    completed: ORDERS.filter((o) => o.status === "Completed").length,
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: C.offwhite }}>
      <div className="w-full px-4 sm:px-8 lg:px-16 py-8">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: C.text }}>
            Recently Viewed
          </h1>
          <p className="text-sm mt-1" style={{ color: C.textSoft }}>
            Your recent rental activity
          </p>
        </header>

        {/* Summary row */}
        <div className="flex flex-wrap gap-3 mb-6">
          <SummaryCard label="Total Rentals" value={summary.total} />
          <SummaryCard label="Active Rental" value={summary.active} />
          <SummaryCard label="Upcoming" value={summary.upcoming} />
          <SummaryCard label="Completed" value={summary.completed} />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="text-sm px-4 py-1.5 rounded-full transition-colors"
              style={{
                backgroundColor: activeFilter === f ? C.mauve : "#FFFFFF",
                color: activeFilter === f ? "#FFFFFF" : C.textSoft,
                border: `1px solid ${activeFilter === f ? C.mauve : C.offwhite}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Orders list */}
        <div className="flex flex-col gap-4">
          {filtered.length > 0 ? (
            filtered.map((order) => <OrderCard key={order.id} order={order} />)
          ) : (
            <div
              className="rounded-2xl p-10 text-center"
              style={{ backgroundColor: "#FFFFFF", border: `1px solid ${C.offwhite}` }}
            >
              <p style={{ color: C.textSoft }}>No rentals in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
