import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { Autocomplete, Avatar, Box, Breadcrumbs, Button, Divider, FormControl, Grid, IconButton, InputAdornment, InputLabel, Link, Menu, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { EllipsisVertical, Filter, Mail, MessageCircle, Phone } from "lucide-react";
import { Search } from "lucide-react";
import { useState } from "react";

import StudentForm from "../Components/students/StudentForm";
import "../Styles/studentGrid.scss";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../Function/translate";

const ranges = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last7" },
  { label: "Last 30 Days", value: "last30" },
  { label: "This Year", value: "thisYear" },
  { label: "Last Year", value: "lastYear" },
  { label: "Custom Range", value: "custom" },
];

const StudentsGrid = () => {
  const [sort, setSort] = useState("az");
  const [range, setRange] = useState("last7");
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const [filterAnchor, setFilterAnchor] = useState(null);
  const filterOpen = Boolean(filterAnchor);
  const openFilterMenu = (e) => setFilterAnchor(e.currentTarget);
  const closeFilterMenu = () => setFilterAnchor(null);

  const [openForm, setOpenForm] = useState(false);
  const handleOpenForm =()=>setOpenForm(true)
  const handleCloesForm =()=>setOpenForm(false)

  const [filters, setFilters] = useState({
    class: "",
    section: "",
    name: "",
    gender: "",
    status: "",
  });

  const handleFilterChange = (key) => (e) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  const resetFilters = () => {
    setFilters({
      class: "",
      section: "",
      name: "",
      gender: "",
      status: "",
    });
    setSort("az");
    closeFilterMenu();
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box textAlign="start">
          <Box sx={{ borderLeft: "3px solid #1D4592", paddingLeft: "10px" }}>
            <Typography variant="h5" color="#1D4592">
              {t(`student_grid`)}
            </Typography>
          </Box>

          <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 1 }}>
            <Link underline="hover" color="inherit" href="#">
              <Typography variant="body2">{t(`dashboard`)}</Typography>
            </Link>
            <Link underline="hover" color="inherit" href="#">
              <Typography variant="body2">{t(`students`)}</Typography>
            </Link>
            <Typography variant="body2" color="text.primary">
              {t(`student_grid`)}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Stack>

      <Box className="filter-box">
        <Grid container spacing={2} alignItems="center" textAlign={"start"}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography fontWeight={500} mb={0.5}>
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

          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography fontWeight={500} mb={0.5}>
              {t("range")}
            </Typography>
            <Autocomplete
              size="small"
              options={ranges}
              getOptionLabel={(option) => option.label}
              value={ranges.find((r) => r.value === range) || null}
              onChange={(e, newValue) => setRange(newValue?.value || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t("All")}
                  variant="outlined"
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: 1,
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 2 }}>
            <Typography fontWeight={500} mb={0.5} color="transparent">
              .
            </Typography>

            <Button
              variant="contained"
              fullWidth
              startIcon={<Filter size={16} />}
              onClick={openFilterMenu}
              sx={{ height: 40 }}
            >
              {t("filter")}
            </Button>
          </Grid>
        </Grid>

        <Menu
          anchorEl={filterAnchor}
          open={filterOpen}
          onClose={closeFilterMenu}
          PaperProps={{
            sx: {
              width: 350,
              p: 2,
              borderRadius: 2,
              boxShadow: 3,
            },
          }}
        >
          <Grid container spacing={2}>
            {[
              { label: t("class"), key: "class", options: ["III", "IV"] },
              { label: t("section"), key: "section", options: ["A", "B"] },
            
              {
                label: t("gender"),
                key: "gender",
                options: ["Male", "Female"],
              },
              {
                label: t("status"),
                key: "status",
                options: ["Active", "Inactive"],
              },
            ].map((f) => (
              <Grid  size={{xs:12,sm:6}} key={f.key}>
                <FormControl size="small" fullWidth variant="outlined">
                  <InputLabel>{f.label}</InputLabel>
                  <Select
                    value={filters[f.key]}
                    onChange={handleFilterChange(f.key)}
                    label={f.label}
                  >
                    <MenuItem value="">{t("none")}</MenuItem>
                    {f.options.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>

          <Stack direction="row" spacing={1} mt={2}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={resetFilters}
            >
              {t("reset")}
            </Button>
            <Button variant="contained" fullWidth onClick={closeFilterMenu}>
              {t("apply")}
            </Button>
          </Stack>
        </Menu>

 
        <Stack direction="row" spacing={2} mt={3}>
          <Button
            variant="contained"
            onClick={handleOpenForm}
            startIcon={<LibraryAddOutlinedIcon size={18} />}
          >
            {t("create")}
          </Button>
         {openForm && (
          <StudentForm t={t} open={openForm} onClose={handleCloesForm}/>
          )}

        </Stack>
      </Box>

  
    </Box>
  );
};

export default StudentsGrid;
