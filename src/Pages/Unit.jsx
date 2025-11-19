import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { useQuery } from "@apollo/client/react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Breadcrumbs, Button, Grid, InputAdornment, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Search } from "lucide-react";
import { useState } from "react";

import UnitForm from "../Components/units/UnitForm";
import "../Styles/TableStyle.scss";
import { useAuth } from "../Context/AuthContext";
import { GET_UNIT_WHITH_PAGINATION } from "../../graphql/queries";
import { translateLauguage } from "../Function/translate";
import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";
const Unit = () => {
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");
  const { data, refetch, loading } = useQuery(GET_UNIT_WHITH_PAGINATION, {
    variables: {
      page: 1,
      limit: 6,
      pagination: true,
      keyword: "",
    },
  });
  const unitDatas = data?.getUnitWithPagination?.data || [];
  const paginator = data?.getUnitWithPagination?.paginator;
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box textAlign="start">
          <Breadcrumbs aria-label="breadcrumb" separator="/">
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

            <Typography variant="h6" color="text.primary">
              {t("unit")}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Stack>
      <Box className="filter-box" mt={5}>
        <Grid container spacing={2} alignItems="center" textAlign={"start"}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              {t("search")}
            </Typography>
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

        <Stack direction="row" spacing={2} mt={3}>
          <Button
            variant="contained"
            startIcon={<LibraryAddOutlinedIcon size={18} />}
            onClick={handleOpen}
          >
            {t("create")}
          </Button>
        </Stack>
        {open && <UnitForm open={handleOpen} onClose={handleClose} t={t} />}
      </Box>
      <TableContainer className="table-container">
        <Table className="table">
          <TableHead className="table-header">
            <TableRow>
              <TableCell>{t(`no`)}</TableCell>
              <TableCell>{t(`khmer_name`)}</TableCell>
              <TableCell>{t(`english_name`)}</TableCell>
              <TableCell>{t(`remark`)}</TableCell>
              <TableCell sx={{ textAlign: "center" }}>{t(`status`)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          {loading ? (
            <CircularIndeterminate />
          ) : unitDatas?.length == 0 ? (
            <EmptyData />
          ) : (
            <TableBody>
              {unitDatas?.map((unit, index) => (
                <TableRow className="table-row">
                  <TableCell>{paginator.slNo + index}</TableCell>
                  <TableCell>{unit?.nameKh}</TableCell>
                  <TableCell>{unit?.nameEn}</TableCell>
                  <TableCell>{unit?.remark}</TableCell>
                  <TableCell>
                    <Switch
                      checked={unit?.active}
                      onChange={() => handleToggle(unit)}
                    />
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Unit;
