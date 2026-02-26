import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  Download as DownloadIcon,
  Print as PrintIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  CircularProgress,
  Alert
} from "@mui/material";
import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_REPORT_STATS } from "../../graphql/queries";

 
const formatCurrency = (value) =>
  value == null
    ? "$0.00"
    : `$${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

const ReportPage = ({ shopId = null }) => {
 
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [dateRange, setDateRange] = useState({
    start: thirtyDaysAgo,
    end: today,
  });
  const [reportType, setReportType] = useState("sales");
  const [searchQuery, setSearchQuery] = useState("");

 
  const { data, loading, error, refetch } = useQuery(GET_REPORT_STATS, {
    variables: {
      type: reportType.toUpperCase(),
      shopId,
      startDate: dateRange.start ? dateRange.start.toISOString() : null,
      endDate: dateRange.end ? dateRange.end.toISOString() : null,
    },
  });

  const reportStat = data?.getReportStats;
  console.log("Report Stat Data:", reportStat);

 
  const handlePrint = () => window.print();
  const handleExport = (format) => {
    console.log(`Exporting ${reportType} report in ${format} format`);
    
  };

  const filterData = (items, field) => {
    if (!searchQuery || !items) return items || [];
    return items.filter((item) =>
      String(item[field]).toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

 
  const renderReportContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load report: {error.message}
        </Alert>
      );
    }

    if (!reportStat) return null;

    const { sales, staff, inventory } = reportStat;

    switch (reportType) {
      case "sales":
        if (!sales) return <Typography>No sales data available</Typography>;
        return (
          <>
           
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Total Revenue</Typography>
                  <Typography variant="h5" fontWeight="600" color="primary.main">
                    {formatCurrency(sales.totalRevenue)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Total Orders</Typography>
                  <Typography variant="h5" fontWeight="600" color="success.main">
                    {sales.totalOrders ?? 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Average Order Value</Typography>
                  <Typography variant="h5" fontWeight="600" color="warning.main">
                    {formatCurrency(sales.averageOrderValue)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
 
            <Typography variant="h6" fontWeight="600" sx={{ mt: 4, mb: 2 }}>
              Top Selling Products
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 1, mb: 4 }}>
              <Table >
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Units Sold</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterData(sales.topProducts, "name").map((product) => (
                    <TableRow sx={{borderSpacing:"none"}} key={product.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">{product.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{product.category}</Typography>
                      </TableCell>
                      <TableCell align="right">{product.sales}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "primary.main" }}>
                        {formatCurrency(product.revenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

             
            <Typography variant="h6" fontWeight="600" sx={{ mt: 4, mb: 2 }}>
              Recent Transactions
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterData(sales.recentTransactions, "customer").map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">{tx.id}</Typography>
                        <Typography variant="caption" color="text.secondary">{tx.date}</Typography>
                      </TableCell>
                      <TableCell>{tx.customer}</TableCell>
                      <TableCell align="right">
                        <Typography
                          fontWeight="600"
                          color={tx.type === "Refund" ? "error.main" : "success.main"}
                        >
                          {tx.type === "Refund" ? "-" : ""}{formatCurrency(tx.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={tx.status}
                          size="small"
                          sx={{
                            bgcolor: tx.status === "completed" ? "success.light" : "warning.light",
                            color: tx.status === "completed" ? "success.dark" : "warning.dark",
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );

      case "staff":
        if (!staff) return <Typography>No staff data available</Typography>;
        return (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Total Staff</Typography>
                  <Typography variant="h5" fontWeight="600" color="primary.main">
                    {staff.totalStaff ?? 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Active Staff</Typography>
                  <Typography variant="h5" fontWeight="600" color="success.main">
                    {staff.activeStaff ?? 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Total Hours</Typography>
                  <Typography variant="h5" fontWeight="600" color="warning.main">
                    {staff.totalHours ?? 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Sales / Staff</Typography>
                  <Typography variant="h5" fontWeight="600" color="secondary.main">
                    {formatCurrency(staff.salesPerStaff)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="h6" fontWeight="600" sx={{ mt: 4, mb: 2 }}>
              Staff Performance
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="right">Hours</TableCell>
                    <TableCell align="right">Sales</TableCell>
                    <TableCell align="right">Orders</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterData(staff.performance, "name").map((staffMember) => (
                    <TableRow key={staffMember.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">{staffMember.name}</Typography>
                      </TableCell>
                      <TableCell>{staffMember.role}</TableCell>
                      <TableCell align="right">{staffMember.hours}</TableCell>
                      <TableCell align="right">
                        {staffMember.sales ? formatCurrency(staffMember.sales) : "-"}
                      </TableCell>
                      <TableCell align="right">{staffMember.orders || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );

      case "inventory":
        if (!inventory) return <Typography>No inventory data available</Typography>;
        return (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Total Items</Typography>
                  <Typography variant="h5" fontWeight="600" color="primary.main">
                    {inventory.totalItems ?? 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Low Stock Items</Typography>
                  <Typography variant="h5" fontWeight="600" color="error.main">
                    {inventory.lowStockCount ?? 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Total Value</Typography>
                  <Typography variant="h5" fontWeight="600" color="success.main">
                    {formatCurrency(inventory.totalValue)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="h6" fontWeight="600" sx={{ mt: 4, mb: 2 }}>
              Inventory Items
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell align="right">Reorder Level</TableCell>
                    <TableCell align="right">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterData(inventory.items, "name").map((item) => {
                    const isLow = item.stock <= item.reorderLevel;
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">{item.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.unit}</Typography>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell align="right">
                          <Typography color={isLow ? "error.main" : "inherit"} fontWeight={isLow ? 600 : 400}>
                            {item.stock}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{item.reorderLevel}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: "primary.main" }}>
                          {formatCurrency(item.value)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Breadcrumbs aria-label="breadcrumb" separator="/">
            <Typography
              variant="h6"
              sx={{
                textDecoration: "none",
                borderLeft: "3px solid #1D4592",
                pl: 1.5,
                fontWeight: 600,
              }}
            >
              Report
            </Typography>
          </Breadcrumbs>
          <Stack direction="row" spacing={2}>
            <Tooltip title="Print Report">
              <IconButton onClick={handlePrint} sx={{ bgcolor: "background.paper", boxShadow: 1 }}>
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => handleExport("PDF")}
              sx={{ bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }}
            >
              Export Report
            </Button>
          </Stack>
        </Stack>

      
        <Box sx={{ mb: 4, borderRadius: 1 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth size="small">
                <Typography id="report-type-label">Report Type</Typography>
                <Select
                  labelId="report-type-label"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="inventory">Inventory</MenuItem>
                </Select>
              </FormControl>
            </Grid>

           
            <Grid size={{ xs: 12, md: 2 }}>
              <Typography>Start Date</Typography>
              <DatePicker
                value={dateRange.start}
                onChange={(newValue) => setDateRange({ ...dateRange, start: newValue })}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Typography>End Date</Typography>
              <DatePicker
                value={dateRange.end}
                onChange={(newValue) => setDateRange({ ...dateRange, end: newValue })}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography>Search</Typography>
              <TextField
                fullWidth
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Report Content */}
        {renderReportContent()}
      </Box>
    </LocalizationProvider>
  );
};

export default ReportPage;