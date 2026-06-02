import { useState } from "react";

// ─── Config ────────────────────────────────────────────────────────────────
const EVENT_NAME = "Your Trade Fair Name";        // ← replace with actual name
const EVENT_DATE = "Anchor University Lagos, 2026";                 // ← replace with actual date/location
const BOOTH_PRICE = 25000;                        // ₦ per booth
const FEE_RATE = 0.05;                            // 5% service fee
const MAX_BOOTHS = 10;
const API_URL = "https://your-api.com/register";  // ← replace with FastAPI endpoint

// ─── Helpers ───────────────────────────────────────────────────────────────
const fmt = (n) =>
  "₦" + n.toLocaleString("en-NG");

const validate = {
  name: (v) => v.trim().length > 0,
  phone: (v) => v.replace(/\s/g, "").length >= 7,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
};

// ─── Styles (CSS-in-JS) ────────────────────────────────────────────────────
const styles = {
  // Page
  page: {
    minHeight: "100vh",
    background: "#0F0D0A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: "border-box",
  },
  container: {
    width: "100%",
    maxWidth: "520px",
  },

  // Header
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  eyebrow: {
    fontSize: "11px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#BA7517",
    marginBottom: "8px",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "32px",
    fontWeight: 600,
    color: "#FAEEDA",
    margin: "0 0 6px",
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: "14px",
    color: "#888780",
    margin: 0,
  },

  // Card
  card: {
    background: "#1A1710",
    border: "0.5px solid #2C2C2A",
    borderRadius: "16px",
    padding: "2rem",
  },

  // Badge
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    background: "#412402",
    color: "#FAC775",
    padding: "4px 12px",
    borderRadius: "100px",
    marginBottom: "1.5rem",
  },

  // Section label
  sectionLabel: {
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#444441",
    margin: "0 0 1rem",
    paddingBottom: "8px",
    borderBottom: "0.5px solid #2C2C2A",
  },

  // Row
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },

  // Field
  field: { marginBottom: "1.25rem" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 500,
    color: "#B4B2A9",
    marginBottom: "6px",
  },
  required: { color: "#EF9F27", marginLeft: "2px" },
  input: {
    width: "100%",
    boxSizing: "border-box",
    height: "42px",
    padding: "0 14px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    color: "#FAEEDA",
    background: "#0F0D0A",
    border: "0.5px solid #444441",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  inputFocus: {
    borderColor: "#BA7517",
    boxShadow: "0 0 0 3px rgba(186,117,23,0.18)",
  },
  inputError: {
    borderColor: "#E24B4A",
    boxShadow: "0 0 0 3px rgba(226,75,74,0.12)",
  },
  errorMsg: {
    fontSize: "12px",
    color: "#F09595",
    marginTop: "4px",
  },

  // Booth selector
  boothRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  boothSelector: {
    display: "flex",
    alignItems: "center",
    background: "#0F0D0A",
    border: "0.5px solid #444441",
    borderRadius: "8px",
    overflow: "hidden",
  },
  boothBtn: {
    width: "38px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#888780",
    fontSize: "18px",
    transition: "background 0.12s, color 0.12s",
  },
  boothBtnDisabled: { opacity: 0.3, cursor: "not-allowed" },
  boothCount: {
    fontSize: "17px",
    fontWeight: 500,
    color: "#FAEEDA",
    width: "42px",
    textAlign: "center",
  },
  boothDesc: {
    fontSize: "13px",
    color: "#888780",
  },

  // Divider
  divider: {
    height: "0.5px",
    background: "#2C2C2A",
    margin: "1.5rem 0",
  },

  // Price summary
  priceSummary: {
    background: "#0F0D0A",
    borderRadius: "8px",
    padding: "1rem 1.25rem",
    marginTop: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#888780",
  },
  priceTotal: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "15px",
    fontWeight: 500,
    color: "#FAEEDA",
    marginTop: "6px",
    paddingTop: "8px",
    borderTop: "0.5px solid #2C2C2A",
  },

  // Checkout button
  checkoutBtn: {
    width: "100%",
    height: "50px",
    marginTop: "1.25rem",
    background: "#BA7517",
    color: "#0F0D0A",
    border: "none",
    borderRadius: "8px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "15px",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "background 0.15s, transform 0.1s",
  },
  checkoutBtnDisabled: {
    background: "#2C2C2A",
    color: "#444441",
    cursor: "not-allowed",
  },

  // Note
  note: {
    textAlign: "center",
    fontSize: "12px",
    color: "#444441",
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
  },

  // Success
  successWrap: {
    textAlign: "center",
    padding: "1rem 0",
  },
  successIcon: {
    width: "60px",
    height: "60px",
    background: "#412402",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1.25rem",
    fontSize: "26px",
    color: "#FAC775",
  },
  successTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "22px",
    color: "#FAEEDA",
    margin: "0 0 8px",
  },
  successText: {
    fontSize: "14px",
    color: "#888780",
    margin: 0,
    lineHeight: 1.6,
  },
};

// ─── Component ─────────────────────────────────────────────────────────────
export default function BoothRegistration() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "",
  });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState({});
  const [booths, setBooths] = useState(1);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [apiError, setApiError] = useState("");

  const subtotal = booths * BOOTH_PRICE;
  const fee = Math.round(subtotal * FEE_RATE);
  const total = subtotal + fee;

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: false }));
  };

  const handleFocus = (field) => () => setFocused((f) => ({ ...f, [field]: true }));
  const handleBlur = (field) => () => setFocused((f) => ({ ...f, [field]: false }));

  const changeBooths = (delta) => {
    setBooths((b) => Math.min(MAX_BOOTHS, Math.max(1, b + delta)));
  };

  const getInputStyle = (field) => ({
    ...styles.input,
    ...(focused[field] ? styles.inputFocus : {}),
    ...(errors[field] ? styles.inputError : {}),
  });

  const handleSubmit = async () => {
    const newErrors = {
      firstName: !validate.name(form.firstName),
      lastName: !validate.name(form.lastName),
      phone: !validate.phone(form.phone),
      email: !validate.email(form.email),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    const payload = {
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      booths,
      subtotal,
      fee,
      total,
    };

    setStatus("loading");
    setApiError("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      // If Jerrie's API returns a payment redirect URL:
      if (data.payment_url) {
        window.location.href = data.payment_url;
        return;
      }

      setStatus("success");
    } catch (err) {
      console.error(err);
      setApiError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div style={styles.page}>
        <div style={styles.container}>

          {/* Header */}
          <div style={styles.header}>
            <p style={styles.eyebrow}>{EVENT_NAME} &mdash; {EVENT_DATE}</p>
            <h1 style={styles.title}>Reserve Your Booth</h1>
            <p style={styles.subtitle}>Secure your space at this year's premier trade fair.</p>
          </div>

          <div style={styles.card}>

            {status === "success" ? (
              /* ── Success state ── */
              <div style={styles.successWrap}>
                <div style={styles.successIcon}>✓</div>
                <h2 style={styles.successTitle}>You're registered!</h2>
                <p style={styles.successText}>
                  Hi {form.firstName}, your {booths} booth{booths > 1 ? "s" : ""} ({fmt(total)}) have
                  been reserved. A confirmation will be sent to <strong style={{ color: "#FAC775" }}>{form.email}</strong>.
                </p>
              </div>
            ) : (
              <>
                {/* Badge */}
                <div style={styles.badge}>
                  🔒 Secure registration
                </div>

                {/* Contact info */}
                <p style={styles.sectionLabel}>Contact information</p>

                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>
                      First name<span style={styles.required}>*</span>
                    </label>
                    <input
                      style={getInputStyle("firstName")}
                      type="text"
                      placeholder="Ada"
                      value={form.firstName}
                      onChange={handleChange("firstName")}
                      onFocus={handleFocus("firstName")}
                      onBlur={handleBlur("firstName")}
                      autoComplete="given-name"
                    />
                    {errors.firstName && (
                      <p style={styles.errorMsg}>Please enter your first name.</p>
                    )}
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>
                      Last name<span style={styles.required}>*</span>
                    </label>
                    <input
                      style={getInputStyle("lastName")}
                      type="text"
                      placeholder="Okafor"
                      value={form.lastName}
                      onChange={handleChange("lastName")}
                      onFocus={handleFocus("lastName")}
                      onBlur={handleBlur("lastName")}
                      autoComplete="family-name"
                    />
                    {errors.lastName && (
                      <p style={styles.errorMsg}>Please enter your last name.</p>
                    )}
                  </div>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>
                    Phone number<span style={styles.required}>*</span>
                  </label>
                  <input
                    style={getInputStyle("phone")}
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    onFocus={handleFocus("phone")}
                    onBlur={handleBlur("phone")}
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <p style={styles.errorMsg}>Please enter a valid phone number.</p>
                  )}
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>
                    Email address<span style={styles.required}>*</span>
                  </label>
                  <input
                    style={getInputStyle("email")}
                    type="email"
                    placeholder="ada@company.com"
                    value={form.email}
                    onChange={handleChange("email")}
                    onFocus={handleFocus("email")}
                    onBlur={handleBlur("email")}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p style={styles.errorMsg}>Please enter a valid email address.</p>
                  )}
                </div>

                {/* Divider */}
                <div style={styles.divider} />
                <p style={styles.sectionLabel}>Booth selection</p>

                {/* Booth counter */}
                <div style={styles.field}>
                  <label style={styles.label}>
                    Number of booth spaces<span style={styles.required}>*</span>
                  </label>
                  <div style={styles.boothRow}>
                    <div style={styles.boothSelector}>
                      <button
                        style={{
                          ...styles.boothBtn,
                          ...(booths <= 1 ? styles.boothBtnDisabled : {}),
                        }}
                        onClick={() => changeBooths(-1)}
                        disabled={booths <= 1}
                        aria-label="Decrease booths"
                      >
                        −
                      </button>
                      <span style={styles.boothCount}>{booths}</span>
                      <button
                        style={{
                          ...styles.boothBtn,
                          ...(booths >= MAX_BOOTHS ? styles.boothBtnDisabled : {}),
                        }}
                        onClick={() => changeBooths(1)}
                        disabled={booths >= MAX_BOOTHS}
                        aria-label="Increase booths"
                      >
                        +
                      </button>
                    </div>
                    <span style={styles.boothDesc}>
                      {booths} booth{booths > 1 ? "s" : ""} — 3m × 3m space{booths > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Price summary */}
                <div style={styles.priceSummary}>
                  <div style={styles.priceRow}>
                    <span>{booths} booth{booths > 1 ? "s" : ""} × {fmt(BOOTH_PRICE)}</span>
                    <span>{fmt(subtotal)}</span>
                  </div>
                  <div style={styles.priceRow}>
                    <span>Service fee (5%)</span>
                    <span>{fmt(fee)}</span>
                  </div>
                  <div style={styles.priceTotal}>
                    <span>Total</span>
                    <span>{fmt(total)}</span>
                  </div>
                </div>

                {/* API error */}
                {apiError && (
                  <p style={{ ...styles.errorMsg, marginTop: "12px", textAlign: "center" }}>
                    {apiError}
                  </p>
                )}

                {/* Checkout button */}
                <button
                  style={{
                    ...styles.checkoutBtn,
                    ...(status === "loading" ? styles.checkoutBtnDisabled : {}),
                  }}
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Processing…" : "🔒 Proceed to payment"}
                </button>

                <p style={styles.note}>
                  🛡 Payments processed securely via Jerrie's API
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
