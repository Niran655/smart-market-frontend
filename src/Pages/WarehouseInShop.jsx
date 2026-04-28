import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { Box, Breadcrumbs, Chip, Grid, InputAdornment, MenuItem, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Search } from "lucide-react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useState } from "react";

import GetProductInShopAction from "../Components/warehouseInShop/getProduct/GetProductInShopAction";
import useGetProductWarehouseInShopWithPagination from "../Components/hook/useGetProductWarehouseInShopWithPagination";
import useGetWarehouseTransferWithPagination from "../Components/hook/useGetWarehouseTransferWithPagination";
import FooterPagination from "../include/FooterPagination";
import "../Styles/modernTable.scss";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";
import useGetStockMovementWithPagination from "../Components/hook/useGetStockMovementWithPagination";

const getStatusStyle = (status) => {
  switch (status) {
    case "pending":
      return {
        backgroundColor: "#FFF3E0",
        color: "#EF6C00",
        "& .MuiChip-icon": { color: "#EF6C00" },
        fontWeight: 500,
        borderRadius: "6px",
      };
    case "accepted":
      return {
        backgroundColor: "#E8F5E9",
        color: "#2E7D32",
        "& .MuiChip-icon": { color: "#2E7D32" },
        fontWeight: 500,
        borderRadius: "6px",
      };
    case "rejected":
      return {
        backgroundColor: "#FFEBEE",
        color: "#C62828",
        "& .MuiChip-icon": { color: "#C62828" },
        fontWeight: 500,
        borderRadius: "6px",
      };
    case "partial_accepted":
      return {
        backgroundColor: "#E3F2FD",
        color: "#1565C0",
        "& .MuiChip-icon": { color: "#1565C0" },
        fontWeight: 500,
        borderRadius: "6px",
      };
    default:
      return {
        backgroundColor: "#F5F5F5",
        color: "#616161",
        fontWeight: 500,
        borderRadius: "6px",
      };
  }
};

const WarehouseInShop = () => {
  const { language } = useAuth();
  const { t } = translateLauguage(language);

  const [productWarehouseKeyword, setProductWarehouseKeyword] = useState("");

  const [tab, setTab] = useState("1");
  const handleTabChange = (e, newValue) => setTab(newValue);

  const savedStoreId = localStorage.getItem("activeShopId");

  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [stockMovementPage, setStockMovementPage] = useState(1);
  const [stockMovementLimit, setStockMovementLimit] = useState(5);
  const [stockMovementKeyword, setStockMovementKeyword] = useState("");

  const [transferPage, setTransferPage] = useState(1);
  const [transferLimit, setTransferLimit] = useState(5);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const {
    producteWarehouseInShop,
    loading: productWarehouseLoading,
    paginator,
    refetch: productWarehouseInShopRefetch
  } = useGetProductWarehouseInShopWithPagination({
    shopId: savedStoreId,
    page,
    limit,
    pagination: true,
    keyword: productWarehouseKeyword,
  });

  const {
    productsWarehouseTransfer,
    loading: productWarehouseTransferLoading,
    refetch: transferRefetch,
    paginator: transferPaginator,
  } = useGetWarehouseTransferWithPagination({
    shopId: savedStoreId,
    page: transferPage,
    limit: transferLimit,
    pagination: true,
    keyword: "",
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
    shopId: savedStoreId
  });


  const handleLimitStockMovement = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setStockMovementLimit(newLimit);
    setStockMovementPage(1);
  };
  const handleStockMovementPageChange = (newPage) => {
    setStockMovementPage(newPage);
  };

  const filteredProducts = producteWarehouseInShop?.filter((item) => {
    if (status === "All") return true;

    if (status === "low_stock") {
      return item.stock < item?.subProduct?.minStock;
    }

    if (status === "in_stock") {
      return item.stock >= item?.subProduct?.minStock;
    }

    return true;
  });

  return (
    <Box sx={{ width: "100%", p: 2 }}>

      <Breadcrumbs separator="/">
        <Typography
          variant="h6"
          sx={{
            borderLeft: "3px solid #1D4592",
            pl: 1.5,
            fontWeight: 600,
          }}
        >
          {t("warehouse_in_shop")}
        </Typography>
      </Breadcrumbs>

      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 4 }}>
          <TabList
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: 14,
              },
            }}
          >
            <Tab label={t("product_stock")} value="1" />
            <Tab label={t("purchase_order")} value="2" />
            <Tab label={t("get_product")} value="3" />
            <Tab label={t("request_to_warehouse")} value="4" />
            <Tab label={t("stock_movement")} value="5" />
          </TabList>
        </Box>


        <TabPanel value="1">
          <Stack direction={"row"} justifyContent={"space-between"} mt={1}>
            <Grid
              container
              spacing={5}
              fullWidth
              alignItems="center"
              textAlign="start"
              mb={2}
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" fontWeight={500} mb={0.5}>
                  {t("search")}
                </Typography>
                <TextField
                  type="search"
                  size="small"
                  placeholder={t("search") + "..."}
                  value={productWarehouseKeyword}
                  onChange={(e) => setProductWarehouseKeyword(e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{
                    width: "250px",

                    "& .MuiOutlinedInput-root": {
                      // "& fieldset": { border: "none" },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography className="search-head-title">{t("status")}</Typography>
                <TextField
                  className="select-text-field"
                  select
                  fullWidth
                  placeholder="Select"
                  size="small"
                  value={status}
                  sx={{
                    width: "200px",

                  }}
                  onChange={handleStatusChange}
                >
                  <MenuItem value="All">
                    {t("all")}
                  </MenuItem>
                  <MenuItem value="low_stock">
                    {t("low_stock")}
                  </MenuItem>
                  <MenuItem value="in_stock">
                    {t("in_enough")}
                  </MenuItem>

                </TextField>
              </Grid>
            </Grid>

            <Stack direction="row" spacing={2} mt={3}>


            </Stack>
          </Stack>

          <TableContainer className="table-container">
            <Table className="table">
              <TableHead>
                <TableRow>
                  <TableCell>{t("no")}</TableCell>
                  <TableCell>{t("product")}</TableCell>
                  <TableCell>{t("barcode")}</TableCell>
                  <TableCell>{t("unit")}</TableCell>
                  <TableCell align="right">{t("stock")}</TableCell>
                  <TableCell align="right">{t("min_stock")}</TableCell>
                  <TableCell align="right">{t("cost")}</TableCell>
                  <TableCell align="right">{t("total_price")}</TableCell>
                  <TableCell>{t("status")}</TableCell>
                </TableRow>
              </TableHead>

              {productWarehouseLoading ? (
                <CircularIndeterminate />
              ) : producteWarehouseInShop?.length === 0 ? (
                <EmptyData />
              ) : (
                <TableBody>
                  {filteredProducts.map((row, index) => {
                    const stock = row?.stock || 0;
                    const minStock = row?.subProduct?.minStock || 0;
                    const cost = row?.subProduct?.costPrice || 0;

                    const totalValue = stock * cost;
                    const isLow = stock < minStock;

                    return (
                      <TableRow key={row._id} className="table-row">


                        <TableCell>{paginator.slNo + index}</TableCell>


                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <img
                              src={row?.subProduct?.productImg}
                              width={36}
                              height={36}
                              style={{ borderRadius: "50%" }}
                            />
                            {language === "kh"
                              ? row?.subProduct?.parentProductId?.nameKh
                              : row?.subProduct?.parentProductId?.nameEn}
                          </Stack>
                        </TableCell>


                        <TableCell>{row?.subProduct?.barCode}</TableCell>


                        <TableCell>
                          {language === "kh"
                            ? row?.subProduct?.unitId?.nameKh
                            : row?.subProduct?.unitId?.nameEn}
                        </TableCell>


                        <TableCell align="right">{stock}</TableCell>


                        <TableCell align="right">{minStock}</TableCell>


                        <TableCell align="right">
                          ${cost.toFixed(2)}
                        </TableCell>


                        <TableCell align="right">
                          <strong>${totalValue.toFixed(2)}</strong>
                        </TableCell>


                        <TableCell>
                          {isLow ? (
                            <Chip
                              icon={<WarningAmberOutlinedIcon />}
                              label={`${t("low_stock")} (${minStock - stock})`}
                              color="error"
                              size="small"
                            />
                          ) : (
                            <Chip
                              icon={<CheckOutlinedIcon />}
                              label={t("in_stock")}
                              size="small"
                              sx={{
                                backgroundColor: "#E8F5E9",
                                color: "#2E7D32",
                                fontWeight: 500,
                              }}
                            />
                          )}
                        </TableCell>

                      </TableRow>
                    );
                  })}
                </TableBody>
              )}
            </Table>

            <Stack alignItems="flex-end" p={2}>
              <FooterPagination
                page={page}
                limit={limit}
                setPage={setPage}
                handleLimit={(e) => setLimit(+e.target.value)}
                totalDocs={paginator?.totalDocs}
                totalPages={paginator?.totalPages}
              />
            </Stack>
          </TableContainer>


        </TabPanel>


        <TabPanel value="2">
          <Typography>Orders Content</Typography>
        </TabPanel>


        <TabPanel value="3">
          <TableContainer className="table-container">
            <Table className="table">
              <TableHead>
                <TableRow>
                  <TableCell>{t("no")}</TableCell>
                  <TableCell>{t("shop")}</TableCell>
                  <TableCell>{t("items")}</TableCell>
                  <TableCell>{t("total_qty")}</TableCell>
                  <TableCell>{t("total_price")}</TableCell>
                  <TableCell>{t("send_by")}</TableCell>
                  <TableCell>{t("accepted_by")}</TableCell>
                  <TableCell>{t("status")}</TableCell>
                  <TableCell>{t("date")}</TableCell>
                  <TableCell>{t("action")}</TableCell>
                </TableRow>
              </TableHead>

              {productWarehouseTransferLoading ? (
                <CircularIndeterminate />
              ) : productsWarehouseTransfer?.length === 0 ? (
                <EmptyData />
              ) : (
                <TableBody>
                  {productsWarehouseTransfer.map((row, index) => {

                    const totalQty = row.items.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    );

                    const totalPrice = row.items.reduce(
                      (sum, item) =>
                        sum + item.quantity * (item.subProduct?.costPrice || 0),
                      0
                    );

                    return (
                      <TableRow className="table-row" key={row._id}>


                        <TableCell>
                          {transferPaginator.slNo + index}
                        </TableCell>


                        <TableCell>
                          {language === "kh"
                            ? row?.toShop?.nameKh
                            : row?.toShop?.nameEn}
                        </TableCell>


                        <TableCell>{row.items.length}</TableCell>


                        <TableCell>{totalQty}</TableCell>


                        <TableCell>${totalPrice.toFixed(2)}</TableCell>


                        <TableCell>
                          {language === "kh"
                            ? row?.requestedBy?.nameKh
                            : row?.requestedBy?.nameEn}
                        </TableCell>


                        <TableCell>
                          {row?.acceptedBy
                            ? language === "kh"
                              ? row?.acceptedBy?.nameKh
                              : row?.acceptedBy?.nameEn
                            : "-"}
                        </TableCell>


                        <TableCell>
                          <Chip
                            label={t(row?.status)}
                            size="small"
                            icon={
                              row?.status === "accepted"
                                ? <CheckOutlinedIcon />
                                : undefined
                            }
                            sx={getStatusStyle(row?.status)}
                          />
                        </TableCell>

                        {/* Date */}
                        <TableCell>
                          {new Date(row?.createdAt).toLocaleDateString()}
                        </TableCell>

                        {/* Action */}
                        <TableCell>
                          <GetProductInShopAction
                            t={t}
                            language={language}
                            editData={row}
                            refetch={transferRefetch}
                            productWarehouseInShopRefetch={productWarehouseInShopRefetch}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              )}
            </Table>

            <Stack alignItems="flex-end" p={2}>
              <FooterPagination
                page={transferPage}
                limit={transferLimit}
                setPage={setTransferPage}
                handleLimit={(e) => setTransferLimit(+e.target.value)}
                totalDocs={transferPaginator?.totalDocs}
                totalPages={transferPaginator?.totalPages}
              />
            </Stack>
          </TableContainer>
        </TabPanel>


        <TabPanel value="4">
          <Typography>Request to warehouse</Typography>
        </TabPanel>
        <TabPanel value="5">
          <Box>
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
                              width: 50,
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
          </Box>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default WarehouseInShop;
