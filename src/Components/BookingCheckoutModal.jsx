import { useState } from "react";

export default function BookingCheckoutModal({
  isOpen,
  onClose,
  bookingData,
  onConfirmBooking,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paystack");

  if (!isOpen || !bookingData) return null;

  const {
    propertyName,
    neighborhood,
    checkIn,
    checkOut,
    nights,
    adults,
    rooms,
    basePrice,
    totalAmount,
  } = bookingData;

  const serviceFee = Math.round((Number(totalAmount) || 0) * 0.05); // 5% platform fee
  const grandTotal = (Number(totalAmount) || 0) + serviceFee;

  const handlePayment = async (e) => {
    e.preventDefault();
    if (isProcessing || grandTotal <= 0) return;
    setIsProcessing(true);
    try {
      await onConfirmBooking({
        ...bookingData,
        serviceFee,
        grandTotal,
        paymentMethod,
      });
    } catch (err) {
      // The parent surfaces the error; keep the modal usable for a retry.
      console.warn("Booking confirmation failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(11, 19, 43, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "1.25rem",
          maxWidth: "520px",
          width: "100%",
          padding: "2rem",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Modal Close Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
            borderBottom: "1px solid #f1f5f9",
            paddingBottom: "1rem",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: "700",
                color: "#f97316",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Plateau Verified Booking
            </span>
            <h2 style={{ fontSize: "1.35rem", fontWeight: "800", color: "#0b132b", margin: 0 }}>
              Checkout & Pass Clearance
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f1f5f9",
              border: "none",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              fontSize: "1.2rem",
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            ✕
          </button>
        </div>

        {/* Reservation Summary Box */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            marginBottom: "1.25rem",
          }}
        >
          <strong style={{ fontSize: "1.1rem", color: "#0b132b", display: "block" }}>
            {propertyName}
          </strong>
          <small style={{ color: "#64748b", display: "block", marginBottom: "0.75rem" }}>
            📍 {neighborhood}
          </small>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
              fontSize: "0.85rem",
              borderTop: "1px solid #e2e8f0",
              paddingTop: "0.75rem",
            }}
          >
            <div>
              <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem" }}>CHECK-IN</span>
              <strong style={{ color: "#1e293b" }}>{checkIn}</strong>
            </div>
            <div>
              <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem" }}>CHECK-OUT</span>
              <strong style={{ color: "#1e293b" }}>{checkOut}</strong>
            </div>
            <div>
              <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem" }}>DURATION</span>
              <strong style={{ color: "#1e293b" }}>{nights} night(s)</strong>
            </div>
            <div>
              <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem" }}>GUESTS & ROOMS</span>
              <strong style={{ color: "#1e293b" }}>{adults} Adult(s) • {rooms} Room</strong>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#334155", display: "block", marginBottom: "0.5rem" }}>
            Select Payment Method
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={() => setPaymentMethod("paystack")}
              style={{
                border: paymentMethod === "paystack" ? "2px solid #f97316" : "1px solid #cbd5e1",
                background: paymentMethod === "paystack" ? "#fff7ed" : "#fff",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "0.85rem",
                color: paymentMethod === "paystack" ? "#c2410c" : "#475569",
              }}
            >
              💳 Card / Transfer
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("wallet")}
              style={{
                border: paymentMethod === "wallet" ? "2px solid #f97316" : "1px solid #cbd5e1",
                background: paymentMethod === "wallet" ? "#fff7ed" : "#fff",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "0.85rem",
                color: paymentMethod === "wallet" ? "#c2410c" : "#475569",
              }}
            >
              🔥 Jos Pulse Wallet
            </button>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div style={{ fontSize: "0.88rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", color: "#64748b" }}>
            <span>
              ₦{Number(basePrice || 0).toLocaleString("en-NG")} × {nights} night(s)
              {rooms > 1 ? ` × ${rooms} rooms` : ""}
            </span>
            <span>₦{Number(totalAmount || 0).toLocaleString("en-NG")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", color: "#64748b" }}>
            <span>Platform Service Fee (5%)</span>
            <span>₦{serviceFee.toLocaleString("en-NG")}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "800",
              fontSize: "1.1rem",
              color: "#0b132b",
              borderTop: "1px solid #e2e8f0",
              paddingTop: "0.75rem",
              marginTop: "0.5rem",
            }}
          >
            <span>Total Payable</span>
            <span style={{ color: "#f97316" }}>₦{grandTotal.toLocaleString("en-NG")}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handlePayment}
          disabled={isProcessing}
          style={{
            background: "#f97316",
            color: "#ffffff",
            border: "none",
            width: "100%",
            padding: "0.95rem",
            borderRadius: "0.6rem",
            fontWeight: "800",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(249, 115, 22, 0.25)",
            textAlign: "center",
          }}
        >
          {isProcessing ? "Processing Secure Payment..." : `Confirm & Pay ₦${grandTotal.toLocaleString("en-NG")}`}
        </button>

        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.75rem", margin: "0.75rem 0 0 0" }}>
          🔒 Encrypted 256-bit Payment. Instant clearance QR pass generated on completion.
        </p>
      </div>
    </div>
  );
}