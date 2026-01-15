import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { useQuery } from "@apollo/client/react";
import { Box, Breadcrumbs, Button, Chip, Grid, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { CopyPlus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";

import ProductTransferForm from "../Components/warehouse/product-transfer/ProductTransferForm";
import ProductWarehouseAction from "../Components/warehouse/ProductWarehouseAction";
import FooterPagination from "../include/FooterPagination";
import { useAuth } from "../context/AuthContext";
import { GET_PRDUCT_WAREHOUSE_WITH_PAGINATION } from "../../graphql/queries";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";
const Warehouse = () => {
  const [activeTab, setActiveTab] = useState("1");
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [openTransfer, setOpenTransfer] = useState(false);
  const handleOpenTransfer = () => setOpenTransfer(true);
  const handleCloseTransfer = () => setOpenTransfer(false);
  const [product, setProduct] = useState([]);
  const {
    data: productWarehouse,
    refetch,
    loading,
  } = useQuery(GET_PRDUCT_WAREHOUSE_WITH_PAGINATION, {
    variables: {
      page: 1,
      limit: 6,
      pagination: true,
      keyword: "",

    },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (productWarehouse?.getProductWareHouseWithPagination?.data) {
      setProduct(productWarehouse.getProductWareHouseWithPagination.data);
    }
  }, [productWarehouse?.getProductWareHouseWithPagination?.data]);



  // const product =
  //   productWarehouse?.getProductWareHouseWithPagination?.data || [];
  const paginator =
    productWarehouse?.getProductWareHouseWithPagination?.paginator || [];
  const handleLimit = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  return (
    <Box sx={{ width: "100%" }}>
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }} mt={5}>
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

      <Box mt={5}>
        {activeTab === "1" && (
          <Box>
            <TableContainer className="table-container">
              <Table className="table">
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

                {loading ? (
                  <CircularIndeterminate />
                ) : product?.length == 0 ? (
                  <EmptyData />
                ) : (
                  <TableBody>
                    {product?.map((row, index) => (
                      <TableRow className="table-row">
                        <TableCell>{paginator.slNo + index}</TableCell>
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
                            setRefetch={refetch}
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
                  page={page}
                  limit={limit}
                  setPage={handlePageChange}
                  handleLimit={handleLimit}
                  totalDocs={paginator?.totalDocs}
                  totalPages={paginator?.totalPages}
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
              mt={5}
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
                  />
                )}
              </Stack>
            </Box>
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
