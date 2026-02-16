import { useLocation, useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { Avatar, Box, List, ListItem, ListItemButton, ListItemIcon, Stack, Tooltip } from "@mui/material";
import { Category, Messages2, Tag, UserOctagon } from "iconsax-react";
import React, { useState } from "react";

 
import { useThemeContext } from "../Context/ThemeContext";
//Import from project
import "./menuNavbar.scss";
//Icons
import SideBarItems from "./SideBarItems";

export default function MenuMobile({ onNavigate, showLabels }) {
    const navigate = useNavigate();
    let location = useLocation();
    const { sidebarColor, layoutMode } = useThemeContext();
    const labelsVisible = typeof showLabels === 'boolean' ? showLabels : layoutMode !== 'compact';

    const menuData = [
        {
            pageTitle: "Dashboard",
            routeTo: "/dashboard",
            className: location.pathname === "/dashboard" ? "list-item-active" : "list-item",
            pageIncon: <Category className="icon" />,
        },
        {
            pageTitle: "Order",
            routeTo: "/order",
            className:
                location.pathname === "/order" || location.pathname === "/order/view-order-detial"
                    ? "list-item-active"
                    : "list-item",
            pageIncon: <Tag className="icon" />,
        },
        {
            pageTitle: "Chat",
            routeTo: "/chat",
            className: location.pathname === "/chat" ? "list-item-active" : "list-item",
            pageIncon: <Messages2 className="icon" />,
        },  
        {
            pageTitle: "Customer",
            routeTo: "/customer",
            className: location.pathname === "/customer" ? "list-item-active" : "list-item",
            pageIncon: <UserOctagon className="icon" />,
        },
    ];

    return (
        <Box sx={{ backgroundColor: sidebarColor, color: 'white', height: '100%' }}>
        <Stack direction={"column"} justifyContent="space-between" className="menu-container" sx={{ paddingTop: layoutMode === 'compact' ? '60px' : '85px' }}>
            <Stack direction="column" spacing={2}>
                <Stack direction="row" justifyContent="center">
                    <Avatar
                        alt="logo"
                        src={"https://hamariweb.com/profiles/images/profile/6138-763-13405.jpg"}
                        className="avatar-user-mobile"
                    />
                </Stack>
                <List className="list-menu">
                    {menuData?.map((menu) => {
                        return (
                            <ListItem
                                key={menu?.pageTitle}
                                className={menu.className}
                                disablePadding
                                onClick={() => {
                                        navigate(menu?.routeTo);
                                        // notify parent (e.g. to close a drawer on mobile)
                                        if (typeof onNavigate === 'function') onNavigate();
                                    }}
                            >
                                <Tooltip title={menu?.pageTitle} placement="right">
                                    <ListItemButton
                                        className="list-item-button"
                                        sx={{
                                            color: 'white',
                                            justifyContent: labelsVisible ? 'flex-start' : 'center',
                                            px: labelsVisible ? 2 : 0,
                                        }}
                                    >
                                        <ListItemIcon className="list-item-icon-mobile" sx={{ minWidth: 0, display: 'flex', justifyContent: 'center' }}>
                                            {menu?.pageIncon}
                                        </ListItemIcon>
                                        {/* show text in mobile if labelsVisible */}
                                        {labelsVisible && (
                                            <Box sx={{ ml: 1, display: 'inline-block' }}>{menu?.pageTitle}</Box>
                                        )}
                                    </ListItemButton>
                                </Tooltip>
                            </ListItem>
                        );
                    })}
                </List>
            </Stack>

            {/* =================================================== Page Setting =============================================== */}
            <List className="list-menu">
                <ListItem
                    disablePadding
                    onClick={() => navigate("/setting")}
                    className={location.pathname === "/setting" ? "list-item-active" : "list-item"}
                >
                    <Tooltip title="Setting" placement="right">
                        <ListItemButton className="list-item-button" sx={{ color: 'white' }}>
                            <ListItemIcon className="list-item-icon-mobile">
                                <IoSettingsOutline className="icon" />
                            </ListItemIcon>
                            {labelsVisible && <Box sx={{ ml: 1 }}>Setting</Box>}
                        </ListItemButton>
                    </Tooltip>
                </ListItem>
            </List>
        </Stack>
        </Box>
    );
}
