import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// ── Background orbs ──────────────────────────────────────────────────────────
const OrbField = () => (
  <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    <div style={{
      position: "absolute", bottom: "-20%", right: "-10%",
      width: "58vw", height: "58vw", borderRadius: "50%",
      background: "radial-gradient(circle, rgba(124,58,237,0.28) 0%, transparent 70%)",
      animation: "orbA 18s ease-in-out infinite",
    }} />
    <div style={{
      position: "absolute", top: "-15%", left: "-8%",
      width: "45vw", height: "45vw", borderRadius: "50%",
      background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)",
      animation: "orbB 14s ease-in-out infinite",
    }} />
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
      backgroundSize: "56px 56px",
    }} />
  </div>
);

// ── Styled input with floating label ─────────────────────────────────────────
const Field = ({ label, type: initialType, placeholder, icon, value, onChange, error }) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = initialType === "password";
  const active = focused || value.length > 0;
  const type = isPassword ? (showPassword ? "text" : "password") : initialType;

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{
        position: "relative",
        background: focused ? "rgba(124,58,237,0.08)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${error ? "#f43f5e" : focused ? "rgba(124,58,237,0.7)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: "14px",
        transition: "all 0.25s ease",
        boxShadow: focused ? "0 0 0 3px rgba(124,58,237,0.15)" : "none",
      }}>
        <label style={{
          position: "absolute",
          left: "48px",
          top: active ? "8px" : "50%",
          transform: active ? "translateY(0)" : "translateY(-50%)",
          fontSize: active ? "0.68rem" : "0.9rem",
          color: error ? "#f43f5e" : focused ? "#a78bfa" : "rgba(255,255,255,0.35)",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          letterSpacing: active ? "0.06em" : "0",
          textTransform: active ? "uppercase" : "none",
          transition: "all 0.2s ease",
          pointerEvents: "none",
        }}>{label}</label>

        <span style={{
          position: "absolute", left: "16px", top: "50%",
          transform: "translateY(-50%)", fontSize: "1rem",
          opacity: focused ? 1 : 0.4, transition: "opacity 0.2s",
        }}>{icon}</span>

        <input
          type={type}
          placeholder={active ? placeholder : ""}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", background: "transparent", border: "none", outline: "none",
            padding: active ? "26px 44px 10px 48px" : "18px 44px 18px 48px",
            color: "#fff", fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.95rem", transition: "padding 0.2s",
          }}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(s => !s)}
            style={{
              position: "absolute", right: "14px", top: "50%",
              transform: "translateY(-50%)", background: "none", border: "none",
              cursor: "pointer", fontSize: "0.85rem",
              color: "rgba(255,255,255,0.35)", padding: "4px", transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#a78bfa"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>

      {error && (
        <p style={{
          fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem",
          color: "#f43f5e", marginTop: "6px", marginLeft: "4px",
          animation: "shake 0.3s ease",
        }}>{error}</p>
      )}
    </div>
  );
};

// ── Main SignIn Component ─────────────────────────────────────────────────────
const SignIn = () => {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [apiError, setApiError]     = useState("");
  const navigate = useNavigate();

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email.includes("@")) e.email = "Enter a valid email address";
    if (form.password.length < 6)  e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = async () => {
    setApiError("");
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      const user_data = new FormData();
      user_data.append("email", form.email);
      user_data.append("password", form.password);

      const response = await axios.post("https://quincyj.alwaysdata.net/api/signin", user_data);

      if (response.data.user) {
        // ✅ Save to localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
        // ✅ Notify Navbar immediately
        window.dispatchEvent(new Event("userchange"));
        setSuccess(true);
        setTimeout(() => navigate("/"), 1800);
      } else {
        setApiError(response.data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setApiError(err.response?.data?.message || "Server connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;600&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #08080c; }
        @keyframes orbA {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-5%,4%) scale(1.05); }
        }
        @keyframes orbB {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(4%,-5%) scale(1.04); }
        }
        @keyframes formReveal {
          from { opacity: 0; transform: translateY(28px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-6px); }
          75%      { transform: translateX(6px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes successPop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #0f0f18 inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#08080c",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 16px", position: "relative",
      }}>
        <OrbField />

        {/* Card */}
        <div style={{
          position: "relative", zIndex: 1,
          width: "100%", maxWidth: "440px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: "28px", padding: "44px 40px",
          backdropFilter: "blur(24px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
          animation: "formReveal 0.65s cubic-bezier(0.23,1,0.32,1) both",
        }}>
          {/* Top accent line */}
          <div style={{
            position: "absolute", top: 0, left: "20%", right: "20%", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(236,72,153,0.8), transparent)",
            borderRadius: "100px",
          }} />

          {!success ? (
            <>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "36px" }}>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <span style={{
                    fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.5rem",
                    background: "linear-gradient(135deg,#fff 0%,#a78bfa 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    display: "block", marginBottom: "20px",
                  }}>Naborly</span>
                </Link>
                <h1 style={{
                  fontFamily: "'Syne',sans-serif", fontWeight: 800,
                  fontSize: "1.9rem", letterSpacing: "-0.03em",
                  color: "#fff", marginBottom: "8px",
                }}>Welcome back</h1>
                <p style={{ fontFamily: "'DM Sans',sans-serif", color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>
                  No account yet?{" "}
                  <Link to="/signup" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 600 }}>
                    Sign up free →
                  </Link>
                </p>
              </div>

              {/* API error banner */}
              {apiError && (
                <div style={{
                  background: "rgba(244,63,94,0.1)",
                  border: "1px solid rgba(244,63,94,0.3)",
                  borderRadius: "12px", padding: "12px 16px",
                  marginBottom: "20px",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "0.85rem", color: "#f43f5e",
                  animation: "shake 0.3s ease",
                }}>⚠️ {apiError}</div>
              )}

              {/* Fields */}
              <div onKeyDown={handleKeyDown}>
                <Field
                  label="Email" type="email" placeholder="you@example.com" icon="✉️"
                  value={form.email} onChange={set("email")} error={errors.email}
                />
                <Field
                  label="Password" type="password" placeholder="Your password" icon="🔒"
                  value={form.password} onChange={set("password")} error={errors.password}
                />
              </div>

              {/* Remember me + Forgot */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: "28px", marginTop: "4px",
              }}>
                <label style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                  fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", userSelect: "none",
                }}>
                  <div
                    onClick={() => setRememberMe(r => !r)}
                    style={{
                      width: "18px", height: "18px", borderRadius: "5px",
                      border: `1px solid ${rememberMe ? "#7c3aed" : "rgba(255,255,255,0.2)"}`,
                      background: rememberMe ? "rgba(124,58,237,0.4)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s", fontSize: "0.65rem", color: "#fff",
                    }}
                  >{rememberMe ? "✓" : ""}</div>
                  Remember me
                </label>
                <Link to="/forgot-password" style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem",
                  color: "rgba(167,139,250,0.7)", textDecoration: "none", transition: "color 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.color = "#a78bfa"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(167,139,250,0.7)"}
                >Forgot password?</Link>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: "100%", padding: "15px", border: "none", borderRadius: "14px",
                  background: loading ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg, #7c3aed, #a855f7)",
                  color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700,
                  fontSize: "1rem", letterSpacing: "0.02em",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 0 36px rgba(124,58,237,0.45)",
                  transition: "all 0.3s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: "18px", height: "18px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff", borderRadius: "50%",
                      display: "inline-block", animation: "spin 0.7s linear infinite",
                    }} />
                    Signing you in…
                  </>
                ) : "Sign In →"}
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>OR</span>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
              </div>

              {/* Google */}
              <button
                style={{
                  width: "100%", padding: "13px",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px",
                  background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.75)",
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.9rem",
                  cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "10px",
                  transition: "background 0.2s, border-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.27 9.76A7.08 7.08 0 0 1 19.07 12c0 .68-.09 1.35-.27 1.99H12v-3.71h7.41A7.1 7.1 0 0 0 12 4.92a7.08 7.08 0 0 0-6.73 4.84z"/>
                  <path fill="#FBBC05" d="M5.27 9.76l-3.54-2.7A11.97 11.97 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l3.55-2.75A7.06 7.06 0 0 1 4.92 12c0-.77.13-1.52.35-2.24z"/>
                  <path fill="#34A853" d="M12 19.08a7.07 7.07 0 0 1-6.17-3.44l-3.55 2.75A11.97 11.97 0 0 0 12 24c3.18 0 5.86-1.17 7.83-3.07l-3.39-2.63A7.08 7.08 0 0 1 12 19.08z"/>
                  <path fill="#4285F4" d="M19.45 13.99l3.39 2.63A11.97 11.97 0 0 0 24 12c0-1.93-.48-3.75-1.32-5.35l-3.61 2.8c.24.82.37 1.67.37 2.55 0 .68-.09 1.35-.27 1.99h.28z"/>
                </svg>
                Continue with Google
              </button>
            </>
          ) : (
            // ── Success state ────────────────────────────────────────────────
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{
                width: "80px", height: "80px", borderRadius: "50%",
                background: "rgba(124,58,237,0.15)",
                border: "1px solid rgba(124,58,237,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2rem", margin: "0 auto 24px",
                animation: "successPop 0.5s cubic-bezier(0.23,1,0.32,1) both",
              }}>👋</div>
              <h2 style={{
                fontFamily: "'Syne',sans-serif", fontWeight: 800,
                fontSize: "1.6rem", color: "#fff", marginBottom: "12px",
              }}>You're back!</h2>
              <p style={{
                fontFamily: "'DM Sans',sans-serif", color: "rgba(255,255,255,0.45)",
                marginBottom: "32px", lineHeight: 1.6, fontSize: "0.9rem",
              }}>
                Signed in as <strong style={{ color: "rgba(255,255,255,0.75)" }}>{form.email}</strong>.<br />
                Your neighborhood is waiting.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <span style={{
                  width: "16px", height: "16px",
                  border: "2px solid rgba(167,139,250,0.4)",
                  borderTopColor: "#a78bfa", borderRadius: "50%",
                  display: "inline-block", animation: "spin 0.7s linear infinite",
                }} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>
                  Redirecting you…
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SignIn;