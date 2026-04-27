import { Link as RouterLink } from "react-router-dom";
import { Box, Breadcrumbs, Grid, Paper, Stack, Typography } from "@mui/material";

import Product from "../assets/Image/best-product.png";
import Category from "../assets/Image/category.png";
import Supplier from "../assets/Image/supplier.png";
import Unit from "../assets/Image/unit.png";
import User from "../assets/Image/man.png";
import Table from "../assets/Image/table.png";
import Customer from "../assets/Image/customer.png";
import { useAuth } from "../context/AuthContext";
import "../Styles/setting.scss";
import { translateLauguage } from "../function/translate";
 

export default function Settings() {
  const { language } = useAuth();
  const { t } = translateLauguage(language);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box textAlign="start">
          <Breadcrumbs aria-label="breadcrumb" separator="/">
            <Typography
              variant="h6"
              sx={{
                textDecoration: "none",
                borderLeft: "3px solid #1D4592",
                pl: 1.5,
                fontWeight: 600,
              }}
            >
              {t("setting")}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Stack>
    

      <Grid container spacing={3} mt={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            className="setting-box"
            component={RouterLink}
            to="/setting/user"
            sx={{ cursor: "pointer", textDecoration: "none" }}
          >
            <Box>
              <img src={User} className="image" alt="User" />
            </Box>
            <Stack textAlign="start" spacing={1}>
              <Typography className="text-title" variant="h5">
                {t(`user`)}
              </Typography>
              <Typography className="text-body">
                {t(`create_update_delete`)} {t(`user`)}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            className="setting-box"
            component={RouterLink}  
            to="/setting/unit"
            sx={{ cursor: "pointer", textDecoration: "none" }}
          >
            <Box>
              <img src={Unit} className="image" alt="Unit" />
            </Box>
            <Stack textAlign="start" spacing={1}>
              <Typography className="text-title" variant="h5">
                {t(`unit`)}
              </Typography>
              <Typography className="text-body">
                {t(`create_update_delete`)} {t(`unit`)}
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            className="setting-box"
            component={RouterLink}
            to="/setting/category"
            sx={{ cursor: "pointer", textDecoration: "none" }}
          >
            <Box>
              <img src={Category} className="image" alt="Category" />
            </Box>
            <Stack textAlign="start" spacing={1}>
              <Typography className="text-title" variant="h5">
                {t(`category`)}
              </Typography>
              <Typography className="text-body">
                {t(`create_update_delete`)} {t(`category`)}
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            className="setting-box"
            component={RouterLink}
            to="/setting/product"
            sx={{ cursor: "pointer", textDecoration: "none" }}
          >
            <Box>
              <img src={Product} className="image" alt="Product" />
            </Box>
            <Stack textAlign="start" spacing={1}>
              <Typography className="text-title" variant="h5">
                {t(`products`)}
              </Typography>
              <Typography className="text-body">
                {t(`create_update_delete`)} {t(`products`)}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            className="setting-box"
            component={RouterLink}
            to="/setting/supplier"
            sx={{ cursor: "pointer", textDecoration: "none" }}
          >
            <Box>
              <img src={Supplier} className="image" alt="Supplier" />
            </Box>
            <Stack textAlign="start"  spacing={1}>
              <Typography className="text-title" variant="h5">
                {t(`suppliers`)}
              </Typography>
              <Typography className="text-body">
                {t(`create_update_delete`)} {t(`suppliers`)}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            className="setting-box"
            component={RouterLink}
            to="/setting/customer"
            sx={{ cursor: "pointer", textDecoration: "none" }}
          >
            <Box>
              <img src={Customer} className="image" alt="Customer" />
            </Box>
            <Stack textAlign="start"  spacing={1}>
              <Typography className="text-title" variant="h5">
                {t(`customer`)}
              </Typography>
              <Typography className="text-body">
                {t(`create_update_delete`)} {t(`customer`)}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            className="setting-box"
            component={RouterLink}
            to="/setting/table"
            sx={{ cursor: "pointer", textDecoration: "none" }}
          >
            <Box>
              <img src={Table} className="image" alt="Table" />
            </Box>
            <Stack textAlign="start"  spacing={1}>
              <Typography className="text-title" variant="h5">
                {t(`table`)}
              </Typography>
              <Typography className="text-body">
                {t(`create_update_delete`)} {t(`table`)}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
