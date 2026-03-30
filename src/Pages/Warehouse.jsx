// import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
// import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
// import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
// import { Box, Breadcrumbs, Button, Chip, Grid, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
// import { Search } from "lucide-react";
// import dayjs from "dayjs";
// import { useState } from "react";

// import ProductTransferAction from "../Components/warehouse/product-transfer/ProductTransferAction";
// import ProductTransferForm from "../Components/warehouse/product-transfer/ProductTransferForm";
// import useGetWarehouseTransferWithPagination from "../Components/hook/useGetWarehouseTransferWithPagination";
// import useGetProductWarehouseWithPagination from "../Components/hook/useGetProductWarehouseWithPagination";
// import ProductWarehouseAction from "../Components/warehouse/ProductWarehouseAction";
// import FooterPagination from "../include/FooterPagination";
// import "../Styles/TableStyle.scss";
// import { useAuth } from "../context/AuthContext";
// import { translateLauguage } from "../function/translate";
// import EmptyData from "../include/EmptyData";
// import CircularIndeterminate from "../include/Loading";
// const getStatusColor = (status) => {
//   switch (status) {
//     case "pending":
//       return "warning";
//     case "accepted":
//       return "success";
//     case "rejected":
//       return "error";
//     case "partial_accepted":
//       return "info";
//     case "cancelled":
//       return "default";
//     default:
//       return "default";
//   }
// };
// const Warehouse = () => {
//   const [activeTab, setActiveTab] = useState("1");
//   const { language } = useAuth();
//   const { t } = translateLauguage(language);

//   const [productWarehousePage, setProductWarehousePage] = useState(1);
//   const [productWarehouseLimit, setProductWarehouseLimit] = useState(5);
//   const [productWarehouseKeyword, setProductWarehouseKeyword] = useState("");

//   const [productWarehouseTransferPage, setProductWarehouseTransferPage] =
//     useState(1);
//   const [productWarehouseTransferLimit, setProductWarehouseTransferLimit] =
//     useState(5);
//   const [productWarehouseTransferKeyword, setProductWarehouseTransferKeyword] =
//     useState("");

//   const [openTransfer, setOpenTransfer] = useState(false);
//   const handleOpenTransfer = () => setOpenTransfer(true);
//   const handleCloseTransfer = () => setOpenTransfer(false);

//   const {
//     productWarehouseWithPagination,
//     loading: productWarehouseLoading,
//     refetch: productWarehouseRefetch,
//     paginator: productWarehousePaginator,
//   } = useGetProductWarehouseWithPagination({
//     page: productWarehousePage,
//     limit: productWarehouseLimit,
//     pagination: true,
//     keyword: productWarehouseKeyword,
//   });


//   const {
//     productsWarehouseTransfer,
//     loading: productLoading,
//     refetch: productsWarehouseTransferRefetch,
//     paginator: productWarehouseTransferPaginator,
//   } = useGetWarehouseTransferWithPagination({
//     page: productWarehouseTransferPage,
//     limit: productWarehouseTransferLimit,
//     pagination: true,
//     keyword: productWarehouseTransferKeyword,
//   });

//   const handleLimit = (e) => {
//     const newLimit = parseInt(e.target.value, 10);
//     setProductWarehouseLimit(newLimit);
//     setProductWarehousePage(1);
//   };

//   const handlePageChange = (newPage) => {
//     setProductWarehousePage(newPage);
//   };

//   const handleLimitPrductWarehouseTransfer = (e) => {
//     const newLimit = parseInt(e.target.value, 10);
//     setProductWarehouseTransferLimit(newLimit);
//     setProductWarehouseTransferPage(1);
//   };

//   const handleProductWarehouseTransferPageChange = (newPage) => {
//     setProductWarehouseTransferPage(newPage);
//   };

//   return (
//     <Box>
//       <Stack direction="row" justifyContent="space-between" alignItems="center">
//         <Box textAlign="start">
//           <Breadcrumbs aria-label="breadcrumb" separator="/">
//             <Typography
//               // component={RouterLink}
//               to="/setting"
//               variant="h6"
//               sx={{
//                 textDecoration: "none",
//                 borderLeft: "3px solid #1D4592",
//                 pl: 1.5,
//                 fontWeight: 600,
//               }}
//             >
//               {t("warehouse")}
//             </Typography>
//           </Breadcrumbs>
//         </Box>
//       </Stack>
//       <Box sx={{ display: "flex", alignItems: "center", gap: 2 }} mt={5} >
//         <Button
//           variant={activeTab === "1" ? "contained" : "outlined"}
//           onClick={() => setActiveTab("1")}
//           fullWidth
//         >
//           {t(`product_stock`)}
//         </Button>
//         <Button
//           variant={activeTab === "5" ? "contained" : "outlined"}
//           onClick={() => setActiveTab("5")}
//           fullWidth
//         >
//           {t(`transfer_product`)}
//         </Button>
//         <Button
//           variant={activeTab === "2" ? "contained" : "outlined"}
//           onClick={() => setActiveTab("2")}
//           fullWidth
//         >
//           {t(`purchase_order`)}
//         </Button>
//         <Button
//           variant={activeTab === "3" ? "contained" : "outlined"}
//           onClick={() => setActiveTab("3")}
//           fullWidth
//         >
//           {t(`get_product`)}
//         </Button>
//         <Button
//           variant={activeTab === "4" ? "contained" : "outlined"}
//           onClick={() => setActiveTab("4")}
//           fullWidth
//         >
//           {t(`shop_request`)}
//         </Button>
//       </Box>

//       <Box>
//         {activeTab === "1" && (
//           <Box>
//             <TableContainer className="table-container">
//               <Table className="table" sx={{ mt: 3 }}>
//                 <TableHead className="table-header">
//                   <TableRow>
//                     <TableCell>{t(`no`)}</TableCell>
//                     <TableCell>{t(`product`)}</TableCell>
//                     <TableCell>{t(`unit`)}</TableCell>
//                     <TableCell>{t(`stock`)}</TableCell>
//                     <TableCell>{t(`min_stock`)}</TableCell>
//                     <TableCell>{t(`status`)}</TableCell>
//                     <TableCell></TableCell>
//                   </TableRow>
//                 </TableHead>
//                 {productWarehouseLoading ? (
//                   <CircularIndeterminate />
//                 ) : productWarehouseWithPagination?.length == 0 ? (
//                   <EmptyData />
//                 ) : (
//                   <TableBody>
//                     {productWarehouseWithPagination?.map((row, index) => (
//                       <TableRow className="table-row">
//                         <TableCell>
//                           {productWarehousePaginator.slNo + index}
//                         </TableCell>
//                         <TableCell>
//                           <Box display="flex" alignItems="center" gap={1}>
//                             <img
//                               src={row?.subProduct?.productImg}
//                               width={40}
//                               height={40}
//                               style={{
//                                 borderRadius: "100%",
//                                 objectFit: "cover",
//                               }}
//                             />
//                             {language == "kh"
//                               ? row?.subProduct?.parentProductId?.nameKh
//                               : row?.subProduct?.parentProductId?.nameEn}
//                           </Box>
//                         </TableCell>
//                         <TableCell>
//                           {language == "kh"
//                             ? row?.subProduct?.unitId?.nameKh
//                             : row?.subProduct?.unitId?.nameEn}
//                         </TableCell>
//                         <TableCell>
//                           {row?.stock}{" "}
//                           {language == "kh"
//                             ? row?.subProduct?.unitId?.nameKh
//                             : row?.subProduct?.unitId?.nameEn}
//                         </TableCell>
//                         <TableCell>
//                           {row?.subProduct?.minStock}{" "}
//                           {language == "kh"
//                             ? row?.subProduct?.unitId?.nameKh
//                             : row?.subProduct?.unitId?.nameEn}
//                         </TableCell>
//                         <TableCell>
//                           {row?.stock < row?.subProduct?.minStock ? (
//                             <Chip
//                               icon={<WarningAmberOutlinedIcon />}
//                               label={t("low_stock")}
//                               color=" "
//                               size="small"
//                               // variant="outlined"
//                               sx={{
//                                 fontWeight: 600,
//                                 bgcolor: "#df4a6fff",
//                                 color: "white",
//                               }}
//                             />
//                           ) : (
//                             <Chip
//                               icon={<CheckOutlinedIcon />}
//                               label={t("in_stock")}
//                               color=""
//                               size="small"
//                               // variant="outlined"
//                               sx={{
//                                 fontWeight: 600,
//                                 bgcolor: "#0097A7",
//                                 color: "white",
//                               }}
//                             />
//                           )}
//                         </TableCell>

//                         <TableCell className="flex-end">
//                           <ProductWarehouseAction
//                             unit={row?.subProduct?.unitId}
//                             setRefetch={productWarehouseRefetch}
//                             subProductId={row?.subProduct?._id}
//                             t={t}
//                           />
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 )}
//               </Table>
//               <Stack
//                 direction="row"
//                 justifyContent="flex-end"
//                 alignItems="center"
//                 sx={{ padding: 2 }}
//               >
//                 <FooterPagination
//                   page={productWarehousePage}
//                   limit={productWarehouseLimit}
//                   setPage={handlePageChange}
//                   handleLimit={handleLimit}
//                   totalDocs={productWarehousePaginator?.totalDocs}
//                   totalPages={productWarehousePaginator?.totalPages}
//                 />
//               </Stack>
//             </TableContainer>
//           </Box>
//         )}
//         {activeTab === "5" && (
//           <Box>
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}

//             >
//               <Grid
//                 container
//                 spacing={2}
//                 alignItems="center"
//                 textAlign={"start"}

//               >
//                 <Grid size={{ xs: 12 }}>
//                   <Typography variant="body2" fontWeight={500} mb={0.5}>
//                     {t("search")}
//                   </Typography>

//                   <TextField
//                     type="search"
//                     size="small"
//                     placeholder={t("search") + "..."}
//                     fullWidth
//                     // value={keyword}
//                     // onChange={(e) => setKeyword(e.target.value)}
//                     variant="outlined"
//                     // sx={{
//                     //   "& .MuiOutlinedInput-root fieldset": { border: "none" },
//                     // }}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <Search />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </Grid>
//               </Grid>

//               <Stack direction="row" spacing={2} mt={3}>
//                 <Button
//                   variant="contained"
//                   startIcon={<LibraryAddOutlinedIcon size={18} />}
//                   onClick={handleOpenTransfer}
//                 >
//                   {t("create_transfer")}
//                 </Button>
//                 {openTransfer && (
//                   <ProductTransferForm
//                     t={t}
//                     open={openTransfer}
//                     onClose={handleCloseTransfer}
//                     dialogTitle={"Create"}
//                     language={language}
//                     setRefetch={productsWarehouseTransferRefetch}
//                   />
//                 )}
//               </Stack>
//             </Box>
//             <TableContainer className="table-container">
//               <Table className="table" >
//                 <TableHead className="table-header">
//                   <TableRow>
//                     <TableCell>{t("no")}</TableCell>

//                     <TableCell>{t("to_shop")}</TableCell>

//                     <TableCell>{t("category")}</TableCell>

//                     <TableCell>{t("total_quantity")}</TableCell>

//                     <TableCell>{t("status")}</TableCell>

//                     <TableCell>{t("date")}</TableCell>

//                     <TableCell>{t("action")}</TableCell>
//                   </TableRow>
//                 </TableHead>

//                 {productLoading ? (
//                   <CircularIndeterminate />
//                 ) : productsWarehouseTransfer?.length == 0 ? (
//                   <EmptyData />
//                 ) : (
//                   <TableBody>
//                     {productsWarehouseTransfer.map((row, index) => {
//                       const totalQty = row.items.reduce(
//                         (sum, item) => sum + Number(item.quantity || 0),
//                         0,
//                       );

//                       return (
//                         <TableRow key={row._id} className="table-row">
//                           <TableCell>
//                             {productWarehouseTransferPaginator.slNo + index}
//                           </TableCell>
//                           <TableCell>
//                             {row.toShop?.nameEn || row.toShop?.nameKh || "-"}
//                           </TableCell>
//                           <TableCell>{row.items.length}</TableCell>
//                           <TableCell>{totalQty}</TableCell>

//                           <TableCell><Chip
//                             label={t(row?.status)}
//                             color={getStatusColor(row?.status)}
//                             size="small"
//                             sx={{ fontWeight: 600 }}
//                           />
//                           </TableCell>
//                           <TableCell>
//                             {dayjs(row.createdAt).format("DD/MM/YYYY")}
//                           </TableCell>
//                           <TableCell>
//                             <ProductTransferAction
//                               language={language}
//                               editData={row}
//                               t={t}
//                             />
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 )}
//               </Table>
//               <Stack
//                 direction="row"
//                 justifyContent="flex-end"
//                 alignItems="center"
//                 sx={{ padding: 2 }}
//               >
//                 <FooterPagination
//                   page={productWarehouseTransferPage}
//                   limit={productWarehouseTransferLimit}
//                   setPage={handleProductWarehouseTransferPageChange}
//                   handleLimit={handleLimitPrductWarehouseTransfer}
//                   totalDocs={productWarehouseTransferPaginator?.totalDocs}
//                   totalPages={productWarehouseTransferPaginator?.totalPages}
//                 />
//               </Stack>
//             </TableContainer>
//           </Box>
//         )}
//         {activeTab === "2" && <Typography> Orders Content</Typography>}
//         {activeTab === "3" && <Typography> Reports Content</Typography>}
//         {activeTab === "4" && <Typography> 4</Typography>}
//       </Box>
//     </Box>
//   );
// };

// export default Warehouse;
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Grid,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Search } from "lucide-react";
import dayjs from "dayjs";
import { useState } from "react";

import ProductTransferAction from "../Components/warehouse/product-transfer/ProductTransferAction";
import ProductTransferForm from "../Components/warehouse/product-transfer/ProductTransferForm";
import useGetWarehouseTransferWithPagination from "../Components/hook/useGetWarehouseTransferWithPagination";
import useGetProductWarehouseWithPagination from "../Components/hook/useGetProductWarehouseWithPagination";
import ProductWarehouseAction from "../Components/warehouse/ProductWarehouseAction";
import FooterPagination from "../include/FooterPagination";
import "../Styles/TableStyle.scss";
import { useAuth } from "../context/AuthContext";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";
import useGetPurchaseOrdersWithPagination from "../Components/hook/useGetPurchaseOrdersWithPagination";
import PurchaseOrderAction from "../Components/warehouse/purchaseOrder/PurchaseOrderAction";
import PurchaseOrderForm from "../Components/warehouse/purchaseOrder/PurchaseOrderForm";
import useGetStockMovementWithPagination from "../Components/hook/useGetStockMovementWithPagination";

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "warning";
    case "accepted":
      return "success";
    case "rejected":
      return "error";
    case "partial_accepted":
      return "info";
    case "cancelled":
      return "default";
    default:
      return "default";
  }
};

const Warehouse = () => {
  const [activeTab, setActiveTab] = useState("1");
  const { language } = useAuth();
  const { t } = translateLauguage(language);

  const [productWarehousePage, setProductWarehousePage] = useState(1);
  const [productWarehouseLimit, setProductWarehouseLimit] = useState(5);
  const [productWarehouseKeyword, setProductWarehouseKeyword] = useState("");

  const [productWarehouseTransferPage, setProductWarehouseTransferPage] = useState(1);
  const [productWarehouseTransferLimit, setProductWarehouseTransferLimit] = useState(5);
  const [productWarehouseTransferKeyword, setProductWarehouseTransferKeyword] = useState("");

  const [stockMovementPage, setStockMovementPage] = useState(1);
  const [stockMovementLimit, setStockMovementLimit] = useState(5);
  const [stockMovementKeyword, setStockMovementKeyword] = useState("");

  const [purchaseOrderPage, setPurchaseOrderPage] = useState(1);
  const [purchaseOrderLimit, setPurchaseOrderLimit] = useState(5);
  const [purchaseOrderKeyword, setPurchaseOrderKeyword] = useState("");

  const [openTransfer, setOpenTransfer] = useState(false);
  const handleOpenTransfer = () => setOpenTransfer(true);
  const handleCloseTransfer = () => setOpenTransfer(false);

  const {
    productWarehouseWithPagination,
    loading: productWarehouseLoading,
    refetch: productWarehouseRefetch,
    paginator: productWarehousePaginator,
  } = useGetProductWarehouseWithPagination({
    page: productWarehousePage,
    limit: productWarehouseLimit,
    pagination: true,
    keyword: productWarehouseKeyword,
  });

  const {
    productsWarehouseTransfer,
    loading: productLoading,
    refetch: productsWarehouseTransferRefetch,
    paginator: productWarehouseTransferPaginator,
  } = useGetWarehouseTransferWithPagination({
    page: productWarehouseTransferPage,
    limit: productWarehouseTransferLimit,
    pagination: true,
    keyword: productWarehouseTransferKeyword,
  });

  const {
    stockMovement,
    loading: stockMovementLoading,
    refetch: sotckMovementRefetch,
    paginator: stockMovementPaginator,
  } = useGetStockMovementWithPagination({
    page: stockMovementPage,
    limit: stockMovementLimit,
    pagination: true,
    keyword: stockMovementKeyword,
  });



  const {
    purchaseOrders,
    loading: purchaseOrderLoading,
    refetch: purchaseOrderRefetch,
    paginator: purchaseOrderPaginator,
  } = useGetPurchaseOrdersWithPagination({
    page: purchaseOrderPage,
    limit: purchaseOrderLimit,
    pagination: true,
    keyword: purchaseOrderKeyword,
  });



  const handleLimit = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setProductWarehouseLimit(newLimit);
    setProductWarehousePage(1);
  };

  const handlePageChange = (newPage) => {
    setProductWarehousePage(newPage);
  };

  const handleLimitPrductWarehouseTransfer = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setProductWarehouseTransferLimit(newLimit);
    setProductWarehouseTransferPage(1);
  };

  const handleProductWarehouseTransferPageChange = (newPage) => {
    setProductWarehouseTransferPage(newPage);
  };

  const handleLimitPurchaseOrder = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setPurchaseOrderLimit(newLimit);
    setPurchaseOrderPage(1);
  };
  const handlePurchaseOrderPageChange = (newPage) => {
    setPurchaseOrderPage(newPage);
  };

  const handleLimitStockMovement = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setStockMovementLimit(newLimit);
    setStockMovementPage(1);
  };
  const handleStockMovementPageChange = (newPage) => {
    setStockMovementPage(newPage);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
              {t("warehouse")}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Stack>


      <Grid container spacing={2} sx={{ mt: 2 }}>

        <Grid size={{ xs: 12, sm: 3, md: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              // backgroundColor: "#f5f5f5",
              height: "70vh",
              borderRadius: 1,
              // height: "100%",
            }}
          >
            <Stack direction="column" spacing={1}>
              <Button
                fullWidth
                variant={activeTab === "1" ? "contained" : "text"}
                onClick={() => setActiveTab("1")}
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                {t("product_stock")}
              </Button>
              <Button
                fullWidth
                variant={activeTab === "5" ? "contained" : "text"}
                onClick={() => setActiveTab("5")}
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                {t("transfer_product")}
              </Button>
              <Button
                fullWidth
                variant={activeTab === "2" ? "contained" : "text"}
                onClick={() => setActiveTab("2")}
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                {t("purchase_order")}
              </Button>
              <Button
                fullWidth
                variant={activeTab === "3" ? "contained" : "text"}
                onClick={() => setActiveTab("3")}
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                {t("stock_movement")}
              </Button>
              <Button
                fullWidth
                variant={activeTab === "4" ? "contained" : "text"}
                onClick={() => setActiveTab("4")}
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                {t("shop_request")}
              </Button>
            </Stack>
          </Paper>
        </Grid>


        <Grid size={{ xs: 12, sm: 9, md: 10 }}>
          <Box>
            {activeTab === "1" && (
              <Box>
                <TableContainer className="table-container">
                  <Table className="table"  >
                    <TableHead  >
                      <TableRow>
                        <TableCell>{t("no")}</TableCell>
                        <TableCell>{t("product")}</TableCell>
                        <TableCell>{t("unit")}</TableCell>
                        <TableCell>{t("stock")}</TableCell>
                        <TableCell>{t("min_stock")}</TableCell>
                        <TableCell >{t("status")}</TableCell>
                        <TableCell className="flex-center">{t("action")}</TableCell>
                      </TableRow>
                    </TableHead>
                    {productWarehouseLoading ? (
                      <CircularIndeterminate />
                    ) : productWarehouseWithPagination?.length === 0 ? (
                      <EmptyData />
                    ) : (
                      <TableBody>
                        {productWarehouseWithPagination?.map((row, index) => (
                          <TableRow className="table-row" key={row._id || index}>
                            <TableCell>
                              {productWarehousePaginator.slNo + index}
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <img
                                  src={row?.subProduct?.productImg}
                                  width={40}
                                  height={40}
                                  style={{
                                    borderRadius: "100%",
                                    objectFit: "cover",
                                  }}
                                  alt="product"
                                />
                                {language == "kh"
                                  ? row?.subProduct?.parentProductId?.nameKh
                                  : row?.subProduct?.parentProductId?.nameEn}
                              </Box>
                            </TableCell>
                            <TableCell>
                              {language == "kh"
                                ? row?.subProduct?.unitId?.nameKh
                                : row?.subProduct?.unitId?.nameEn}
                            </TableCell>
                            <TableCell>
                              {row?.stock}{" "}
                              {language == "kh"
                                ? row?.subProduct?.unitId?.nameKh
                                : row?.subProduct?.unitId?.nameEn}
                            </TableCell>
                            <TableCell>
                              {row?.subProduct?.minStock}{" "}
                              {language == "kh"
                                ? row?.subProduct?.unitId?.nameKh
                                : row?.subProduct?.unitId?.nameEn}
                            </TableCell>
                            <TableCell>
                              {row?.stock < row?.subProduct?.minStock ? (
                                <Chip
                                  icon={<WarningAmberOutlinedIcon />}
                                  label={t("low_stock")}
                                  size="small"
                                  sx={{
                                    fontWeight: 600,
                                    bgcolor: "#df4a6fff",
                                    color: "white",
                                  }}
                                />
                              ) : (
                                <Chip
                                  icon={<CheckOutlinedIcon />}
                                  label={t("in_stock")}
                                  size="small"
                                  sx={{
                                    fontWeight: 600,
                                    bgcolor: "#0097A7",
                                    color: "white",
                                  }}
                                />
                              )}
                            </TableCell>

                            <TableCell className="flex-end">
                              <ProductWarehouseAction
                                unit={row?.subProduct?.unitId}
                                setRefetch={productWarehouseRefetch}
                                subProductId={row?.subProduct?._id}
                                t={t}
                                warehouseData={row}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    )}
                  </Table>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    sx={{ padding: 2 }}
                  >
                    <FooterPagination
                      page={productWarehousePage}
                      limit={productWarehouseLimit}
                      setPage={handlePageChange}
                      handleLimit={handleLimit}
                      totalDocs={productWarehousePaginator?.totalDocs}
                      totalPages={productWarehousePaginator?.totalPages}
                    />
                  </Stack>
                </TableContainer>
              </Box>
            )}
            {activeTab === "5" && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    textAlign={"start"}
                    sx={{ flex: 1 }}
                  >
                    <Grid size={{ xs: 3 }}>
                      {/* <Typography variant="body2" fontWeight={500} mb={0.5}>
                        {t("search")}
                      </Typography> */}
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

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={<LibraryAddOutlinedIcon size={18} />}
                      onClick={handleOpenTransfer}
                    >
                      {t("create_transfer")}
                    </Button>
                    {openTransfer && (
                      <ProductTransferForm
                        t={t}
                        open={openTransfer}
                        onClose={handleCloseTransfer}
                        dialogTitle={"Create"}
                        language={language}
                        setRefetch={productsWarehouseTransferRefetch}
                      />
                    )}
                  </Stack>
                </Box>
                <TableContainer className="table-container">
                  <Table className="table">
                    <TableHead  >
                      <TableRow>
                        <TableCell>{t("no")}</TableCell>
                        <TableCell>{t("to_shop")}</TableCell>
                        <TableCell>{t("category")}</TableCell>
                        <TableCell>{t("total_quantity")}</TableCell>
                        <TableCell>{t("status")}</TableCell>
                        <TableCell>{t("date")}</TableCell>
                        <TableCell className="flex-center">{t("action")}</TableCell>
                      </TableRow>
                    </TableHead>

                    {productLoading ? (
                      <CircularIndeterminate />
                    ) : productsWarehouseTransfer?.length === 0 ? (
                      <EmptyData />
                    ) : (
                      <TableBody>
                        {productsWarehouseTransfer.map((row, index) => {
                          const totalQty = row.items.reduce(
                            (sum, item) => sum + Number(item.quantity || 0),
                            0
                          );

                          return (
                            <TableRow key={row._id} className="table-row">
                              <TableCell>
                                {productWarehouseTransferPaginator.slNo + index}
                              </TableCell>
                              <TableCell>
                                {row.toShop?.nameEn || row.toShop?.nameKh || "-"}
                              </TableCell>
                              <TableCell>{row.items.length}</TableCell>
                              <TableCell>{totalQty}</TableCell>
                              <TableCell>
                                <Chip
                                  label={t(row?.status)}
                                  color={getStatusColor(row?.status)}
                                  size="small"
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell>
                                {dayjs(row.createdAt).format("DD/MM/YYYY")}
                              </TableCell>
                              <TableCell className="flex-end">
                                <ProductTransferAction
                                  language={language}
                                  editData={row}
                                  t={t}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    )}
                  </Table>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    sx={{ padding: 2 }}
                  >
                    <FooterPagination
                      page={productWarehouseTransferPage}
                      limit={productWarehouseTransferLimit}
                      setPage={handleProductWarehouseTransferPageChange}
                      handleLimit={handleLimitPrductWarehouseTransfer}
                      totalDocs={productWarehouseTransferPaginator?.totalDocs}
                      totalPages={productWarehouseTransferPaginator?.totalPages}
                    />
                  </Stack>
                </TableContainer>
              </Box>
            )}
            {activeTab === "2" &&
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    textAlign={"start"}
                    sx={{ flex: 1 }}
                  >
                    <Grid size={{ xs: 3 }}>
                      {/* <Typography variant="body2" fontWeight={500} mb={0.5}>
                        {t("search")}
                      </Typography> */}
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

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={<LibraryAddOutlinedIcon size={18} />}
                      onClick={handleOpenTransfer}
                    >
                      {t("create_purchase_order")}
                    </Button>
                    {openTransfer && (
                      <PurchaseOrderForm
                        t={t}
                        open={openTransfer}
                        onClose={handleCloseTransfer}
                        dialogTitle={"Create"}
                        language={language}
                        setRefetch={productsWarehouseTransferRefetch}
                      />
                    )}
                  </Stack>
                </Box>
                <TableContainer className="table-container">
                  <Table className="table">
                    <TableHead  >
                      <TableRow>
                        <TableCell>{t("no")}</TableCell>
                        <TableCell>{t("suppliers")}</TableCell>
                        <TableCell>{t("category")}</TableCell>
                        <TableCell>{t("total_quantity")}</TableCell>
                        <TableCell>{t("status")}</TableCell>
                        <TableCell>{t("date")}</TableCell>
                        <TableCell className="flex-center" >{t("action")}</TableCell>
                      </TableRow>
                    </TableHead>

                    {purchaseOrderLoading ? (
                      <CircularIndeterminate />
                    ) : purchaseOrders?.length === 0 ? (
                      <EmptyData />
                    ) : (
                      <TableBody>
                        {purchaseOrders.map((row, index) => {
                          const totalQty = row.items.reduce(
                            (sum, item) => sum + Number(item.quantity || 0),
                            0
                          );

                          return (
                            <TableRow key={row._id} className="table-row">
                              <TableCell>
                                {productWarehouseTransferPaginator.slNo + index}
                              </TableCell>
                              <TableCell>
                                {language === "en" ? row.supplier?.nameEn : row.supplier?.nameKh || "-"}
                              </TableCell>
                              <TableCell>{row.items.length}</TableCell>
                              <TableCell>{totalQty}</TableCell>
                              <TableCell>
                                <Chip
                                  label={t(row?.status)}
                                  color={getStatusColor(row?.status)}
                                  size="small"
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell>
                                {dayjs(row.createdAt).format("DD/MM/YYYY")}
                              </TableCell>
                              <TableCell className="flex-end" >
                                <PurchaseOrderAction language={language} setRefetch={purchaseOrderRefetch} purchaseOrder={row} t={t} />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    )}
                  </Table>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    sx={{ padding: 2 }}
                  >
                    <FooterPagination
                      page={purchaseOrderPage}
                      limit={purchaseOrderLimit}
                      setPage={handlePurchaseOrderPageChange}
                      handleLimit={handleLimitPurchaseOrder}
                      totalDocs={purchaseOrderPaginator?.totalDocs}
                      totalPages={purchaseOrderPaginator?.totalPages}
                    />
                  </Stack>
                </TableContainer>
              </Box>
            }
            {activeTab === "3" && <Box>
              <TableContainer className="table-container">
                <Table className="table"  >
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("no")}</TableCell>
                      <TableCell>{t("date")}</TableCell>
                      <TableCell>{t("product")}</TableCell>
                      <TableCell>{t("type")}</TableCell>
                      <TableCell>{t("quantity")}</TableCell>
                      <TableCell>{t("previous_stock")}</TableCell>
                      <TableCell>{t("new_stock")}</TableCell>
                      <TableCell>{t("reason")}</TableCell>
      
                    </TableRow>
                  </TableHead>
                  {stockMovementLoading ? (
                    <CircularIndeterminate />
                  ) : stockMovement?.length === 0 ? (
                    <EmptyData />
                  ) : (
                    <TableBody>
                      {stockMovement?.map((row, index) => (
                        <TableRow className="table-row" key={index}>

                          {/* No */}
                          <TableCell>
                            {stockMovementPaginator?.slNo + index}
                          </TableCell>

                          {/* Date */}
                          <TableCell>
                            {new Date(row?.createdAt).toLocaleString()}
                          </TableCell>

                          {/* Product */}
                          <TableCell>
                            {language === "kh"
                              ? row?.product?.nameKh
                              : row?.product?.nameEn}
                          </TableCell>

                          {/* Type */}
                          <TableCell>
                            <Chip
                              label={row?.type}
                              size="small"
                              sx={{
                                width:50,
                                bgcolor:
                                  row?.type === "in"
                                    ? "#4CAF50"
                                    : row?.type === "out"
                                      ? "#F44336"
                                      : "#FF9800",
                                color: "#fff",
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>

                          {/* Quantity */}
                          <TableCell>
                            {row?.quantity}{" "}
                            {language === "kh"
                              ? row?.subProduct?.unitId?.nameKh
                              : row?.subProduct?.unitId?.nameEn}
                          </TableCell>

                          {/* Previous Stock */}
                          <TableCell>{row?.previousStock}</TableCell>

                          {/* New Stock */}
                          <TableCell>{row?.newStock}</TableCell>

                          {/* Reason */}
                          <TableCell>{row?.reason || "-"}</TableCell>

                     
 

                        </TableRow>
                      ))}
                    </TableBody>
                  )}
                </Table>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  sx={{ padding: 2 }}
                >
                  <FooterPagination
                    page={stockMovementPage}
                    limit={stockMovementLimit}
                    setPage={handleStockMovementPageChange}
                    handleLimit={handleLimitStockMovement}
                    totalDocs={stockMovementPaginator?.totalDocs}
                    totalPages={stockMovementPaginator?.totalPages}
                  />
                </Stack>
              </TableContainer>
            </Box>}
            {activeTab === "4" && <Typography> 4</Typography>}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Warehouse;