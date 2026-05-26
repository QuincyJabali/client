import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ─── Tiny icon components ────────────────────────────────────────────────────
const Icon = ({ d, size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const ArrowLeft = (p) => <Icon {...p} d="M19 12H5M5 12l7 7M5 12l7-7" />;

const ShieldCheck = (p) => (
  <Icon {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
);

const ChatBubble = (p) => (
  <Icon
    {...p}
    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
  />
);

const SendIcon = (p) => (
  <Icon {...p} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
);

const TruckIcon = (p) => (
  <Icon
    {...p}
    d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
  />
);

const WalkIcon = (p) => (
  <Icon
    {...p}
    d="M13 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0M6 20l4-8 3 3 3-6M6 20h4M13 7l-2 5h5"
  />
);

const AlertIcon = (p) => (
  <Icon
    {...p}
    d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"
  />
);

const CheckIcon = (p) => <Icon {...p} d="M20 6L9 17l-5-5" />;

// ─── Toast ───────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, visible }) => (
  <div
    style={{
      position: "fixed",
      bottom: "28px",
      left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : "20px"})`,
      opacity: visible ? 1 : 0,
      transition: "all 0.35s ease",
      zIndex: 999,
      background:
        type === "success"
          ? "rgba(16,185,129,0.15)"
          : "rgba(244,63,94,0.15)",
      border:
        type === "success"
          ? "1px solid rgba(16,185,129,0.4)"
          : "1px solid rgba(244,63,94,0.4)",
      color: type === "success" ? "#10b981" : "#f43f5e",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderRadius: "100px",
      padding: "12px 24px",
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 600,
      fontSize: "0.9rem",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
    }}
  >
    {type === "success" ? <CheckIcon size={14} /> : <AlertIcon size={14} />}
    {msg}
  </div>
);

// ─── Seller Avatar ───────────────────────────────────────────────────────────
const SellerAvatar = ({
  avatarUrl,
  username,
  size = 36,
  fontSize = "0.85rem",
}) => {
  const [imgError, setImgError] = useState(false);

  const initial = (username || "S")[0].toUpperCase();

  if (avatarUrl && !imgError) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
          border: "2px solid rgba(124,58,237,0.45)",
          boxShadow: "0 0 20px rgba(124,58,237,0.25)",
        }}
      >
        <img
          src={avatarUrl}
          alt={username}
          onError={() => setImgError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#7c3aed,#a855f7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Syne',sans-serif",
        fontWeight: 800,
        fontSize,
        color: "#fff",
        boxShadow: "0 0 24px rgba(124,58,237,0.35)",
      }}
    >
      {initial}
    </div>
  );
};

// ─── Bubble ──────────────────────────────────────────────────────────────────
const Bubble = ({
  msg,
  sellerAvatarUrl,
  sellerUsername,
  buyerInitial,
}) => {
  const isBuyer = msg.sender === "buyer";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isBuyer ? "flex-end" : "flex-start",
        marginBottom: "14px",
      }}
    >
      {!isBuyer && (
        <div style={{ marginRight: "8px" }}>
          <SellerAvatar
            avatarUrl={sellerAvatarUrl}
            username={sellerUsername}
            size={28}
            fontSize="0.65rem"
          />
        </div>
      )}

      <div style={{ maxWidth: "75%" }}>
        <div
          style={{
            padding: "12px 16px",
            borderRadius: isBuyer
              ? "18px 18px 4px 18px"
              : "18px 18px 18px 4px",
            background: isBuyer
              ? "linear-gradient(135deg,#7c3aed,#a855f7)"
              : "rgba(255,255,255,0.06)",
            color: "#fff",
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "0.88rem",
            border: isBuyer
              ? "none"
              : "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          {msg.text}
        </div>

        <div
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "0.65rem",
            color: "rgba(255,255,255,0.28)",
            marginTop: "4px",
            textAlign: isBuyer ? "right" : "left",
          }}
        >
          {msg.time}
        </div>
      </div>

      {isBuyer && (
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "linear-gradient(135deg,#10b981,#059669)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Syne',sans-serif",
            fontWeight: 800,
            fontSize: "0.65rem",
            color: "#fff",
            marginLeft: "8px",
          }}
        >
          {buyerInitial}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product;
  const productId = product?.item_id || product?.id;

  // ─── Buyer ────────────────────────────────────────────────────────────────
  const buyer = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const buyerId = buyer?.user_id || buyer?.id || "guest";
  const buyerInitial = (buyer?.username || "B")[0].toUpperCase();

  // ─── Chat key ─────────────────────────────────────────────────────────────
  const chatKey = `naborly_chat_${productId}_${buyerId}`;

  // ─── Seller ───────────────────────────────────────────────────────────────
  const sellerUsername =
    product?.seller_username || product?.seller_name || "Seller";

  const sellerAvatarUrl = product?.seller_avatar
    ? product.seller_avatar.startsWith("http")
      ? product.seller_avatar
      : `https://quincyj.alwaysdata.net/static/images/${product.seller_avatar}`
    : null;

  // ─── State ────────────────────────────────────────────────────────────────
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [toast, setToast] = useState({
    msg: "",
    type: "success",
    visible: false,
  });

  const [chatHistory, setChatHistory] = useState(() => {
    if (!productId) return [];

    try {
      const saved = localStorage.getItem(chatKey);

      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}

    return [
      {
        id: 1,
        sender: "seller",
        text: `Hi! I see you're interested in the ${product?.item_name}.`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];
  });

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // ─── Save chat ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (productId) {
      localStorage.setItem(chatKey, JSON.stringify(chatHistory));
    }
  }, [chatHistory, chatKey, productId]);

  // ─── Scroll ───────────────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatHistory]);

  // ─── Poll for updates ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!productId) return;

    const interval = setInterval(() => {
      try {
        const saved = localStorage.getItem(chatKey);

        if (!saved) return;

        const stored = JSON.parse(saved);

        setChatHistory((prev) => {
          if (JSON.stringify(stored) !== JSON.stringify(prev)) {
            return stored;
          }

          return prev;
        });
      } catch {}
    }, 1500);

    return () => clearInterval(interval);
  }, [chatKey, productId]);

  // ─── Toast ────────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({
      msg,
      type,
      visible: true,
    });

    setTimeout(() => {
      setToast((t) => ({
        ...t,
        visible: false,
      }));
    }, 3000);
  };

  // ─── Send message ─────────────────────────────────────────────────────────
  const handleSend = (e) => {
    e?.preventDefault();

    if (!message.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "buyer",
      buyerId,
      buyerName: buyer?.username || "Buyer",
      buyerInitial,
      text: message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
    };

    setChatHistory((prev) => [...prev, userMsg]);

    setMessage("");

    inputRef.current?.focus();
  };

  // ─── Payment ──────────────────────────────────────────────────────────────
  const handleAction = () => {
    if (deliveryMethod === "pickup") {
      showToast("Pickup order confirmed!", "success");
      return;
    }

    if (!phone.trim()) {
      showToast("Please enter your M-Pesa number.", "error");
      return;
    }

    showToast("STK Push sent!", "success");
  };

  // ─── Guard ────────────────────────────────────────────────────────────────
  if (!product) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#050507",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        No product selected.
      </div>
    );
  }

  const imageUrl =
    product.image_url ||
    `https://quincyj.alwaysdata.net/static/images/${product.item_image}`;

  const cost = (
    product.item_cost ||
    product.cost ||
    0
  ).toLocaleString();

  return (
    <>
      <Toast
        msg={toast.msg}
        type={toast.type}
        visible={toast.visible}
      />

      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top left, rgba(124,58,237,0.22), transparent 30%), radial-gradient(circle at bottom right, rgba(168,85,247,0.16), transparent 25%), #050507",
          color: "#fff",
          paddingBottom: "50px",
        }}
      >
        {/* NAV */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            background: "rgba(8,8,12,0.72)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              width: "46px",
              height: "46px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
              borderRadius: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(12px)",
            }}
          >
            <ArrowLeft size={18} />
          </button>

          <h2
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              fontSize: "1.4rem",
              letterSpacing: "-0.5px",
            }}
          >
            Naborly
          </h2>
        </div>

        {/* MAIN */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "40px 20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
            gap: "28px",
          }}
        >
          {/* LEFT */}
          <div>
            <div
              style={{
                borderRadius: "30px",
                overflow: "hidden",
                marginBottom: "22px",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              }}
            >
              <img
                src={imageUrl}
                alt={product.item_name}
                style={{
                  width: "100%",
                  height: "420px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "28px",
                padding: "28px",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "22px",
                }}
              >
                <SellerAvatar
                  avatarUrl={sellerAvatarUrl}
                  username={sellerUsername}
                  size={64}
                  fontSize="1.2rem"
                />

                <div>
                  <h3
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      fontWeight: 800,
                      marginBottom: "6px",
                    }}
                  >
                    {sellerUsername}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <ShieldCheck size={13} color="#10b981" />

                    <span
                      style={{
                        color: "#10b981",
                        fontSize: "0.78rem",
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    >
                      Verified Seller
                    </span>
                  </div>
                </div>
              </div>

              <h1
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 800,
                  fontSize: "1.8rem",
                  marginBottom: "14px",
                  lineHeight: 1.2,
                }}
              >
                {product.item_name}
              </h1>

              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  color: "rgba(255,255,255,0.62)",
                  lineHeight: 1.8,
                  fontSize: "0.96rem",
                }}
              >
                {product.item_description}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* CHECKOUT */}
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "28px",
                padding: "28px",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "28px",
                }}
              >
                <div>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "'DM Sans',sans-serif",
                      marginBottom: "6px",
                    }}
                  >
                    Total Amount
                  </p>

                  <h2
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      fontWeight: 800,
                      fontSize: "2rem",
                    }}
                  >
                    KES {cost}
                  </h2>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "14px",
                  marginBottom: "22px",
                }}
              >
                <button
                  onClick={() => setDeliveryMethod("delivery")}
                  style={{
                    padding: "18px",
                    borderRadius: "18px",
                    border:
                      deliveryMethod === "delivery"
                        ? "1px solid rgba(168,85,247,0.4)"
                        : "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer",
                    background:
                      deliveryMethod === "delivery"
                        ? "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.2))"
                        : "rgba(255,255,255,0.04)",
                    color: "#fff",
                    transition: "0.25s ease",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <TruckIcon size={20} />
                    <span
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                      }}
                    >
                      Delivery
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setDeliveryMethod("pickup")}
                  style={{
                    padding: "18px",
                    borderRadius: "18px",
                    border:
                      deliveryMethod === "pickup"
                        ? "1px solid rgba(168,85,247,0.4)"
                        : "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer",
                    background:
                      deliveryMethod === "pickup"
                        ? "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.2))"
                        : "rgba(255,255,255,0.04)",
                    color: "#fff",
                    transition: "0.25s ease",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <WalkIcon size={20} />
                    <span
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                      }}
                    >
                      Pickup
                    </span>
                  </div>
                </button>
              </div>

              {deliveryMethod === "delivery" && (
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "10px",
                      color: "rgba(255,255,255,0.65)",
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.88rem",
                    }}
                  >
                    M-Pesa Phone Number
                  </label>

                  <input
                    type="tel"
                    placeholder="0712 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "16px 18px",
                      borderRadius: "16px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.05)",
                      color: "#fff",
                      outline: "none",
                      fontSize: "0.95rem",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                </div>
              )}

              <button
                onClick={handleAction}
                style={{
                  width: "100%",
                  padding: "18px",
                  borderRadius: "18px",
                  border: "none",
                  background:
                    "linear-gradient(135deg,#7c3aed,#a855f7)",
                  color: "#fff",
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 12px 35px rgba(124,58,237,0.4)",
                }}
              >
                {deliveryMethod === "pickup"
                  ? "Confirm Pickup"
                  : "Pay via M-Pesa"}
              </button>
            </div>

            {/* CHAT */}
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "28px",
                overflow: "hidden",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              }}
            >
              {/* CHAT HEADER */}
              <div
                style={{
                  padding: "18px 22px",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <SellerAvatar
                  avatarUrl={sellerAvatarUrl}
                  username={sellerUsername}
                  size={42}
                />

                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      fontWeight: 700,
                      marginBottom: "4px",
                    }}
                  >
                    {sellerUsername}
                  </p>

                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#10b981",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    Active now
                  </span>
                </div>

                <ChatBubble size={18} color="rgba(255,255,255,0.4)" />
              </div>

              {/* MESSAGES */}
              <div
                style={{
                  height: "300px",
                  overflowY: "auto",
                  padding: "18px",
                }}
              >
                {chatHistory.map((msg) => (
                  <Bubble
                    key={msg.id}
                    msg={msg}
                    sellerAvatarUrl={sellerAvatarUrl}
                    sellerUsername={sellerUsername}
                    buyerInitial={buyerInitial}
                  />
                ))}

                <div ref={chatEndRef} />
              </div>

              {/* INPUT */}
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  padding: "14px",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Message seller..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSend(e)
                  }
                  style={{
                    flex: 1,
                    borderRadius: "100px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.05)",
                    color: "#fff",
                    padding: "14px 18px",
                    outline: "none",
                    fontSize: "0.9rem",
                  }}
                />

                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                    background: message.trim()
                      ? "linear-gradient(135deg,#7c3aed,#a855f7)"
                      : "rgba(255,255,255,0.06)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "0.2s ease",
                  }}
                >
                  <SendIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;