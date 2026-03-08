import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { useQuery } from "@apollo/client/react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Breadcrumbs, Button, Grid, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Search } from "lucide-react";
import { useState } from "react";

import UserAction from "../Components/user/UserAction";
import AllowUser from "../Components/user/AllowUser";
import UserForm from "../Components/user/UserForm";
import FooterPagination from "../include/FooterPagination";
import "../Styles/TableStyle.scss";
import { useAuth } from "../context/AuthContext";
import { GET_USER_WITH_PAGINATION } from "../../graphql/queries";
import { translateLauguage } from "../function/translate";
import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";
const User = () => {
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState("All");
  const { data, refetch, loading,  } = useQuery(GET_USER_WITH_PAGINATION, {
    variables: {
      page,
      limit,
      pagination: true,
      keyword,
      role: role === "All" ? "" : role,
    },
  });

  const userRow = data?.getUsersWithPagination?.data || [];
  const paginator = data?.getUsersWithPagination?.paginator || {};

  const handleLimit = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setPage(1);
  };

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

            <Typography
              sx={{
                textDecoration: "none",
                fontWeight: 600,
              }}
              variant="h6"
              color="text.primary"
            >
              {t("user")}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"} mt={5}>
        <Grid
          container
          spacing={5}
          fullWidth
          alignItems="center"
          textAlign="start"
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              {t("search")}
            </Typography>
            <TextField
              type="search"
              size="small"
              placeholder={t("search") + "..."}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                width: "250px",
 
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
              size="small"
              value={role}
              sx={{
                width: "200px",
         
              }}
              onChange={handleRoleChange}
            >
              <MenuItem value="All">{t("all")}</MenuItem>
              <MenuItem value="superAdmin">{t("super_admin")}</MenuItem>
              <MenuItem value="cashier">{t("cashier")}</MenuItem>
              <MenuItem value="admin">{t("admin")}</MenuItem>
              <MenuItem value="stockController">
                {t("stock_controller")}
              </MenuItem>
            </TextField>
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
          {open && (
            <UserForm
              dialogTitle="Create"
              open={open}
              onClose={handleClose}
              setRefetch={refetch}
              t={t}
            />
          )}
        </Stack>
      </Stack>
      <TableContainer  className="table-container" sx={{ mt: 2 }}>
        <Table className="table">
          <TableHead >
            <TableRow>
              <TableCell>{t(`no`)}</TableCell>
              <TableCell>{t(`khmer_name`)}</TableCell>
              <TableCell>{t(`gender`)}</TableCell>
              <TableCell>{t(`phone`)}</TableCell>
              <TableCell>{t(`email`)}</TableCell>
              <TableCell>{t(`role`)}</TableCell>
              <TableCell>{t(`shop`)}</TableCell>
              <TableCell sx={{ textAlign: "center" }}>{t(`status`)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          {loading ? (
            <CircularIndeterminate />
          ) : userRow?.length === 0 ? (
            <EmptyData />
          ) : (
            <TableBody>
              {userRow.map((row, index) => (
                <TableRow key={row._id} className="table-row">
                  <TableCell>{paginator.slNo + index}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <img
                        src={row?.image}
                        alt={row?.nameEn}
                        width={40}
                        height={40}
                        style={{ borderRadius: "100%", objectFit: "cover" }}
                      />
                      <span>
                        {language === "en" ? row?.nameEn : row?.nameKh}
                      </span>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {row.gender === "male" ? t("male") : t("female")}
                  </TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    {row.role === "admin" && t("admin")}
                    {row.role === "superAdmin" && t("super_admin")}
                    {row.role === "cashier" && t("cashier")}
                    {row.role === "manager" && t("manager")}
                    {row.role === "stockController" && t("stock_controller")}
                  </TableCell>
                  <TableCell>{row.shop}</TableCell>
                  <TableCell align="center">
                    <AllowUser editData={row} refetch={refetch} />
                  </TableCell>
                  <TableCell>
                    <UserAction
                      userData={row}
                      setRefetch={refetch}
                      userName={row?.nameEn}
                      userId={row?._id}
                      onClose={handleClose}
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
  );
};

export default User;
