import React, { useState } from "react";
import RentalHubDashboard from "../RentalHubDashboard.jsx";
import ProfilePage from "../ProfilePage.jsx";
import SellItemPage from "../SellItemPage.jsx";
import RecentlyViewed from "../RecentlyViewed.jsx";
import About from "../About.jsx";
import { ArrowLeft, Home, User, PlusCircle, Clock, Info } from "lucide-react";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard"); // "dashboard" | "profile" | "sell" | "recent" | "about"

  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen">
      {/* Top Floating Quick Navigation bar when on subpages */}
      {currentPage !== "dashboard" && (
        <div className="sticky top-0 z-50 bg-[#ECEBE8]/90 backdrop-blur-md border-b border-[#E0C5C4] px-4 py-2.5 flex items-center justify-between">
          <button
            onClick={() => navigate("dashboard")}
            className="flex items-center gap-2 text-sm font-medium px-3.5 py-1.5 rounded-full bg-[#F5E2E3] text-[#4A3335] hover:bg-[#ECCBC9] transition-colors border border-[#E0C5C4]"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => navigate("dashboard")}
              className={`p-2 rounded-xl text-xs font-medium transition-colors ${
                currentPage === "dashboard"
                  ? "bg-[#D0A0A3] text-white"
                  : "text-[#4A3335] hover:bg-[#F5E2E3]"
              }`}
              title="Dashboard"
            >
              <Home size={18} />
            </button>
            <button
              onClick={() => navigate("sell")}
              className={`p-2 rounded-xl text-xs font-medium transition-colors ${
                currentPage === "sell"
                  ? "bg-[#D0A0A3] text-white"
                  : "text-[#4A3335] hover:bg-[#F5E2E3]"
              }`}
              title="Sell / List Item"
            >
              <PlusCircle size={18} />
            </button>
            <button
              onClick={() => navigate("recent")}
              className={`p-2 rounded-xl text-xs font-medium transition-colors ${
                currentPage === "recent"
                  ? "bg-[#D0A0A3] text-white"
                  : "text-[#4A3335] hover:bg-[#F5E2E3]"
              }`}
              title="Recently Viewed"
            >
              <Clock size={18} />
            </button>
            <button
              onClick={() => navigate("about")}
              className={`p-2 rounded-xl text-xs font-medium transition-colors ${
                currentPage === "about"
                  ? "bg-[#D0A0A3] text-white"
                  : "text-[#4A3335] hover:bg-[#F5E2E3]"
              }`}
              title="About Us"
            >
              <Info size={18} />
            </button>
            <button
              onClick={() => navigate("profile")}
              className={`p-2 rounded-xl text-xs font-medium transition-colors ${
                currentPage === "profile"
                  ? "bg-[#D0A0A3] text-white"
                  : "text-[#4A3335] hover:bg-[#F5E2E3]"
              }`}
              title="Profile"
            >
              <User size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Main Page Rendering */}
      {currentPage === "dashboard" && (
        <RentalHubDashboard onNavigate={(dest) => navigate(dest)} />
      )}
      {currentPage === "profile" && (
        <ProfilePage onNavigate={navigate} onBack={() => navigate("dashboard")} />
      )}
      {currentPage === "sell" && (
        <SellItemPage onNavigate={navigate} onBack={() => navigate("dashboard")} />
      )}
      {currentPage === "recent" && (
        <RecentlyViewed onNavigate={navigate} onBack={() => navigate("dashboard")} />
      )}
      {currentPage === "about" && (
        <About onNavigate={navigate} onBack={() => navigate("dashboard")} />
      )}
    </div>
  );
}
