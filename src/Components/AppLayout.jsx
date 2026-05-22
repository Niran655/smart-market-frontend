import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import {
  ChartColumnIncreasing,
  ChevronDown,
  ExternalLink,
  LayoutDashboard,
  Settings2,
  Shrink,
  Store,
  ChevronsUpDown 
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Divider,
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
  InputBase,
} from "@mui/material";
import { useEffect, useState } from "react";

import CambodiaFlag from "../assets/Image/cambodiaflag.png";
import EnglishFlag from "../assets/Image/englishflag.png";
import { useThemeContext } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import Menu from "./menu/Menu";
import { MenuMobile, MenuNavbar } from "../Menu";
import TopNavbar from "../Menu/TopNavbar";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import { GET_ALL_SHOP, GET_OPEN_SHIFT } from "../../graphql/queries";
// import search icon
import { Search, X } from "lucide-react";
export default function AppLayout() {
  const {
    sidebarColor,
    topbarColor,
    layoutMode,
    mobileDrawerWidth,
    mobileShowLabels,
  } = useThemeContext();
  const { logout, language, changeLanguage, quickAlert, setAlert } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
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
  const [menuPosition, setMenuPosition] = useState(null);
  const [storeMenuAnchor, setStoreMenuAnchor] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userObject, setUserObject] = useState(null);


  const isTopNav = layoutMode === "top";
  const isCompact = layoutMode === "compact";


  const sidebarWidth = isTopNav ? 0 : isCompact ? 75 : 250;

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

  const { data: shopData, loading: shopLoading } = useQuery(GET_ALL_SHOP, {
    variables: { id: "" },
    fetchPolicy: "cache-and-network",
  });
  const [checkOpenShift] = useLazyQuery(GET_OPEN_SHIFT);

  const stores = shopData?.getAllShops || [];
  const activeShop = stores.find((shop) => shop?._id === id);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setAnchorEl(e.currentTarget);
    setMenuPosition({
      top: rect.bottom,
      left: rect.right,
    });
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPosition(null);
  };
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
  };

  const toggleLanguage = () => {
    const newLang = language === "kh" ? "en" : "kh";
    changeLanguage(newLang);
    localStorage.setItem("language", newLang);
    setSelectedFlag(newLang === "kh" ? CambodiaFlag : EnglishFlag);
    setSelectedLanguage(newLang === "kh" ? "ភាសាខ្មែរ" : "English");
  };


  const menuItems = [
    // {
    //   icon: LayoutDashboard,
    //   label: `${t("dashboard")}`,
    //   path: "/dashboard",
    // },
    { icon: Store, label: `${t("store")}`, path: "/store", dropdown: true },
    // {
    //   icon: ChartColumnIncreasing,
    //   label: `${t("report")}`,
    //   path: "/report",
    // },
    // {
    //   icon: Settings2,
    //   label: `${t("setting")}`,
    //   path: "/setting",
    // },
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

  const sidebarBg = sidebarColor;
  const topbarSx = {
    bgcolor: `${topbarColor} !important`,
    backgroundImage: "none !important",
    boxShadow: "none !important",
    border: "0 !important",
    borderBottom: "0 !important",
    outline: "0 !important",
  };

  const handleStoreMenuOpen = (event) => {
    setStoreMenuAnchor(event.currentTarget);
  };

  const handleStoreMenuClose = () => {
    setStoreMenuAnchor(null);
  };

  const handleGoToShop = async (shopId) => {
    handleStoreMenuClose();
    if (!shopId) {
      navigate("/store");
      return;
    }

    const userId = userObject?._id;
    if (!userId) {
      quickAlert(true, "error", {
        messageEn: "User not found",
        messageKh: "រកមិនឃើញអ្នកប្រើប្រាស់",
      });
      return;
    }

    try {
      const { data } = await checkOpenShift({
        variables: { userId, shopId },
        fetchPolicy: "network-only",
      });

      if (!data?.getOpenShift) {
        quickAlert(
          "warning",
          "Please start your shift before entering POS",
          "សូមបើកវេនការងារជាមុនសិន"
        );
        return;
      }

      localStorage.setItem("activeShopId", shopId);
      navigate(`/store/pos/${shopId}`);
    } catch (error) {
      setAlert(true, "error", {
        messageEn: error.message,
        messageKh: error.message,
      });
    }
  };

  const handleGoToStore = () => {
    handleStoreMenuClose();
    window.location.href = `${window.location.origin}/store`;
  };

  const StoreDropdownMenu = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredStores = stores.filter((shop) => {
      const name =
        language === "kh"
          ? shop?.nameKh || shop?.nameEn
          : shop?.nameEn || shop?.nameKh;
      return name?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
      <MuiMenu
        anchorEl={storeMenuAnchor}
        open={Boolean(storeMenuAnchor)}
        onClose={() => {
          handleStoreMenuClose();
          setSearchQuery("");
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: 340,
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: theme.shadows[8],
              maxHeight: "none",
            },
          },
          backdrop: {
            sx: {
              backdropFilter: "none",
              backgroundColor: "transparent",
            },
          },
        }}
      >

        <Box sx={{ px: 1.5, pt: 1.5, pb: 1 }}>
          
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.25,
              py: 0.75,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1.5,
              bgcolor: "action.hover",
              "&:focus-within": {
                borderColor: "primary.main",
                bgcolor: "background.paper",
                boxShadow: `0 0 0 3px ${theme.palette.primary.main}22`,
              },
              transition: "all 0.15s ease",
            }}
          >
            <Search size={15} style={{ color: theme.palette.text.secondary, flexShrink: 0 }} />
            <InputBase
              autoFocus
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                fontSize: "0.85rem",
                "& input": { p: 0, lineHeight: 1.5 },
              }}
            />
            {searchQuery && (
              <IconButton
                size="small"
                onClick={() => setSearchQuery("")}
                sx={{ p: 0.25, color: "text.secondary" }}
              >
                <X size={13} />
              </IconButton>
            )}
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "text.disabled",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 0.5,
                px: 0.5,
                lineHeight: 1.6,
                flexShrink: 0,
              }}
            >
              Esc
            </Typography>
          </Box>
        </Box>


        <Divider />


        <Box
          sx={{
            maxHeight: 280,
            overflowY: "auto",
            px: 0.75,
            py: 0.75,
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: theme.palette.divider,
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: theme.palette.text.disabled,
            },
            scrollbarWidth: "thin",
            scrollbarColor: `${theme.palette.divider} transparent`,
          }}
        >
          {shopLoading ? (
            <Box sx={{ px: 2, py: 2 }}>
              <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
                {t("loading") || "Loading..."}
              </Typography>
            </Box>
          ) : filteredStores.length === 0 ? (
            <Box sx={{ px: 2, py: 2.5, textAlign: "center" }}>
              <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : t("no_stores_found") || "No stores found"}
              </Typography>
            </Box>
          ) : (
            filteredStores.map((shop) => {
              const isActiveShop = shop?._id === id;
              const shopName =
                language === "kh"
                  ? shop?.nameKh || shop?.nameEn
                  : shop?.nameEn || shop?.nameKh;
              return (
                <MenuItem
                  key={shop?._id}
                  onClick={() => handleGoToShop(shop?._id)}
                  sx={{
                    gap: 1.5,
                    alignItems: "center",
                    py: 1,
                    px: 1,
                    borderRadius: 1,
                    mb: 0.25,
                    bgcolor: isActiveShop ? "action.selected" : "transparent",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Avatar
                    src={shop?.image}
                    variant="rounded"
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: isActiveShop ? "primary.main" : "action.hover",
                      color: isActiveShop ? "primary.contrastText" : "text.primary",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      borderRadius: 1,
                    }}
                  >
                    {(shopName || "S").slice(0, 1).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{ fontSize: "0.88rem", fontWeight: 700 }} noWrap>
                      {shopName || t("store")}
                    </Typography>
                    <Typography sx={{ fontSize: "0.72rem", color: "text.secondary" }} noWrap>
                      {isActiveShop
                        ? t("active") || "Active"
                        : shop?.code || shop?._id?.slice(-8)}
                    </Typography>
                  </Box>
                  {isActiveShop ? (
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        bgcolor: "success.main",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <ExternalLink size={14} style={{ color: theme.palette.text.disabled, flexShrink: 0 }} />
                  )}
                </MenuItem>
              );
            })
          )}
        </Box>

        {/* Divider above footer */}
        <Divider />

        {/* Footer Button */}
        <Box sx={{ p: 0.75 }}>
          <Button
            fullWidth
            onClick={handleGoToStore}
            startIcon={
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "action.hover",
                }}
              >
                <Store size={15} />
              </Box>
            }
            sx={{
              justifyContent: "flex-start",
              gap: 0.5,
              py: 1,
              px: 1,
              borderRadius: 1,
              textTransform: "none",
              color: "text.primary",
              fontWeight: 700,
              fontSize: "0.88rem",
              border: "1px solid",
              borderColor: "divider",
              "&:hover": {
                bgcolor: "action.hover",
                borderColor: "text.disabled",
              },
            }}
          >
            {t("store_settings")}
          </Button>
        </Box>
      </MuiMenu>
    );
  };

  const ProfileMenu = () => (
    <MuiMenu
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      anchorReference="anchorPosition"
      anchorPosition={menuPosition || undefined}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      slotProps={{
        paper: {
          sx: {
            mt: 1.5,
            minWidth: 160,
            boxShadow: theme.shadows[4],
            transformOrigin: "right top !important",
          },
        },
      }}
    >
      <MenuItem onClick={handleProfile}>
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        {t(`profile`)}
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        {t(`logout`)}
      </MenuItem>
    </MuiMenu>
  );


  const RightActions = () => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton
        onClick={handleToggleFullscreen}
        sx={{ color: theme.palette.getContrastText(topbarColor) }}
      >
        <Shrink size={20} />
      </IconButton>
      <Tooltip title={selectedLanguage}>
        <IconButton
          onClick={toggleLanguage}
          sx={{ color: theme.palette.getContrastText(topbarColor) }}
        >
          <Avatar src={selectedFlag} sx={{ width: 30, height: 30 }} />
        </IconButton>
      </Tooltip>

      <ButtonBase
        onClick={handleMenuOpen}
        sx={{ borderRadius: theme.shape.borderRadius }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            sx={{ width: 32, height: 32 }}
            src={userObject?.image}
            alt={userObject?.nameKh}
          />
          {!isExtraSmall && (
            <Typography
              sx={{ color: theme.palette.getContrastText(topbarColor) }}
            >
              {userObject?.nameKh}
            </Typography>
          )}
        </Stack>
      </ButtonBase>

    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        bgcolor: theme.palette.background.default,
      }}
    >

      {!isPosPage && !isMobile && !isTopNav && (
        <Box
          sx={{
            position: "fixed",
            left: 0,
            top: 0,
            height: "100vh",
            width: sidebarWidth,
            bgcolor: sidebarBg,
            color: theme.palette.getContrastText(sidebarBg),
            borderRight: `1px solid ${theme.palette.divider}`,
            zIndex: theme.zIndex.drawer,
            overflow: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
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
              bgcolor: sidebarBg,
              color: theme.palette.getContrastText(sidebarBg),
              borderRight: `1px solid ${theme.palette.divider}`,
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
          marginLeft: !isPosPage && !isMobile && !isTopNav ? `${sidebarWidth}px` : 0,
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
            sx={topbarSx}
          >
            <Toolbar sx={{ justifyContent: "space-between", gap: 1 }}>

              {isMobile && (
                <IconButton
                  onClick={handleDrawerToggle}
                  edge="start"
                  sx={{ color: theme.palette.getContrastText(topbarColor) }}
                >
                  <MenuIcon />
                </IconButton>
              )}


              {!isMobile && isTopNav && !isPosPage && (
                <Box sx={{ flex: 1, overflow: "hidden" }}>
                  <TopNavbar />
                </Box>
              )}


              {!isMobile && !isTopNav && (
                <Box display="flex" gap={1}>
                  {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActiveItem = location.pathname.startsWith(item.path);
                    const buttonSx = {
                      position: "relative",
                      minHeight: 35,
                      borderRadius: 1,
                      px: 1.5,
                      gap: 1,
                      textTransform: "none",
                      fontWeight: isActiveItem ? 700 : 500,
                      color: theme.palette.getContrastText(topbarColor),
                      bgcolor: isActiveItem
                        ? "rgba(255,255,255,0.16)"
                        : "transparent",
                      border: "1px solid",
                      borderColor: isActiveItem
                        ? "rgba(255,255,255,0.28)"
                        : "transparent",
                      boxShadow: isActiveItem
                        ? "0 6px 18px rgba(0,0,0,0.12)"
                        : "none",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.12)",
                        borderColor: "rgba(255,255,255,0.18)",
                      },
                    };
                    const buttonContent = (
                      <>
                        <Box
                          component="span"
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: 1.5,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconComponent size={18} strokeWidth={2.2} />
                        </Box>
                        {item.label}
                        {item.dropdown && <ChevronsUpDown  size={15} />}
                      </>
                    );

                    if (item.dropdown) {
                      return (
                        <Button
                          key={item.path}
                          onClick={handleStoreMenuOpen}
                          sx={buttonSx}
                        >
                          {buttonContent}
                        </Button>
                      );
                    }

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        style={{ textDecoration: "none" }}
                      >
                        <Button sx={buttonSx}>{buttonContent}</Button>
                      </Link>
                    );
                  })}
                </Box>
              )}

              {isMobile && <Box flex={1} />}

              <RightActions />
            </Toolbar>
          </AppBar>
        )}

        {isPosPage && (
          <>
            <AppBar
              position="sticky"
              color="default"
              sx={topbarSx}
            >
              <Toolbar
                sx={{
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  rowGap: 1,
                  py: { xs: 0.5, sm: 0 },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Link
                    to={`/store/pos/${id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button>
                      {!isExtraSmall && (
                        <Typography
                          sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                        >
                          {t("pos_system")}
                        </Typography>
                      )}
                    </Button>
                  </Link>
                  <IconButton
                    onClick={handleOpen}
                    sx={{
                      borderRadius: 1,
                      color: theme.palette.getContrastText(topbarColor),
                      bgcolor: "rgba(255,255,255,0.1)",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                    }}
                  >
                    <GridViewOutlinedIcon fontSize="small" />
                  </IconButton>
                </Stack>

                <Box
                  sx={{
                    flex: { xs: "1 1 100%", sm: "0 1 auto" },
                    order: { xs: 3, sm: 2 },
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                    maxWidth: "100%",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ display: "inline-flex", px: 1 }}
                  >
                    {tabs.map((tab) => (
                      <Button
                        key={tab.key}
                        variant={activeTab === tab.key ? "contained" : "text"}
                        onClick={() => setActiveTab(tab.key)}
                        component={Link}
                        to={tab.link}
                        sx={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          bgcolor:
                            activeTab === tab.key
                              ? theme.palette.primary.main
                              : "transparent",
                          color:
                            activeTab === tab.key
                              ? theme.palette.primary.contrastText
                              : theme.palette.getContrastText(topbarColor),
                          "&:hover": {
                            bgcolor:
                              activeTab === tab.key
                                ? theme.palette.primary.dark
                                : "rgba(255,255,255,0.1)",
                          },
                        }}
                      >
                        {tab.label}
                      </Button>
                    ))}
                  </Stack>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    order: { xs: 2, sm: 3 },
                  }}
                >
                  <Tooltip title={selectedLanguage}>
                    <IconButton
                      onClick={toggleLanguage}
                      sx={{ color: theme.palette.getContrastText(topbarColor) }}
                    >
                      <Avatar src={selectedFlag} sx={{ width: 30, height: 30 }} />
                    </IconButton>
                  </Tooltip>

                  <ButtonBase
                    onClick={handleMenuOpen}
                    sx={{ borderRadius: theme.shape.borderRadius }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar
                        sx={{ width: 32, height: 32 }}
                        src={userObject?.image}
                        alt={userObject?.nameKh}
                      />
                      {!isExtraSmall && (
                        <Typography
                          sx={{
                            color: theme.palette.getContrastText(topbarColor),
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

        <StoreDropdownMenu />
        <ProfileMenu />


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
