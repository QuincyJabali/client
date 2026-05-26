import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

// ── Orb background ─────────────────────────────────────────────────────────────
const OrbField = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    <div style={{
      position: "absolute", top: "-15%", left: "-10%",
      width: "65vw", height: "65vw", borderRadius: "50%",
      background: "radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)",
      animation: "orbFloat1 14s ease-in-out infinite",
    }} />
    <div style={{
      position: "absolute", bottom: "-20%", right: "-10%",
      width: "55vw", height: "55vw", borderRadius: "50%",
      background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)",
      animation: "orbFloat2 18s ease-in-out infinite",
    }} />
    <div style={{
      position: "absolute", top: "40%", right: "20%",
      width: "30vw", height: "30vw", borderRadius: "50%",
      background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)",
      animation: "orbFloat3 11s ease-in-out infinite",
    }} />
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
      backgroundSize: "60px 60px",
    }} />
  </div>
);

// ── Floating stat badge ─────────────────────────────────────────────────────────
const StatBadge = ({ value, label, delay, style }) => (
  <div style={{
    position: "absolute",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "16px",
    padding: "14px 20px",
    animation: `floatBadge 6s ${delay} ease-in-out infinite`,
    ...style,
  }}>
    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#fff", lineHeight: 1 }}>{value}</div>
    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{label}</div>
  </div>
);

// ── Feature card ───────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc, accent, delay }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)"
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: "24px",
        padding: "clamp(24px, 4vw, 36px) clamp(20px, 3vw, 32px)",
        cursor: "default",
        transition: "all 0.35s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        animation: `cardReveal 0.7s ${delay} both`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: hovered ? `linear-gradient(90deg, transparent, ${accent}, transparent)` : "transparent",
        transition: "background 0.4s",
      }} />
      <div style={{
        width: "52px", height: "52px", borderRadius: "14px",
        background: `${accent}20`,
        border: `1px solid ${accent}40`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "20px",
        fontSize: "1.4rem",
        transition: "transform 0.3s",
        transform: hovered ? "scale(1.1) rotate(-3deg)" : "scale(1) rotate(0deg)",
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <h3 style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700,
        fontSize: "clamp(1rem, 2vw, 1.15rem)",
        color: "#fff",
        marginBottom: "10px",
      }}>{title}</h3>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        color: "rgba(255,255,255,0.5)",
        fontSize: "clamp(0.875rem, 1.5vw, 0.95rem)",
        lineHeight: 1.6,
        margin: 0,
      }}>{desc}</p>
    </div>
  );
};

// ── Step item ──────────────────────────────────────────────────────────────────
const Step = ({ num, title, desc }) => (
  <div style={{
    display: "flex", gap: "20px", alignItems: "flex-start",
    padding: "24px 0",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  }}>
    <div style={{
      minWidth: "44px", height: "44px", borderRadius: "50%",
      border: "1px solid rgba(124,58,237,0.5)",
      background: "rgba(124,58,237,0.1)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Syne', sans-serif",
      fontWeight: 800, fontSize: "0.9rem",
      color: "#a78bfa",
      flexShrink: 0,
    }}>{num}</div>
    <div>
      <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#fff", margin: "0 0 6px", fontSize: "clamp(0.95rem, 2vw, 1rem)" }}>{title}</h4>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.6, fontSize: "clamp(0.85rem, 1.5vw, 0.9rem)" }}>{desc}</p>
    </div>
  </div>
);

// ── Main Landing Page ──────────────────────────────────────────────────────────
const LandingPage = () => {
  const isLoggedIn = localStorage.getItem("user");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth < 960);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,600;1,400&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #08080c; }

        @keyframes orbFloat1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(4%,6%) scale(1.06); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-5%,-4%) scale(1.04); }
        }
        @keyframes orbFloat3 {
          0%,100% { transform: translate(0,0); }
          50%      { transform: translate(3%,-6%); }
        }
        @keyframes floatBadge {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes heroReveal {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pillReveal {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: clamp(0.9rem, 2vw, 1rem);
          padding: 14px clamp(22px, 4vw, 34px);
          border-radius: 100px;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .cta-primary {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: #fff;
          box-shadow: 0 0 40px rgba(124,58,237,0.4);
        }
        .cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 50px rgba(124,58,237,0.55);
        }
        .cta-secondary {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(10px);
        }
        .cta-secondary:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-3px);
        }

        /* Responsive grid helpers */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 960px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .features-grid { grid-template-columns: 1fr; }
        }

        .how-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        @media (max-width: 860px) {
          .how-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .how-cards { display: none !important; }
        }

        .cta-buttons {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }
        @media (max-width: 420px) {
          .cta-buttons { flex-direction: column; align-items: center; }
          .cta-btn { width: 100%; max-width: 300px; }
        }

        .footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .footer-inner {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
        }

        .cta-banner-inner {
          padding: clamp(36px, 6vw, 64px) clamp(24px, 5vw, 48px);
        }

        .social-proof {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }
      `}</style>

      <div style={{ background: "#08080c", minHeight: "100vh", color: "#fff" }}>
        <Navbar />

        {/* ── HERO ── */}
        <section style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(100px, 15vw, 140px) clamp(16px, 5vw, 24px) clamp(60px, 8vw, 80px)",
          overflow: "hidden",
        }}>
          <OrbField />

          {/* Floating stat badges — hidden on small screens */}
          {!isMobile && (
            <>
              <StatBadge value="12k+" label="Active Listings" delay="0s"
                style={{ top: "22%", left: "5%", display: isTablet ? "none" : "block" }} />
              <StatBadge value="4.9★" label="User Rating" delay="1.5s"
                style={{ top: "30%", right: "4%", display: isTablet ? "none" : "block" }} />
              <StatBadge value="$2M+" label="Saved by Users" delay="3s"
                style={{ bottom: "22%", left: "6%", display: isTablet ? "none" : "block" }} />
            </>
          )}

          {/* Hero content */}
          <div style={{ position: "relative", maxWidth: "860px", textAlign: "center", width: "100%" }}>
            {/* Pill badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.35)",
              borderRadius: "100px",
              padding: "6px 18px 6px 8px",
              marginBottom: "28px",
              animation: "pillReveal 0.6s 0.1s both",
              flexWrap: "nowrap",
            }}>
              <span style={{
                background: "#7c3aed", borderRadius: "100px",
                padding: "3px 10px", fontSize: "0.7rem",
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
                letterSpacing: "0.08em", color: "#fff",
                flexShrink: 0,
              }}>NEW</span>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                color: "rgba(255,255,255,0.65)",
                whiteSpace: "nowrap",
              }}>Neighborhood Commerce, Reimagined</span>
            </div>

            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.2rem, 7vw, 5.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#fff",
              marginBottom: "24px",
              animation: "heroReveal 0.8s 0.25s both",
            }}>
              You don't have it?<br />
              <span style={{
                background: "linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #f59e0b 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 4s linear infinite",
              }}>Your Neighbor does.</span>
            </h1>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(0.95rem, 2.5vw, 1.2rem)",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              maxWidth: "600px",
              margin: "0 auto 40px",
              animation: "heroReveal 0.8s 0.4s both",
              padding: "0 clamp(0px, 2vw, 16px)",
            }}>
              The all-in-one platform to buy, sell, and connect with your local community. List in seconds, find deals nearby, and get things done — without the hassle.
            </p>

            <div className="cta-buttons" style={{ animation: "heroReveal 0.8s 0.55s both" }}>
              <Link className="cta-btn cta-primary" to={isLoggedIn ? "/dashboard" : "/signup"}>
                {isLoggedIn ? "Go to Dashboard" : "Get Started Free"}
                <span style={{ fontSize: "1.1rem" }}>→</span>
              </Link>
              <Link className="cta-btn cta-secondary" to="#features">
                See How It Works
              </Link>
            </div>

            {/* Social proof */}
            <div className="social-proof" style={{
              marginTop: "48px",
              animation: "heroReveal 0.8s 0.7s both",
            }}>
              <div style={{ display: "flex" }}>
                {["🧑‍💼", "👩‍💻", "🧑‍🎨", "👩‍🔧"].map((emoji, i) => (
                  <div key={i} style={{
                    width: "34px", height: "34px", borderRadius: "50%",
                    background: `hsl(${i * 60 + 200},60%,25%)`,
                    border: "2px solid #08080c",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1rem",
                    marginLeft: i ? "-8px" : "0",
                    zIndex: 4 - i,
                    position: "relative",
                    flexShrink: 0,
                  }}>{emoji}</div>
                ))}
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(0.8rem, 2vw, 0.85rem)", color: "rgba(255,255,255,0.45)" }}>
                Trusted by <strong style={{ color: "rgba(255,255,255,0.75)" }}>8,000+</strong> neighbors
              </span>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" style={{
          padding: "clamp(60px, 10vw, 100px) clamp(16px, 5vw, 24px)",
          maxWidth: "1200px",
          margin: "0 auto",
        }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(40px, 7vw, 64px)" }}>
            <p style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 700,
              fontSize: "0.75rem", letterSpacing: "0.2em",
              color: "#7c3aed", textTransform: "uppercase", marginBottom: "14px",
            }}>Platform Features</p>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "clamp(1.6rem, 4vw, 3rem)",
              letterSpacing: "-0.02em", color: "#fff", marginBottom: "16px",
            }}>Built for your community</h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "rgba(255,255,255,0.45)",
              fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
              maxWidth: "480px", margin: "0 auto",
              padding: "0 clamp(0px, 2vw, 16px)",
            }}>
              Cost-effective, secure, and always in sync — everything you need to thrive locally.
            </p>
          </div>

          <div className="features-grid">
            <FeatureCard delay="0s"    icon="💸" accent="#10b981" title="Cost Effective"   desc="Zero listing fees, zero hidden charges. Keep more money in your pocket with every transaction." />
            <FeatureCard delay="0.12s" icon="🔒" accent="#7c3aed" title="Secure by Design" desc="End-to-end encryption, verified profiles, and secure payments — your privacy is non-negotiable." />
            <FeatureCard delay="0.24s" icon="⚡" accent="#f59e0b" title="Always Synced"    desc="One account, every device. Your listings, messages, and offers follow you everywhere in real-time." />
            <FeatureCard delay="0.36s" icon="📍" accent="#ec4899" title="Hyper-Local"      desc="Browse deals within walking distance. Our smart radius filtering puts your neighborhood first." />
            <FeatureCard delay="0.48s" icon="💬" accent="#06b6d4" title="In-App Messaging" desc="Chat with buyers and sellers without sharing your personal number. Safe, fast, and simple." />
            <FeatureCard delay="0.60s" icon="🚀" accent="#8b5cf6" title="List in Seconds"  desc="Snap a photo, set a price, done. Our smart auto-fill does the heavy lifting so you don't have to." />
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{
          padding: "clamp(60px, 10vw, 80px) clamp(16px, 5vw, 24px)",
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <div className="how-grid">
              {/* Left: text + steps */}
              <div>
                <p style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 700,
                  fontSize: "0.75rem", letterSpacing: "0.2em",
                  color: "#7c3aed", textTransform: "uppercase", marginBottom: "14px",
                }}>How It Works</p>
                <h2 style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  fontSize: "clamp(1.5rem, 3vw, 2.4rem)",
                  letterSpacing: "-0.02em", color: "#fff", marginBottom: "8px",
                }}>
                  Up and running<br />in three steps
                </h2>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "clamp(0.875rem, 1.5vw, 0.95rem)",
                  marginBottom: "32px", lineHeight: 1.7,
                }}>
                  No steep learning curves. No complicated setups. Just connect, list, and sell.
                </p>
                <Step num="01" title="Create your free account" desc="Sign up in under a minute — no credit card required. Your neighbourhood awaits." />
                <Step num="02" title="List your item" desc="Add a photo, write a quick description, set your price, and publish instantly." />
                <Step num="03" title="Connect & sell" desc="Chat with interested buyers nearby, agree on a meetup, and complete the deal." />
              </div>

              {/* Right: floating card stack — hidden on tablet/mobile via CSS */}
              <div className="how-cards" style={{ position: "relative", height: "380px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {[
                  { bg: "rgba(124,58,237,0.15)", border: "rgba(124,58,237,0.3)", rotate: "-6deg", top: "10%", label: "📦 Vintage Lamp",   price: "$45" },
                  { bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)",  rotate: "3deg",  top: "20%", label: "🚲 Mountain Bike",  price: "$120" },
                  { bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)",  rotate: "0deg",  top: "28%", label: "📱 iPhone 14",      price: "$499" },
                ].map((card, i) => (
                  <div key={i} style={{
                    position: "absolute",
                    width: "clamp(180px, 22vw, 220px)",
                    background: card.bg,
                    border: `1px solid ${card.border}`,
                    borderRadius: "20px",
                    padding: "20px 24px",
                    backdropFilter: "blur(14px)",
                    transform: `rotate(${card.rotate})`,
                    top: card.top,
                    zIndex: 3 - i,
                    animation: `floatBadge ${7 + i * 2}s ${i * 1.2}s ease-in-out infinite`,
                  }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "#fff", marginBottom: "6px" }}>{card.label}</div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#fff" }}>{card.price}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>📍 0.3 mi away</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section style={{
          padding: "clamp(60px, 10vw, 100px) clamp(16px, 5vw, 24px)",
          textAlign: "center",
        }}>
          <div style={{
            maxWidth: "720px",
            margin: "0 auto",
            background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(236,72,153,0.1) 100%)",
            border: "1px solid rgba(124,58,237,0.25)",
            borderRadius: "clamp(20px, 4vw, 32px)",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.2) 0%, transparent 70%)",
            }} />
            <div className="cta-banner-inner">
              <h2 style={{
                position: "relative",
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: "clamp(1.5rem, 4vw, 2.8rem)",
                letterSpacing: "-0.02em", color: "#fff",
                marginBottom: "16px",
              }}>
                Your community is already here.
              </h2>
              <p style={{
                position: "relative",
                fontFamily: "'DM Sans', sans-serif",
                color: "rgba(255,255,255,0.5)",
                fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
                marginBottom: "36px", lineHeight: 1.7,
              }}>
                Join thousands of neighbors buying and selling every day. It's free, it's local, it's yours.
              </p>
              <Link
                className="cta-btn cta-primary"
                to={isLoggedIn ? "/dashboard" : "/signup"}
                style={{ position: "relative", fontSize: "clamp(0.9rem, 2vw, 1.05rem)" }}
              >
                {isLoggedIn ? "Go to Dashboard" : "Join Naborly Free"} →
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          padding: "clamp(20px, 4vw, 32px) clamp(16px, 5vw, 48px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}>
          <div className="footer-inner">
            <span style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem",
              background: "linear-gradient(135deg, #fff 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Naborly</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}>
              © 2026 Naborly by Quincy Jabali
            </span>
            <div style={{ display: "flex", gap: "clamp(14px, 3vw, 24px)", flexWrap: "wrap", justifyContent: "center" }}>
              {["Privacy", "Terms", "Contact"].map(l => (
                <Link key={l} to="/" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>{l}</Link>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;