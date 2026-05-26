import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// ── Inline SVG icons ──────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, color = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const HomeIcon     = (p) => <Icon {...p} d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />;
const ShopIcon     = (p) => <Icon {...p} d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />;
const PlusIcon     = (p) => <Icon {...p} d="M12 5v14M5 12h14" />;
const ListIcon     = (p) => <Icon {...p} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />;
const SettingsIcon = (p) => <Icon {...p} d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />;
const LogoutIcon   = (p) => <Icon {...p} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />;
const ChevronDown  = (p) => <Icon {...p} d="M6 9l6 6 6-6" />;
const MenuIcon     = (p) => <Icon {...p} d="M3 12h18M3 6h18M3 18h18" />;
const CloseIcon    = (p) => <Icon {...p} d="M18 6L6 18M6 6l12 12" />;

// ── Helper to safely read user from localStorage ──────────────────────────────
const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

// ── Nav link pill ─────────────────────────────────────────────────────────────
const NavPill = ({ to, icon, label, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: "7px",
      padding: "7px 16px",
      borderRadius: "100px",
      textDecoration: "none",
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 600,
      fontSize: "0.85rem",
      color: active ? "#fff" : "rgba(255,255,255,0.45)",
      background: active ? "rgba(124,58,237,0.2)" : "transparent",
      border: active ? "1px solid rgba(124,58,237,0.35)" : "1px solid transparent",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
    }}
    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = "rgba(255,255,255,0.8)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}}
    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.background = "transparent"; }}}
  >
    {icon}
    {label}
  </Link>
);

// ── Dropdown menu item ────────────────────────────────────────────────────────
const DropItem = ({ to, icon, label, onClick, danger }) => {
  const [hovered, setHovered] = useState(false);
  const inner = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "10px 14px",
        borderRadius: "10px",
        cursor: "pointer",
        background: hovered ? (danger ? "rgba(244,63,94,0.08)" : "rgba(255,255,255,0.06)") : "transparent",
        color: danger ? (hovered ? "#f43f5e" : "rgba(244,63,94,0.7)") : (hovered ? "#fff" : "rgba(255,255,255,0.55)"),
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 600,
        fontSize: "0.875rem",
        transition: "all 0.18s",
        textDecoration: "none",
      }}
    >
      {React.cloneElement(icon, { size: 15, color: "currentColor" })}
      {label}
    </div>
  );
  return to ? <Link to={to} style={{ textDecoration: "none" }}>{inner}</Link> : inner;
};

// ── Main Navbar ───────────────────────────────────────────────────────────────
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropRef  = useRef(null);

  // ✅ FIX: user is now reactive state, not a one-time computed value
  const [user,       setUser]       = useState(readUser);
  const [scrolled,   setScrolled]   = useState(false);
  const [dropOpen,   setDropOpen]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [imgError,   setImgError]   = useState(false);

  const isActive = (path) => location.pathname === path;

  // ✅ FIX: Re-read user on every route change (covers same-tab login/signup)
  useEffect(() => {
    const freshUser = readUser();
    setUser(freshUser);
    setImgError(false); // reset avatar error on user change
  }, [location.pathname]);

  // ✅ FIX: Also listen for cross-tab storage changes AND a custom "userchange"
  // event that your sign-in / sign-up pages should dispatch after saving to
  // localStorage:  window.dispatchEvent(new Event("userchange"));
  useEffect(() => {
    const handleChange = () => {
      setUser(readUser());
      setImgError(false);
    };
    window.addEventListener("storage",    handleChange); // cross-tab
    window.addEventListener("userchange", handleChange); // same-tab custom event
    return () => {
      window.removeEventListener("storage",    handleChange);
      window.removeEventListener("userchange", handleChange);
    };
  }, []);

  // Scroll shadow
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Close menus on navigation
  useEffect(() => { setMobileOpen(false); setDropOpen(false); }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setDropOpen(false);
    navigate("/signin");
  };

  const avatarUrl = user?.profile_image
    ? `https://quincyj.alwaysdata.net/static/images/${user.profile_image}`
    : null;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;600&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes dropDown {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 680px) {
          .nb-desktop { display: none !important; }
          .nb-hamburger { display: flex !important; }
        }
        @media (min-width: 681px) {
          .nb-hamburger { display: none !important; }
        }
      `}</style>

      {/* Sticky wrapper */}
      <div style={{
        position: "sticky", top: 0, zIndex: 200,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: scrolled ? "8px 16px" : "14px 16px",
        transition: "padding 0.35s ease",
        pointerEvents: "none",
      }}>

        {/* Pill navbar */}
        <nav style={{
          pointerEvents: "auto",
          width: "100%", maxWidth: "1100px",
          background: scrolled ? "rgba(8,8,12,0.95)" : "rgba(8,8,12,0.75)",
          backdropFilter: "blur(22px)",
          border: `1px solid ${scrolled ? "rgba(255,255,255,0.11)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: "100px",
          padding: "7px 10px 7px 18px",
          display: "flex", alignItems: "center", gap: "6px",
          boxShadow: scrolled ? "0 10px 44px rgba(0,0,0,0.55)" : "0 4px 20px rgba(0,0,0,0.3)",
          transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
        }}>

          {/* Brand */}
          <Link to="/" style={{ textDecoration: "none", flexShrink: 0, marginRight: "6px" }}>
            <span style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem",
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg,#fff 0%,#a78bfa 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Naborly</span>
          </Link>

          {/* Center nav — desktop only */}
          <div className="nb-desktop" style={{ display: "flex", alignItems: "center", gap: "2px", flex: 1, justifyContent: "center" }}>
            <NavPill to="/"          icon={<HomeIcon size={14} />} label="Home"  active={isActive("/")} />
            {user && <NavPill to="/dashboard" icon={<ShopIcon size={14} />} label="Shop" active={isActive("/dashboard")} />}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>

            {user ? (
              /* Avatar dropdown */
              <div ref={dropRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setDropOpen(o => !o)}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "4px 12px 4px 4px",
                    borderRadius: "100px",
                    border: `1px solid ${dropOpen ? "rgba(124,58,237,0.55)" : "rgba(255,255,255,0.12)"}`,
                    background: dropOpen ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.06)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: dropOpen ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
                  }}
                >
                  {/* Avatar circle */}
                  {avatarUrl && !imgError ? (
                    <img src={avatarUrl} alt="avatar" onError={() => setImgError(true)} style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      objectFit: "cover", border: "1px solid rgba(124,58,237,0.5)",
                    }} />
                  ) : (
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Syne',sans-serif", fontWeight: 800,
                      fontSize: "0.75rem", color: "#fff", flexShrink: 0,
                    }}>{(user.username || "U")[0].toUpperCase()}</div>
                  )}
                  <span style={{
                    fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.85rem",
                    color: "#fff", maxWidth: "90px",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{user.username}</span>
                  <span style={{ transition: "transform 0.2s", transform: dropOpen ? "rotate(180deg)" : "rotate(0)", display: "flex" }}>
                    <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
                  </span>
                </button>

                {/* Dropdown panel */}
                {dropOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 10px)", right: 0,
                    minWidth: "228px",
                    background: "rgba(11,11,17,0.98)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: "20px", padding: "8px",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.65)",
                    animation: "dropDown 0.22s cubic-bezier(0.23,1,0.32,1) both",
                    zIndex: 300,
                  }}>
                    {/* Account tag */}
                    <div style={{
                      padding: "11px 14px", marginBottom: "6px",
                      background: "rgba(124,58,237,0.08)",
                      border: "1px solid rgba(124,58,237,0.14)",
                      borderRadius: "12px",
                    }}>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", margin: "0 0 3px" }}>
                        Signed in as
                      </p>
                      <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.87rem", color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {user.email || user.username}
                      </p>
                    </div>

                    <DropItem to="/myitems"  icon={<ListIcon />}     label="My Listings" />
                    <DropItem to="/additem"  icon={<PlusIcon />}     label="Add New Item" />
                    <DropItem to="/profile"  icon={<SettingsIcon />} label="Account Settings" />

                    <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "6px 0" }} />
                    <DropItem icon={<LogoutIcon />} label="Log Out" onClick={logout} danger />
                  </div>
                )}
              </div>

            ) : (
              /* Guest buttons */
              <div className="nb-desktop" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Link to="/signin" style={{
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.5)", textDecoration: "none",
                  padding: "7px 14px", borderRadius: "100px",
                  transition: "color 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                >Sign In</Link>
                <Link to="/signup" style={{
                  fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.85rem",
                  color: "#fff", textDecoration: "none",
                  padding: "8px 20px", borderRadius: "100px",
                  background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                  boxShadow: "0 0 20px rgba(124,58,237,0.35)",
                  transition: "all 0.2s", whiteSpace: "nowrap",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(124,58,237,0.55)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(124,58,237,0.35)"; }}
                >Get Started</Link>
              </div>
            )}

            {/* Hamburger — mobile only */}
            <button
              className="nb-hamburger"
              onClick={() => setMobileOpen(o => !o)}
              style={{
                display: "none",
                alignItems: "center", justifyContent: "center",
                width: "36px", height: "36px", borderRadius: "10px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                cursor: "pointer", color: "#fff", flexShrink: 0,
              }}
            >
              {mobileOpen ? <CloseIcon size={16} /> : <MenuIcon size={16} />}
            </button>
          </div>
        </nav>

        {/* Mobile slide-down panel */}
        {mobileOpen && (
          <div style={{
            pointerEvents: "auto",
            width: "calc(100% - 32px)", maxWidth: "1100px",
            marginTop: "8px",
            background: "rgba(10,10,16,0.97)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "20px", padding: "12px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
            animation: "slideDown 0.25s cubic-bezier(0.23,1,0.32,1) both",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <NavPill to="/" icon={<HomeIcon size={15} />} label="Home" active={isActive("/")} onClick={() => setMobileOpen(false)} />
              {user && <NavPill to="/dashboard" icon={<ShopIcon size={15} />} label="Shop" active={isActive("/dashboard")} onClick={() => setMobileOpen(false)} />}

              {user && (
                <>
                  <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "6px 0" }} />
                  <DropItem to="/myitems"  icon={<ListIcon />}     label="My Listings" />
                  <DropItem to="/additem"  icon={<PlusIcon />}     label="Add New Item" />
                  <DropItem to="/profile"  icon={<SettingsIcon />} label="Account Settings" />
                  <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "6px 0" }} />
                  <DropItem icon={<LogoutIcon />} label="Log Out" onClick={logout} danger />
                </>
              )}

              {!user && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px" }}>
                  <Link to="/signin" onClick={() => setMobileOpen(false)} style={{
                    display: "block", textAlign: "center", padding: "12px",
                    borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.6)", textDecoration: "none",
                    fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.9rem",
                  }}>Sign In</Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} style={{
                    display: "block", textAlign: "center", padding: "12px",
                    borderRadius: "12px", background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                    color: "#fff", textDecoration: "none",
                    fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.9rem",
                  }}>Get Started</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;