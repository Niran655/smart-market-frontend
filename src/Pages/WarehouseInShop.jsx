import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { useQuery } from "@apollo/client/react";
import { Box, Breadcrumbs, Button, Chip, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useState } from "react";

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
  const {
    data: productWarehouseInShop,
    refetch,
    loading,
  } = useQuery(GET_PRODUCT_WAREHOUSE_IN_SHOP_WITH_PAGINATION, {
    variables: {
      shopId: savedStoreId,
      page,
      limit,
      pagination: true,
      keyword: "",
    },
  });
  const products =
    productWarehouseInShop?.getProductWareHouseInShopoWithPagination?.data || [];
  const paginator =
    productWarehouseInShop?.getProductWareHouseInShopoWithPagination?.paginator || [];


  const handleLimit = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }} mt={5}>
        <Button
          variant={activeTab === "1" ? "contained" : "outlined"}
          onClick={() => setActiveTab("1")}
          fullWidth
        >
          {t(`product_stock`)}
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
          {t(`request_to_warehouse`)}
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
                    <TableCell>{t(`current_stock`)}</TableCell>
                    <TableCell>{t(`min_stock`)}</TableCell>
                    <TableCell>{t(`status`)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                {loading ? (
                  <CircularIndeterminate />
                ) : products?.length == 0 ? (
                  <EmptyData />
                ) : (
                  <TableBody>
                    {products.map((row, index) => (
                      <TableRow key={row._id}>
                        <TableCell>{paginator.slNo + index}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <img
                              src={row?.subProduct?.productImg}
                              width={40}
                              height={40}
                              style={{ borderRadius: "100%", objectFit: "cover" }}
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
                              sx={{ fontWeight: 600, bgcolor: "#df4a6fff", color: "white" }}
                            />
                          ) : (
                            <Chip
                              icon={<CheckOutlinedIcon />}
                              label={t("in_stock")}
                              sx={{ fontWeight: 600, bgcolor: "#0097A7", color: "white" }}
                            />
                          )}
                        </TableCell>
                        <TableCell>

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
        {activeTab === "2" && <Typography> Orders Content</Typography>}
        {activeTab === "3" && <Typography> Reports Content</Typography>}
        {activeTab === "4" && <Typography> 4</Typography>}
      </Box>
    </Box>
  );
};

export default WarehouseInShop;
