import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import React from "react";
import { useAuth } from "../../Context/AuthContext";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AlertMessage() {
  const { alert, setAlert, language } = useAuth();

  const open = alert()?.open;
  const message = alert()?.message;
  const status = alert()?.status;

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setAlert(false, "", "");
  };

  const getColor = () => {
    switch (status) {
      case "success":
        return "#00C9A7";
      case "error":
        return "#FF6F91";
      case "warning":
        return "#FFA500";
      default:
        return "#333";
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={status}
        sx={{
          borderRadius: "999px",
          backgroundColor: getColor(),
          color: "#fff",
          px: 3,
          py: 1,
          fontSize: "0.9rem",
          fontWeight: 500,
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          alignItems: "center",
        }}
      >
        {language === "en"
          ? message?.messageEn
          : message?.messageKh}
      </Alert>
    </Snackbar>
  );
}