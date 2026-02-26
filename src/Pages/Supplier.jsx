import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Button,
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
import { Search } from "lucide-react";
import { useState } from "react";

import SupplierAction from "../Components/supplier/SupplierAction";
import SupplierForm from "../Components/supplier/SupplierForm";
import FooterPagination from "../include/FooterPagination";
import "../Styles/TableStyle.scss";
import { useAuth } from "../context/AuthContext";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";
import useGetSupplierWithPagination from "../Components/hook/useGetSupplierWithPagination";
 
const Supplier = () => {
  const { language } = useAuth();
  const { t } = translateLauguage(language);

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");

  const { suppliers, paginator, loading, refetch } =
    useGetSupplierWithPagination(page, limit, true, keyword);

  const handleLimit = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(1);
  };

  return (
    <Box>
     
      <Stack direction="row" justifyContent="space-between">
        <Breadcrumbs separator="/">
          <Typography
            component={RouterLink}
            to="/setting"
            variant="h6"
            sx={{
              textDecoration: "none",
              borderLeft: "3px solid #1D4592",
              pl: 1.5,
              fontWeight: 600,
            }}
          >
            {t("setting")}
          </Typography>

          <Typography variant="h6" fontWeight={600}>
            {t("supplier")}
          </Typography>
        </Breadcrumbs>
      </Stack>

      {/* ───────── Search + Create ───────── */}
      <Box
        sx={{ display: "flex", justifyContent: "space-between" }}
        mt={5}
      >
        <Grid container spacing={2}>
          <Grid size={{xs:12}} textAlign={"start"}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              {t("search")}
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder={t("search") + "..."}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
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

        <Stack direction="row" spacing={2} mt={3}>
          <Button
            variant="contained"
            startIcon={<LibraryAddOutlinedIcon />}
            onClick={() => setOpen(true)}
          >
            {t("create")}
          </Button>
        </Stack>

        {open && (
          <SupplierForm
            open={open}
            onClose={() => setOpen(false)}
            dialogTitle="Create"
            setRefetch={refetch}
            t={t}
          />
        )}
      </Box>

 
      <TableContainer className="table-container">
        <Table className="table">
          <TableHead className="table-header">
            <TableRow>
              <TableCell>{t("no")}</TableCell>
              <TableCell>{t("khmer_name")}</TableCell>
              <TableCell>{t("english_name")}</TableCell>
              <TableCell>{t("remark")}</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>

          {loading ? (
            <CircularIndeterminate />
          ) : suppliers.length === 0 ? (
            <EmptyData />
          ) : (
            <TableBody>
              {suppliers.map((supplier, index) => (
                <TableRow key={supplier._id}>
                  <TableCell>{paginator.slNo + index}</TableCell>
                  <TableCell>{supplier.nameKh}</TableCell>
                  <TableCell>{supplier.nameEn}</TableCell>
                  <TableCell>{supplier.remark}</TableCell>
                  <TableCell className="flex-end">
                    <SupplierAction
                      t={t}
                      supplierId={supplier._id}
                      supplierData={supplier}
                      setRefetch={refetch}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>

 
        <Stack direction="row" justifyContent="flex-end" p={2}>
          <FooterPagination
            page={page}
            limit={limit}
            setPage={setPage}
            handleLimit={handleLimit}
            totalDocs={paginator.totalDocs}
            totalPages={paginator.totalPages}
          />
        </Stack>
      </TableContainer>
    </Box>
  );
};

export default Supplier;