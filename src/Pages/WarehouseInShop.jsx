import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { useQuery } from "@apollo/client/react";
import { Box, Breadcrumbs, Button, Chip, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";

import GetProductInShopAction from "../Components/warehouseInShop/getProduct/GetProductInShopAction";
import useGetProductWarehouseInShopWithPagination from "../Components/hook/useGetProductWarehouseInShopWithPagination";
import useGetWarehouseTransferWithPagination from "../Components/hook/useGetWarehouseTransferWithPagination";
import FooterPagination from "../include/FooterPagination";
import { useAuth } from "../context/AuthContext";
import { GET_PRODUCT_WAREHOUSE_IN_SHOP_WITH_PAGINATION } from "../../graphql/queries";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";
const WarehouseInShop = () => {
  const [activeTab, setActiveTab] = useState("1");
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const savedStoreId = localStorage.getItem("activeShopId");

  const [productWarehouseInShopPage, setProductWarehouseInShopPage] =
    useState(1);
  const [productWarehouseInShopLimit, setProductWarehouseInShopLimit] =
    useState(5);
  const [productWarehouseInShopKeyword, setProductWarehouseInShopKeyword] =
    useState("");

  const [productWarehouseTransferPage, setProductWarehouseTransferPage] =
    useState(1);
  const [productWarehouseTransferLimit, setProductWarehouseTransferLimit] =
    useState(5);
  const [productWarehouseTransferKeyword, setProductWarehouseTransferKeyword] =
    useState("");

  const {
    productsWarehouseTransfer,
    loading: productWarehouseTransferLoading,
    refetch: productsWarehouseTransferRefetch,
    paginator: productWarehouseTransferPaginator,
  } = useGetWarehouseTransferWithPagination({
    page: productWarehouseTransferPage,
    limit: productWarehouseTransferLimit,
    pagination: true,
    keyword: productWarehouseTransferKeyword,
    shopId: savedStoreId,
  });

  const {
    data: productWarehouseInShop,
    refetch,
    loading: productWarehouseInShopLoading,
  } = useQuery(GET_PRODUCT_WAREHOUSE_IN_SHOP_WITH_PAGINATION, {
    variables: {
      shopId: savedStoreId,
      page,
      limit,
      pagination: true,
      keyword: "",
    },
  });

  const {
    producteWarehouseInShop,
    loading: productWarehouseLoading,
    refetch: productWarehouseRefetch,
    paginator: productWarehousePaginator,
  } = useGetProductWarehouseInShopWithPagination({
    shopId: savedStoreId,
    page: productWarehouseInShopPage,
    limit: productWarehouseInShopLimit,
    pagination: true,
    keyword: productWarehouseInShopKeyword,
  });

  const products =
    productWarehouseInShop?.getProductWareHouseInShopoWithPagination?.data ||
    [];
  const paginator =
    productWarehouseInShop?.getProductWareHouseInShopoWithPagination
      ?.paginator || [];

  const handleLimitProductWarehouseInShop = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setProductWarehouseInShopLimit(newLimit);
    setProductWarehouseInShopPage(1);
  };

  const handlePageChangeProductWarehouseInShop = (newPage) => {
    setProductWarehouseInShopPage(newPage);
  };

  const handleLimitWarehouseTransfer = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setProductWarehouseTransferLimit(newLimit);
    setProductWarehouseTransferPage(1);
  };

  const handlePageChangeWarehouseTransfer = (newPage) => {
    setProductWarehouseTransferPage(newPage);
  };

  return (
    <Box sx={{ width: "100%", padding: "16px" }}>
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
              {t("warehouse_in_shop")}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Stack>
      <Grid container spacing={2} mt={5}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Button
            variant={activeTab === "1" ? "contained" : "outlined"}
            onClick={() => setActiveTab("1")}
            fullWidth
          >
            {t(`product_stock`)}
          </Button>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Button
            variant={activeTab === "2" ? "contained" : "outlined"}
            onClick={() => setActiveTab("2")}
            fullWidth
          >
            {t(`purchase_order`)}
          </Button>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Button
            variant={activeTab === "3" ? "contained" : "outlined"}
            onClick={() => setActiveTab("3")}
            fullWidth
          >
            {t(`get_product`)}
          </Button>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Button
            variant={activeTab === "4" ? "contained" : "outlined"}
            onClick={() => setActiveTab("4")}
            fullWidth
          >
            {t(`request_to_warehouse`)}
          </Button>
        </Grid>
      </Grid>

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
                    <TableCell>{t(`current_stock`)}</TableCell>
                    <TableCell>{t(`min_stock`)}</TableCell>
                    <TableCell>{t(`status`)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                {productWarehouseLoading ? (
                  <CircularIndeterminate />
                ) : producteWarehouseInShop?.length == 0 ? (
                  <EmptyData />
                ) : (
                  <TableBody>
                    {producteWarehouseInShop.map((row, index) => (
                      <TableRow key={row._id}>
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
                            {language === "kh"
                              ? row?.subProduct?.parentProductId?.nameKh
                              : row?.subProduct?.parentProductId?.nameEn}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {language === "kh"
                            ? row?.subProduct?.unitId?.nameKh
                            : row?.subProduct?.unitId?.nameEn}
                        </TableCell>
                        <TableCell>{row?.stock}</TableCell>
                        <TableCell>{row?.minStock}</TableCell>
                        <TableCell>
                          {row?.stock < row?.minStock ? (
                            <Chip
                              icon={<WarningAmberOutlinedIcon />}
                              label={t("low_stock")}
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
                              sx={{
                                fontWeight: 600,
                                bgcolor: "#0097A7",
                                color: "white",
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell></TableCell>
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
                  setPage={handlePageChangeProductWarehouseInShop}
                  handleLimit={handleLimitProductWarehouseInShop}
                  totalDocs={paginator?.totalDocs}
                  totalPages={paginator?.totalPages}
                />
              </Stack>
            </TableContainer>
          </Box>
        )}
        {activeTab === "2" && <Typography> Orders Content</Typography>}
        {activeTab === "3" && (
          <Box>
            <TableContainer className="table-container">
              <Table className="table">
                <TableHead className="table-header">
                  <TableRow>
                    <TableCell>{t(`no`)}</TableCell>
                    <TableCell>{t(`items_count`)}</TableCell>
                    <TableCell>{t(`requested_by`)}</TableCell>
                    <TableCell>{t(`accepted_by`)}</TableCell>
                    <TableCell>{t(`status`)}</TableCell>
                    <TableCell>{t(`remark`)}</TableCell>
                    <TableCell>{t(`created_at`)}</TableCell>
                    <TableCell>{t(`action`)}</TableCell>
                  </TableRow>
                </TableHead>

                {productWarehouseLoading ? (
                  <CircularIndeterminate />
                ) : productsWarehouseTransfer?.length == 0 ? (
                  <EmptyData />
                ) : (
                  <TableBody>
                    {productsWarehouseTransfer.map((row, index) => (
                      <TableRow key={row._id}>
                        <TableCell>{paginator.slNo + index}</TableCell>

                        <TableCell>
                          {row?.items?.length} {t(`product`)}
                        </TableCell>

                        <TableCell>
                          {language === "kh"
                            ? row?.requestedBy?.nameKh
                            : row?.requestedBy?.nameEn}
                        </TableCell>

                        <TableCell>
                          {language === "kh"
                            ? row?.acceptedBy?.nameKh
                            : row?.acceptedBy?.nameEn}
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={row?.status}
                            sx={{
                              fontWeight: 600,
                              bgcolor:
                                row?.status === "APPROVED"
                                  ? "#0097A7"
                                  : row?.status === "PENDING"
                                    ? "#fbc02d"
                                    : "#df4a6fff",
                              color: "white",
                            }}
                          />
                        </TableCell>

                        <TableCell>{row?.remark}</TableCell>

                        <TableCell>
                          {new Date(row?.createdAt).toLocaleDateString()}
                        </TableCell>

                        <TableCell>
                          <GetProductInShopAction
                            t={t}
                            language={language}
                            editData={row}
                            loading={productWarehouseTransferLoading}
                            refetch={productsWarehouseTransferRefetch}
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
                  page={productWarehouseTransferPage}
                  limit={productWarehouseTransferLimit}
                  setPage={handlePageChangeWarehouseTransfer}
                  handleLimit={handleLimitWarehouseTransfer}
                  totalDocs={productWarehouseTransferPaginator?.totalDocs}
                  totalPages={productWarehouseTransferPaginator?.totalPages}
                />
              </Stack>
            </TableContainer>
          </Box>
        )}
        {activeTab === "4" && <Typography> 4</Typography>}
      </Box>
    </Box>
  );
};

export default WarehouseInShop;
