import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export const CATEGORIES = [
  { label: "All",         icon: "✦" },
  { label: "Clothing",    icon: "👕" },
  { label: "Electronics", icon: "⚡" },
  { label: "Power Tools", icon: "🔧" },
  { label: "Kitchen",     icon: "🍳" },
  { label: "Cameras",     icon: "📷" },
  { label: "Sports",      icon: "🏃" },
  { label: "Music",       icon: "🎵" },
  { label: "Books",       icon: "📚" },
  { label: "Gardening",   icon: "🌿" },
  { label: "Toys",        icon: "🧸" },
  { label: "Others",      icon: "•••" },
];

// ── Orb background (matches MyItems) ────────────────────────────────────────
const OrbField = () => (
  <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    <div style={{
      position: "absolute", top: "-20%", right: "-10%",
      width: "60vw", height: "60vw", borderRadius: "50%",
      background: "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)",
      animation: "orbA 16s ease-in-out infinite",
    }} />
    <div style={{
      position: "absolute", bottom: "-15%", left: "-10%",
      width: "55vw", height: "55vw", borderRadius: "50%",
      background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
      animation: "orbB 20s ease-in-out infinite",
    }} />
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
      backgroundSize: "60px 60px",
    }} />
  </div>
);

// ── Skeleton loader card ─────────────────────────────────────────────────────
const SkeletonCard = ({ delay }) => (
  <div style={{
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "22px",
    overflow: "hidden",
    backdropFilter: "blur(20px)",
    animation: `skeletonPulse 1.6s ${delay} ease-in-out infinite`,
  }}>
    <div style={{ height: "200px", background: "rgba(255,255,255,0.06)" }} />
    <div style={{ padding: "16px" }}>
      <div style={{ height: "14px", width: "70%", background: "rgba(255,255,255,0.06)", borderRadius: "6px", marginBottom: "10px" }} />
      <div style={{ height: "14px", width: "40%", background: "rgba(255,255,255,0.06)", borderRadius: "6px", marginBottom: "18px" }} />
      <div style={{ height: "38px", background: "rgba(255,255,255,0.06)", borderRadius: "12px" }} />
    </div>
  </div>
);

// ── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ item, onBuy, index }) => {
  const [hovered, setHovered] = useState(false);
  const isSold = item.status === "Sold";
  const imageUrl = item.image_url || `https://quincyj.alwaysdata.net/static/images/${item.item_image}`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered && !isSold ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "22px",
        overflow: "hidden",
        backdropFilter: "blur(20px)",
        transition: "transform 0.3s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s cubic-bezier(0.23,1,0.32,1), border-color 0.3s",
        transform: hovered && !isSold ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered && !isSold
          ? "0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.2)"
          : "0 4px 20px rgba(0,0,0,0.3)",
        animation: `cardReveal 0.5s ${index * 0.06}s both`,
        opacity: isSold ? 0.6 : 1,
        cursor: isSold ? "default" : "pointer",
      }}
    >
      {/* Image area */}
      <div style={{ position: "relative", overflow: "hidden", height: "200px" }}>
        <img
          src={imageUrl}
          alt={item.item_name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.5s ease",
            transform: hovered && !isSold ? "scale(1.07)" : "scale(1)",
            filter: isSold ? "grayscale(60%)" : "none",
          }}
          onError={e => e.target.src = "https://via.placeholder.com/500x350/111/444?text=No+Image"}
        />

        {/* Bottom gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(8,8,12,0.65) 0%, transparent 55%)",
        }} />

        {/* Status badge */}
        <span style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          padding: "5px 12px",
          borderRadius: "100px",
          fontSize: "0.7rem",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          background: isSold ? "rgba(17,17,17,0.85)" : "rgba(16,185,129,0.2)",
          color: isSold ? "rgba(255,255,255,0.4)" : "#10b981",
          border: `1px solid ${isSold ? "rgba(255,255,255,0.1)" : "rgba(16,185,129,0.4)"}`,
          backdropFilter: "blur(8px)",
        }}>
          {isSold ? "Sold" : "Available"}
        </span>

        {/* Category chip */}
        <span style={{
          position: "absolute",
          bottom: "12px",
          left: "12px",
          padding: "4px 11px",
          borderRadius: "100px",
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.68rem",
          color: "rgba(255,255,255,0.6)",
          fontWeight: 600,
        }}>
          {item.item_category || item.category}
        </span>

        {/* Sold overlay */}
        {isSold && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(8,8,12,0.45)",
          }}>
            <span style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.2em",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "6px 18px",
              borderRadius: "6px",
              backdropFilter: "blur(6px)",
            }}>SOLD</span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: "16px" }}>
        <h3 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: "1rem",
          color: "#fff",
          margin: "0 0 4px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>{item.item_name}</h3>

        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: "1.15rem",
          background: "linear-gradient(135deg,#a78bfa,#ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: "0 0 14px",
        }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 600 }}>KES </span>
          {(item.item_cost || item.cost || 0).toLocaleString()}
        </p>

        <button
          onClick={() => !isSold && onBuy(item)}
          disabled={isSold}
          style={{
            width: "100%",
            padding: "10px",
            border: isSold ? "1px solid rgba(255,255,255,0.08)" : "none",
            borderRadius: "12px",
            background: isSold
              ? "rgba(255,255,255,0.05)"
              : hovered
                ? "linear-gradient(135deg,#7c3aed,#a855f7)"
                : "rgba(124,58,237,0.2)",
            color: isSold ? "rgba(255,255,255,0.25)" : "#fff",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: "0.82rem",
            letterSpacing: "0.04em",
            cursor: isSold ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            boxShadow: hovered && !isSold ? "0 0 20px rgba(124,58,237,0.35)" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
          onMouseEnter={e => !isSold && (e.currentTarget.style.transform = "translateY(-1px)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
        >
          {isSold ? "Unavailable" : "Buy Now →"}
        </button>
      </div>
    </div>
  );
};

// ── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = ({ query, category }) => (
  <div style={{
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px",
    gap: "16px",
    animation: "cardReveal 0.4s both",
  }}>
    <div style={{
      width: "80px", height: "80px", borderRadius: "24px",
      background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "2rem",
    }}>🔍</div>
    <h3 style={{
      fontFamily: "'Syne', sans-serif", fontWeight: 800,
      color: "#fff", fontSize: "1.2rem", margin: 0,
    }}>No items found</h3>
    <p style={{
      fontFamily: "'DM Sans', sans-serif",
      color: "rgba(255,255,255,0.35)", fontSize: "0.875rem",
      textAlign: "center", margin: 0,
    }}>
      {query
        ? `Nothing matching "${query}" in ${category}`
        : `No items in ${category} yet`}
    </p>
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────
const ButtonScrollGroup = () => {
  const [products, setProducts]         = useState([]);
  const [activeTab, setActiveTab]       = useState("All");
  const [searchQuery, setSearchQuery]   = useState("");
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const catRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://quincyj.alwaysdata.net/api/get_items");
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handlePayNow = (product) => navigate("/pay", { state: { product } });

  const filteredProducts = products.filter((item) => {
    const category = (item.item_category || item.category || "").toLowerCase();
    const name = (item.item_name || "").toLowerCase();
    const matchesCategory = activeTab === "All" || category === activeTab.toLowerCase();
    return matchesCategory && name.includes(searchQuery.toLowerCase());
  });

  const availableCount = filteredProducts.filter(p => p.status !== "Sold").length;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;600&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #08080c; color: #fff; font-family: 'DM Sans', sans-serif; }

        @keyframes orbA {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-5%,5%) scale(1.04); }
        }
        @keyframes orbB {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(5%,-5%) scale(1.03); }
        }
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes skeletonPulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .cat-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          border: none;
          border-radius: 100px;
          padding: 8px 18px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.22s ease;
        }
        .cat-btn.active {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: #fff;
          box-shadow: 0 0 20px rgba(124,58,237,0.4);
        }
        .cat-btn.inactive {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.45);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .cat-btn.inactive:hover {
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.8);
          border-color: rgba(255,255,255,0.15);
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#08080c", paddingBottom: "60px" }}>
        <OrbField />
        <Navbar />

        <div style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "40px 20px",
        }}>

          {/* ── Page Header ── */}
          <div style={{ marginBottom: "28px", animation: "cardReveal 0.5s both" }}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.6rem, 4vw, 2rem)",
              letterSpacing: "-0.03em",
              color: "#fff",
              margin: "0 0 4px",
            }}>
              Browse the{" "}
              <span style={{
                background: "linear-gradient(135deg,#a78bfa,#ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Market</span>
            </h1>
            {!loading && (
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.875rem",
                margin: 0,
              }}>
                {availableCount} item{availableCount !== 1 ? "s" : ""} available near you
              </p>
            )}
          </div>

          {/* ── Search ── */}
          <div style={{
            position: "relative",
            marginBottom: "20px",
            animation: "cardReveal 0.5s 0.05s both",
          }}>
            <span style={{
              position: "absolute",
              left: "18px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "1rem",
              opacity: searchFocused ? 1 : 0.4,
              transition: "opacity 0.2s",
              pointerEvents: "none",
            }}>🔍</span>
            <input
              type="text"
              placeholder="Search items…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                width: "100%",
                background: searchFocused ? "rgba(124,58,237,0.08)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${searchFocused ? "rgba(124,58,237,0.6)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "14px",
                padding: "14px 16px 14px 48px",
                color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.95rem",
                outline: "none",
                transition: "all 0.25s ease",
                boxShadow: searchFocused ? "0 0 0 3px rgba(124,58,237,0.15)" : "none",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >✕</button>
            )}
          </div>

          {/* ── Category pills ── */}
          <div
            ref={catRef}
            className="no-scrollbar"
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              paddingBottom: "8px",
              marginBottom: "28px",
              animation: "cardReveal 0.5s 0.1s both",
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveTab(cat.label)}
                className={`cat-btn ${activeTab === cat.label ? "active" : "inactive"}`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* ── Error state ── */}
          {error && (
            <div style={{
              background: "rgba(244,63,94,0.1)",
              border: "1px solid rgba(244,63,94,0.25)",
              borderRadius: "14px",
              padding: "14px 18px",
              marginBottom: "24px",
              fontFamily: "'DM Sans', sans-serif",
              color: "#f43f5e",
              fontSize: "0.9rem",
            }}>
              ⚠️ Failed to load items: {error}
            </div>
          )}

          {/* ── Grid ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "22px",
          }}>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} delay={`${i * 0.07}s`} />
                ))
              : filteredProducts.length === 0
                ? <EmptyState query={searchQuery} category={activeTab} />
                : filteredProducts.map((item, index) => (
                    <ProductCard
                      key={item.id || item.item_id}
                      item={item}
                      onBuy={handlePayNow}
                      index={index}
                    />
                  ))
            }
          </div>

          {/* ── Result count footer ── */}
          {!loading && filteredProducts.length > 0 && (
            <p style={{
              textAlign: "center",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.2)",
              marginTop: "40px",
            }}>
              Showing {filteredProducts.length} of {products.length} listings
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ButtonScrollGroup;