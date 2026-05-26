import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import SellerInbox from "./SellerInbox";

/* ─────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────── */

const Icon = ({ d, size = 16, color = "currentColor", fill = "none" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <path d={d} />
  </svg>
);

const EditIcon = (p) => (
  <Icon
    {...p}
    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
  />
);

const TrashIcon = (p) => (
  <Icon
    {...p}
    d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"
  />
);

const ChatIcon = (p) => (
  <Icon
    {...p}
    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
  />
);

const CheckIcon = (p) => (
  <Icon {...p} d="M20 6L9 17l-5-5" />
);

const BoxIcon = (p) => (
  <Icon
    {...p}
    d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
  />
);

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */

const safeJSONParse = (value, fallback = []) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const imageFallback =
  "https://via.placeholder.com/500x350/111111/444444?text=No+Image";

/* ─────────────────────────────────────────────────────────────
   BACKGROUND
───────────────────────────────────────────────────────────── */

const OrbField = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 0,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "-20%",
        right: "-10%",
        width: "60vw",
        height: "60vw",
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)",
        animation: "orbA 16s ease-in-out infinite",
      }}
    />

    <div
      style={{
        position: "absolute",
        bottom: "-15%",
        left: "-10%",
        width: "55vw",
        height: "55vw",
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
        animation: "orbB 20s ease-in-out infinite",
      }}
    />
  </div>
);

/* ─────────────────────────────────────────────────────────────
   UNREAD HOOK
───────────────────────────────────────────────────────────── */

const useUnreadCount = (itemId) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateUnread = () => {
      const prefix = `naborly_chat_${itemId}_`;

      let total = 0;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (!key?.startsWith(prefix)) continue;

        const messages = safeJSONParse(
          localStorage.getItem(key),
          []
        );

        total += messages.filter(
          (m) => m.sender === "buyer" && !m.read
        ).length;
      }

      setCount(total);
    };

    updateUnread();

    window.addEventListener("storage", updateUnread);

    return () => {
      window.removeEventListener("storage", updateUnread);
    };
  }, [itemId]);

  return count;
};

/* ─────────────────────────────────────────────────────────────
   ITEM CARD
───────────────────────────────────────────────────────────── */

const ItemCard = ({
  item,
  onEdit,
  onDelete,
  onMarkSold,
}) => {
  const id = item?.item_id || item?.id;

  const unread = useUnreadCount(id);

  const [chatOpen, setChatOpen] = useState(false);

  const isSold = item?.status === "Sold";

  const imageUrl =
    item?.image_url ||
    `https://quincyj.alwaysdata.net/static/images/${item?.item_image}`;

  return (
    <div className="item-card" style={styles.card}>
      {/* IMAGE */}

      <div style={styles.imageWrapper}>
        <img
          src={imageUrl}
          alt={item?.item_name}
          style={styles.image}
          onError={(e) => {
            e.target.src = imageFallback;
          }}
        />

        <div style={styles.overlay} />

        {/* STATUS */}

        <span
          style={{
            ...styles.status,
            background: isSold
              ? "rgba(17,17,17,0.85)"
              : "rgba(16,185,129,0.2)",
            color: isSold
              ? "rgba(255,255,255,0.45)"
              : "#10b981",
          }}
        >
          {isSold ? "Sold" : "Available"}
        </span>

        {/* CATEGORY */}

        <span style={styles.category}>
          {item?.item_category}
        </span>

        {/* CHAT BADGE */}

       
        <button
  style={styles.chatButton}
  onClick={() => setChatOpen(true)}
>
  <ChatIcon size={14} />

  {unread > 0 && (
    <span style={styles.unreadBadge}>
      {unread > 9 ? "9+" : unread}
    </span>
  )}
</button>

      </div>

      {/* BODY */}

      <div style={styles.body}>
        <h3 style={styles.title}>
          {item?.item_name}
        </h3>

        <p style={styles.price}>
          <span style={{ fontSize: "0.7rem" }}>
            KES
          </span>{" "}
          {Number(item?.item_cost || 0).toLocaleString()}
        </p>

        {/* BUTTONS */}

        <div style={styles.buttonColumn}>
          {/* {!isSold && (
            <button
              style={styles.primaryButton}
              onClick={() => onMarkSold(id)}
            >
              <CheckIcon size={13} />
              Mark as Sold
            </button>
          )} */}
          <button
  style={{
    ...styles.primaryButton,
    background: isSold
      ? "rgba(255,255,255,0.08)"
      : "linear-gradient(135deg,#7c3aed,#a855f7)",
  }}
  onClick={() => onMarkSold(id)}
>
  <CheckIcon size={13} />

  {isSold ? "Mark as Available" : "Mark as Sold"}
</button>

          <div style={styles.buttonRow}>
            <button
              style={styles.secondaryButton}
              onClick={() => onEdit(item)}
            >
              <EditIcon size={13} />
              Edit
            </button>

            <button
              style={styles.deleteButton}
              onClick={() => onDelete(id)}
            >
              <TrashIcon size={13} />
              Delete
            </button>
          </div>
        </div>
      </div>
      {chatOpen && (
  <SellerInbox
    item={item}
    itemId={id}
    onClose={() => setChatOpen(false)}
  />
)}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */

const MyItems = () => {
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const navigate = useNavigate();

  const user = useMemo(() => {
    return safeJSONParse(
      localStorage.getItem("user"),
      null
    );
  }, []);

  const fetchItems = useCallback(async () => {
    const userId = user?.user_id || user?.id;

    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://quincyj.alwaysdata.net/api/my_items/${userId}`
      );

      setItems(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(error);

      setErrorMessage(
        "Failed to load your inventory."
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  /* DELETE */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this item?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://quincyj.alwaysdata.net/api/delete_item/${id}`
      );

      setItems((prev) =>
        prev.filter(
          (item) =>
            (item.item_id || item.id) !== id
        )
      );
    } catch {
      alert("Delete failed");
    }
  };

  /* EDIT */

  const handleEdit = (item) => {
    navigate("/additem", {
      state: { item },
    });
  };

  /* SOLD */

  // const handleMarkSold = async (id) => {
  //   try {
  //     const response = await fetch(
  //       `https://quincyj.alwaysdata.net/api/mark_as_sold/${id}`,
  //       {
  //         method: "POST",
  //       }
  //     );

  //     if (response.ok) {
  //       setItems((prev) =>
  //         prev.map((item) =>
  //           (item.item_id || item.id) === id
  //             ? {
  //                 ...item,
  //                 status: "Sold",
  //               }
  //             : item
  //         )
  //       );
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const handleToggleSold = async (id) => {
  const currentItem = items.find(
    (item) => (item.item_id || item.id) === id
  );

  if (!currentItem) return;

  const newStatus =
    currentItem.status === "Sold"
      ? "Available"
      : "Sold";

  try {
    const response = await fetch(
      `https://quincyj.alwaysdata.net/api/mark_as_sold/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );

    if (response.ok) {
      setItems((prev) =>
        prev.map((item) =>
          (item.item_id || item.id) === id
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );
    }
  } catch (error) {
    console.error(error);
  }
};

  /* NO USER */

  if (!user) {
    return (
      <div style={styles.authWrapper}>
        <Navbar />

        <div style={styles.authContent}>
          <BoxIcon
            size={48}
            color="rgba(255,255,255,0.2)"
          />

          <h2 style={styles.authTitle}>
            Sign in to see your inventory
          </h2>

          <Link to="/signin" style={styles.signInBtn}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />

      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #08080c;
          color: white;
          font-family: 'DM Sans', sans-serif;
        }

        @keyframes orbA {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-5%,5%) scale(1.04); }
        }

        @keyframes orbB {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(5%,-5%) scale(1.03); }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .inventory-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px,1fr));
          gap: 24px;
        }

        @media (max-width: 640px) {
          .inventory-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div style={styles.page}>
        <OrbField />

        <Navbar />

        <div style={styles.container}>
          {/* HEADER */}

          <div style={styles.header}>
            <div>
              <h1 style={styles.pageTitle}>
                My{" "}
                <span style={styles.gradientText}>
                  Inventory
                </span>
              </h1>

              <p style={styles.subtitle}>
                Manage your listings easily
              </p>
            </div>

            <Link
              to="/additem"
              style={styles.addButton}
            >
              + Add Item
            </Link>
          </div>

          {/* ERROR */}

          {errorMessage && (
            <div style={styles.errorBox}>
              ⚠️ {errorMessage}
            </div>
          )}

          {/* LOADING */}

          {loading ? (
            <div style={styles.loadingWrapper}>
              <span style={styles.loader} />

              <p style={styles.loadingText}>
                Loading your inventory...
              </p>
            </div>
          ) : items.length > 0 ? (
            <div className="inventory-grid">
              {items.map((item) => (
                <ItemCard
                  key={`${item.item_id || item.id}`}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onMarkSold={handleToggleSold}
                />
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <BoxIcon
                size={32}
                color="#a78bfa"
              />

              <h3 style={styles.emptyTitle}>
                No items yet
              </h3>

              <p style={styles.emptyText}>
                Start by adding your first item.
              </p>

              <Link
                to="/additem"
                style={styles.addButton}
              >
                + Add Your First Item
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#08080c",
    paddingBottom: "60px",
  },

  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 20px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "40px",
    flexWrap: "wrap",
  },

  pageTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "2rem",
    fontWeight: 800,
    margin: 0,
  },

  gradientText: {
    background:
      "linear-gradient(135deg,#a78bfa,#ec4899)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    marginTop: "6px",
    color: "rgba(255,255,255,0.4)",
  },

  addButton: {
    padding: "10px 22px",
    borderRadius: "999px",
    textDecoration: "none",
    color: "#fff",
    fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
    background:
      "linear-gradient(135deg,#7c3aed,#a855f7)",
    boxShadow:
      "0 0 20px rgba(124,58,237,0.35)",
  },

  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "22px",
    overflow: "hidden",
    backdropFilter: "blur(20px)",
  },

  imageWrapper: {
    position: "relative",
    height: "220px",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.65), transparent 60%)",
  },

  status: {
    position: "absolute",
    top: "12px",
    right: "12px",
    padding: "5px 12px",
    borderRadius: "999px",
    fontSize: "0.72rem",
    fontWeight: 700,
  },

  category: {
    position: "absolute",
    left: "12px",
    bottom: "12px",
    padding: "5px 12px",
    borderRadius: "999px",
    background: "rgba(0,0,0,0.5)",
    color: "rgba(255,255,255,0.75)",
    fontSize: "0.72rem",
  },

 chatButton: {
  position: "absolute",
  right: "12px",
  bottom: "12px",
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  border: "none",
  cursor: "pointer",
},

  unreadBadge: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: "#f43f5e",
    color: "#fff",
    fontSize: "0.6rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  body: {
    padding: "18px",
  },

  title: {
    margin: "0 0 10px",
    fontSize: "1rem",
    fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
  },

  price: {
    marginBottom: "18px",
    fontSize: "1.2rem",
    fontWeight: 800,
    background:
      "linear-gradient(135deg,#a78bfa,#ec4899)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  buttonColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  primaryButton: {
    padding: "11px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg,#7c3aed,#a855f7)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },

  buttonRow: {
    display: "flex",
    gap: "10px",
  },

  secondaryButton: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "rgba(255,255,255,0.07)",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },

  deleteButton: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid rgba(244,63,94,0.25)",
    background: "rgba(244,63,94,0.08)",
    color: "#f43f5e",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },

  loadingWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "80px 0",
    gap: "16px",
  },

  loader: {
    width: "34px",
    height: "34px",
    border: "3px solid rgba(124,58,237,0.2)",
    borderTopColor: "#7c3aed",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  loadingText: {
    color: "rgba(255,255,255,0.4)",
  },

  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "18px",
    padding: "100px 20px",
  },

  emptyTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
  },

  emptyText: {
    color: "rgba(255,255,255,0.45)",
  },

  errorBox: {
    padding: "14px 18px",
    borderRadius: "14px",
    background: "rgba(244,63,94,0.1)",
    border: "1px solid rgba(244,63,94,0.25)",
    color: "#f43f5e",
    marginBottom: "24px",
  },

  authWrapper: {
    minHeight: "100vh",
    background: "#08080c",
  },

  authContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "70vh",
    gap: "16px",
  },

  authTitle: {
    color: "#fff",
    fontFamily: "'Syne', sans-serif",
  },

  signInBtn: {
    padding: "12px 28px",
    borderRadius: "999px",
    background:
      "linear-gradient(135deg,#7c3aed,#a855f7)",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
  },
};

export default MyItems;