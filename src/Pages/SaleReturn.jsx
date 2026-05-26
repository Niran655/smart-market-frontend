import { useQuery } from "@apollo/client/react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
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
} from "@mui/material";
import dayjs from "dayjs";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { GET_SALES } from "../../graphql/queries";
import SaleReturnAction from "../Components/saleReturn/SaleReturnAction";
import SaleReturnForm from "../Components/saleReturn/SaleReturnForm";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import FooterPagination from "../include/FooterPagination";
import CircularIndeterminate from "../include/Loading";
import "../Styles/TableStyle.scss";

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;
const formatDate = (value) => (value ? dayjs(value).format("DD MMM YYYY") : "-");

export default function SaleReturn() {
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [dialogMode, setDialogMode] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);

  const { data, loading, refetch } = useQuery(GET_SALES, {
    variables: { status: "refunded", page, limit, pagination: true, keyword },
    fetchPolicy: "cache-and-network",
  });

  const { data: invoiceData, refetch: refetchInvoices } = useQuery(GET_SALES, {
    variables: { status: "completed", page: 1, limit: 100, pagination: true, keyword: "" },
    fetchPolicy: "cache-and-network",
  });

  const returns = data?.getSales?.data || [];
  const invoices = invoiceData?.getSales?.data || [];
  const paginator = data?.getSales?.paginator || {};

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedSale(null);
  };

  const refresh = () => {
    closeDialog();
    refetch();
    refetchInvoices();
  };

  return (
    <Box>
      <Breadcrumbs separator="/">
        <Typography
          component={RouterLink}
          to="/"
          sx={{ textDecoration: "none", borderLeft: "3px solid #1D4592", pl: 1.5, fontWeight: 600 }}
        >
          Sales Return
        </Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
        mt={5}
      >
        <Grid container spacing={2} alignItems="center" sx={{ flex: 1 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography textAlign={'left'} variant="body2" fontWeight={500} mb={0.5}>
              {t("search")}
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={keyword}
              placeholder={`${t("search")}...`}
              onChange={(event) => {
                setKeyword(event.target.value);
                setPage(1);
              }}
              inputProps={{ style: { textAlign: "left" } }}
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
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => setDialogMode("create")}>
          {t("add_return")}
        </Button>
      </Box>

      <TableContainer className="table-container" sx={{ mt: 2 }}>
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell>{t("no")}</TableCell>
              <TableCell>{t("reference")}</TableCell>
              <TableCell>{t("customer")}</TableCell>
              <TableCell>{t("date")}</TableCell>
              <TableCell>{t("grand_total")}</TableCell>
              <TableCell>{t("status")}</TableCell>
              <TableCell align="center">{t("action")}</TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <CircularIndeterminate />
          ) : returns.length === 0 ? (
            <EmptyData />
          ) : (
            <TableBody>
              {returns.map((row, index) => (
                <TableRow key={row._id} className="table-row">
                  <TableCell>{(paginator.slNo || 1) + index}</TableCell>
                  <TableCell>{row.saleNumber}</TableCell>
                  <TableCell>{row.customerName || "-"}</TableCell>
                  <TableCell>{formatDate(row.createdAt)}</TableCell>
                  <TableCell>{formatMoney(row.total)}</TableCell>
                  <TableCell>
                    <Chip size="small" label={row.status} color="error" variant="outlined" />
                  </TableCell>
                  <TableCell align="center">
                    <SaleReturnAction
                      row={row}
                      onView={(sale) => {
                        setSelectedSale(sale);
                        setDialogMode("view");
                      }}
                      onEdit={(sale) => {
                        setSelectedSale(sale);
                        setDialogMode("edit");
                      }}
                      onDeleted={refresh}
                    />
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
          setPage={setPage}
          handleLimit={(event) => {
            setLimit(parseInt(event.target.value, 10));
            setPage(1);
          }}
          totalDocs={paginator.totalDocs}
          totalPages={paginator.totalPages}
        />
      </Stack>

      <SaleReturnForm
        open={Boolean(dialogMode)}
        mode={dialogMode}
        sale={selectedSale}
        invoices={invoices}
        onClose={closeDialog}
        onDone={refresh}
        t={t}
        language={language}
      />
    </Box>
  );
}
