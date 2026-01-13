import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import React, { useContext } from "react";

import { useAuth } from "../../context/AuthContext";
//Srcs
import "./alertmessage.scss";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AlertMessage() {
  const { alert, setAlert, language } = useAuth();
  let open = alert()?.open;
  let message = alert()?.message;
  let status = alert()?.status;

  const handleCloseAlert = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert(false, "", "");
  };

  return (
    <div className="alert-message">
      {status === "success" ? (
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleCloseAlert}
          className="snackbar-alert"
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="success"
            onClose={handleCloseAlert}
            className={"alert-success"}
          >
            {language === "en" ? message?.messageEn : message?.messageKh}
          </Alert>
        </Snackbar>
      ) : null}

      {status === "error" ? (
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleCloseAlert}
          className="snackbar-alert"
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="error"
            className={"alert-error"}
            onClose={handleCloseAlert}
          >
            {language === "en" ? message?.messageEn : message?.messageKh}
          </Alert>
        </Snackbar>
      ) : null}
    </div>
  );
}
