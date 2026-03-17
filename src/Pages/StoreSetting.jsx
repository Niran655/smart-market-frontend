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
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@apollo/client/react";

import FooterPagination from "../include/FooterPagination";
import "../Styles/TableStyle.scss";

import { useAuth } from "../context/AuthContext";
import { translateLauguage } from "../function/translate";

import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";

import { GET_SHIFT_SESSIONS } from "../../graphql/queries";
import ShiftSessionAction from "../Components/shiftSession/ShiftSessionAction";
import ShiftSessionForm from "../Components/shiftSession/ShiftSessionForm";

const StoreSetting = () => {
  const { language } = useAuth();
  const { t } = translateLauguage(language);

  const { shopId } = useParams();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");

  const { data, loading, error, refetch } = useQuery(GET_SHIFT_SESSIONS, {
    variables: {
      shopId,
    },
    fetchPolicy: "network-only",
  });

  const shiftSession = data?.getShiftSessions || [];


  const filteredData = shiftSession.filter((shift) =>
    shift?.shiftName?.toLowerCase().includes(keyword.toLowerCase())
  );


  const startIndex = (page - 1) * limit;
  const paginatedData = filteredData.slice(startIndex, startIndex + limit);

  const handleLimit = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };


  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };


  if (error) {
    return (
      <Typography color="error">
        Error loading shift sessions
      </Typography>
    );
  }

  return (
    <Box>



      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box textAlign="start">
          <Breadcrumbs aria-label="breadcrumb" separator="/">

            <Typography
              component={RouterLink}
              to="/store"
              variant="h6"
              sx={{
                textDecoration: "none",
                borderLeft: "3px solid #1D4592",
                pl: 1.5,
                fontWeight: 600,
              }}
            >
              {t("store")}
            </Typography>

            <Typography
              variant="h6"
              sx={{ fontWeight: 600 }}
              color="text.primary"
            >

              {t(`shift_sessions`)}
            </Typography>

          </Breadcrumbs>
        </Box>
      </Stack>

      {/* ==========================
         SEARCH
      ========================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        mt={5}
      >
        <Grid container spacing={2} alignItems="center" textAlign="start">

          <Grid xs={12}>
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
            startIcon={<LibraryAddOutlinedIcon size={18} />}
            onClick={handleOpen}
          >
            {t("create")}
          </Button>
          {open && (
            <ShiftSessionForm
              dialogTitle="Create"
              open={open}
              onClose={handleClose}
              setRefetch={refetch}
              t={t}
            />
          )}
        </Stack>
      </Box>

      {/* ==========================
         TABLE
      ========================== */}

      <TableContainer className="table-container" sx={{ mt: 2 }}>
        <Table className="table">

          {/* TABLE HEADER */}

          <TableHead>
            <TableRow>

              <TableCell>{t(`no`)}</TableCell>
              <TableCell>{t(`user`)}</TableCell>
              <TableCell>{t(`shop`)}</TableCell>
              <TableCell>{t(`shift_name`)}</TableCell>
              <TableCell>{t(`start_time`)}</TableCell>
              <TableCell>{t(`end_time`)}</TableCell>
              <TableCell>{t(`status`)}</TableCell>
              <TableCell>{t(`total_orders`)}</TableCell>
              <TableCell>{t(`total_sales`)}</TableCell>
              <TableCell align="center"></TableCell>

            </TableRow>
          </TableHead>

          {/* TABLE BODY */}

          {loading ? (
            <CircularIndeterminate />
          ) : paginatedData.length === 0 ? (
            <EmptyData />
          ) : (
            <TableBody>

              {paginatedData.map((shift, index) => (

                <TableRow key={shift._id} className="table-row">

                  <TableCell>
                    {(page - 1) * limit + index + 1}
                  </TableCell>

                  <TableCell>
                    {shift?.user?.nameEn || shift?.user?.nameKh}
                  </TableCell>

                  <TableCell>
                    {shift?.shop?.nameEn || shift?.shop?.nameKh}
                  </TableCell>

                  <TableCell>{shift?.shiftName}</TableCell>

                  <TableCell>
                    {formatDate(shift?.startTime)}
                  </TableCell>

                  <TableCell>
                    {formatDate(shift?.endTime)}
                  </TableCell>

                  <TableCell>
                    {shift?.status === "open"
                      ? "🟢 OPEN"
                      : "🔴 CLOSED"}
                  </TableCell>

                  <TableCell>
                    {shift?.totalOrders || 0}
                  </TableCell>

                  <TableCell>
                    ${shift?.totalSales || 0}
                  </TableCell>

                  <TableCell align="center">

                    <ShiftSessionAction
                      shiftData={shift}
                      shiftId={shift._id}
                      setRefetch={refetch}
                      t={t}
                    />

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>
          )}
        </Table>

        {/* ==========================
           PAGINATION
        ========================== */}

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
            totalDocs={filteredData.length}
            totalPages={Math.ceil(filteredData.length / limit)}
          />

        </Stack>

      </TableContainer>

    </Box>
  );
};

export default StoreSetting;