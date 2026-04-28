// import React, { createContext, useContext, useState } from 'react';
// const AuthContext = createContext();
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };
// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(() => {
//     return localStorage.getItem('token') || null;
//   });
//   const login = (newToken) => {
//     localStorage.setItem('token', newToken);
//     setToken(newToken);
//   };
//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//   };
//   const value = {
//     token,
//     setToken,
//     login,
//     logout,
//     isAuthenticated: !!token,
//   };
//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
 
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const userRole = user?.role || "";
  const handleGetLanguage = () => {
    return window.localStorage.getItem("language") || "en"
  }
  const [language, setLanguage] = useState(handleGetLanguage());
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };
  

  
    const [open, setOpen] = useState(false);
    const [alertStatus, setAlertStatus] = useState("");
    const [messageAlert, setMessageAlert] = useState({
      messageKh: "",
      messageEn: "",
    });

    const setAlert = (open, alert, message) => {
      setOpen(open);
      setAlertStatus(alert);
      setMessageAlert(message);
    };

    const alert = () => {
      return { open: open, status: alertStatus, message: messageAlert };
    };

    const quickAlert = (status, messageEn, messageKh) => {
    setOpen(true);
    setAlertStatus(status);
    setMessageAlert({
      messageEn,
      messageKh,
    });

 
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  };

  

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
        language,
        changeLanguage,
        alert,
        setAlert,
        quickAlert,
        userRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
