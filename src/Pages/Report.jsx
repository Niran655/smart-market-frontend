import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  ArrowDownward,
  ArrowUpward,
  Download as DownloadIcon,
  MonetizationOn as MonetizationOnIcon,
  MoreVert,
  People as PeopleIcon,
  Print as PrintIcon,
  Receipt as ReceiptIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
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
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";


const salesData = {
  totalRevenue: 856000,
  totalOrders: 524,
  averageOrderValue: 1633.59,
  topProducts: [
    { id: 1, name: "Classic Burger", category: "Burgers", sales: 1280, revenue: 15360 },
    { id: 2, name: "Margherita Pizza", category: "Pizza", sales: 980, revenue: 17640 },
    { id: 3, name: "Fresh Juice", category: "Drinks", sales: 1560, revenue: 7800 },
    { id: 4, name: "Chicken Wings", category: "Appetizers", sales: 870, revenue: 13050 },
    { id: 5, name: "Chocolate Cake", category: "Desserts", sales: 650, revenue: 5850 },
  ],
  recentTransactions: [
    { id: "#TRX001", date: "2024-01-15", customer: "John Doe", type: "Sale", amount: 45.50, status: "completed" },
    { id: "#TRX002", date: "2024-01-15", customer: "Jane Smith", type: "Sale", amount: 89.75, status: "completed" },
    { id: "#TRX003", date: "2024-01-14", customer: "Mike Johnson", type: "Refund", amount: 25.00, status: "refunded" },
    { id: "#TRX004", date: "2024-01-14", customer: "Sarah Wilson", type: "Sale", amount: 67.80, status: "completed" },
    { id: "#TRX005", date: "2024-01-13", customer: "David Brown", type: "Sale", amount: 120.25, status: "completed" },
  ],
};

const staffData = {
  totalStaff: 24,
  activeStaff: 18,
  totalHours: 2840,
  salesPerStaff: 35666.67,
  performance: [
    { id: 1, name: "Emma Watson", role: "Server", hours: 160, sales: 12450, orders: 187 },
    { id: 2, name: "James Smith", role: "Chef", hours: 172, sales: 0, orders: 0 }, // Chef might not have direct sales
    { id: 3, name: "Olivia Brown", role: "Server", hours: 148, sales: 10890, orders: 162 },
    { id: 4, name: "William Jones", role: "Bartender", hours: 156, sales: 8760, orders: 98 },
    { id: 5, name: "Sophia Garcia", role: "Server", hours: 144, sales: 11230, orders: 171 },
  ],
};

const inventoryData = {
  totalItems: 156,
  lowStockCount: 12,
  totalValue: 45820,
  items: [
    { id: 1, name: "Tomatoes", category: "Produce", stock: 45, unit: "kg", reorderLevel: 20, value: 112.50 },
    { id: 2, name: "Chicken Breast", category: "Meat", stock: 28, unit: "kg", reorderLevel: 15, value: 336.00 },
    { id: 3, name: "Pizza Dough", category: "Prepared", stock: 60, unit: "pieces", reorderLevel: 25, value: 90.00 },
    { id: 4, name: "Cheddar Cheese", category: "Dairy", stock: 12, unit: "kg", reorderLevel: 10, value: 96.00 },
    { id: 5, name: "Olive Oil", category: "Pantry", stock: 8, unit: "liters", reorderLevel: 5, value: 120.00 },
  ],
};

// ==================== HELPER ====================
const formatCurrency = (value) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const ReportPage = () => {
  const [dateRange, setDateRange] = useState({
    start: new Date("2024-01-01"),
    end: new Date("2024-01-15"),
  });
  const [reportType, setReportType] = useState("sales");
  const [searchQuery, setSearchQuery] = useState("");

  const handlePrint = () => window.print();

  const handleExport = (format) => {
    console.log(`Exporting ${reportType} report in ${format} format`);

  };


  const filterData = (items, field) => {
    if (!searchQuery) return items;
    return items.filter((item) =>
      String(item[field]).toLowerCase().includes(searchQuery.toLowerCase())
    );
  };


  const renderReportContent = () => {
    switch (reportType) {
      case "sales":
        return (
          <>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Total Revenue</Typography>
                  <Typography variant="h5" fontWeight="600" color="primary.main">
                    {formatCurrency(salesData.totalRevenue)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Total Orders</Typography>
                  <Typography variant="h5" fontWeight="600" color="success.main">
                    {salesData.totalOrders}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Average Order Value</Typography>
                  <Typography variant="h5" fontWeight="600" color="warning.main">
                    {formatCurrency(salesData.averageOrderValue)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>


            <Typography variant="h6" fontWeight="600" sx={{ mt: 4, mb: 2 }}>
              Top Selling Products
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 1, mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Units Sold</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterData(salesData.topProducts, "name").map((product) => (
                    <TableRow key={product.id}>
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
                  {filterData(salesData.recentTransactions, "customer").map((tx) => (
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
        return (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }} >
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Total Staff</Typography>
                  <Typography variant="h5" fontWeight="600" color="primary.main">
                    {staffData.totalStaff}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Active Staff</Typography>
                  <Typography variant="h5" fontWeight="600" color="success.main">
                    {staffData.activeStaff}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Total Hours</Typography>
                  <Typography variant="h5" fontWeight="600" color="warning.main">
                    {staffData.totalHours}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Sales / Staff</Typography>
                  <Typography variant="h5" fontWeight="600" color="secondary.main">
                    {formatCurrency(staffData.salesPerStaff)}
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
                  {filterData(staffData.performance, "name").map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">{staff.name}</Typography>
                      </TableCell>
                      <TableCell>{staff.role}</TableCell>
                      <TableCell align="right">{staff.hours}</TableCell>
                      <TableCell align="right">{staff.sales ? formatCurrency(staff.sales) : "-"}</TableCell>
                      <TableCell align="right">{staff.orders || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );

      case "inventory":
        return (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Total Items</Typography>
                  <Typography variant="h5" fontWeight="600" color="primary.main">
                    {inventoryData.totalItems}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Low Stock Items</Typography>
                  <Typography variant="h5" fontWeight="600" color="error.main">
                    {inventoryData.lowStockCount}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">Total Value</Typography>
                  <Typography variant="h5" fontWeight="600" color="success.main">
                    {formatCurrency(inventoryData.totalValue)}
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
                  {filterData(inventoryData.items, "name").map((item) => {
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

 
        <Box sx={{ p: 3, mb: 4, borderRadius: 1 }}>
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
              <Typography>Time Period</Typography>
              <TextField
                select
                fullWidth
                size="small"
       
                value="custom"
            
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </TextField>
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
            <Grid size={{xs:12,md:4}}>
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


        {renderReportContent()}


      </Box>
    </LocalizationProvider>
  );
};

export default ReportPage;