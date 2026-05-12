import Snackbar from "@mui/material/Snackbar";
import React from "react";
import { useAuth } from "../../Context/AuthContext";

const STATUS_CONFIG = {
  info: {
    color: "#4FC3F7",
    bg: "rgba(79, 195, 247, 0.12)",
    border: "#4FC3F7",
  },
  success: {
    color: "#00C9A7",
    bg: "rgba(0, 201, 167, 0.12)",
    border: "#00C9A7",
  },
  warning: {
    color: "#FFA500",
    bg: "rgba(255, 165, 0, 0.12)",
    border: "#FFA500",
  },
  error: {
    color: "#FF6F91",
    bg: "rgba(255, 111, 145, 0.12)",
    border: "#FF6F91",
  },
};

export default function AlertMessage() {
  const { alert, setAlert, language } = useAuth();

  const open = alert()?.open;
  const message = alert()?.message;
  const status = alert()?.status;

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setAlert(false, "", "");
  };

  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.info;

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          minWidth: 220,
          maxWidth: 360,
          padding: "14px 20px",
          borderRadius: 8,
          backgroundColor: cfg.bg,
          border: `1px solid ${cfg.border}33`,
  
          color: cfg.color,
          fontSize: "0.9rem",
          fontWeight: 500,
          fontFamily: "'Segoe UI', sans-serif",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        
          gap: 12,
        }}
      >
        <span style={{ flex: 1 }}>
          {language === "en" ? message?.messageEn : message?.messageKh}
        </span>
        <button
          onClick={handleClose}
          style={{
            background: "none",
            border: "none",
            color: cfg.color,
            cursor: "pointer",
            fontSize: "1rem",
            opacity: 0.7,
            padding: 0,
            lineHeight: 1,
            flexShrink: 0,
          }}
          aria-label="close"
        >
          ✕
        </button>
      </div>
    </Snackbar>
  );
}