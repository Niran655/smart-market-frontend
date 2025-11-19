import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { Autocomplete, Avatar, Box, Breadcrumbs, Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, Link, Menu, MenuItem, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { EllipsisVertical, Filter, Mail, MessageCircle, Phone } from "lucide-react";
import { Search } from "lucide-react";
import { useState } from "react";

import "../Styles/studentGrid.scss";
import "../Styles/TableStyle.scss";

const ranges = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last7" },
  { label: "Last 30 Days", value: "last30" },
  { label: "This Year", value: "thisYear" },
  { label: "Last Year", value: "lastYear" },
  { label: "Custom Range", value: "custom" },
];

const StudentList = () => {
  const [sort, setSort] = useState("az");
  const [range, setRange] = useState("last7");

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const [filterAnchor, setFilterAnchor] = useState(null);
  const filterOpen = Boolean(filterAnchor);
  const openFilterMenu = (e) => setFilterAnchor(e.currentTarget);
  const closeFilterMenu = () => setFilterAnchor(null);

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
    setFilters({ class: "", section: "", name: "", gender: "", status: "" });
    setSort("az");
    closeFilterMenu();
  };

  const students = [
    {
      id: "AD9892434",
      name: "Janet Daniel",
      class: "III",
      section: "A",
      roll: "35013",
      gender: "Female",
      joined: "10 Jan 2015",
      status: "Active",
      avatar: "https://randomuser.me/api/portraits/women/10.jpg",
    },
    {
      id: "AD9892433",
      name: "Joann Michael",
      class: "IV",
      section: "B",
      roll: "35012",
      gender: "Male",
      joined: "19 Aug 2014",
      status: "Active",
      avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    },
    {
      id: "AD9892432",
      name: "Kathleen Dison",
      class: "III",
      section: "A",
      roll: "35011",
      gender: "Female",
      joined: "05 Dec 2015",
      status: "Active",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ];

  return (
    <Box>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box textAlign="start">
          <Typography variant="h5">Students Table</Typography>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 1 }}>
            <Link underline="hover" color="inherit" href="#">
              Dashboard
            </Link>
            <Link underline="hover" color="inherit" href="#">
              Peoples
            </Link>
            <Typography color="text.primary">Students Table</Typography>
          </Breadcrumbs>
        </Box>

        
      </Stack>

      {/* FILTER BOX */}
      <Box className="filter-box" sx={{ mt: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            type="search"
            size="small"
            placeholder="Search..."
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

          <Autocomplete
            size="small"
            options={ranges}
            getOptionLabel={(option) => option.label}
            value={ranges.find((r) => r.value === range) || null}
            onChange={(e, newValue) => setRange(newValue?.value || "")}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select range..."
                variant="outlined"
                sx={{ minWidth: 160, bgcolor: "#ffffff", borderRadius: 1 }}
              />
            )}
          />

          <Button
            variant="contained"
            fullWidth
            startIcon={<Filter size={16} />}
            onClick={openFilterMenu}
          >
            Filter
          </Button>

          <Menu
            anchorEl={filterAnchor}
            open={filterOpen}
            onClose={closeFilterMenu}
            PaperProps={{ sx: { width: 340, p: 2, borderRadius: 2, boxShadow: 3 } }}
          >
            <Grid container spacing={2}>
              {[
                { label: "Class", key: "class", options: ["III", "IV"] },
                { label: "Section", key: "section", options: ["A", "B"] },
                { label: "Name", key: "name", options: ["Kathleen", "Dara"] },
                { label: "Gender", key: "gender", options: ["Male", "Female"] },
                { label: "Status", key: "status", options: ["Active", "Inactive"] },
              ].map((f) => (
                <Grid size={{xs:12,md:6}} key={f.key}>
                  <FormControl size="small" fullWidth variant="outlined">
                    <InputLabel>{f.label}</InputLabel>
                    <Select value={filters[f.key]} onChange={handleFilterChange(f.key)}>
                      <MenuItem value="">None</MenuItem>
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
              <Button variant="outlined" fullWidth onClick={resetFilters}>
                Reset
              </Button>
              <Button variant="contained" fullWidth onClick={closeFilterMenu}>
                Apply
              </Button>
            </Stack>
          </Menu>
        </Stack>

        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="contained" startIcon={<LibraryAddOutlinedIcon />}>
            បង្កើត
          </Button>
        </Stack>
      </Box>

      {/* STUDENTS TABLE */}
      <TableContainer sx={{ mt: 2 }} className="table-container">
        <Table className="table">
          <TableHead className="header">
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Profile</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Roll No</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Joined Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {students.map((s, index) => (
              <TableRow key={index} className="table-row">
                <TableCell>{s.id}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={s.avatar} sx={{ width: 42, height: 42 }} />
                    <Box>
                      <Typography variant="subtitle1">{s.name}</Typography>
                      <Typography variant="body2">
                        {s.class} - {s.section}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{s.class}</TableCell>
                <TableCell>{s.roll}</TableCell>
                <TableCell>{s.gender}</TableCell>
                <TableCell>{s.joined}</TableCell>
                <TableCell>{s.status}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton size="small">
                      <MessageCircle size={16} />
                    </IconButton>
                    <IconButton size="small">
                      <Phone size={16} />
                    </IconButton>
                    <IconButton size="small">
                      <Mail size={16} />
                    </IconButton>
                    <IconButton size="small" onClick={handleOpen}>
                      <EllipsisVertical size={16} />
                    </IconButton>
                  </Stack>

                  <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    <MenuItem onClick={handleClose}>View Student</MenuItem>
                    <MenuItem onClick={handleClose}>Edit</MenuItem>
                    <MenuItem onClick={handleClose}>Promote Student</MenuItem>
                    <MenuItem onClick={handleClose} sx={{ color: "red" }}>
                      Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StudentList;
