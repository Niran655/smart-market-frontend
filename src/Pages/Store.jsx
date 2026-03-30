import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { useQuery, useLazyQuery } from "@apollo/client/react";
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

import { BookmarkX, ChartBarStacked, LogIn, Search, Settings } from "lucide-react";
import { useEffect, useState } from "react";

import ShopAction from "../Components/Shop/ShopAction";
import ShopForm from "../Components/Shop/ShopForm";


import { GET_ALL_SHOP, GET_OPEN_SHIFT } from "../../graphql/queries";

import { translateLauguage } from "../function/translate";
import { useAuth } from "../context/AuthContext";


const Store = () => {
  const { language, userRole, setAlert, quickAlert } = useAuth();
  const { t } = translateLauguage(language);

  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

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



  const [checkOpenShift] = useLazyQuery(GET_OPEN_SHIFT);


  const handleJoinShop = async (shopId) => {
    const userId = userObject?._id;

    if (!userId) {
      quickAlert(true, "error", {
        messageEn: "User not found",
        messageKh: "រកមិនឃើញអ្នកប្រើប្រាស់",
      });
      return;
    }

    try {
      const { data } = await checkOpenShift({
        variables: {
          userId,
          shopId,
        },
        fetchPolicy: "network-only",
      });

      const openShift = data?.getOpenShift;

      if (!openShift) {
        quickAlert(
          "warning",
          "Please start your shift before entering POS",
          "សូមបើកវេនការងារជាមុនសិន"
        );
        alert("កុំស្រឡាញ់គេម្នាក់ឯង")
        return
      }

      localStorage.setItem("activeShopId", shopId);

      navigate(`/store/pos/${shopId}`);
    } catch (error) {
      setAlert(true, "error", {
        messageEn: error.message,
        messageKh: error.message,
      });
    }
  };


  const filteredShops = data?.getAllShops?.filter((shop) =>
    shop?.nameEn?.toLowerCase().includes(keyword.toLowerCase())
  );

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

      {/* Search */}

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
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        {/* Create Shop */}

        <Stack direction="row" spacing={2} mt={3}>
          {(userRole === "superAdmin" || userRole === "admin") && (
            <Button
              variant="contained"
              startIcon={<LibraryAddOutlinedIcon />}
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

      {/* Shops List */}
      <Grid container spacing={3} mt={4}>
        {filteredShops?.map((shop, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={index}>
            <Card
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              {/* Top Section: Logo + Report */}
              <Stack
                direction="row"
                spacing={2}
                alignItems="start"
                justifyContent="space-between"
              >
              
                <Stack direction="row" spacing={2} alignItems="start">
                  <img
                    src={shop.image}
                    alt={shop.nameKh}
                    width={80}
                    height={80}
                    style={{ borderRadius: "5px" }}
                  />
                  <Typography variant="subtitle1" fontWeight={600}>
                    {language === "en" ? shop.nameEn : shop.nameKh}
                  </Typography>
                </Stack>

              
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<ChartBarStacked size={16} />}
                >
                  {t("report")}
                </Button>
              </Stack>

          
              <Stack direction="row" spacing={2} mt={3}>
                <Button
                  fullWidth
                  startIcon={<LogIn size={16} />}
                  size="small"
                  variant="contained"
                  onClick={() => handleJoinShop(shop._id)}
                >
                  {t("join_in_shop")}
                </Button>

                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  sx={{ bgcolor: "red" }}
                  startIcon={<BookmarkX size={16} />}
                >
                  {t("close_shop")}
                </Button>
 
                <Box mt={2}>
                  <ShopAction
                    setRefetch={refetch}
                    t={t}
                    shopData={shop}
                    shopId={shop?._id}
                    shopName={shop?.nameEn}
                    userId={userObject?._id}
                  />
                </Box>
              </Stack>


            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Store;