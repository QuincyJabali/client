// SellerInbox.jsx
// Replaces ChatDrawer in MyItems. Shows a list of all buyers who have
// messaged about this item, then opens a per-buyer thread.

import React, { useState, useEffect, useRef } from "react";

const Icon = ({ d, size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const SendIcon  = (p) => <Icon {...p} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />;
const CloseIcon = (p) => <Icon {...p} d="M18 6L6 18M6 6l12 12" />;
const BackIcon  = (p) => <Icon {...p} d="M19 12H5M5 12l7 7M5 12l7-7" />;
const ChatIcon  = (p) => <Icon {...p} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;

// key helpers
const chatKey    = (itemId, buyerId) => `naborly_chat_${itemId}_${buyerId}`;
const keyPrefix  = (itemId)          => `naborly_chat_${itemId}_`;

// scan localStorage for all buyer threads for this item
const getBuyerThreads = (itemId) => {
  const prefix = keyPrefix(itemId);
  const threads = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k?.startsWith(prefix)) continue;
    const buyerId = k.slice(prefix.length);
    try {
      const msgs = JSON.parse(localStorage.getItem(k) || "[]");
      if (msgs.length === 0) continue;
      const last    = msgs[msgs.length - 1];
      const unread  = msgs.filter(m => m.sender === "buyer" && !m.read).length;
      const buyerName = msgs.find(m => m.sender === "buyer")?.buyerName || `Buyer ${buyerId.slice(0, 6)}`;
      threads.push({ buyerId, buyerName, last, unread, msgs });
    } catch { /* skip */ }
  }
  return threads.sort((a, b) => (b.last?.id || 0) - (a.last?.id || 0));
};

// ── Avatars ──────────────────────────────────────────────────────────────────
const BuyerAvatar = ({ name, size = 32 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: "linear-gradient(135deg,#10b981,#059669)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Syne',sans-serif", fontWeight: 800,
    fontSize: size > 30 ? "0.8rem" : "0.6rem", color: "#fff", flexShrink: 0,
  }}>{(name || "B")[0].toUpperCase()}</div>
);

const SellerAvatar = ({ avatarUrl, initial, size = 26 }) => {
  const [err, setErr] = useState(false);
  if (avatarUrl && !err) return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "1.5px solid rgba(124,58,237,0.5)" }}>
      <img src={avatarUrl} onError={() => setErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
    </div>
  );
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "0.65rem", color: "#fff", flexShrink: 0 }}>{initial}</div>
  );
};

// ── Single message bubble ────────────────────────────────────────────────────
const Bubble = ({ msg, ownerInitial, ownerAvatarUrl, buyerName }) => {
  const isSeller = msg.sender === "seller";
  return (
    <div style={{ display: "flex", justifyContent: isSeller ? "flex-end" : "flex-start", marginBottom: "8px", animation: "bubbleIn 0.22s cubic-bezier(0.23,1,0.32,1) both" }}>
      {!isSeller && (
        <div style={{ marginRight: 7, alignSelf: "flex-end" }}>
          <BuyerAvatar name={buyerName} size={26} />
        </div>
      )}
      <div style={{ maxWidth: "75%" }}>
        <div style={{
          padding: "9px 13px",
          borderRadius: isSeller ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isSeller ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "rgba(255,255,255,0.08)",
          border: isSeller ? "none" : "1px solid rgba(255,255,255,0.1)",
          color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: "0.84rem", lineHeight: 1.55, wordBreak: "break-word",
        }}>{msg.text}</div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", color: "rgba(255,255,255,0.22)", marginTop: 3, textAlign: isSeller ? "right" : "left" }}>{msg.time}</div>
      </div>
      {isSeller && (
        <div style={{ marginLeft: 7, alignSelf: "flex-end" }}>
          <SellerAvatar avatarUrl={ownerAvatarUrl} initial={ownerInitial} />
        </div>
      )}
    </div>
  );
};

// ── Thread view (one buyer conversation) ─────────────────────────────────────
const ThreadView = ({ itemId, buyerId, buyerName, user, onBack }) => {
  const key          = chatKey(itemId, buyerId);
  const chatEndRef   = useRef(null);
  const inputRef     = useRef(null);
  const ownerInitial = (user?.username || "S")[0].toUpperCase();
  const ownerAvatarUrl = user?.avatar
    ? (user.avatar.startsWith("http") ? user.avatar : `https://quincyj.alwaysdata.net/static/images/${user.avatar}`)
    : null;

  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
  });
  const [reply, setReply] = useState("");

  // mark all as read on open
  useEffect(() => {
    setMessages(prev => {
      const updated = prev.map(m => ({ ...m, read: true }));
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // auto-scroll
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // poll for new buyer messages
  useEffect(() => {
    const id = setInterval(() => {
      try {
        const stored = JSON.parse(localStorage.getItem(key) || "[]");
        setMessages(prev => {
          if (stored.length > prev.length) {
            const readAll = stored.map(m => ({ ...m, read: true }));
            localStorage.setItem(key, JSON.stringify(readAll));
            return readAll;
          }
          return prev;
        });
      } catch { /* ignore */ }
    }, 1500);
    return () => clearInterval(id);
  }, [key]);

  const handleSend = () => {
    if (!reply.trim()) return;
    const msg = {
      id: Date.now(), sender: "seller",
      text: reply.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
    };
    setMessages(prev => {
      const next = [...prev, msg];
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
    setReply("");
    inputRef.current?.focus();
  };

  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(9,9,14,0.98)", borderRadius: "22px", display: "flex", flexDirection: "column", animation: "drawerUp 0.25s cubic-bezier(0.23,1,0.32,1) both", zIndex: 12, overflow: "hidden" }}>
      {/* header */}
      <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 6, color: "rgba(255,255,255,0.5)", cursor: "pointer", display: "flex" }}>
          <BackIcon size={13} />
        </button>
        <BuyerAvatar name={buyerName} size={34} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.84rem", color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{buyerName}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>Interested buyer</span>
          </div>
        </div>
      </div>

      {/* messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 6px" }} className="chat-scroll">
        {messages.length === 0 && (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, opacity: 0.4 }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", textAlign: "center" }}>No messages yet in this thread.</p>
          </div>
        )}
        {messages.map(msg => (
          <Bubble key={msg.id} msg={msg} ownerInitial={ownerInitial} ownerAvatarUrl={ownerAvatarUrl} buyerName={buyerName} />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* input */}
      <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 8, alignItems: "center", background: "rgba(255,255,255,0.02)", flexShrink: 0 }}>
        <input ref={inputRef} type="text" placeholder={`Reply to ${buyerName}…`} value={reply}
          onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
          style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px", padding: "9px 16px", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", outline: "none" }} />
        <button onClick={handleSend} disabled={!reply.trim()} style={{
          width: 36, height: 36, borderRadius: "50%", border: "none", flexShrink: 0, cursor: reply.trim() ? "pointer" : "not-allowed",
          background: reply.trim() ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "rgba(255,255,255,0.06)",
          color: reply.trim() ? "#fff" : "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: reply.trim() ? "0 0 14px rgba(124,58,237,0.4)" : "none", transition: "all 0.2s",
        }}><SendIcon size={13} /></button>
      </div>
    </div>
  );
};

// ── Inbox list (all buyer threads for one item) ───────────────────────────────
export const SellerInbox = ({ item, itemId, user, onClose }) => {
  const [threads, setThreads]     = useState(() => getBuyerThreads(itemId));
  const [activeThread, setActive] = useState(null); // { buyerId, buyerName }

  // poll for new threads or messages
  useEffect(() => {
    const id = setInterval(() => setThreads(getBuyerThreads(itemId)), 1500);
    return () => clearInterval(id);
  }, [itemId]);

  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(9,9,14,0.98)", backdropFilter: "blur(24px)", borderRadius: "22px", display: "flex", flexDirection: "column", animation: "drawerUp 0.3s cubic-bezier(0.23,1,0.32,1) both", zIndex: 10, overflow: "hidden" }}>
      {/* header */}
      <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }}>
          <img src={item.image_url || `https://quincyj.alwaysdata.net/static/images/${item.item_image}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.item_name}</p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", margin: "2px 0 0" }}>
            {threads.length === 0 ? "No enquiries yet" : `${threads.length} interested buyer${threads.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 6, color: "rgba(255,255,255,0.5)", cursor: "pointer", display: "flex" }}>
          <CloseIcon size={13} />
        </button>
      </div>

      {/* thread list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }} className="chat-scroll">
        {threads.length === 0 ? (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: 0.4, padding: "20px 0" }}>
            <ChatIcon size={28} color="rgba(255,255,255,0.3)" />
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", textAlign: "center", lineHeight: 1.5 }}>
              No buyers have messaged<br />about this item yet.
            </p>
          </div>
        ) : threads.map(t => (
          <button key={t.buyerId} onClick={() => setActive({ buyerId: t.buyerId, buyerName: t.buyerName })}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.04)", marginBottom: 8, cursor: "pointer", transition: "all 0.2s", textAlign: "left" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <BuyerAvatar name={t.buyerName} size={38} />
              {t.unread > 0 && (
                <span style={{ position: "absolute", top: -3, right: -3, width: 16, height: 16, borderRadius: "50%", background: "#f43f5e", border: "2px solid #08080c", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "0.55rem", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {t.unread > 9 ? "9+" : t.unread}
                </span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.buyerName}</p>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", flexShrink: 0, marginLeft: 8 }}>{t.last?.time || ""}</span>
              </div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.76rem", color: "rgba(255,255,255,0.4)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.last?.sender === "seller" ? "You: " : ""}{t.last?.text || ""}
              </p>
            </div>
            {t.unread > 0 && (
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a78bfa", flexShrink: 0 }} />
            )}
          </button>
        ))}
      </div>

      {/* thread drill-down */}
      {activeThread && (
        <ThreadView
          itemId={itemId}
          buyerId={activeThread.buyerId}
          buyerName={activeThread.buyerName}
          user={user}
          onBack={() => setActive(null)}
        />
      )}
    </div>
  );
};

// ── Hook: total unread count across ALL buyer threads for one item ─────────────
export const useUnreadCount = (itemId) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => {
      const threads = getBuyerThreads(itemId);
      setCount(threads.reduce((sum, t) => sum + t.unread, 0));
    };
    update();
    const id = setInterval(update, 1500);
    window.addEventListener("storage", update);
    return () => { clearInterval(id); window.removeEventListener("storage", update); };
  }, [itemId]);
  return count;
};
export default SellerInbox;