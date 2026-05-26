import React, { useState } from "react";
import Navbar from "./Navbar";
import { useLocation, useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Clothing", "Electronics", "Power Tools", "Kitchen", "Cameras",
  "Sports", "Music", "Books", "Gardening", "Toys", "Others"
];

const OrbField = () => (
  <div style={{
    position: "fixed", inset: 0, overflow: "hidden",
    pointerEvents: "none", zIndex: 0,
  }}>
    <div style={{
      position: "absolute", top: "-20%", right: "-10%",
      width: "60vw", height: "60vw", borderRadius: "50%",
      background: "radial-gradient(circle, rgba(124,58,237,0.22), transparent 70%)",
      animation: "orbA 16s ease-in-out infinite",
    }} />
    <div style={{
      position: "absolute", bottom: "-15%", left: "-10%",
      width: "55vw", height: "55vw", borderRadius: "50%",
      background: "radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)",
      animation: "orbB 20s ease-in-out infinite",
    }} />
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage:
        `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
         linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
      backgroundSize: "60px 60px",
    }} />
  </div>
);

// Unified field component used for text/number/textarea inputs
const Field = ({ label, value, onChange, type = "text", placeholder = "" }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{
      fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em",
      textTransform: "uppercase", color: "rgba(255,255,255,0.38)",
    }}>
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        style={inputStyle}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...inputStyle, height: 44 }}
      />
    )}
  </div>
);

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "0.5px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#fff",
  fontSize: "0.9rem",
  fontFamily: "inherit",
  outline: "none",
  padding: "11px 14px",
  transition: "border-color 0.2s, background 0.2s",
  width: "100%",
  boxSizing: "border-box",
};

const SectionLabel = ({ children }) => (
  <p style={{
    gridColumn: "1 / -1",
    fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
    marginBottom: 2,
  }}>
    {children}
  </p>
);

const Divider = () => (
  <hr style={{
    gridColumn: "1 / -1",
    border: "none",
    borderTop: "0.5px solid rgba(255,255,255,0.07)",
    margin: "6px 0",
  }} />
);

const AddItem = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const editingItem = location.state?.item || null;

  const [itemName, setItemName] = useState(editingItem?.item_name || "");
  const [itemDescription, setItemDescription] = useState(editingItem?.item_description || "");
  const [itemCategory, setItemCategory] = useState(editingItem?.item_category || CATEGORIES[0]);
  const [itemCost, setItemCost] = useState(editingItem?.item_cost || "");
  const [itemImage, setItemImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(editingItem ? "Updating item..." : "Uploading item...");

    const userData = localStorage.getItem("user");
    if (!userData) {
      setMessage("Please login first.");
      setLoading(false);
      return;
    }

    const user = JSON.parse(userData);
    const formData = new FormData();
    formData.append("item_name", itemName);
    formData.append("item_description", itemDescription);
    formData.append("item_category", itemCategory);
    formData.append("item_cost", itemCost);
    formData.append("user_id", user.user_id || user.id);
    if (itemImage) formData.append("item_image", itemImage);

    const url = editingItem
      ? `https://quincyj.alwaysdata.net/api/update_item/${editingItem.item_id || editingItem.id}`
      : "https://quincyj.alwaysdata.net/api/add_item";

    try {
      const res = await fetch(url, { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok) {
        setMessage("Success ✔");
        setTimeout(() => navigate("/myitems"), 1200);
      } else {
        setMessage(data?.error || "Something went wrong");
      }
    } catch {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#09090e", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#fff" }}>
      <OrbField />
      <Navbar />

      <div style={{
        display: "flex", justifyContent: "center",
        padding: "60px 20px", position: "relative", zIndex: 1,
      }}>
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%", maxWidth: 860,
            background: "rgba(255,255,255,0.045)",
            border: "0.5px solid rgba(255,255,255,0.1)",
            borderRadius: 24,
            padding: "36px 40px 40px",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
              {editingItem ? "Edit item" : "List new item"}
            </h1>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", marginTop: 5 }}>
              Fill in details to publish your item
            </p>
          </div>

          {/* Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 14,
          }}>

            {message && (
              <div style={{
                gridColumn: "1 / -1",
                padding: "10px 14px", borderRadius: 10,
                background: "rgba(139,92,246,0.12)",
                border: "0.5px solid rgba(139,92,246,0.3)",
                fontSize: "0.85rem", color: "rgba(255,255,255,0.75)",
              }}>
                {message}
              </div>
            )}

            <SectionLabel>Item details</SectionLabel>

            <div style={{ gridColumn: "1 / -1" }}>
              <Field
                label="Item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Canon EOS M50 Camera"
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <Field
                label="Description"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                type="textarea"
                placeholder="Describe your item — condition, what's included, any notes..."
              />
            </div>

            <Divider />
            <SectionLabel>Pricing &amp; category</SectionLabel>

            {/* Category */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{
                fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.38)",
              }}>
                Category
              </label>
              <select
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                style={{ ...inputStyle, height: 44, cursor: "pointer" }}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Price */}
            <Field
              label="Price (KES)"
              value={itemCost}
              onChange={(e) => setItemCost(e.target.value)}
              type="number"
              placeholder="0.00"
            />

            <Divider />
            <SectionLabel>Product image</SectionLabel>

            {/* File upload */}
            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{
                fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.38)",
              }}>
                Upload photo {editingItem && <span style={{ textTransform: "none", fontWeight: 400 }}>(optional)</span>}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setItemImage(e.target.files[0])}
                required={!editingItem}
                style={{
                  ...inputStyle,
                  height: "auto",
                  padding: "10px 14px",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.82rem",
                }}
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 28, width: "100%", height: 48,
              borderRadius: 14, border: "none",
              background: "linear-gradient(135deg,#7c3aed,#a855f7)",
              color: "#fff", fontSize: "0.95rem", fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              letterSpacing: "0.01em",
              transition: "opacity 0.2s, transform 0.15s",
            }}
          >
            {loading ? "Processing..." : editingItem ? "Save changes" : "Publish item"}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes orbA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-5%,5%)} }
        @keyframes orbB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(5%,-5%)} }
        input:focus, select:focus, textarea:focus {
          border-color: rgba(139,92,246,0.6) !important;
          background: rgba(139,92,246,0.06) !important;
        }
        input[type="file"]::file-selector-button {
          background: rgba(139,92,246,0.15);
          border: 0.5px solid rgba(139,92,246,0.4);
          border-radius: 8px;
          color: rgba(255,255,255,0.8);
          font-size: 0.8rem;
          padding: 5px 12px;
          cursor: pointer;
          margin-right: 12px;
          transition: background 0.2s;
        }
        input[type="file"]::file-selector-button:hover {
          background: rgba(139,92,246,0.28);
        }
        select option { background: #1a1a2e; color: #fff; }
        @media (max-width: 580px) {
          form > div:last-of-type { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default AddItem;