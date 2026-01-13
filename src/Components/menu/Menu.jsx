import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Box from "@mui/material/Box";
import { Link as RouterLink } from "react-router-dom";
import { Grid, Stack, Typography } from "@mui/material";
import { CornerUpLeft, ScrollText } from "lucide-react";
import { ShoppingCart, Users, Warehouse } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { translateLauguage } from "../../function/translate";
import "../../Styles/menu.scss";
export default function Menu({ open, onClose }) {
  const [delayedOpen, setDelayedOpen] = useState(false);
  const { language } = useAuth();
  const { t } = translateLauguage(language);

  const id = localStorage.getItem("activeShopId");

  useEffect(() => {
    let timer;
    if (open) {
      timer = setTimeout(() => setDelayedOpen(true), 200);
    } else {
      setDelayedOpen(false);
    }
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (location.pathname === "/store") {
      setDelayedOpen(false);
      onClose();
    }
  }, [location, onClose]);
  const handleLogout = () => {
    localStorage.removeItem("activeShopId");
    onClose();
  };

  return (
    <SwipeableDrawer
      anchor="top"
      open={delayedOpen}
      onClose={onClose}
      onOpen={() => {}}
      className="menu-drawer"
      sx={{height:'100vh'}}
    >
     
      <Box className="menu-container" onClick={onClose}>
        <Box className="menu-content">
          <Grid container spacing={3}>
            <Grid size={{ xs: 6,sm:4, md: 3 }}>
              <Box
                className="menu-box"
                component={RouterLink}
                to="/store"
                onClick={handleLogout}
                sx={{ bgcolor: "#FF4C61", color: "#FFFFFF" }}
              >
                <Stack textAlign="center" spacing={1}>
                  <Box className="icon">
                    <CornerUpLeft color="#FFD700" size={40} />
                  </Box>
                  <Typography
                    className="text-title"
                    variant="h5"
                    sx={{ color: "#FFFFFF" }}
                  >
                    {t(`exit_the_shop`)}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
            <Grid size={{ xs: 6,sm:4, md: 3 }}>
              <Box
                className="menu-box"
                component={RouterLink}
                to={`/store/pos/${id}`}
             
                sx={{ bgcolor: "#5EE9B5", color: "#FFFFFF" }}
              >
                <Stack textAlign="center" spacing={1}>
                  <Box className="icon">
                    <ShoppingCart color="#62748E" size={40} />
                  </Box>
                  <Typography
                    className="text-title"
                    variant="h5"
                    sx={{ color: "#FFFFFF" }}
                  >
                    {t(`pos`)}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
            <Grid size={{ xs: 6,sm:4, md: 3 }}>
              <Box
                className="menu-box"
                component={RouterLink}
                to={`store/pos/${id}/warehouse-in-shop`}
                onClick={onClose}
                sx={{ bgcolor: "#F9D65C", color: "#000000" }}
              >
                <Stack textAlign="center" spacing={1}>
                  <Box className="icon">
                    <Warehouse color="#37474F" size={40} />
                  </Box>
                  <Typography
                    className="text-title"
                    variant="h5"
                    sx={{ color: "#000000" }}
                  >
                    {t(`warehouse`)}
                  </Typography>
                </Stack>
              </Box>
            </Grid>

            <Grid size={{ xs: 6,sm:4, md: 3 }}>
              <Box
                className="menu-box"
                component={RouterLink}
                to={`store/pos/${id}/warehouse-in-shop`}
                onClick={onClose}
                sx={{ bgcolor: "#4FC3F7", color: "#FFFFFF" }}
              >
                <Stack textAlign="center" spacing={1}>
                  <Box className="icon">
                    <ScrollText color="#1565C0" size={40} />
                  </Box>
                  <Typography
                    className="text-title"
                    variant="h5"
                    sx={{ color: "#FFFFFF" }}
                  >
                    {t(`report`)}
                  </Typography>
                </Stack>
              </Box>
            </Grid>

            <Grid size={{ xs: 6,sm:4, md: 3 }}>
              <Box
                className="menu-box"
                component={RouterLink}
                to={`store/pos/${id}/warehouse-in-shop`}
                onClick={onClose}
                sx={{ bgcolor: "#1976D2", color: "#FFFFFF" }}
              >
                <Stack textAlign="center" spacing={1}>
                  <Box className="icon">
                    <Users color="#BBDEFB" size={40} />
                  </Box>
                  <Typography
                    className="text-title"
                    variant="h5"
                    sx={{ color: "#FFFFFF" }}
                  >
                    {t(`staff`)}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
}
