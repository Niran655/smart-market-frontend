import {
  CategoryOutlined,
  GroupOutlined,
  Inventory2Outlined,
  LocalShippingOutlined,
  PeopleAltOutlined,
  RestaurantOutlined,
  SecurityOutlined,
  StraightenOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
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
  FileText,
  LayoutDashboard,
  RotateCcw,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Warehouse,
} from "lucide-react";

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


  const isCompact = layoutMode === "compact";

  const menuData = [
    { type: "section", pageTitle: t("main") },
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
      pageTitle: "AI Chat",
      routeTo: "/chat",
      pageIcon: <BotMessageSquare className="icon" />,
    },
    { type: "section", pageTitle: t("sales") },
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
      pageTitle: t("period_invoice") || "Invoice",
      routeTo: "/invoice",
      pageIcon: <FileText className="icon" />,
    },
    {
      pageTitle: t("total_sale_return") || "Sales Return",
      routeTo: "/sale-return",
      pageIcon: <RotateCcw className="icon" />,
    },
    { type: "section", pageTitle: t("finance") || "Finance" },
    {
      pageTitle: t("income_report") || "Income",
      routeTo: "/income",
      pageIcon: <TrendingUp className="icon" />,
    },
    {
      pageTitle: t("period_expense") || "Expense",
      routeTo: "/expense",
      pageIcon: <TrendingDown className="icon" />,
    },
    { type: "section", pageTitle: t("inventory") },
    {
      pageTitle: t("warehouse"),
      routeTo: "/warehouse",
      pageIcon: <Warehouse className="icon" />,
    },
    {
      pageTitle: t("products"),
      routeTo: "/setting/product",
      pageIcon: <Inventory2Outlined className="icon" />,
    },
    {
      pageTitle: t("category"),
      routeTo: "/setting/category",
      pageIcon: <CategoryOutlined className="icon" />,
    },
    {
      pageTitle: t("unit"),
      routeTo: "/setting/unit",
      pageIcon: <StraightenOutlined className="icon" />,
    },
    { type: "section", pageTitle: t("people") },
    {
      pageTitle: t("user"),
      routeTo: "/setting/user",
      pageIcon: <GroupOutlined className="icon" />,
    },
    {
      pageTitle: t("suppliers"),
      routeTo: "/setting/supplier",
      pageIcon: <LocalShippingOutlined className="icon" />,
    },
    {
      pageTitle: t("customer"),
      routeTo: "/setting/customer",
      pageIcon: <PeopleAltOutlined className="icon" />,
    },
    {
      pageTitle: t("permission"),
      routeTo: "/setting/permission",
      pageIcon: <SecurityOutlined className="icon" />,
    },
    { type: "section", pageTitle: t("restaurant") },
    {
      pageTitle: t("table"),
      routeTo: "/setting/table",
      pageIcon: <RestaurantOutlined className="icon" />,
    },
  ];

  const textColor = getContrastText(sidebarColor);

  const isActive = (menu) => {
    const paths = menu.matchPaths || [menu.routeTo];
    return paths.some((path) => location.pathname === path);
  };

  const handleItemClick = (menu) => {
    if (menu.routeTo) {
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
          {menuData.map((menu, index) => {
            const menuKey = `${menu.type || "item"}-${menu.routeTo || menu.pageTitle}-${index}`;

            if (menu.type === "section") {
              if (isCompact) return null;

              const isFirstSection = index === 0;

              return (
                <Typography
                  key={menuKey}
                  sx={{
                    color: `${textColor}99`,
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    textAlign: "left",
                    px: 1.25,
                    pt: 2.25,
                    pb: 0.75,
                    textTransform: "capitalize",
                    borderTop: isFirstSection ? "none" : "1px solid rgba(255,255,255,0.08)",
                    mt: isFirstSection ? 0 : 1.25,
                  }}
                >
                  {menu.pageTitle}
                </Typography>
              );
            }

            const active = isActive(menu);

            const row = (
              <ListItem
                key={menuKey}
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
                    </>
                  )}
                </ListItemButton>
              </ListItem>
            );

            return (
              <Box key={menuKey}>
                {/* Wrap icon-only in Tooltip */}
                {isCompact ? (
                  <Tooltip title={menu.pageTitle} placement="right" arrow>
                    {row}
                  </Tooltip>
                ) : (
                  row
                )}
              </Box>
            );
          })}
        </List>
      </Box>
 
    </Box>
  );
}
