import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── Icons (inline SVG, no react-icons dep needed) ────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor", fill = "none", vb = "0 0 24 24" }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const EditIcon   = (p) => <Icon {...p} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />;
const SaveIcon   = (p) => <Icon {...p} d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8" />;
const CancelIcon = (p) => <Icon {...p} d="M18 6L6 18M6 6l12 12" />;
const TrashIcon  = (p) => <Icon {...p} d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />;
const BackIcon   = (p) => <Icon {...p} d="M19 12H5M12 5l-7 7 7 7" />;
const GridIcon   = (p) => <Icon {...p} d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />;
const StarIcon   = (p) => <Icon {...p} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />;

const Profile = () => {
  const navigate    = useNavigate();
  const fileRef     = useRef();
  const storedUser  = (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })();

  const [isEditing,    setIsEditing]    = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview,      setPreview]      = useState(null);
  const [saving,       setSaving]       = useState(false);
  const [saveError,    setSaveError]    = useState("");
  const [activeTab,    setActiveTab]    = useState("listings");
  const [formData, setFormData] = useState({
    user_id:  storedUser?.user_id,
    username: storedUser?.username || "",
    email:    storedUser?.email    || "",
  });

  const avatarSrc = preview
    || (storedUser?.profile_image
      ? `https://quincyj.alwaysdata.net/static/images/${storedUser.profile_image}`
      : null);

  const initials = (formData.username || "U")[0].toUpperCase();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const data = new FormData();
      data.append("user_id",  formData.user_id);
      data.append("username", formData.username);
      data.append("email",    formData.email);
      if (selectedFile) data.append("profile_image", selectedFile);

      const res = await fetch("https://quincyj.alwaysdata.net/api/update_profile", {
        method: "POST", body: data,
      });

      if (res.ok) {
        const result      = await res.json();
        const updatedUser = {
          ...storedUser, ...formData,
          profile_image: result.image_name || storedUser?.profile_image,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("userchange"));
        setIsEditing(false);
        setSelectedFile(null);
      } else {
        setSaveError("Update failed. Please try again.");
      }
    } catch {
      setSaveError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setPreview(null);
    setSaveError("");
    setFormData({
      user_id:  storedUser?.user_id,
      username: storedUser?.username || "",
      email:    storedUser?.email    || "",
    });
  };

  if (!storedUser) return (
    <div style={{ minHeight: "100vh", background: "#08080c", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", color: "rgba(255,255,255,0.4)" }}>Please sign in to view your profile.</p>
    </div>
  );

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #08080c; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }

        .prof-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .prof-input:focus {
          border-color: rgba(124,58,237,0.7);
          background: rgba(124,58,237,0.06);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
        }

        .tab-btn {
          flex: 1;
          padding: 10px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.82rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: color 0.2s;
          position: relative;
        }
        .tab-btn::after {
          content: '';
          position: absolute;
          bottom: 0; left: 20%; right: 20%;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg,#7c3aed,#a855f7);
          transform: scaleX(0);
          transition: transform 0.25s cubic-bezier(0.23,1,0.32,1);
        }
        .tab-btn.active::after { transform: scaleX(1); }

        .stat-pill:hover { background: rgba(124,58,237,0.15) !important; border-color: rgba(124,58,237,0.3) !important; }

        .action-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 22px;
          border-radius: 100px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-btn:hover { transform: translateY(-2px); }
        .action-btn:active { transform: translateY(0); }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#08080c", paddingBottom: "80px" }}>

        {/* ── Cover + Back ──────────────────────────────────────────────────── */}
        <div style={{ position: "relative", height: "220px" }}>
          {/* Gradient cover */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, #1a0a3e 0%, #0e1a3a 40%, #0a0a0e 100%)",
            overflow: "hidden",
          }}>
            {/* Decorative orbs on cover */}
            <div style={{
              position: "absolute", top: "-40%", right: "-5%",
              width: "50vw", height: "50vw", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 65%)",
            }} />
            <div style={{
              position: "absolute", bottom: "-30%", left: "10%",
              width: "35vw", height: "35vw", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 65%)",
            }} />
            {/* Subtle grid */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }} />
          </div>

          {/* Back button */}
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              position: "absolute", top: "16px", left: "16px",
              display: "flex", alignItems: "center", gap: "6px",
              background: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "100px", padding: "8px 16px 8px 12px",
              color: "rgba(255,255,255,0.8)", cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.82rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.55)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,0.35)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
          >
            <BackIcon size={14} /> Back
          </button>
        </div>

        {/* ── Avatar + Name block ───────────────────────────────────────────── */}
        <div style={{
          maxWidth: "600px", margin: "0 auto",
          padding: "0 20px",
          animation: "fadeUp 0.5s cubic-bezier(0.23,1,0.32,1) both",
        }}>
          {/* Avatar row */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: "-52px", marginBottom: "16px" }}>
            {/* Avatar */}
            <div style={{ position: "relative" }}>
              <div style={{
                width: "104px", height: "104px", borderRadius: "50%",
                border: "3px solid #08080c",
                background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
                cursor: isEditing ? "pointer" : "default",
              }}
                onClick={() => isEditing && fileRef.current?.click()}
              >
                {avatarSrc ? (
                  <img src={avatarSrc} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "2.2rem", color: "#fff" }}>{initials}</span>
                )}

                {/* Camera overlay when editing */}
                {isEditing && (
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "rgba(0,0,0,0.55)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px",
                    borderRadius: "50%",
                  }}>
                    <span style={{ fontSize: "1.4rem" }}>📷</span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", fontWeight: 600, color: "rgba(255,255,255,0.8)", letterSpacing: "0.05em" }}>CHANGE</span>
                  </div>
                )}
              </div>

              {/* Online dot */}
              <div style={{
                position: "absolute", bottom: "6px", right: "4px",
                width: "14px", height: "14px", borderRadius: "50%",
                background: "#22c55e", border: "2px solid #08080c",
              }} />

              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
            </div>

            {/* Edit / Save / Cancel buttons */}
            <div style={{ display: "flex", gap: "8px", paddingBottom: "4px" }}>
              {!isEditing ? (
                <button
                  className="action-btn"
                  onClick={() => setIsEditing(true)}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  <EditIcon size={14} /> Edit Profile
                </button>
              ) : (
                <>
                  <button
                    className="action-btn"
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      background: saving ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg,#7c3aed,#a855f7)",
                      border: "none", color: "#fff",
                      boxShadow: saving ? "none" : "0 0 24px rgba(124,58,237,0.4)",
                      opacity: saving ? 0.7 : 1,
                    }}
                  >
                    {saving
                      ? <span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                      : <SaveIcon size={14} />}
                    {saving ? "Saving…" : "Save"}
                  </button>
                  <button
                    className="action-btn"
                    onClick={cancelEdit}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    <CancelIcon size={14} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Name + email */}
          {!isEditing ? (
            <div style={{ marginBottom: "20px", animation: "scaleIn 0.4s ease both" }}>
              <h1 style={{
                fontFamily: "'Syne',sans-serif", fontWeight: 800,
                fontSize: "1.6rem", color: "#fff", letterSpacing: "-0.02em",
                marginBottom: "4px",
              }}>{formData.username}</h1>
              <p style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem",
                color: "rgba(255,255,255,0.4)", marginBottom: "10px",
              }}>{formData.email}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  padding: "4px 10px", borderRadius: "100px",
                  background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
                }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", fontWeight: 600, color: "#22c55e", letterSpacing: "0.04em" }}>ACTIVE</span>
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  padding: "4px 10px", borderRadius: "100px",
                  background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)",
                }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", fontWeight: 600, color: "#a78bfa", letterSpacing: "0.04em" }}>NABORLY MEMBER</span>
                </div>
              </div>
            </div>
          ) : (
            /* Edit fields */
            <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "12px", animation: "scaleIn 0.3s ease both" }}>
              {saveError && (
                <div style={{
                  padding: "10px 14px", borderRadius: "10px",
                  background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.25)",
                  fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", color: "#f43f5e",
                }}>⚠️ {saveError}</div>
              )}
              <div>
                <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "6px" }}>Username</label>
                <input className="prof-input" value={formData.username} onChange={e => setFormData(f => ({ ...f, username: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "6px" }}>Email</label>
                <input className="prof-input" type="email" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
          )}

          {/* ── Stats row ───────────────────────────────────────────────────── */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px",
            marginBottom: "28px",
          }}>
            {[
              { value: "12",  label: "Listings" },
              { value: "4.8", label: "Rating", icon: <StarIcon size={12} color="#fbbf24" fill="#fbbf24" /> },
              { value: "38",  label: "Neighbors" },
            ].map(({ value, label, icon }) => (
              <div
                key={label}
                className="stat-pill"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px", padding: "16px 12px",
                  textAlign: "center", cursor: "default",
                  transition: "background 0.2s, border-color 0.2s",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", marginBottom: "4px" }}>
                  {icon}
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#fff" }}>{value}</span>
                </div>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", fontWeight: 500, letterSpacing: "0.03em" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* ── Tabs ─────────────────────────────────────────────────────────── */}
          <div style={{
            display: "flex",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px 16px 0 0",
            overflow: "hidden", marginBottom: "0",
          }}>
            {[
              { key: "listings", label: "Listings", icon: <GridIcon size={13} /> },
              { key: "reviews",  label: "Reviews",  icon: <StarIcon  size={13} /> },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                className={`tab-btn ${activeTab === key ? "active" : ""}`}
                onClick={() => setActiveTab(key)}
                style={{ color: activeTab === key ? "#fff" : "rgba(255,255,255,0.35)" }}
              >
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  {icon} {label}
                </span>
              </button>
            ))}
          </div>

          {/* ── Tab content ──────────────────────────────────────────────────── */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderTop: "none",
            borderRadius: "0 0 16px 16px",
            padding: "24px",
            minHeight: "160px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {activeTab === "listings" ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "10px" }}>📦</div>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", marginBottom: "6px" }}>No listings yet</p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}>Your listed items will appear here</p>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "10px" }}>⭐</div>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", marginBottom: "6px" }}>No reviews yet</p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}>Reviews from your neighbors will show here</p>
              </div>
            )}
          </div>

          {/* ── Danger zone ──────────────────────────────────────────────────── */}
          <div style={{
            marginTop: "24px",
            padding: "20px",
            background: "rgba(244,63,94,0.04)",
            border: "1px solid rgba(244,63,94,0.15)",
            borderRadius: "16px",
          }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,63,94,0.5)", marginBottom: "12px" }}>Danger Zone</p>
            <button
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "transparent",
                border: "1px solid rgba(244,63,94,0.3)",
                borderRadius: "12px", padding: "11px 18px",
                color: "rgba(244,63,94,0.7)",
                fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.875rem",
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(244,63,94,0.08)"; e.currentTarget.style.color = "#f43f5e"; e.currentTarget.style.borderColor = "rgba(244,63,94,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(244,63,94,0.7)"; e.currentTarget.style.borderColor = "rgba(244,63,94,0.3)"; }}
            >
              <TrashIcon size={15} color="currentColor" /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;