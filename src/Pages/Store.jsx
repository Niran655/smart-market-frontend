import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { BookmarkX, ChartBarStacked, LogIn, Search } from "lucide-react";
import { useEffect, useState } from "react";

import ShopAction from "../Components/Shop/ShopAction";
import ShopForm from "../Components/Shop/ShopForm";
import { useAuth } from "../context/AuthContext";
import { GET_ALL_SHOP } from "../../graphql/queries";
import { translateLauguage } from "../function/translate";
const Store = () => {
  const { language, userRole } = useAuth();
  const { t } = translateLauguage(language);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [userObject, setUserObject] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserObject(JSON.parse(storedUser));
    }
  }, []);

  const { data, refetch, loading } = useQuery(GET_ALL_SHOP, {
    variables: {
      id: "",
    },
  });

  const handleJoinShop = (shopId) => {
    localStorage.setItem("activeShopId", shopId);
    navigate(`/store/pos/${shopId}`);
  };

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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        mt={5}
      >
        <Grid container spacing={2} alignItems="center" textAlign="start">
          <Grid size={{ xs: 12 }}>
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
          {(userRole === "superAdmin" || userRole === "admin") && (
            <Button
              variant="contained"
              startIcon={<LibraryAddOutlinedIcon size={18} />}
              onClick={handleOpen}
            >
              {t("create")}
            </Button>
          )}
          {open && (
            <ShopForm
              open={open}
              dialogTitle={"Create"}
              setRefetch={refetch}
              onClose={handleClose}
              t={t}
            />
          )}
        </Stack>
      </Box>

      <Grid container spacing={3} mt={4}>
        {data?.getAllShops?.map((shop, index) => (
          <Grid size={{ xs: 12, md: 6, sm: 12 }} key={index}>
            <Card sx={{ p: 2 }}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="start"
                justifyContent={"space-between"}
              >
                <Stack direction={"row"} spacing={2} alignItems={"center"}>
                  <img
                    src={shop.image}
                    alt={shop.nameKh}
                    width={80}
                    height={80}
                    style={{ borderRadius: "5px" }}
                  />

                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {language === "en" ? shop.nameEn : shop.nameKh}
                    </Typography>
                    <Stack direction={"column"} spacing={1} mt={2}>
                      <Button
                        startIcon={<LogIn size={16} />}
                        size="small"
                        variant="contained"
                        onClick={() => handleJoinShop(shop._id)}
                      >
                        {t("join_in_shop")}
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{ bgcolor: "red" }}
                        startIcon={<BookmarkX size={16} />}
                      >
                        {t(`close_shop`)}
                      </Button>
                    </Stack>
                  </Box>
                </Stack>

                <Stack direction={"row"} spacing={2}>
                  <Stack direction={"row"} spacing={2}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<ChartBarStacked />}
                    >
                      {t(`report`)}
                    </Button>
                    <ShopAction
                      setRefetch={refetch}
                      t={t}
                      shopData={shop}
                      shopId={shop?._id}
                      shopName={shop?.nameEn}
                      userId={userObject?._id}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Store;
