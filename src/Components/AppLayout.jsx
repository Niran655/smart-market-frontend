import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import { Shrink } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Drawer,
  IconButton,
  ListItemIcon,
  MenuItem,
  Menu as MuiMenu,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Store } from "lucide-react";
import { useEffect, useState } from "react";

import CambodiaFlag from "../assets/Image/cambodiaflag.png";
import EnglishFlag from "../assets/Image/englishflag.png";
import { useThemeContext } from "../Context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { translateLauguage } from "../function/translate";
import Menu from "./menu/Menu";
import { MenuMobile, MenuNavbar } from "../Menu";

export default function AppLayout() {
  const {
    sidebarColor,
    topbarColor,
    layoutMode,
    mobileDrawerWidth,
    mobileShowLabels,
  } = useThemeContext();
  const { logout, language, changeLanguage } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = translateLauguage(language);
  const id = localStorage.getItem("activeShopId");
  const [activeTab, setActiveTab] = useState("orders");
  const isPosPage = location.pathname.startsWith("/store/pos/");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userObject, setUserObject] = useState(null);


  const sidebarWidth = layoutMode === "compact" ? 70 : 250;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserObject(JSON.parse(storedUser));
    }
  }, []);


  useEffect(() => {
    if (isPosPage) {
      const path = location.pathname;
      if (path.includes("/pos/")) setActiveTab("pos");
      else if (path.includes("/orders/")) setActiveTab("orders");
      else if (path.includes("/kitchen/")) setActiveTab("kitchen");
      else if (path.includes("/reservation/")) setActiveTab("reservation");
      else if (path.includes("/table/")) setActiveTab("table");
    }
  }, [location, isPosPage]);

  const [selectedFlag, setSelectedFlag] = useState(
    language === "kh" ? CambodiaFlag : EnglishFlag
  );
  const [selectedLanguage, setSelectedLanguage] = useState(
    language === "kh" ? "ភាសាខ្មែរ" : "English"
  );

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };
  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }


  const toggleLanguage = () => {
    const newLang = language === "kh" ? "en" : "kh";
    changeLanguage(newLang);
    localStorage.setItem("language", newLang);
    setSelectedFlag(newLang === "kh" ? CambodiaFlag : EnglishFlag);
    setSelectedLanguage(newLang === "kh" ? "ភាសាខ្មែរ" : "English");
  };

  const menuItems = [
    {
      icon: GridViewOutlinedIcon,
      label: `${t("dashboard")}`,
      path: "/dashboard",
    },
    { icon: Store, label: `${t("store")}`, path: "/store" },
    {
      icon: ReceiptLongOutlinedIcon,
      label: `${t("report")}`,
      path: "/report",
    },
    {
      icon: SettingsOutlinedIcon,
      label: `${t("setting")}`,
      path: "/setting",
    },
  ];

  const tabs = [
    { key: "pos", label: t("pos"), link: `/store/pos/${id}` },
    { key: "orders", label: t("orders"), link: `/store/orders/${id}` },
    { key: "kitchen", label: t("kitchen"), link: `/store/kitchen/${id}` },
    {
      key: "reservation",
      label: t("reservation"),
      link: `/store/reservation/${id}`,
    },
    { key: "table", label: t("table"), link: `/store/table/${id}` },
  ];

  return (
    <Box sx={{ minHeight: "100vh", width: "100vw", position: "relative" }}>

      {!isPosPage && !isMobile && (
        <Box
          sx={{
            position: "fixed",
            left: 0,
            top: 0,
            height: "100vh",
            width: sidebarWidth,
            background: `linear-gradient(180deg, ${sidebarColor} 0%, #1c1c1c 100%)`,
            color: "white",
            borderRight: "1px solid rgba(255,255,255,0.1)",
            zIndex: theme.zIndex.drawer,
            overflow: "hidden",
          }}
        >
          <MenuNavbar />
        </Box>
      )}

      {!isPosPage && isMobile && (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: mobileDrawerWidth,
              background: `linear-gradient(180deg, ${sidebarColor} 0%, #1c1c1c 100%)`,
              color: "white",
            },
          }}
        >
          <MenuMobile
            onNavigate={handleDrawerToggle}
            showLabels={mobileShowLabels}
          />
        </Drawer>
      )}


      <Box
        sx={{
          marginLeft: !isPosPage && !isMobile ? `${sidebarWidth}px` : 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: theme.transitions.create("margin-left", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >

        {!isPosPage && (
          <AppBar
            position="sticky"
            color="default"
            sx={{
              backgroundColor: topbarColor,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Toolbar sx={{ justifyContent: "space-between" }}>
              {isMobile && (
                <IconButton onClick={handleDrawerToggle} edge="start">
                  <MenuIcon />
                </IconButton>
              )}


              {!isMobile && (
                <Box display="flex">
                  {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = location.pathname.startsWith(item.path);

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        style={{ textDecoration: "none" }}
                      >
                        <Button
                          startIcon={<IconComponent />}
                          sx={{
                            borderRadius: 1,
                            border: isActive ? "1.5px solid rgba(255,255,255,0.1)" : "none",
                            px: 2,
                            color:
                              topbarColor === "#FDFDFD" ? "black" : "white",
                            backgroundColor: isActive
                              ? topbarColor === "#FDFDFD"
                                ? "rgba(0,0,0,0.1)"
                                : "rgba(255,255,255,0.15)"
                              : "transparent",
                          }}
                        >
                          {item.label}
                        </Button>
                      </Link>
                    );
                  })}
                </Box>
              )}

              {/* Spacer to push right items when nav is hidden on mobile */}
              {isMobile && <Box flex={1} />}

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleToggleFullscreen}>
                  <Shrink className="link-icon" />
                </IconButton>
                <Tooltip title={selectedLanguage}>
                  <IconButton onClick={toggleLanguage}>
                    <Avatar src={selectedFlag} sx={{ width: 30, height: 30 }} />
                  </IconButton>
                </Tooltip>

                <ButtonBase onClick={handleMenuOpen} sx={{ borderRadius: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      sx={{ width: 32, height: 32 }}
                      src={userObject?.image}
                      alt={userObject?.nameKh}
                    />

                    {!isExtraSmall && (
                      <Typography
                        sx={{
                          color:
                            topbarColor === "#FDFDFD" ? "black" : "white",
                        }}
                      >
                        {userObject?.nameKh}
                      </Typography>
                    )}
                  </Stack>
                </ButtonBase>

                <MuiMenu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      mt: 1.5,
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleProfile}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>

                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </MuiMenu>
              </Box>
            </Toolbar>
          </AppBar>
        )}

        {/* POS Topbar */}
        {isPosPage && (
          <>
            <AppBar
              position="sticky"
              color="default"
              sx={{
                backgroundColor: topbarColor,
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <Toolbar
                sx={{
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  rowGap: 1,
                  py: { xs: 0.5, sm: 0 },
                }}
              >
                {/* Left section: POS title and grid icon */}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Link to={`/store/pos/${id}`}>
                    <Button>
                      {/* Hide title on extra small screens */}
                      {!isExtraSmall && (
                        <Typography
                          sx={{
                            color:
                              topbarColor === "#FDFDFD" ? "black" : "white",
                            fontSize: 20,
                            fontWeight: "bold",
                          }}
                        >
                          POS System
                        </Typography>
                      )}
                    </Button>
                  </Link>
                  <IconButton
                    onClick={handleOpen}
                    sx={{
                      borderRadius: 10,
                      color: topbarColor === "#FDFDFD" ? "black" : "white",
                      backgroundColor: "rgba(255,255,255,0.15)",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.25)",
                      },
                    }}
                  >
                    <GridViewOutlinedIcon fontSize="small" />
                  </IconButton>
                </Stack>

                {/* Center: scrollable tabs */}
                <Box
                  sx={{
                    flex: { xs: "1 1 100%", sm: "0 1 auto" },
                    order: { xs: 3, sm: 2 },
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    scrollbarWidth: "none", // Firefox
                    "&::-webkit-scrollbar": { display: "none" }, // Chrome/Safari
                    maxWidth: "100%",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      display: "inline-flex",
                      px: 1,
                    }}
                  >
                    {tabs.map((tab) => (
                      <Button
                        key={tab.key}
                        variant={activeTab === tab.key ? "contained" : "text"}
                        onClick={() => setActiveTab(tab.key)}
                        component={Link}
                        to={tab.link}
                        sx={{
                          borderRadius: 10,
                          backgroundColor:
                            activeTab === tab.key
                              ? "#ffffff"
                              : "transparent",
                          color:
                            activeTab === tab.key ? "#000" : "#fff",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          "&:hover": {
                            backgroundColor:
                              activeTab === tab.key
                                ? "#f0f0f0"
                                : "rgba(255,255,255,0.1)",
                          },
                        }}
                      >
                        {tab.label}
                      </Button>
                    ))}
                  </Stack>
                </Box>




                {/* Right section: language & profile */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    order: { xs: 2, sm: 3 },
                  }}
                >
                  <Tooltip title={selectedLanguage}>
                    <IconButton onClick={toggleLanguage}>
                      <Avatar
                        src={selectedFlag}
                        sx={{ width: 30, height: 30 }}
                      />
                    </IconButton>
                  </Tooltip>

                  <ButtonBase onClick={handleMenuOpen} sx={{ borderRadius: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar
                        sx={{ width: 32, height: 32 }}
                        src={userObject?.image}
                        alt={userObject?.nameKh}
                      />
                      {/* Hide name on extra small */}
                      {!isExtraSmall && (
                        <Typography
                          sx={{
                            color:
                              topbarColor === "#FDFDFD" ? "black" : "white",
                          }}
                        >
                          {userObject?.nameKh}
                        </Typography>
                      )}
                    </Stack>
                  </ButtonBase>
                </Box>
              </Toolbar>
            </AppBar>
            {open && <Menu open={open} onClose={handleClose} t={t} />}
          </>
        )}

        {/* Main content (scrollable) */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: isPosPage ? { xs: 0.5, sm: 1 } : { xs: 2, sm: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}