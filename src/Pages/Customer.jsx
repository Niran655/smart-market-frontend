import { useQuery } from "@apollo/client/react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Search } from "lucide-react";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { useState } from "react";

import { GET_CUSTOMERS_WITH_PAGINATION } from "../../graphql/queries";
import { useAuth } from "../context/AuthContext";
import { translateLauguage } from "../function/translate";
import FooterPagination from "../include/FooterPagination";
import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";
import CustomerAction from "../Components/customer/CustomerAction";
import CustomerForm from "../Components/customer/CustomerForm";
// import AllowStatus from "../include/AllowStatus";

const Customer = () => {
  const { language, user } = useAuth();
  const { t } = translateLauguage(language);
  const shopId = user?.shopId || user?._id;
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState("active");

  const { data, refetch, loading } = useQuery(GET_CUSTOMERS_WITH_PAGINATION, {
    variables: {
      shopIds: null,
      page,
      limit,
      pagination: true,
      keyword,
      active: activeFilter === "active" ? true : activeFilter === "inactive" ? false : undefined,
    },
  });


  console.log("data::", data);


  const customers = data?.getCustomersWithPagination?.data || [];
  const paginator = data?.getCustomersWithPagination?.paginator || {};

  const handleLimit = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  const handlePageChange = (newPage) => setPage(newPage);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Breadcrumbs aria-label="breadcrumb" separator="/">
          <Typography
            component={RouterLink}
            to="/"
            variant="h6"
            sx={{ textDecoration: "none", borderLeft: "3px solid #1D4592", pl: 1.5, fontWeight: 600 }}
          >
            {t("customer")}
          </Typography>
        </Breadcrumbs>
        
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} mt={5}>
        <Grid container
          spacing={2}
          fullWidth
          alignItems="center"
          textAlign="start">
          <Grid size={{ xs: 6, md: 6 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              {t("search")}
            </Typography>
            <TextField
              size="small"
              placeholder={t("search") + "..."}
              value={keyword}
              fullWidth
              onChange={(e) => setKeyword(e.target.value)}
              
              InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 6 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              {t("status")}
            </Typography>
            <TextField select fullWidth size="small"  value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
              <MenuItem value="active">{t("active")}</MenuItem>
              <MenuItem value="inactive">{t("inactive")}</MenuItem>
              <MenuItem value="all">{t("all")}</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Button variant="contained" startIcon={<LibraryAddOutlinedIcon />} onClick={() => setOpen(true)}>
          {t("create")}
        </Button>
      </Box>

      <TableContainer sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("no")}</TableCell>
              <TableCell>{t("name")}</TableCell>
              <TableCell>{t("phone")}</TableCell>
              <TableCell>{t("email")}</TableCell>
              <TableCell>{t("gender")}</TableCell>
              <TableCell>{t("total_spent")}</TableCell>
              <TableCell align="center">{t("status")}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          {loading ? (
            <CircularIndeterminate />
          ) : customers.length === 0 ? (
            <EmptyData />
          ) : (
            <TableBody>
              {customers.map((row, idx) => (
                <TableRow key={row._id}>
                  <TableCell>{(paginator.currentPage - 1) * limit + idx + 1}</TableCell>
                  <TableCell>{language === "en" ? row.nameEn : row.nameKh || row.nameEn}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.gender === "male" ? t("male") : t("female")}</TableCell>
                  <TableCell>${row.totalSpent?.toFixed(2) || "0.00"}</TableCell>
                  <TableCell align="center">
                    {/* <AllowStatus active={row.active} onToggle={() => {}} />{" "} */}

                  </TableCell>
                  <TableCell>
                    <CustomerAction customerData={row} setRefetch={refetch} t={t} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <Stack direction="row" justifyContent="flex-end" sx={{ p: 2 }}>
        <FooterPagination
          page={page}
          limit={limit}
          setPage={handlePageChange}
          handleLimit={handleLimit}
          totalDocs={paginator.totalDocs}
          totalPages={paginator.totalPages}
        />
      </Stack>

      <CustomerForm dialogTitle={'Create'} open={open} onClose={() => setOpen(false)} setRefetch={refetch} t={t} />
    </Box>
  );
};

export default Customer;