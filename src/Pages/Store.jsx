import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { Box, Breadcrumbs, Button, Grid, InputAdornment, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Search } from "lucide-react";
import React from "react";

import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../Function/translate";
const Store = () => {
    const {language}  = useAuth()
    const {t} = translateLauguage(language);
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
              {t("store")}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Stack>
            <Box className="filter-box" mt={5}>
        <Grid container spacing={2} alignItems="center" textAlign={"start"}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              {t("search")}
            </Typography>
            <TextField
              type="search"
              size="small"
              placeholder={t("search") + "..."}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} mt={3}>
          <Button
            variant="contained"
            startIcon={<LibraryAddOutlinedIcon size={18} />}
           
          >
            {t("create")}
          </Button>
        </Stack>
       
      </Box>
    </Box>
  );
};

export default Store;
