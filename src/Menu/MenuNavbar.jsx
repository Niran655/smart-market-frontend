import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  BadgePercent,
  BotMessageSquare,
  ChartNoAxesColumn,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Users,
  Warehouse,
} from "lucide-react";
import { useState } from "react";

import logo from "../assets/Image/small-logo.png";
import { useThemeContext } from "../Context/ThemeContext";
import "./menuNavbar.scss";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";

function getContrastText(hexColor) {
  if (!hexColor || !hexColor.startsWith("#")) return "#ffffff";
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

export default function MenuNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const { sidebarColor, layoutMode, setLayoutMode } = useThemeContext();
  const [openDropdown, setOpenDropdown] = useState(null);

   
  const isCompact = layoutMode === "compact";

  const menuData = [
    {
      pageTitle: t("dashboard"),
      routeTo: "/dashboard",
      pageIcon: <LayoutDashboard className="icon" />,
    },
     {
      pageTitle: t("report"),
      routeTo: "/report",
      pageIcon: <ChartNoAxesColumn className="icon" />,
    },
    {
      pageTitle: t("warehouse"),
      routeTo: "/warehouse",
      pageIcon: <Warehouse className="icon" />,
    },
    {
      pageTitle: t("orders"),
      routeTo: "/order",
      pageIcon: <ShoppingCart className="icon" />,
      matchPaths: ["/order", "/order/view-order-detail"],
    },
    {
      pageTitle: t("sale"),
      routeTo: "/on-sale",
      pageIcon: <BadgePercent className="icon" />,
    },
    {
      pageTitle: t("customer"),
      routeTo: "/customer",
      pageIcon: <Users className="icon" />,
      matchPaths: ["/customer", "/customer/customer-detail"],
    },
   
    {
      pageTitle: "AI Chat",
      routeTo: "/chat",
      pageIcon: <BotMessageSquare className="icon" />,
    },
  ];

  const textColor = getContrastText(sidebarColor);

  const isActive = (menu) => {
    const paths = menu.matchPaths || [menu.routeTo];
    return paths.some((path) => location.pathname === path);
  };

  const handleItemClick = (menu) => {
    if (menu.children) {
      setOpenDropdown((prev) =>
        prev === menu.pageTitle ? null : menu.pageTitle
      );
    } else {
      navigate(menu.routeTo);
    }
  };

  const handleLogoClick = () => {
    setLayoutMode(isCompact ? "default" : "compact");
  };

 
  const itemSx = (active) => ({
    backgroundColor: active ? "rgba(255,255,255,0.1)" : "transparent",
    borderRadius: "6px",
    border: active
      ? "1px solid rgba(255,255,255,0.12)"
      : "1px solid transparent",
    mb: "2px",
    transition: "background-color 0.15s ease, border-color 0.15s ease",
    "&:hover": {
      backgroundColor: active
        ? "rgba(255,255,255,0.1)"
        : "rgba(255,255,255,0.06)",
    },
  });

  const btnSx = {
    color: textColor,
    borderRadius: "6px",
    px: isCompact ? 0 : 1.25,
    py: 0.75,
    minHeight: 36,
    justifyContent: isCompact ? "center" : "flex-start",
  };

  return (
    <Box
      sx={{
        backgroundColor: sidebarColor,
        color: textColor,
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(255,255,255,0.18)",
          borderRadius: "2px",
        },
      }}
    >
      
      <Stack
        direction="row"
        alignItems="center"
        spacing={isCompact ? 0 : 1.5}
        justifyContent={isCompact ? "center" : "flex-start"}
        sx={{
          px: isCompact ? 0 : 2,
          py: 2.3,
          flexShrink: 0,
          borderBottom: `1px solid rgba(255,255,255,0.07)`,
        }}
      >
        <Tooltip title={isCompact ? "Default" : "Compact"} placement="right" arrow>
          <Avatar
            alt="logo"
            src={logo}
            onClick={handleLogoClick}
            sx={{
              width: 28,
              height: 28,
              borderRadius: 0,
              flexShrink: 0,
              cursor: "pointer",
            }}
          />
        </Tooltip>
        {!isCompact && (
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.8125rem",
              color: textColor,
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
              opacity: 0.95,
            }}
          >
            LIKA WEB APP SYSTEM
          </Typography>
        )}
      </Stack>

      {/* ── Menu items ──────────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        <List sx={{ px: 1, pt: 1.5, pb: 0 }}>
          {menuData.map((menu) => {
            const active = isActive(menu);
            const hasChildren = !!menu.children;
            const isOpen = openDropdown === menu.pageTitle;

            const row = (
              <ListItem
                key={menu.pageTitle}
                disablePadding
                sx={itemSx(active)}
                onClick={() => handleItemClick(menu)}
              >
                <ListItemButton sx={btnSx}>
                  {/* Icon */}
                  <ListItemIcon
                    sx={{
                      color: active ? textColor : `${textColor}99`,
                      minWidth: 0,
                      mr: isCompact ? 0 : 1.25,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      "& svg, & .icon": { width: 18, height: 18 },
                    }}
                  >
                    {menu.pageIcon}
                  </ListItemIcon>

                  {/* Label */}
                  {!isCompact && (
                    <>
                      <Typography
                        sx={{
                          fontSize: "0.8375rem",
                          fontWeight: active ? 600 : 400,
                          color: active ? textColor : `${textColor}cc`,
                          flexGrow: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: 1.4,
                        }}
                      >
                        {menu.pageTitle}
                      </Typography>

                      {/* Chevron */}
                      {hasChildren &&
                        (isOpen ? (
                          <ExpandLess
                            sx={{ fontSize: 15, color: `${textColor}88`, flexShrink: 0 }}
                          />
                        ) : (
                          <ExpandMore
                            sx={{ fontSize: 15, color: `${textColor}88`, flexShrink: 0 }}
                          />
                        ))}
                    </>
                  )}
                </ListItemButton>
              </ListItem>
            );

            return (
              <Box key={menu.pageTitle}>
                {/* Wrap icon-only in Tooltip */}
                {isCompact ? (
                  <Tooltip title={menu.pageTitle} placement="right" arrow>
                    {row}
                  </Tooltip>
                ) : (
                  row
                )}

                {/* Dropdown children */}
                {hasChildren && (
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: isCompact ? 0.5 : 1 }}>
                      {menu.children.map((child) => {
                        const childActive = location.pathname === child.routeTo;
                        return (
                          <ListItem
                            key={child.pageTitle}
                            disablePadding
                            sx={itemSx(childActive)}
                            onClick={() => navigate(child.routeTo)}
                          >
                            <ListItemButton
                              sx={{ ...btnSx, px: isCompact ? 0 : 1.25, py: 0.625 }}
                            >
                              {/* Dot for non-compact child */}
                              {!isCompact && (
                                <Box
                                  sx={{
                                    width: 4,
                                    height: 4,
                                    borderRadius: "50%",
                                    bgcolor: childActive ? textColor : `${textColor}55`,
                                    mr: 1.75,
                                    ml: 0.5,
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                              <Typography
                                sx={{
                                  fontSize: "0.8rem",
                                  fontWeight: childActive ? 600 : 400,
                                  color: childActive ? textColor : `${textColor}aa`,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {child.pageTitle}
                              </Typography>
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </List>
      </Box>

      {/* ── Settings pinned at bottom ────────────────────────────────────── */}
      <Box
        sx={{
          flexShrink: 0,
          borderTop: `1px solid rgba(255,255,255,0.07)`,
          px: 1,
          py: 1,
        }}
      >
        {isCompact ? (
          <Tooltip title={t("setting")} placement="right" arrow>
            <ListItem
              disablePadding
              sx={itemSx(location.pathname === "/setting")}
              onClick={() => navigate("/setting")}
            >
              <ListItemButton
                sx={{ ...btnSx, justifyContent: "center" }}
              >
                <ListItemIcon
                  sx={{
                    color:
                      location.pathname === "/setting"
                        ? textColor
                        : `${textColor}99`,
                    minWidth: 0,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Settings size={18} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ) : (
          <ListItem
            disablePadding
            sx={itemSx(location.pathname === "/setting")}
            onClick={() => navigate("/setting")}
          >
            <ListItemButton sx={btnSx}>
              <ListItemIcon
                sx={{
                  color:
                    location.pathname === "/setting"
                      ? textColor
                      : `${textColor}99`,
                  minWidth: 0,
                  mr: 1.25,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Settings size={18} />
              </ListItemIcon>
              <Typography
                sx={{
                  fontSize: "0.8375rem",
                  fontWeight: location.pathname === "/setting" ? 600 : 400,
                  color:
                    location.pathname === "/setting"
                      ? textColor
                      : `${textColor}cc`,
                  whiteSpace: "nowrap",
                }}
              >
                {t("setting")}
              </Typography>
            </ListItemButton>
          </ListItem>
        )}
      </Box>
    </Box>
  );
}
