import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { Avatar, Box, Collapse, List, ListItem, ListItemButton, ListItemIcon, Stack, Typography } from "@mui/material";
import { Bag2, Category, DocumentText1, HomeHashtag, Messages2, Tag, UserOctagon } from "iconsax-react";
import { useState } from "react";

import logo from "../assets/Image/logo.png";
import { useThemeContext } from "../Context/ThemeContext";
import "./menuNavbar.scss";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";

 
function getContrastText(hexColor) {
   
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
   const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export default function MenuNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const {language} = useAuth();
  const {t} = translateLauguage(language);

  const { sidebarColor, layoutMode } = useThemeContext();
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuData = [
    {
      pageTitle: t(`dashboard`),
      routeTo: "/dashboard",
      pageIcon: <Category className="icon" />,
    },
    {
      pageTitle: t(`warehouse`),
      routeTo: "/warehouse",
      pageIcon: <HomeHashtag className="icon" />,
    },
    {
      pageTitle: t(`orders`),
      routeTo: "/order",
      pageIcon: <Tag className="icon" />,
      matchPaths: ["/order", "/order/view-order-detail"],
    },
    {
      pageTitle: t(`message`),
      routeTo: "/chat",
      pageIcon: <Messages2 className="icon" />,
    },
    {
      pageTitle: t(`sale`),
      routeTo: "/on-sale",
      pageIcon: <Bag2 className="icon" />,
    },
    {
      pageTitle: t(`customer`),
      routeTo: "/customer",
      pageIcon: <UserOctagon className="icon" />,
      matchPaths: ["/customer", "/customer/customer-detail"],
    },
    {
      pageTitle: t(`report`),
      routeTo: "/report",
      pageIcon: <DocumentText1 className="icon" />,
    },
  ];

 
  const textColor = getContrastText(sidebarColor);

  const isActive = (menu) => {
    const paths = menu.matchPaths || [menu.routeTo];
    return paths.some((path) => location.pathname === path);
  };

  return (
    <Box
      sx={{
        backgroundColor: sidebarColor,
        color: textColor,
        height: "100vh",
        position: "sticky",
        top: 0,
        overflowY: "auto",               
        paddingTop: "10px",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "rgba(255, 255, 255, 0.1)",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(255, 255, 255, 0.3)",
          borderRadius: "3px",
        },
      }}
    >
      <Stack
        direction="column"
        justifyContent="space-between"
        sx={{ minHeight: "100%" }}       
      >
   
        <Stack direction="column" spacing={3} sx={{ px: 2 }}>
         <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            justifyContent="center"
            
          >
            <Avatar alt="logo" src={logo} sx={{ width: 48, height: 48 }} />
            {layoutMode !== "compact" && (
              <Stack direction="column">
                <Typography sx={{ fontWeight: 600, color: textColor }}>
                  LIKA COMPANY
                </Typography>
              </Stack>
            )}
          </Stack>

          <List >
            {menuData.map((menu) => {
              const active = isActive(menu);
              const hasChildren = !!menu.children;

              return (
                <Box key={menu.pageTitle} >
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
                      borderRadius: "8px",
                      border: active ? "1.5px solid rgba(255,255,255,0.1)" : "none",
                      
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
                        color: textColor,                     // dynamic text color
                        justifyContent:
                          layoutMode === "compact" ? "center" : "flex-start",
                        px: layoutMode === "compact" ? 0 : 2,
                        borderRadius: "8px",
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
                            <Typography sx={{ ml: 1, flexGrow: 1, color: textColor }}>
                              {menu.pageTitle}
                            </Typography>
                            {hasChildren &&
                              (openDropdown === menu.pageTitle ? (
                                <ExpandLess fontSize="small" sx={{ color: textColor }} />
                              ) : (
                                <ExpandMore fontSize="small" sx={{ color: textColor }} />
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
                              <ListItemButton sx={{ pl: 6, color: textColor }}>
                                <Typography sx={{ color: textColor }}>
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
        </Stack>

        {/* Settings at bottom */}
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
            <ListItemButton sx={{ color: textColor }}>
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
                    borderRadius: "50%",
                  }}
                >
                  <IoSettingsOutline size={25} className="icon" />
                </ListItemIcon>
                {layoutMode !== "compact" && (
                  <Typography sx={{ ml: 1, color: textColor }}>{t(`setting`)}</Typography>
                )}
              </Stack>
            </ListItemButton>
          </ListItem>
        </List>
      </Stack>
    </Box>
  );
}