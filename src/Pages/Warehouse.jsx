import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { Box, Breadcrumbs, Button, Chip, Grid, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
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

const Warehouse = () => {
  const [activeTab, setActiveTab] = useState("1");
  const { language } = useAuth();
  const { t } = translateLauguage(language);

  const [productWarehousePage, setProductWarehousePage] = useState(1);
  const [productWarehouseLimit, setProductWarehouseLimit] = useState(5);
  const [productWarehouseKeyword, setProductWarehouseKeyword] = useState("");

  const [productWarehouseTransferPage, setProductWarehouseTransferPage] =
    useState(1);
  const [productWarehouseTransferLimit, setProductWarehouseTransferLimit] =
    useState(5);
  const [productWarehouseTransferKeyword, setProductWarehouseTransferKeyword] =
    useState("");

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

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box textAlign="start">
          <Breadcrumbs aria-label="breadcrumb" separator="/">
            <Typography
              // component={RouterLink}
              to="/setting"
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 2  }} mt={5} >
        <Button
          variant={activeTab === "1" ? "contained" : "outlined"}
          onClick={() => setActiveTab("1")}
          fullWidth
        >
          {t(`product_stock`)}
        </Button>
        <Button
          variant={activeTab === "5" ? "contained" : "outlined"}
          onClick={() => setActiveTab("5")}
          fullWidth
        >
          {t(`transfer_product`)}
        </Button>
        <Button
          variant={activeTab === "2" ? "contained" : "outlined"}
          onClick={() => setActiveTab("2")}
          fullWidth
        >
          {t(`purchase_order`)}
        </Button>
        <Button
          variant={activeTab === "3" ? "contained" : "outlined"}
          onClick={() => setActiveTab("3")}
          fullWidth
        >
          {t(`get_product`)}
        </Button>
        <Button
          variant={activeTab === "4" ? "contained" : "outlined"}
          onClick={() => setActiveTab("4")}
          fullWidth
        >
          {t(`shop_request`)}
        </Button>
      </Box>

      <Box>
        {activeTab === "1" && (
          <Box>
            <TableContainer className="table-container">
              <Table className="table" sx={{ mt: 3 }}>
                <TableHead className="table-header">
                  <TableRow>
                    <TableCell>{t(`no`)}</TableCell>
                    <TableCell>{t(`product`)}</TableCell>
                    <TableCell>{t(`unit`)}</TableCell>
                    <TableCell>{t(`stock`)}</TableCell>
                    <TableCell>{t(`min_stock`)}</TableCell>
                    <TableCell>{t(`status`)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                {productWarehouseLoading ? (
                  <CircularIndeterminate />
                ) : productWarehouseWithPagination?.length == 0 ? (
                  <EmptyData />
                ) : (
                  <TableBody>
                    {productWarehouseWithPagination?.map((row, index) => (
                      <TableRow className="table-row">
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
                              color=" "
                              size="small"
                              // variant="outlined"
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
                              color=""
                              size="small"
                              // variant="outlined"
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
              }}
           
            >
              <Grid
                container
                spacing={2}
                alignItems="center"
                textAlign={"start"}
        
              >
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" fontWeight={500} mb={0.5}>
                    {t("search")}
                  </Typography>

                  <TextField
                    type="search"
                    size="small"
                    placeholder={t("search") + "..."}
                    fullWidth
                    // value={keyword}
                    // onChange={(e) => setKeyword(e.target.value)}
                    variant="outlined"
                    // sx={{
                    //   "& .MuiOutlinedInput-root fieldset": { border: "none" },
                    // }}
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
              <Table className="table" >
                <TableHead className="table-header">
                  <TableRow>
                    <TableCell>{t("no")}</TableCell>

                    <TableCell>{t("to_shop")}</TableCell>

                    <TableCell>{t("items_count")}</TableCell>

                    <TableCell>{t("total_quantity")}</TableCell>

                    <TableCell>{t("status")}</TableCell>

                    <TableCell>{t("date")}</TableCell>

                    <TableCell>{t("action")}</TableCell>
                  </TableRow>
                </TableHead>

                {productLoading ? (
                  <CircularIndeterminate />
                ) : productsWarehouseTransfer?.length == 0 ? (
                  <EmptyData />
                ) : (
                  <TableBody>
                    {productsWarehouseTransfer.map((row, index) => {
                      const totalQty = row.items.reduce(
                        (sum, item) => sum + Number(item.quantity || 0),
                        0,
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
                              size="small"
                              label={row.status}
                              color={
                                row.status === "PENDING"
                                  ? "warning"
                                  : row.status === "APPROVED"
                                    ? "success"
                                    : "default"
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {dayjs(row.createdAt).format("DD/MM/YYYY")}
                          </TableCell>
                          <TableCell>
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
        {activeTab === "2" && <Typography> Orders Content</Typography>}
        {activeTab === "3" && <Typography> Reports Content</Typography>}
        {activeTab === "4" && <Typography> 4</Typography>}
      </Box>
    </Box>
  );
};

export default Warehouse;
