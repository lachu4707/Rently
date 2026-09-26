import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  User,
  Clock,
  Info,
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  Plus,
  ChevronUp,
  ChevronDown,
  Tag,
  ArrowUpDown,
  LogIn,
  LogOut,
  UserCheck,
} from "lucide-react";
import { fetchProducts, getAuthUser, clearAuthSession } from "./src/services/api.js";
import AuthModal from "./src/components/AuthModal.jsx";
import RentBookingModal from "./src/components/RentBookingModal.jsx";

/* ------------------------------------------------------------------
   RENTALHUB — dashboard
   Palette: Dessert Rose
     --cream   #ECEBE8  page base
     --blush   #F5E2E3  card surface
     --petal   #ECCBC9  secondary / tags
     --mauve   #E0C5C4  borders / dividers
     --rose    #D0A0A3  primary accent (buttons, active states)
     --ink     #4A3335  headings
     --ink-soft #7A5A5C body / muted text

   NAVIGATION
   This page ships as a self-contained demo. The Profile, Sell, and
   Product-detail pages aren't wired up yet — swap the `go()` calls
   below for real navigation (react-router `navigate(...)`, or lift
   the handler up as a prop) once those pages exist. Every place a
   real page will eventually live is marked with // TODO: route.
------------------------------------------------------------------- */

const PALETTE = {
  cream: "#ECEBE8",
  blush: "#F5E2E3",
  petal: "#ECCBC9",
  mauve: "#E0C5C4",
  rose: "#D0A0A3",
  ink: "#4A3335",
  inkSoft: "#8A6668",
};

const DISTANCES = [5, 10, 15, 20, 25, 30];

const CATEGORIES_DEMO = [
  {
    id: "p1",
    title: "Canon EOS R6 Mirrorless Camera",
    price: 950,
    priceUnit: "day",
    location: "Anna Nagar, Chennai",
    distanceKm: 3,
    tag: "Electronics",
    description:
      "Full-frame body with 24-105mm kit lens, two batteries, and a padded case included.",
    images: [
      "https://picsum.photos/seed/camera1/700/500",
      "https://picsum.photos/seed/camera2/700/500",
      "https://picsum.photos/seed/camera3/700/500",
    ],
  },
  {
    id: "p2",
    title: "Trek Marlin 7 Mountain Bike",
    price: 300,
    priceUnit: "day",
    location: "Velachery, Chennai",
    distanceKm: 7,
    tag: "Sports",
    description:
      "Hardtail 29er, disc brakes, size M frame. Helmet available on request.",
    images: [
      "https://picsum.photos/seed/bike1/700/500",
      "https://picsum.photos/seed/bike2/700/500",
    ],
  },
  {
    id: "p3",
    title: "DeWalt Cordless Drill Set",
    price: 180,
    priceUnit: "day",
    location: "T Nagar, Chennai",
    distanceKm: 12,
    tag: "Tools",
    description:
      "20V drill with two batteries, charger, and a 30-piece bit set in a carry case.",
    images: [
      "https://picsum.photos/seed/drill1/700/500",
      "https://picsum.photos/seed/drill2/700/500",
    ],
  },
  {
    id: "p4",
    title: "IKEA Study Table + Chair",
    price: 220,
    priceUnit: "week",
    location: "Adyar, Chennai",
    distanceKm: 18,
    tag: "Furniture",
    description:
      "Compact desk with a matching chair, ideal for a short-term stay. Pickup only.",
    images: [
      "https://picsum.photos/seed/desk1/700/500",
      "https://picsum.photos/seed/desk2/700/500",
    ],
  },
  {
    id: "p5",
    title: "GoPro Hero 12 Action Camera",
    price: 400,
    priceUnit: "day",
    location: "Nungambakkam, Chennai",
    distanceKm: 5,
    tag: "Electronics",
    description:
      "Comes with a chest mount, extra battery, and a 128GB memory card.",
    images: [
      "https://picsum.photos/seed/gopro1/700/500",
      "https://picsum.photos/seed/gopro2/700/500",
    ],
  },
  {
    id: "p6",
    title: "Foldable Camping Tent (4-person)",
    price: 260,
    priceUnit: "day",
    location: "Porur, Chennai",
    distanceKm: 22,
    tag: "Outdoors",
    description:
      "Waterproof 4-person tent with a rainfly and stakes. Sets up in under 5 minutes.",
    images: [
      "https://picsum.photos/seed/tent1/700/500",
      "https://picsum.photos/seed/tent2/700/500",
    ],
  },
];

function go(where, payload) {
  // TODO: route — replace with real navigation once each page exists.
  console.log(`[navigate] → ${where}`, payload ?? "");
}

export default function RentalHubDashboard({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState(null);
  const [sort, setSort] = useState(null); // 'low' | 'high' | null
  const [toast, setToast] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [rentingProduct, setRentingProduct] = useState(null);
  const [products, setProducts] = useState(CATEGORIES_DEMO);
  const [loading, setLoading] = useState(true);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    setCurrentUser(getAuthUser());
  }, []);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    flash(`Welcome, ${user.name || user.email}!`);
  };

  const handleLogout = () => {
    clearAuthSession();
    setCurrentUser(null);
    flash("Signed out successfully");
  };

  const openAuth = (mode = "login") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleRent = (product) => {
    if (!currentUser) {
      flash("Please sign in or register to rent an item");
      openAuth("login");
      return;
    }
    setRentingProduct(product);
  };

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      if (data && data.length > 0) {
        const mapped = data.map((p, idx) => ({
          ...p,
          id: p._id || p.id || `p_${idx}`,
          distanceKm: p.distanceKm || (idx * 4 + 3) % 25 + 2,
        }));
        setProducts(mapped);
      }
    } catch (err) {
      console.warn("Using fallback demo items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const isSearching = query.trim().length > 0;

  const flash = (msg) => {
    setToast(msg);
    window.clearTimeout(flash._t);
    flash._t = window.setTimeout(() => setToast(null), 2200);
  };

  const handleNav = (where, payload) => {
    if (where === "sell" && !currentUser) {
      flash("Please sign in or register to list items");
      openAuth("register");
      return;
    }
    if (where === "profile" && !currentUser) {
      openAuth("login");
      return;
    }
    if (where === "rent" && payload) {
      handleRent(payload);
      return;
    }
    if (onNavigate) {
      onNavigate(where, payload);
      return;
    }
    const labels = {
      profile: "Profile page",
      recent: "Recently viewed page",
      about: "About us page",
      sell: "Sell page",
      rent: `Rent flow for “${payload?.title}”`,
      product: `Product page for “${payload?.title}”`,
    };
    flash(`Would open: ${labels[where] ?? where}`);
  };

  const results = useMemo(() => {
    let list = products.filter((p) =>
      p.title.toLowerCase().includes(query.trim().toLowerCase())
    );
    if (radius) list = list.filter((p) => p.distanceKm <= radius);
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, query, radius, sort]);

  return (
    <div
      className="min-h-screen w-full flex"
      style={{
        background: PALETTE.cream,
        fontFamily:
          "'Work Sans', 'Segoe UI', ui-sans-serif, system-ui, sans-serif",
        color: PALETTE.ink,
      }}
    >
      <GoogleFontLoader />

      {/* ---------------- SIDEBAR ---------------- */}
      <Sidebar
        currentUser={currentUser}
        onNav={handleNav}
        onOpenAuth={openAuth}
        onLogout={handleLogout}
      />

      {/* ---------------- MAIN ---------------- */}
      <main className="flex-1 min-w-0 flex flex-col">
        <Header
          query={query}
          setQuery={setQuery}
          radius={radius}
          setRadius={setRadius}
          sort={sort}
          setSort={setSort}
          isSearching={isSearching}
          currentUser={currentUser}
          onOpenAuth={openAuth}
          onLogout={handleLogout}
          onSell={() => handleNav("sell")}
        />

        <div className="flex-1 min-h-0 px-6 md:px-10 pb-10">
          {loading ? (
            <div className="py-20 text-center text-sm" style={{ color: PALETTE.inkSoft }}>
              Loading listings...
            </div>
          ) : isSearching ? (
            <SearchResults
              results={results}
              onView={(p) => setActiveProduct(p)}
              onRent={(p) => handleRent(p)}
            />
          ) : (
            <Feed
              items={products}
              onView={(p) => setActiveProduct(p)}
              onRent={(p) => handleRent(p)}
            />
          )}
        </div>
      </main>

      {activeProduct && (
        <ProductModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onRent={(p) => {
            setActiveProduct(null);
            handleRent(p);
          }}
        />
      )}

      {/* Rent Booking Flow Modal */}
      {rentingProduct && (
        <RentBookingModal
          product={rentingProduct}
          isOpen={Boolean(rentingProduct)}
          onClose={() => setRentingProduct(null)}
          onBookingSuccess={(booking) => {
            flash(`Rental request for "${booking.productTitle}" sent to owner! Total: ₹${booking.totalPrice}`);
          }}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authMode}
      />

      {toast && <Toast message={toast} />}
    </div>
  );
}

/* ------------------------------ Sidebar ------------------------------ */

function Sidebar({ currentUser, onNav, onOpenAuth, onLogout }) {
  const navItems = [
    { key: "recent", label: "Recently viewed", icon: Clock },
    { key: "about", label: "About us", icon: Info },
  ];

  return (
    <aside
      className="hidden sm:flex flex-col w-[230px] shrink-0 px-5 pt-8 pb-6"
      style={{
        background: PALETTE.blush,
        borderRight: `1px solid ${PALETTE.mauve}`,
      }}
    >
      {currentUser ? (
        <div className="mb-6">
          <button
            onClick={() => onNav("profile")}
            className="group flex items-center gap-3 w-full text-left"
          >
            <span
              className="flex items-center justify-center rounded-full w-11 h-11 shrink-0 font-bold text-white text-base transition-transform group-hover:scale-105"
              style={{
                background: PALETTE.rose,
                boxShadow: `0 2px 8px ${PALETTE.rose}55`,
              }}
            >
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <User size={20} />}
            </span>
            <span className="min-w-0 flex-1">
              <span
                className="block text-[14px] leading-tight font-semibold truncate"
                style={{ color: PALETTE.ink }}
              >
                {currentUser.name || "User"}
              </span>
              <span className="block text-[11px] truncate opacity-70" style={{ color: PALETTE.inkSoft }}>
                {currentUser.email}
              </span>
            </span>
          </button>
          <div className="flex gap-2 mt-2.5">
            <button
              onClick={() => onNav("profile")}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#ECCBC9] text-[#4A3335] hover:opacity-80 transition-opacity"
            >
              Edit Profile
            </button>
            <button
              onClick={onLogout}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center gap-1"
            >
              <LogOut size={11} />
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div
            className="p-3.5 rounded-2xl text-center"
            style={{ background: PALETTE.petal, border: `1px solid ${PALETTE.mauve}` }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: PALETTE.ink }}>
              Welcome to RentalHub
            </p>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => onOpenAuth("login")}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: PALETTE.rose }}
              >
                <LogIn size={13} />
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth("register")}
                className="w-full py-1.5 px-3 rounded-xl text-xs font-semibold transition-colors bg-white/70 hover:bg-white text-[#4A3335]"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="h-px w-full mb-4"
        style={{ background: PALETTE.mauve }}
      />

      <nav className="flex flex-col gap-1">
        {navItems.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onNav(key)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors"
            style={{ color: PALETTE.ink }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = PALETTE.petal)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <Icon size={17} color={PALETTE.rose} strokeWidth={2} />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <div
          className="rounded-2xl p-4 text-xs leading-relaxed"
          style={{ background: PALETTE.petal, color: PALETTE.ink }}
        >
          <span className="block font-semibold mb-1">Renting is caring</span>
          Borrow what you need, list what you don't.
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------ Header ------------------------------ */

function Header({
  query,
  setQuery,
  radius,
  setRadius,
  sort,
  setSort,
  isSearching,
  currentUser,
  onOpenAuth,
  onLogout,
  onSell,
}) {
  return (
    <header
      className="px-6 md:px-10 pt-8 pb-6"
      style={{ borderBottom: `1px solid ${PALETTE.mauve}` }}
    >
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex-1 hidden md:block">
          {currentUser ? (
            <div className="flex items-center gap-2 text-xs font-medium text-[#7A5A5C]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Logged in as <strong className="text-[#4A3335]">{currentUser.name || currentUser.email}</strong></span>
            </div>
          ) : (
            <span className="text-xs text-[#8A6668]">Explore local rentals near you</span>
          )}
        </div>

        <h1
          className="text-center flex-1 select-none"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "2.6rem",
            letterSpacing: "0.02em",
            color: PALETTE.ink,
          }}
        >
          Rental<span style={{ fontStyle: "italic", color: PALETTE.rose }}>hub</span>
        </h1>

        <div className="flex-1 flex items-center justify-end gap-2.5">
          {!currentUser ? (
            <>
              <button
                onClick={() => onOpenAuth("login")}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-colors hover:bg-[#ECCBC9]"
                style={{ color: PALETTE.ink, border: `1px solid ${PALETTE.mauve}` }}
              >
                <LogIn size={14} />
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth("register")}
                className="hidden sm:block px-3.5 py-2 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: PALETTE.rose }}
              >
                Register
              </button>
            </>
          ) : (
            <button
              onClick={onLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
              title="Log out"
            >
              <LogOut size={13} />
              Logout
            </button>
          )}

          <button
            onClick={onSell}
            className="flex items-center gap-1.5 sm:gap-2 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${PALETTE.rose}, #c08386)`,
              boxShadow: `0 6px 16px ${PALETTE.rose}66`,
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>List Item</span>
          </button>
        </div>
      </div>


      {/* search bar */}
      <div className="max-w-2xl mx-auto">
        <div
          className="flex items-center gap-3 rounded-full px-5 py-3"
          style={{
            background: PALETTE.blush,
            border: `1.5px solid ${PALETTE.mauve}`,
          }}
        >
          <Search size={18} color={PALETTE.rose} strokeWidth={2.2} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a product to rent…"
            className="flex-1 bg-transparent outline-none text-[15px] placeholder:opacity-60"
            style={{ color: PALETTE.ink }}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              <X size={16} color={PALETTE.inkSoft} />
            </button>
          )}
        </div>

        {isSearching && (
          <FilterBar
            radius={radius}
            setRadius={setRadius}
            sort={sort}
            setSort={setSort}
          />
        )}
      </div>
    </header>
  );
}

function FilterBar({ radius, setRadius, sort, setSort }) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="flex items-center gap-1 text-xs font-medium mr-1"
          style={{ color: PALETTE.inkSoft }}
        >
          <MapPin size={13} /> Distance
        </span>
        {DISTANCES.map((d) => (
          <Chip
            key={d}
            active={radius === d}
            onClick={() => setRadius(radius === d ? null : d)}
          >
            {d} km
          </Chip>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="flex items-center gap-1 text-xs font-medium mr-1"
          style={{ color: PALETTE.inkSoft }}
        >
          <ArrowUpDown size={13} /> Price
        </span>
        <Chip active={sort === "low"} onClick={() => setSort(sort === "low" ? null : "low")}>
          Low to high
        </Chip>
        <Chip active={sort === "high"} onClick={() => setSort(sort === "high" ? null : "high")}>
          High to low
        </Chip>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors"
      style={{
        background: active ? PALETTE.rose : PALETTE.petal,
        color: active ? "#fff" : PALETTE.ink,
      }}
    >
      {children}
    </button>
  );
}

/* ------------------------------ Search results ------------------------------ */

function SearchResults({ results, onView, onRent }) {
  return (
    <section className="pt-6">
      <p className="text-sm mb-4" style={{ color: PALETTE.inkSoft }}>
        {results.length} result{results.length !== 1 ? "s" : ""}
      </p>
      {results.length === 0 ? (
        <EmptyState text="No products match your search and filters yet. Try widening the distance or clearing a filter." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((p) => (
            <ResultCard key={p.id} product={p} onView={onView} onRent={onRent} />
          ))}
        </div>
      )}
    </section>
  );
}

function ResultCard({ product, onView, onRent }) {
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: PALETTE.blush, border: `1px solid ${PALETTE.mauve}` }}
    >
      <img
        src={product.images[0]}
        alt={product.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span
          className="self-start text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5"
          style={{ background: PALETTE.petal, color: PALETTE.ink }}
        >
          {product.tag}
        </span>
        <h3 className="text-[15px] font-semibold leading-snug" style={{ color: PALETTE.ink }}>
          {product.title}
        </h3>
        <p className="text-xs flex items-center gap-1" style={{ color: PALETTE.inkSoft }}>
          <MapPin size={12} /> {product.location} · {product.distanceKm} km away
        </p>
        <p className="text-sm font-semibold" style={{ color: PALETTE.rose }}>
          ₹{product.price} / {product.priceUnit}
        </p>
        <div className="mt-auto flex gap-2 pt-2">
          <ActionButtons product={product} onView={onView} onRent={onRent} compact />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Feed (default) ------------------------------ */

function Feed({ items, onView, onRent }) {
  const scrollerRef = useRef(null);

  const scrollBy = (dy) =>
    scrollerRef.current?.scrollBy({ top: dy, behavior: "smooth" });

  return (
    <section className="pt-8 flex flex-col min-h-0 flex-1">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2
          className="text-lg font-semibold"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: PALETTE.ink }}
        >
          Nearby feed
        </h2>
        <div className="hidden sm:flex flex-col gap-2">
          <RoundIconButton onClick={() => scrollBy(-320)}>
            <ChevronUp size={16} />
          </RoundIconButton>
          <RoundIconButton onClick={() => scrollBy(320)}>
            <ChevronDown size={16} />
          </RoundIconButton>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex flex-col gap-5 overflow-y-auto pr-1 -mr-1 snap-y snap-mandatory"
        style={{ scrollbarWidth: "thin", maxHeight: "calc(100vh - 340px)" }}
      >
        {items.map((p) => (
          <FeedCard key={p.id} product={p} onView={onView} onRent={onRent} />
        ))}
      </div>
    </section>
  );
}

function FeedCard({ product, onView, onRent }) {
  return (
    <div
      className="snap-start shrink-0 w-full rounded-2xl overflow-hidden flex"
      style={{ background: PALETTE.blush, border: `1px solid ${PALETTE.mauve}` }}
    >
      <img
        src={product.images[0]}
        alt={product.title}
        className="w-48 sm:w-56 h-auto object-cover shrink-0"
      />
      <div className="p-4 flex flex-col gap-1.5 flex-1 min-w-0">
        <span
          className="self-start text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5"
          style={{ background: PALETTE.petal, color: PALETTE.ink }}
        >
          <Tag size={9} className="inline -mt-0.5 mr-1" />
          {product.tag}
        </span>
        <h3
          className="text-[14.5px] font-semibold leading-snug truncate"
          style={{ color: PALETTE.ink }}
          title={product.title}
        >
          {product.title}
        </h3>
        <p className="text-xs line-clamp-2" style={{ color: PALETTE.inkSoft }}>
          {product.description}
        </p>
        <p className="text-xs flex items-center gap-1" style={{ color: PALETTE.inkSoft }}>
          <MapPin size={12} /> {product.distanceKm} km · {product.location}
        </p>
        <p className="text-sm font-semibold" style={{ color: PALETTE.rose }}>
          ₹{product.price} / {product.priceUnit}
        </p>
        <div className="mt-auto flex gap-2 pt-1">
          <ActionButtons product={product} onView={onView} onRent={onRent} compact />
        </div>
      </div>
    </div>
  );
}

function ActionButtons({ product, onView, onRent, compact }) {
  const pad = compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  return (
    <>
      <button
        onClick={() => onRent(product)}
        className={`rounded-full font-semibold text-white ${pad}`}
        style={{ background: PALETTE.rose }}
      >
        Rent
      </button>
      <button
        onClick={() => onView(product)}
        className={`rounded-full font-semibold ${pad}`}
        style={{
          background: "transparent",
          color: PALETTE.ink,
          border: `1.4px solid ${PALETTE.rose}`,
        }}
      >
        View product
      </button>
    </>
  );
}

function RoundIconButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-full flex items-center justify-center"
      style={{ background: PALETTE.petal, color: PALETTE.ink }}
    >
      {children}
    </button>
  );
}

/* ------------------------------ Product modal ------------------------------ */

function ProductModal({ product, onClose, onRent }) {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(74,51,53,0.45)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-3xl"
        style={{ background: PALETTE.blush, border: `1px solid ${PALETTE.mauve}` }}
      >
        <div className="relative">
          <img
            src={product.images[activeImg]}
            alt={product.title}
            className="w-full h-72 sm:h-96 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.85)" }}
          >
            <X size={18} color={PALETTE.ink} />
          </button>
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-4 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImg(i)}
                  className="w-12 h-12 rounded-lg overflow-hidden"
                  style={{
                    border: `2px solid ${i === activeImg ? PALETTE.rose : "rgba(255,255,255,0.8)"}`,
                  }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <span
            className="inline-block text-[10px] font-semibold uppercase tracking-wide rounded-full px-2.5 py-1 mb-3"
            style={{ background: PALETTE.petal, color: PALETTE.ink }}
          >
            {product.tag}
          </span>
          <h2
            className="text-2xl mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: PALETTE.ink }}
          >
            {product.title}
          </h2>
          <p className="text-sm flex items-center gap-1 mb-4" style={{ color: PALETTE.inkSoft }}>
            <MapPin size={13} /> {product.location} · {product.distanceKm} km away
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: PALETTE.ink }}>
            {product.description}
          </p>

          <div
            className="flex items-center justify-between rounded-2xl px-5 py-4"
            style={{ background: PALETTE.petal }}
          >
            <div>
              <p className="text-xs" style={{ color: PALETTE.inkSoft }}>
                Rental price
              </p>
              <p className="text-xl font-semibold" style={{ color: PALETTE.ink }}>
                ₹{product.price}{" "}
                <span className="text-sm font-normal">/ {product.priceUnit}</span>
              </p>
            </div>
            <button
              onClick={() => onRent(product)}
              className="rounded-full px-6 py-3 text-sm font-semibold text-white"
              style={{ background: PALETTE.rose, boxShadow: `0 6px 16px ${PALETTE.rose}66` }}
            >
              Rent this item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Misc ------------------------------ */

function EmptyState({ text }) {
  return (
    <div
      className="rounded-2xl p-10 text-center text-sm"
      style={{ background: PALETTE.blush, color: PALETTE.inkSoft, border: `1px dashed ${PALETTE.mauve}` }}
    >
      {text}
    </div>
  );
}

function Toast({ message }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-lg"
      style={{ background: PALETTE.ink }}
    >
      {message}
    </div>
  );
}

function GoogleFontLoader() {
  useEffect(() => {
    const id = "rentalhub-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Work+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
  return null;
}
