// import ManageHistoryOutlinedIcon from "@mui/icons-material/ManageHistoryOutlined";
// import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
// import RemoveIcon from "@mui/icons-material/Remove";
// import SearchIcon from "@mui/icons-material/Search";
// import AddIcon from "@mui/icons-material/Add";
// import { useMutation, useQuery } from "@apollo/client/react";
// import { Navigate, useParams } from "react-router-dom";
// import { Box, Button, Card, CardContent, CardMedia, Chip, Divider, Grid, IconButton, InputAdornment, LinearProgress, MenuItem, Paper, Select, Stack, Tab, Tabs, TextField, Tooltip, Typography } from "@mui/material";
// import { Timer, Trash2 } from "lucide-react";
// import { useEffect, useState } from "react";

// import InvoicePending from "../Components/pos/InvoicePending";
// import SaleHistory from "../Components/pos/SaleHistory";
// import { CREATE_SALE } from "../../graphql/mutation";
// import { useAuth } from "../context/AuthContext";
// import { GET_PRODUCT_FOR_SALE_WITH_PAGINATION } from "../../graphql/queries";
// import { translateLauguage } from "../function/translate";
// import "../Styles/pos.scss";
// const orders = [
//   {
//     id: "65698",
//     customer: "Liam O'Connor",
//     type: "Dine-in Table",
//     time: "11:10 AM",
//     table: "Table 1",
//     elapsed: 45,
//     estimated: 33,
//   },
//   {
//     id: "96589",
//     customer: "Sophia Kim",
//     type: "Delivery",
//     time: "11:20 AM",
//     elapsed: 22,
//     estimated: 70,
//   },
//   {
//     id: "14589",
//     customer: "James Smith",
//     type: "Delivery",
//     time: "11:30 AM",
//     elapsed: 12,
//     estimated: 20,
//   },
// ];

// const POS = () => {
//   const { shopId } = useParams();
//   const activeShopId = localStorage.getItem("activeShopId");
//   const { setAlert } = useAuth();
//   const { language } = useAuth();
//   const { t } = translateLauguage(language);
//   const [openHistory, setOpenHistory] = useState(false);
//   const handleOpenSaleHistory = () => setOpenHistory(true);
//   const handleCloseSaleHistory = () => setOpenHistory(false);
//   const [openSalePending, setOpenSalePending] = useState(false);
//   const handleOpenSalePending = () => setOpenSalePending(true);
//   const handleCloseSalePending = () => setOpenSalePending(false);
//   const { data, loading } = useQuery(GET_PRODUCT_FOR_SALE_WITH_PAGINATION, {
//     variables: {
//       shopId,
//       page: 1,
//       limit: 50,
//       pagination: false,
//       keyword: "",
//       categoryId: "",
//     },
//     pollInterval: 1000,
//   });
//   const [cart, setCart] = useState([]);
//   const [createSale, { loading: creating, error: createError }] = useMutation(
//     CREATE_SALE,
//     {
//       onCompleted: ({ createSale }) => {
//         if (createSale?.isSuccess) {
//           setAlert(true, "success", createSale?.message);
//           setCart([]);
//         } else {
//           setAlert(true, "error", createSale?.message);
//         }
//       },
//       onError: (error) => {
//         console.log("Error", error);
//       },
//     },
//   );

//   const [orderType, setOrderType] = useState("dine_in");
//   const [selectedOrderType, setSelectedOrderType] = useState("All");
//   const [selectedTable, setSelectedTable] = useState("Table 01");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [categories, setCategories] = useState([
//     { id: "all", nameEn: "All", nameKh: "ទាំងអស់" },
//   ]);
//   const [searchKeyword, setSearchKeyword] = useState("");

//   useEffect(() => {
//     if (data?.getProductForSaleWithPagination?.data) {
//       const categoryMap = new Map();
//       data.getProductForSaleWithPagination.data
//         .filter((item) => item.parentProductId?.categoryId)
//         .forEach((item) => {
//           const category = item.parentProductId.categoryId;
//           if (!categoryMap.has(category._id)) {
//             categoryMap.set(category._id, {
//               id: category._id,
//               nameEn: category.nameEn,
//               nameKh: category.nameKh,
//             });
//           }
//         });

//       const uniqueCategories = Array.from(categoryMap.values());
//       setCategories([
//         { id: "all", nameEn: "All", nameKh: "ទាំងអស់" },
//         ...uniqueCategories,
//       ]);
//     }
//   }, [data, language]);

//   useEffect(() => {
//     if (selectedCategory === "all") {
//       setSelectedCategory("all");
//     }
//   }, [language]);

//   if (activeShopId !== shopId) {
//     return <Navigate to="/store" replace />;
//   }

//   const tables = [
//     "Table 01",
//     "Table 02",
//     "Table 03",
//     "Table 04",
//     "Table 05",
//     "Table 06",
//   ];

//   const ORDER_TYPES = {
//     DINE_IN: "dine_in",
//     TAKEAWAY: "take_away",
//     DELIVERY: "delivery",
//   };

//   const filteredProducts = data?.getProductForSaleWithPagination?.data?.filter(
//     (item) => {
//       if (selectedCategory === "all") {
//         const matchesSearch =
//           item.parentProductId?.nameKh
//             ?.toLowerCase()
//             .includes(searchKeyword.toLowerCase()) ||
//           item.parentProductId?.nameEn
//             ?.toLowerCase()
//             .includes(searchKeyword.toLowerCase());
//         return matchesSearch;
//       } else {
//         const matchesCategory =
//           item.parentProductId?.categoryId?._id === selectedCategory ||
//           item.parentProductId?.categoryId?.nameEn === selectedCategory ||
//           item.parentProductId?.categoryId?.nameKh === selectedCategory;

//         const matchesSearch =
//           item.parentProductId?.nameKh
//             ?.toLowerCase()
//             .includes(searchKeyword.toLowerCase()) ||
//           item.parentProductId?.nameEn
//             ?.toLowerCase()
//             .includes(searchKeyword.toLowerCase());

//         return matchesCategory && matchesSearch;
//       }
//     },
//   );

//   const filteredOrders =
//     selectedOrderType === "All Order"
//       ? orders
//       : orders.filter((o) => o.type === selectedOrderType);

//   const addToCart = (item) => {
//     setCart((prev) => {
//       const found = prev.find((p) => p.id === item._id);
//       if (found) {
//         return prev.map((p) =>
//           p.id === item._id ? { ...p, qty: p.qty + 1 } : p,
//         );
//       }
//       return [
//         ...prev,
//         {
//           id: item._id,
//           subProductId: item._id,
//           productId: item.parentProductId._id,
//           name:
//             language === "kh"
//               ? item.parentProductId.nameKh
//               : item.parentProductId.nameEn,
//           nameEn: item.parentProductId.nameEn,
//           nameKh: item.parentProductId.nameKh,
//           price: item.salePrice,
//           qty: 1,
//           img: item.productImg,
//           variant: "Original",
//         },
//       ];
//     });
//   };

//   const updateQty = (id, value) => {
//     if (value === 0) {
//       removeFromCart(id);
//     } else {
//       setCart((prev) =>
//         prev.map((item) => (item.id === id ? { ...item, qty: value } : item)),
//       );
//     }
//   };

//   const removeFromCart = (id) => {
//     setCart((prev) => prev.filter((item) => item.id !== id));
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
//   const tax = subtotal * 0.1;
//   const total = subtotal + tax;

//   const handleCreateSale = async () => {
//     try {
//       const orderTypeMap = {
//         dine_in: "Dine In",
//         take_away: "Takeaway",
//         delivery: "Delivery",
//       };
//       const subtotalRounded = Number(subtotal.toFixed(2));
//       const taxRounded = Number(tax.toFixed(2));
//       const totalRounded = Number((subtotalRounded + taxRounded).toFixed(2));
//       const amountPaid = totalRounded;
//       const change = Number((amountPaid - totalRounded).toFixed(2));
//       const input = {
//         shopId: shopId,
//         items: cart.map((item) => ({
//           product: item.productId,
//           subProductId: item.subProductId,
//           name: item.name,
//           price: Number(item.price.toFixed(2)),
//           quantity: item.qty,
//           total: Number((item.price * item.qty).toFixed(2)),
//         })),
//         subtotal: subtotalRounded,
//         tax: taxRounded,
//         discount: 0,
//         total: totalRounded,
//         paymentMethod: "cash",
//         amountPaid,
//         change,
//         // orderType: orderTypeMap[orderType] || "Dine In",
//         // table: selectedTable,
//       };
//       console.log("input sale", input);
//       await createSale({ variables: { input } });
//     } catch (error) {
//       console.error("Error creating sale:", error);
//     }
//   };

//   const getCategoryData = (category, language) => {
//     const name = language === "kh" ? category.nameKh : category.nameEn;
//     const image = category.image; // assuming category has an `image` property

//     return { name, image };
//   };

//   const orderTypes = [
//     { key: "dine_in", label: t("dine_in") },
//     { key: "take_away", label: t("take_away") },
//     { key: "delivery", label: t("delivery") },
//   ];

//   return (
//     <Box className="pos-container">
//       <Grid container spacing={2} sx={{ height: "90vh", overflow: "hidden" }}>
//         <Grid size={{ xs: 8 }}>
//           <Box
//             sx={{ overflowY: "auto", height: "100vh", scrollbarWidth: "thin",padding:2 }}
//           >
//             <Grid container className="product-list-header">
//               <Grid
//                 container
//                 justifyContent="flex-start"
//                 alignItems="center"
//                 mb={2}
//                 size={{ xs: 12 }}
//                 spacing={2}
//               >
//                 <Grid xs={6}>
//                   <Typography className="section-title">
//                     {t(`recent_orders`)}
//                   </Typography>
//                 </Grid>

//                 <Grid xs={6}>
//                   <Stack direction="row" spacing={1}>
//                     {["All Order", "Takeaway", "Dine-in Table", "Delivery"].map(
//                       (orderType) => (
//                         <Button
//                           key={orderType}
//                           sx={{ borderRadius: "5px" }}
//                           onClick={() => setSelectedOrderType(orderType)}
//                           variant={
//                             selectedOrderType === orderType
//                               ? "contained"
//                               : "outlined"
//                           }
//                           className={`order-type-button ${
//                             selectedOrderType === orderType
//                               ? "order-type-button--active"
//                               : ""
//                           }`}
//                         >
//                           {orderType}
//                         </Button>
//                       ),
//                     )}
//                   </Stack>
//                 </Grid>
//               </Grid>

//               <Grid
//                 container
//                 spacing={2}
//                 alignItems="center"
//                 mb={2}
//                 size={{ xs: 12 }}
//               >
//                 {filteredOrders.map((order) => (
//                   <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={order.id}>
//                     <Card className="order-card">
//                       <Stack
//                         direction={"row"}
//                         justifyContent="space-between"
//                         alignItems="center"
//                         mb={1}
//                       >
//                         <Typography className="order-id">
//                           #{order.id}
//                         </Typography>
//                         <Box>
//                           <Chip
//                             label={order.type}
//                             size="small"
//                             sx={{
//                               fontWeight: "bold",
//                               color: "#45556C",
//                               bgcolor: "#F8F8F8",
//                             }}
//                           />
//                         </Box>
//                       </Stack>

//                       <Stack
//                         direction={"row"}
//                         justifyContent="space-between"
//                         alignItems="center"
//                         mb={1}
//                       >
//                         <Box>
//                           <Typography variant="body2"  >
//                             {order.customer}  
//                           </Typography>
//                           <Typography variant="body2">
//                             {order.time}
//                           </Typography>
//                         </Box>
//                         <Box className="order-status-container">
//                           <Timer size={16} color="white" />
//                           <Typography className="order-status">
//                             {order.estimated} Mins
//                           </Typography>
//                         </Box>
//                       </Stack>
//                       <Typography className="order-text"></Typography>

//                       {/* {order.table && (
//                       <Typography className="order-text">
//                         <strong>Table:</strong> {order.table}
//                       </Typography>
//                     )} */}

//                       <LinearProgress
//                         variant="determinate"
//                         value={(order.elapsed / order.estimated) * 100}
//                         className="order-progress"
//                       />
//                     </Card>
//                   </Grid>
//                 ))}
//               </Grid>

//               <Grid size={{ xs: 6 }}>
//                 <Typography className="section-title">
//                   {t(`product_list`)}
//                 </Typography>
//               </Grid>
//               <Grid size={{ xs: 6 }}>
//                 <Box className="search-container">
//                   <TextField
//                     placeholder={t(`search`)}
//                     value={searchKeyword}
//                     onChange={(e) => setSearchKeyword(e.target.value)}
//                     size="small"
//                     className="search-field"
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <SearchIcon fontSize="small" color="action" />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </Box>
//               </Grid>
//             </Grid>

//             <Box className="category-scroll-container">
//               {categories.map((category) => {
//                 const { name, image } = getCategoryData(category, language);

//                 return (
//                   <Button
//                     key={category.id}
//                     onClick={() => setSelectedCategory(category.id)}
//                     variant={
//                       selectedCategory === category.id
//                         ? "contained"
//                         : "outlined"
//                     }
//                     className={`category-button ${
//                       selectedCategory === category.id
//                         ? "category-button--active"
//                         : ""
//                     }`}
//                   >
//                     <Box display="flex" alignItems="center" gap={1}>
//                       {/* <img
//                       src={image}
//                       alt={name}
//                       style={{ width: 24, height: 24, objectFit: "contain" }}
//                     /> */}
//                       <span>{name}</span>
//                     </Box>
//                   </Button>
//                 );
//               })}
//             </Box>
//             <Grid container spacing={1} className="product-grid">
//               {filteredProducts?.map((item, idx) => (
//                 <Grid size={{ xs: 3 }} key={idx}>
//                   <Card
//                     className="product-card"
//                     onClick={() => addToCart(item)}
//                   >
//                     <CardMedia
//                       component="img"
//                       height="100"
//                       image={item.productImg || "/placeholder-food.jpg"}
//                       alt={item.parentProductId?.nameKh || "Product"}
//                       className="product-image"
//                     />
//                     <CardContent className="product-content">
//                       <Typography className="product-name">
//                         {language === "kh"
//                           ? item.parentProductId?.nameKh
//                           : item.parentProductId?.nameEn}
//                       </Typography>
//                       <Typography className="product-category">
//                         {language === "kh"
//                           ? item.parentProductId?.categoryId?.nameKh
//                           : item.parentProductId?.categoryId?.nameEn}
//                       </Typography>
//                       <Box className="product-footer">
//                         <Typography className="product-price">
//                           {item.salePrice?.toLocaleString()}$
//                         </Typography>

//                         <Chip
//                           label={
//                             language === "kh"
//                               ? item?.unitId?.nameKh
//                               : item?.unitId?.nameEn
//                           }
//                           size="small"
//                           color="primary"
//                           className="add-chip"
//                         />
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>
//         </Grid>

//         {/* ---------------- CART PANEL ---------------- */}
//         <Grid size={{ xs: 4 }} sx={{borderLeft:"1px solid #D1D5DC"}}>
//           <Box>
//             <Box className="cart-panel"  sx={{ overflow: "auto", height: "100%" }}>
//               <Box className="cart-header">
//                 <Stack direction={"row"} spacing={2} alignItems={"center"}>
//                   <Typography className="cart-title">
//                     {t(`current_order`)}
//                   </Typography>
//                   <Tooltip title="View  history">
//                     <IconButton onClick={handleOpenSaleHistory}>
//                       <ReceiptOutlinedIcon />
//                     </IconButton>
//                   </Tooltip>
//                   <Tooltip title="View Stop Invoice">
//                     <IconButton onClick={handleOpenSalePending}>
//                       <ManageHistoryOutlinedIcon />
//                     </IconButton>
//                   </Tooltip>
//                   <SaleHistory
//                     open={openHistory}
//                     onClose={handleCloseSaleHistory}
//                     t={t}
//                   />
//                   <InvoicePending
//                     t={t}
//                     open={openSalePending}
//                     onClose={handleCloseSalePending}
//                   />
//                 </Stack>


//                 <Stack direction={"row"} spacing={2}>
//                   {cart.length > 0 && (
//                     <Button size="small" color="error" onClick={clearCart}>
//                       <Typography color="error">{t(`clear`)}</Typography>
//                     </Button>
//                   )}
//                 </Stack>
//               </Box>
//               <Divider/>
//               <Tabs
//                 value={orderType}
//                 onChange={(e, newValue) => setOrderType(newValue)}
//                 variant="fullWidth"
//                 className="order-type-tabs"
//               >
//                 {orderTypes.map((type) => (
//                   <Tab
//                     key={type.key}
//                     label={type.label}
//                     value={type.key}
//                     component={Button}
//                     sx={{
//                       mx: 0.2,
//                       "&.Mui-selected": {
//                         bgcolor: "primary.main",
//                         color: "white",
//                         borderRadius: "5px",
//                       },
//                     }}
//                   />
//                 ))}
//               </Tabs>

//               <Divider />

//               {orderType === ORDER_TYPES.DINE_IN && (
//                 <Box className="customer-info">
//                   <TextField
//                     fullWidth
//                     placeholder={t(`customer`)}
//                     size="small"
//                     className="customer-field"
//                   />
//                   <Select
//                     fullWidth
//                     value={selectedTable}
//                     onChange={(e) => setSelectedTable(e.target.value)}
//                     size="small"
//                   >
//                     {tables.map((table) => (
//                       <MenuItem
//                         key={table}
//                         value={table}
//                         className="table-menu-item"
//                       >
//                         {table}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </Box>
//               )}

//               <Divider className="section-divider" />

//               <Box className="cart-items-container">
//                 {cart.map((item, idx) => (
//                   <Box key={idx} className="cart-item"  >
//                     <img
//                       src={item.img || "/placeholder-food.jpg"}
//                       className="cart-item-image"
//                       alt={item.name}
//                     />
//                     <Stack direction={"column"} className="cart-item-details">
//                       <Typography className="cart-item-name">
//                         {item.name}
//                       </Typography>
//                       <Typography className="cart-item-price">
//                         {item.price.toLocaleString()}$
//                       </Typography>
//                     </Stack>

//                     <Box className="cart-item-spacer"></Box>

//                     <Typography className="cart-item-total">
//                       {t(`total_price`)}:{" "}
//                       {(item.qty * item.price).toLocaleString()}$
//                     </Typography>

//                     <Box className="quantity-controls">
//                       <IconButton
//                         size="small"
//                         onClick={() => updateQty(item.id, item.qty - 1)}
//                         className="qty-button"
//                       >
//                         <RemoveIcon fontSize="small" />
//                       </IconButton>
//                       <TextField
//                         value={item.qty}
//                         onChange={(e) =>
//                           updateQty(item.id, parseInt(e.target.value) || 0)
//                         }
//                         size="small"
//                         className="qty-input"
//                       />
//                       <IconButton
//                         size="small"
//                         onClick={() => updateQty(item.id, item.qty + 1)}
//                         className="qty-button"
//                       >
//                         <AddIcon fontSize="small" />
//                       </IconButton>
//                     </Box>

//                     <Box className="cart-item-actions">
//                       <IconButton
//                         onClick={() => removeFromCart(item.id)}
//                         className="delete-button"
//                       >
//                         <Trash2 size={16} />
//                       </IconButton>
//                     </Box>
//                   </Box>
//                 ))}
//                 {cart.length === 0 && (
//                   <Typography className="empty-cart-message">
//                     {t(`cart_empty`)}
//                   </Typography>
//                 )}
//               </Box>

//               <Divider className="section-divider" />

//               <Box className="order-summary">
//                 <Box className="summary-row">
//                   <Typography className="summary-label">
//                     {t(`subtotal`)}
//                   </Typography>
//                   <Typography className="summary-value">
//                     {subtotal.toLocaleString()}$
//                   </Typography>
//                 </Box>
//                 <Box className="summary-row">
//                   <Typography className="summary-label">
//                     {t(`tax`)} (10%)
//                   </Typography>
//                   <Typography className="summary-value">
//                     {tax.toLocaleString()}$
//                   </Typography>
//                 </Box>
//                 <Box className="summary-row">
//                   <Typography className="summary-label">
//                     {t(`discount`)}
//                   </Typography>
//                   <Typography className="summary-value">0$</Typography>
//                 </Box>
//                 <Divider />
//                 <Box className="total-row">
//                   <Typography className="total-label">
//                     {t(`total_price`)}
//                   </Typography>
//                   <Typography className="total-value">
//                     {total.toLocaleString()}$
//                   </Typography>
//                 </Box>
//               </Box>
//               <Stack direction={"row"} spacing={2} alignItems={"center"}>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   size="medium"
//                   disabled={cart.length === 0 || creating}
//                   className="pay-button"
//                   sx={{ bgcolor: "red" }}
//                 >
//                   {t(`stop_invoice`)}
//                 </Button>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   size="medium"
//                   onClick={handleCreateSale}
//                   disabled={cart.length === 0 || creating}
//                   className="pay-button"
//                 >
//                   {t(`pay_now`)} {total.toLocaleString()}$
//                 </Button>
//               </Stack>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default POS;


import { useMutation, useQuery } from "@apollo/client/react";
import { Navigate, useParams } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { GET_PRODUCT_FOR_SALE_WITH_PAGINATION } from "../../graphql/queries";
import { CREATE_SALE } from "../../graphql/mutation";
import { translateLauguage } from "../function/translate";
import ProductDialog from "../Components/pos/ProductDialog";
import PaymentDialog from "../Components/pos/PaymentDialog";
import ProductList from "../Components/pos/ProductList";
import CartPanel from "../Components/pos/CartPanel";
import RecentOrders from "../Components/pos/RecentOrders";
import "../Styles/pos.scss";

const POS = () => {
  const { shopId } = useParams();
  const activeShopId = localStorage.getItem("activeShopId");
  const { setAlert } = useAuth();
  const { language } = useAuth();
  const { t } = translateLauguage(language);

  // Dialog states
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openPendingDialog, setOpenPendingDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Existing dialog states
  const [openHistory, setOpenHistory] = useState(false);
  const [openSalePending, setOpenSalePending] = useState(false);

  // Cart state
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState("dine_in");
  const [selectedTable, setSelectedTable] = useState("Table 01");
  
  // Product list state
  const [selectedOrderType, setSelectedOrderType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([
    { id: "all", nameEn: "All", nameKh: "ទាំងអស់" },
  ]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const { data, loading } = useQuery(GET_PRODUCT_FOR_SALE_WITH_PAGINATION, {
    variables: {
      shopId,
      page: 1,
      limit: 50,
      pagination: false,
      keyword: "",
      categoryId: "",
    },
    pollInterval: 1000,
  });

  const [createSale, { loading: creating, error: createError }] = useMutation(CREATE_SALE, {
    onCompleted: ({ createSale }) => {
      if (createSale?.isSuccess) {
        setAlert(true, "success", createSale?.message);
        setCart([]);
        setOpenPaymentDialog(false);
        setOpenPendingDialog(false);
      } else {
        setAlert(true, "error", createSale?.message);
      }
    },
    onError: (error) => {
      console.log("Error", error);
      setAlert(true, "error", error.message);
    },
  });

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

  // Dialog handlers
  const handleOpenProductDialog = (product) => {
    setSelectedProduct(product);
    setOpenProductDialog(true);
  };

  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
    setSelectedProduct(null);
  };

  const handleOpenPaymentDialog = () => {
    if (cart.length === 0) {
      setAlert(true, "warning", language === "kh" ? "រទេះទទេ" : "Cart is empty");
      return;
    }
    setOpenPaymentDialog(true);
  };

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
  };

  const handleOpenPendingDialog = () => {
    if (cart.length === 0) {
      setAlert(true, "warning", language === "kh" ? "រទេះទទេ" : "Cart is empty");
      return;
    }
    setOpenPendingDialog(true);
  };

  const handleClosePendingDialog = () => {
    setOpenPendingDialog(false);
  };

  const handleOpenSaleHistory = () => setOpenHistory(true);
  const handleCloseSaleHistory = () => setOpenHistory(false);
  const handleOpenSalePending = () => setOpenSalePending(true);
  const handleCloseSalePending = () => setOpenSalePending(false);

  // Cart operations
  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === item._id);
      if (found) {
        return prev.map((p) => (p.id === item._id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [
        ...prev,
        {
          id: item._id,
          subProductId: item._id,
          productId: item.parentProductId._id,
          name: language === "kh" ? item.parentProductId.nameKh : item.parentProductId.nameEn,
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

  const addToCartFromDialog = (item) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
        return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + item.qty } : p));
      }
      return [...prev, item];
    });
  };

  const updateQty = (id, value) => {
    if (value === 0) {
      removeFromCart(id);
    } else {
      setCart((prev) => prev.map((item) => (item.id === id ? { ...item, qty: value } : item)));
    }
  };

  // const removeFromCart = (id) => {
  //   setCart((prev) => prev.filter((item) => item.id !== id));
  // };

  const removeFromCart = (id) =>{
      setCart((prev) => prev.filter((item) => item.id !== id));
  }

  const clearCart = () => {
    setCart([]);
  };

  const handleSelectPendingSale = (cartItems) => {
    setCart(cartItems);
    setAlert(true, "info", language === "kh" 
      ? "វិក័យប័ត្របណ្ដោះអាសន្នត្រូវបានទាញយក" 
      : "Pending invoice loaded to cart");
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCreateSale = async (paymentInfo, isPending = false) => {
    try {
      const subtotalRounded = Number(subtotal.toFixed(2));
      const taxRounded = Number(tax.toFixed(2));
      const totalRounded = Number((subtotalRounded + taxRounded).toFixed(2));

      const input = {
        shopId: shopId,
        items: cart.map((item) => ({
          product: item.productId,
          subProductId: item.subProductId,
          name: item.name,
          price: Number(item.price.toFixed(2)),
          quantity: item.qty,
          total: Number((item.price * item.qty).toFixed(2)),
        })),
        subtotal: subtotalRounded,
        tax: taxRounded,
        discount: 0,
        total: totalRounded,
        paymentMethod: paymentInfo.method || "cash",
        amountPaid: paymentInfo.amountPaid || 0,
        change: paymentInfo.change || 0,
        status: isPending ? "pending" : "completed",
      };

      await createSale({ variables: { input } });
    } catch (error) {
      console.error("Error creating sale:", error);
    }
  };

  if (activeShopId !== shopId) {
    return <Navigate to="/store" replace />;
  }

  const filteredProducts = data?.getProductForSaleWithPagination?.data?.filter((item) => {
    if (selectedCategory === "all") {
      const matchesSearch =
        item.parentProductId?.nameKh?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.parentProductId?.nameEn?.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchesSearch;
    } else {
      const matchesCategory =
        item.parentProductId?.categoryId?._id === selectedCategory ||
        item.parentProductId?.categoryId?.nameEn === selectedCategory ||
        item.parentProductId?.categoryId?.nameKh === selectedCategory;

      const matchesSearch =
        item.parentProductId?.nameKh?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.parentProductId?.nameEn?.toLowerCase().includes(searchKeyword.toLowerCase());

      return matchesCategory && matchesSearch;
    }
  });

  return (
    <Box className="pos-container">
     
      <ProductDialog
        open={openProductDialog}
        onClose={handleCloseProductDialog}
        product={selectedProduct}
        onAddToCart={addToCartFromDialog}
        language={language}
        t={t}
      />

      <PaymentDialog
        open={openPaymentDialog}
        onClose={handleClosePaymentDialog}
        total={total}
        onCreateSale={(paymentInfo) => handleCreateSale(paymentInfo, false)}
        language={language}
        creating={creating}
        t={t}
        isPending={false}
      />

      <PaymentDialog
        open={openPendingDialog}
        onClose={handleClosePendingDialog}
        total={total}
        onCreateSale={(paymentInfo) => handleCreateSale(paymentInfo, true)}
        language={language}
        creating={creating}
        t={t}
        isPending={true}
      />

      <Grid container spacing={2} sx={{ height: "90vh", overflow: "hidden" }}>
      
        <Grid size={{ xs: 8 }}>
          <Box sx={{ overflowY: "auto", height: "100vh", scrollbarWidth: "thin", padding: 2 }}>
            <RecentOrders
              selectedOrderType={selectedOrderType}
              setSelectedOrderType={setSelectedOrderType}
              t={t}
            />
            
            <ProductList
              t={t}
              language={language}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
              filteredProducts={filteredProducts}
              onProductClick={handleOpenProductDialog}
            />
          </Box>
        </Grid>

    
        <Grid size={{ xs: 4 }} sx={{ borderLeft: "1px solid #D1D5DC" }}>
          <CartPanel
            cart={cart}
            orderType={orderType}
            setOrderType={setOrderType}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            updateQty={updateQty}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            subtotal={subtotal}
            tax={tax}
            total={total}
            t={t}
            language={language}
            creating={creating}
            onPayNow={handleOpenPaymentDialog}
            onStopInvoice={handleOpenPendingDialog}
            openHistory={openHistory}
            openSalePending={openSalePending}
            onOpenHistory={handleOpenSaleHistory}
            onCloseHistory={handleCloseSaleHistory}
            onOpenSalePending={handleOpenSalePending}
            onCloseSalePending={handleCloseSalePending}
            shopId={shopId}
            onSelectPendingSale={handleSelectPendingSale}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default POS;