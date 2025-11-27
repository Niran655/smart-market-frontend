import FilterListIcon from "@mui/icons-material/FilterList";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useMutation, useQuery } from "@apollo/client/react";
import { Navigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  fabClasses,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Trash, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { CREATE_SALE } from "../../graphql/mutation";
import { useAuth } from "../context/AuthContext";
import { GET_PRODUCT_FOR_SALE_WITH_PAGINATION } from "../../graphql/queries";
import { translateLauguage } from "../function/translate";
import "../Styles/pos.scss";

const POS = () => {
  const { shopId } = useParams();
  const activeShopId = localStorage.getItem("activeShopId");
  const {setAlert} = useAuth()
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const { data, loading } = useQuery(GET_PRODUCT_FOR_SALE_WITH_PAGINATION, {
    variables: {
      shopId,
      page: 1,
      limit: 50,
      pagination: false,
      keyword: "",
      categoryId: "",
    },
  });

  const [createSale, { loading: creating, error: createError }] = useMutation(CREATE_SALE,{
    onCompleted:({createSale})=>{
      if(createSale?.isSuccess){
        setAlert(true, "success", createSale?.message)
      }else{
         setAlert(true, "error", createSale?.message)
      }
    },
    onError:(error)=>{
      console.log("Error",error)
    }
  });
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState("dine_in");
  const [selectedTable, setSelectedTable] = useState("Table 01");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([
    { id: "all", nameEn: "All", nameKh: "ទាំងអស់" },
  ]);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    if (data?.getProductForSaleWithPagination?.data) {
      const categoryMap = new Map();
      data.getProductForSaleWithPagination.data
        .filter((item) => item.parentProductId?.categoryId)
        .forEach((item) => {
          const category = item.parentProductId.categoryId;
          if (!categoryMap.has(category._id)) {
            categoryMap.set(category._id, {
              id: category._id,
              nameEn: category.nameEn,
              nameKh: category.nameKh,
            });
          }
        });

      const uniqueCategories = Array.from(categoryMap.values());
      setCategories([
        { id: "all", nameEn: "All", nameKh: "ទាំងអស់" },
        ...uniqueCategories,
      ]);
    }
  }, [data, language]);

  useEffect(() => {
    if (selectedCategory === "all") {
      setSelectedCategory("all");
    }
  }, [language]);

  if (activeShopId !== shopId) {
    return <Navigate to="/store" replace />;
  }

  const tables = [
    "Table 01",
    "Table 02",
    "Table 03",
    "Table 04",
    "Table 05",
    "Table 06",
  ];

  const ORDER_TYPES = {
    DINE_IN: "dine_in",
    TAKEAWAY: "take_away",
    DELIVERY: "delivery",
  };

  const filteredProducts = data?.getProductForSaleWithPagination?.data?.filter(
    (item) => {
      if (selectedCategory === "all") {
        const matchesSearch =
          item.parentProductId?.nameKh
            ?.toLowerCase()
            .includes(searchKeyword.toLowerCase()) ||
          item.parentProductId?.nameEn
            ?.toLowerCase()
            .includes(searchKeyword.toLowerCase());
        return matchesSearch;
      } else {
        const matchesCategory =
          item.parentProductId?.categoryId?._id === selectedCategory ||
          item.parentProductId?.categoryId?.nameEn === selectedCategory ||
          item.parentProductId?.categoryId?.nameKh === selectedCategory;

        const matchesSearch =
          item.parentProductId?.nameKh
            ?.toLowerCase()
            .includes(searchKeyword.toLowerCase()) ||
          item.parentProductId?.nameEn
            ?.toLowerCase()
            .includes(searchKeyword.toLowerCase());

        return matchesCategory && matchesSearch;
      }
    }
  );

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === item._id);
      if (found) {
        return prev.map((p) =>
          p.id === item._id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [
        ...prev,
        {
          id: item._id,
          productId: item.parentProductId._id,
          name:
            language === "kh"
              ? item.parentProductId.nameKh
              : item.parentProductId.nameEn,
          nameEn: item.parentProductId.nameEn,
          nameKh: item.parentProductId.nameKh,
          price: item.salePrice,
          qty: 1,
          img: item.productImg,
          variant: "Original",
        },
      ];
    });
  };

  const updateQty = (id, value) => {
    if (value === 0) {
      removeFromCart(id);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, qty: value } : item))
      );
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCreateSale = async () => {
    try {
      const orderTypeMap = {
        dine_in: "Dine In",
        take_away: "Takeaway",
        delivery: "Delivery",
      };
      const subtotalRounded = Number(subtotal.toFixed(2));
      const taxRounded = Number(tax.toFixed(2));
      const totalRounded = Number((subtotalRounded + taxRounded).toFixed(2));
      const amountPaid = totalRounded;
      const change = Number((amountPaid - totalRounded).toFixed(2));
      const input = {
        shopId: shopId,
        items: cart.map((item) => ({
          product: item.productId,
          name: item.name,
          price: Number(item.price.toFixed(2)),
          quantity: item.qty,
          total: Number((item.price * item.qty).toFixed(2)),
        })),
        subtotal: subtotalRounded,
        tax: taxRounded,
        discount: 0,
        total: totalRounded,
        paymentMethod: "cash",
        amountPaid,
        change,
        // orderType: orderTypeMap[orderType] || "Dine In",
        // table: selectedTable,
      };
      console.log("input sale", input);
      await createSale({ variables: { input } });
      setCart([]);
    } catch (error) {
      console.error("Error creating sale:", error);
    }
  };

  const getCategoryName = (category) => {
    if (category.id === "all") {
      return language === "kh" ? category.nameKh : category.nameEn;
    }
    return language === "kh" ? category.nameKh : category.nameEn;
  };

  const orderTypes = [
    { key: "dine_in", label: t("dine_in") },
    { key: "take_away", label: t("take_away") },
    { key: "delivery", label: t("delivery") },
  ];

  return (
    <Box className="pos-container">
      <Grid container spacing={2}>
        <Grid size={{ xs: 8 }}>
          <Grid container className="product-list-header">
            <Grid size={{ xs: 6 }}>
              <Typography className="section-title">
                {t(`product_list`)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box className="search-container">
                <TextField
                  placeholder={t(`search`)}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  size="small"
                  className="search-field"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          <Box className="category-scroll-container">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={
                  selectedCategory === category.id ? "contained" : "outlined"
                }
                className={`category-button ${
                  selectedCategory === category.id
                    ? "category-button--active"
                    : ""
                }`}
              >
                {getCategoryName(category)}
              </Button>
            ))}
          </Box>

          <Grid container spacing={1} className="product-grid">
            {filteredProducts?.map((item, idx) => (
              <Grid size={{ xs: 3 }} key={idx}>
                <Card className="product-card" onClick={() => addToCart(item)}>
                  <CardMedia
                    component="img"
                    height="100"
                    image={item.productImg || "/placeholder-food.jpg"}
                    alt={item.parentProductId?.nameKh || "Product"}
                    className="product-image"
                  />
                  <CardContent className="product-content">
                    <Typography className="product-name">
                      {language === "kh"
                        ? item.parentProductId?.nameKh
                        : item.parentProductId?.nameEn}
                    </Typography>
                    <Typography className="product-category">
                      {language === "kh"
                        ? item.parentProductId?.categoryId?.nameKh
                        : item.parentProductId?.categoryId?.nameEn}
                    </Typography>
                    <Box className="product-footer">
                      <Typography className="product-price">
                        {item.salePrice?.toLocaleString()}$
                      </Typography>

                      <Chip
                        label={
                          language === "kh"
                            ? item?.unitId?.nameKh
                            : item?.unitId?.nameEn
                        }
                        size="small"
                        color="primary"
                        className="add-chip"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* ---------------- CART PANEL ---------------- */}
        <Grid size={{ xs: 4 }}>
          <Paper className="cart-panel">
            <Box className="cart-header">
              <Typography className="cart-title">
                {t(`current_order`)}
              </Typography>
              {cart.length > 0 && (
                <Button size="small" color="error" onClick={clearCart}>
                  <Typography>{t(`clear`)}</Typography>
                </Button>
              )}
            </Box>

            <Tabs
              value={orderType}
              onChange={(e, newValue) => setOrderType(newValue)}
              variant="fullWidth"
              className="order-type-tabs"
            >
              {orderTypes.map((type) => (
                <Tab
                  key={type.key}
                  label={type.label}
                  value={type.key}
                  component={Button}
                  sx={{
                    mx: 0.2,
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "white",
                      borderRadius: "5px",
                    },
                  }}
                />
              ))}
            </Tabs>

            <Divider />

            {orderType === ORDER_TYPES.DINE_IN && (
              <Box className="customer-info">
                <TextField
                  fullWidth
                  label={t(`customer`)}
                  size="small"
                  className="customer-field"
                />
                <Select
                  fullWidth
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  size="small"
                >
                  {tables.map((table) => (
                    <MenuItem
                      key={table}
                      value={table}
                      className="table-menu-item"
                    >
                      {table}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            )}

            <Divider className="section-divider" />

            <Box className="cart-items-container">
              {cart.map((item, idx) => (
                <Box key={idx} className="cart-item" component={Card}>
                  <img
                    src={item.img || "/placeholder-food.jpg"}
                    className="cart-item-image"
                    alt={item.name}
                  />
                  <Stack direction={"column"} className="cart-item-details">
                    <Typography className="cart-item-name">
                      {item.name}
                    </Typography>
                    <Typography className="cart-item-price">
                      {item.price.toLocaleString()}$
                    </Typography>
                  </Stack>

                  <Box className="cart-item-spacer"></Box>

                  <Typography className="cart-item-total">
                    {t(`total_price`)}:{" "}
                    {(item.qty * item.price).toLocaleString()}$
                  </Typography>

                  <Box className="quantity-controls">
                    <IconButton
                      size="small"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="qty-button"
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <TextField
                      value={item.qty}
                      onChange={(e) =>
                        updateQty(item.id, parseInt(e.target.value) || 0)
                      }
                      size="small"
                      className="qty-input"
                    />
                    <IconButton
                      size="small"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="qty-button"
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box className="cart-item-actions">
                    <IconButton
                      onClick={() => removeFromCart(item.id)}
                      className="delete-button"
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
              {cart.length === 0 && (
                <Typography className="empty-cart-message">
                  {t(`cart_empty`)}
                </Typography>
              )}
            </Box>

            <Divider className="section-divider" />

            <Box className="order-summary">
              <Box className="summary-row">
                <Typography className="summary-label">
                  {t(`subtotal`)}
                </Typography>
                <Typography className="summary-value">
                  {subtotal.toLocaleString()}$
                </Typography>
              </Box>
              <Box className="summary-row">
                <Typography className="summary-label">
                  {t(`tax`)} (10%)
                </Typography>
                <Typography className="summary-value">
                  {tax.toLocaleString()}$
                </Typography>
              </Box>
              <Box className="summary-row">
                <Typography className="summary-label">
                  {t(`discount`)}
                </Typography>
                <Typography className="summary-value">0$</Typography>
              </Box>
              <Divider />
              <Box className="total-row">
                <Typography className="total-label">
                  {t(`total_price`)}
                </Typography>
                <Typography className="total-value">
                  {total.toLocaleString()}$
                </Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="medium"
              onClick={handleCreateSale}
              disabled={cart.length === 0 || creating}
              className="pay-button"
            >
              {t(`pay`)} {total.toLocaleString()}$
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default POS;
