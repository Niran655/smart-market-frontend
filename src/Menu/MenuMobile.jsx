import { ExpandLess, ExpandMore } from "@mui/icons-material"; // kept for potential future use
import { useLocation, useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import {
  Avatar,
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  Typography,
} from "@mui/material";
import {
  Bag2,
  Category,
  DocumentText1,
  HomeHashtag,
  Messages2,
  Shop,          // for Store page
  Tag,
  UserOctagon,
} from "iconsax-react";
import { useState } from "react";

import { useThemeContext } from "../Context/ThemeContext";
import "./menuNavbar.scss";

export default function MenuMobile({ onNavigate, showLabels }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarColor, layoutMode } = useThemeContext();

  // Determine if labels should be shown (passed prop overrides layout mode)
  const labelsVisible =
    typeof showLabels === "boolean" ? showLabels : layoutMode !== "compact";

  // Full list of menu items (merged from topbar and desktop sidebar)
  const menuData = [
    {
      pageTitle: "Dashboard",
      routeTo: "/dashboard",
      pageIcon: <Category className="icon" />,
    },
    {
      pageTitle: "Store",
      routeTo: "/store",
      pageIcon: <Shop className="icon" />,
    },
    {
      pageTitle: "Warehouse",
      routeTo: "/warehouse",
      pageIcon: <HomeHashtag className="icon" />,
    },
    {
      pageTitle: "Order",
      routeTo: "/order",
      pageIcon: <Tag className="icon" />,
      matchPaths: ["/order", "/order/view-order-detail"],
    },
    {
      pageTitle: "Chat",
      routeTo: "/chat",
      pageIcon: <Messages2 className="icon" />,
    },
    {
      pageTitle: "On Sale",
      routeTo: "/on-sale",
      pageIcon: <Bag2 className="icon" />,
    },
    {
      pageTitle: "Customer",
      routeTo: "/customer",
      pageIcon: <UserOctagon className="icon" />,
      matchPaths: ["/customer", "/customer/customer-detail"],
    },
    {
      pageTitle: "Reports",
      routeTo: "/report",
      pageIcon: <DocumentText1 className="icon" />,
    },
  ];

  const isActive = (menu) => {
    const paths = menu.matchPaths || [menu.routeTo];
    return paths.some((path) => location.pathname === path);
  };

  return (
    <Box
      sx={{
        backgroundColor: sidebarColor,
        color: "white",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        direction="column"
        justifyContent="space-between"
        sx={{ flex: 1, py: 2 }}
      >
        {/* Avatar and main menu */}
        <Stack direction="column" spacing={2} alignItems="center">
          <Avatar
            alt="logo"
            src="https://hamariweb.com/profiles/images/profile/6138-763-13405.jpg"
            sx={{
              width: labelsVisible ? 48 : 40,
              height: labelsVisible ? 48 : 40,
              mt: 1,
            }}
          />

          <List sx={{ width: "100%", px: 0 }}>
            {menuData.map((menu) => {
              const active = isActive(menu);

              return (
                <ListItem
                  key={menu.pageTitle}
                  disablePadding
                  onClick={() => {
                    navigate(menu.routeTo);
                    if (typeof onNavigate === "function") onNavigate();
                  }}
                  sx={{
                    backgroundColor: active
                      ? "rgba(255, 255, 255, 0.15)"
                      : "transparent",
                    transition: "background-color 0.3s ease",
                    "&:hover": {
                      backgroundColor: active
                        ? "rgba(255, 255, 255, 0.15)"
                        : "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <ListItemButton
                    sx={{
                      color: "white",
                      justifyContent: labelsVisible ? "flex-start" : "center",
                      px: labelsVisible ? 2 : 0,
                      py: 1,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        display: "flex",
                        justifyContent: "center",
                        mr: labelsVisible ? 2 : 0,
                        color: "inherit",
                      }}
                    >
                      {menu.pageIcon}
                    </ListItemIcon>
                    {labelsVisible && (
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, lineHeight: 1.5 }}
                      >
                        {menu.pageTitle}
                      </Typography>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Stack>

        {/* Settings at bottom */}
        <List sx={{ width: "100%", px: 0 }}>
          <ListItem
            disablePadding
            onClick={() => {
              navigate("/setting");
              if (typeof onNavigate === "function") onNavigate();
            }}
            sx={{
              backgroundColor:
                location.pathname === "/setting"
                  ? "rgba(255, 255, 255, 0.15)"
                  : "transparent",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor:
                  location.pathname === "/setting"
                    ? "rgba(255, 255, 255, 0.15)"
                    : "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemButton
              sx={{
                color: "white",
                justifyContent: labelsVisible ? "flex-start" : "center",
                px: labelsVisible ? 2 : 0,
                py: 1,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  display: "flex",
                  justifyContent: "center",
                  mr: labelsVisible ? 2 : 0,
                  color: "inherit",
                }}
              >
                <IoSettingsOutline size={25} className="icon" />
              </ListItemIcon>
              {labelsVisible && (
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Setting
                </Typography>
              )}
            </ListItemButton>
          </ListItem>
        </List>
      </Stack>
    </Box>
  );
}