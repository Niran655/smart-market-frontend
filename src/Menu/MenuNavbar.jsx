import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { Avatar, Box, Collapse, List, ListItem, ListItemButton, ListItemIcon, Stack, Typography } from "@mui/material";
import { Bag2, Category, DocumentText1, House2, Messages2, Tag, User, UserOctagon } from "iconsax-react";
import { useState } from "react";

import logo from "../assets/Image/logo.png";
import { useThemeContext } from "../Context/ThemeContext";
import "./menuNavbar.scss";

export default function MenuNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarColor, layoutMode } = useThemeContext();
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuData = [
    {
      pageTitle: "Dashboard",
      routeTo: "/dashboard",
      pageIcon: <Category className="icon" />,
    },
    // {
    //   pageTitle: "Student",
    //   pageIcon: <User className="icon" />,
    //   matchPaths: ["/student-grid", "/student/details"],
    //   children: [
    //     {
    //       pageTitle: "All Student",
    //       routeTo: "/student-grid",
    //     },
    //     {
    //       pageTitle: "Student List",
    //       routeTo: "/student-list",
    //     },
    //   ], 
    // },
    {
      pageTitle: "Warehouse",
      routeTo: "/warehouse",
      pageIcon: <House2 className="icon" />,
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
        height: "100vh",
        paddingTop: "10px",
        position: "sticky",
        top: 0,
      }}
    >
      <Stack
        direction="column"
        justifyContent="space-between"
        sx={{ height: "100%" }}
      >
        {/* Top section */}
        <Stack direction="column" spacing={3} sx={{ px: 2 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar alt="logo" src={logo} sx={{ width: 48, height: 48 }} />
            {layoutMode !== "compact" && (
              <Stack direction="column">
                <Typography sx={{ fontWeight: 600 }}>Welcome</Typography>
              </Stack>
            )}
          </Stack>

          <List>
            {menuData.map((menu) => {
              const active = isActive(menu);
              const hasChildren = !!menu.children;

              return (
                <Box key={menu.pageTitle}>
                  <ListItem
                    disablePadding
                    className={active ? "list-item-active" : "list-item"}
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
                    onClick={() => {
                      if (hasChildren) {
                        setOpenDropdown((prev) =>
                          prev === menu.pageTitle ? null : menu.pageTitle
                        );
                      } else {
                        navigate(menu.routeTo);
                      }
                    }}
                  >
                    <ListItemButton
                      sx={{
                        color: "white",
                        justifyContent:
                          layoutMode === "compact" ? "center" : "flex-start",
                        px: layoutMode === "compact" ? 0 : 2,
                      }}
                    >
                      {layoutMode !== "compact" && <Box sx={{ width: 6 }} />}
                      <Stack
                        direction="row"
                        alignItems="center"
                        sx={{
                          justifyContent:
                            layoutMode === "compact" ? "center" : "flex-start",
                          width: "100%",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: "inherit",
                            minWidth: 0,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          {menu.pageIcon}
                        </ListItemIcon>
                        {layoutMode !== "compact" && (
                          <>
                            <Typography sx={{ ml: 1, flexGrow: 1 }}>
                              {menu.pageTitle}
                            </Typography>
                            {hasChildren &&
                              (openDropdown === menu.pageTitle ? (
                                <ExpandLess fontSize="small" />
                              ) : (
                                <ExpandMore fontSize="small" />
                              ))}
                          </>
                        )}
                      </Stack>
                    </ListItemButton>
                  </ListItem>

                  {hasChildren && (
                    <Collapse
                      in={openDropdown === menu.pageTitle}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {menu.children.map((child) => {
                          const childActive =
                            location.pathname === child.routeTo;
                          return (
                            <ListItem
                              key={child.pageTitle}
                              disablePadding
                              onClick={() => navigate(child.routeTo)}
                              sx={{
                                backgroundColor: childActive
                                  ? "rgba(255, 255, 255, 0.15)"
                                  : "transparent",
                                transition: "background-color 0.3s ease",
                                "&:hover": {
                                  backgroundColor: childActive
                                    ? "rgba(255, 255, 255, 0.15)"
                                    : "rgba(255, 255, 255, 0.1)",
                                },
                              }}
                            >
                              <ListItemButton sx={{ pl: 6, color: "white" }}>
                                <Typography>{child.pageTitle}</Typography>
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
        </Stack>

        <List sx={{ px: 2, pb: 2 }}>
          <ListItem
            disablePadding
            onClick={() => navigate("/setting")}
            sx={{
              backgroundColor:
                location.pathname === "/setting"
                  ? "rgba(255, 255, 255, 0.15)"
                  : "transparent",
              transition: "background-color 0.3s ease",
              textAlign: "center",
              "&:hover": {
                backgroundColor:
                  location.pathname === "/setting"
                    ? "rgba(255, 255, 255, 0.15)"
                    : "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemButton sx={{ color: "white" }}>
              <Box sx={{ width: 6 }} />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent={
                  layoutMode === "compact" ? "center" : "flex-start"
                }
                sx={{ width: "100%" }}
              >
                <ListItemIcon
                  sx={{
                    color: "inherit",
                    minWidth: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <IoSettingsOutline size={25} className="icon" />
                </ListItemIcon>
                {layoutMode !== "compact" && (
                  <Typography sx={{ ml: 1 }}>Setting</Typography>
                )}
              </Stack>
            </ListItemButton>
          </ListItem>
        </List>
      </Stack>
    </Box>
  );
}
