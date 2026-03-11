import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem, Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Breadcrumbs, useTheme
} from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward, Download,
  Print,
  MonetizationOn,
  TrendingUp,
  ShoppingCart,
  EventSeat, Search,
  MoreVert
} from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  PieChart,
  Pie,
  Cell, Tooltip as RechartsTooltip, ResponsiveContainer
} from "recharts";
import { TableOfContents } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { translateLauguage } from "../function/translate";
import { useQuery } from "@apollo/client/react";
import { DASHBOARD_STATS } from "../../graphql/queries";
import Chart from "react-apexcharts";
import ErrorPage from "../include/ErrorPage";

const formatCurrency = (value) =>
  value != null ? `$${Number(value).toFixed(2)}` : "$0.00";

export default function Dashboard() {
  const theme = useTheme();
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const savedStoreId = localStorage.getItem("activeShopId");


  const [filterType, setFilterType] = useState("today");
  const [customStart, setCustomStart] = useState(null);
  const [customEnd, setCustomEnd] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [customPopoverAnchor, setCustomPopoverAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const open = Boolean(anchorEl);

  const getQueryVars = () => {
    if (filterType === "today") return { filter: "today", dayStart: null, dayEnd: null };
    if (filterType === "yesterday") return { filter: "yesterday", dayStart: null, dayEnd: null };
    if (filterType === "last7days") return { filter: "last7days", dayStart: null, dayEnd: null };
    if (filterType === "last30days") return { filter: "last30days", dayStart: null, dayEnd: null };
    if (filterType === "thisMonth") return { filter: "thisMonth", dayStart: null, dayEnd: null };
    if (filterType === "lastMonth") return { filter: "lastMonth", dayStart: null, dayEnd: null };
    return {
      filter: "customRange",
      dayStart: customStart ? customStart.format("YYYY-MM-DD") : null,
      dayEnd: customEnd ? customEnd.format("YYYY-MM-DD") : null,
    };
  };

  const shouldSkip = filterType === "custom" && (!customStart || !customEnd);

  const { data, loading, error, refetch } = useQuery(DASHBOARD_STATS, {
    variables: {
      shopId: savedStoreId,
      ...getQueryVars(),
    },
    skip: shouldSkip,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const stats = data?.dashboardStats;


  const totalOrders = stats?.totalOrders ?? 0;
  const totalSales = stats?.totalSales ?? 0;
  const averageValue = stats?.averageValue ?? 0;
  const reservations = stats?.reservations ?? 0;
  const dailyRevenue = stats?.dailyRevenue?.length ? stats.dailyRevenue : [0];
  const topSellingItems = stats?.topSellingItems?.length ? stats.topSellingItems : [];
  const activeOrders = stats?.activeOrders?.length ? stats.activeOrders : [];
  const categoryStats = stats?.categoryStats?.length ? stats.categoryStats : [];


  const generateChartCategories = () => {
    const length = dailyRevenue.length;
    if (filterType === "last7days" || length === 7) {
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    }
    if (filterType === "thisMonth" || filterType === "lastMonth") {
      return Array.from({ length }, (_, i) => (i + 1).toString());
    }
    if (filterType === "today") return ["Today"];
    if (filterType === "yesterday") return ["Yesterday"];
    if (filterType === "last30days") {
      return Array.from({ length }, (_, i) => (i + 1).toString());
    }
    if (filterType === "custom" && customStart && customEnd) {
      const start = dayjs(customStart);
      return Array.from({ length }, (_, i) => start.add(i, 'day').format('MMM D'));
    }
    return Array.from({ length }, (_, i) => (i + 1).toString());
  };

  const chartCategories = generateChartCategories();
  const revenueData = dailyRevenue.map((value, index) => ({
    day: chartCategories[index] || `Day ${index + 1}`,
    revenue: value,
    orders: 0,
  }));


  const categoryPieData = categoryStats.map((cat, idx) => ({
    name: cat.category,
    value: cat.orders,
    color: `hsl(${idx * 45 % 360}, 70%, 60%)`,
  }));


  const summaryCards = [
    {
      title: t("total_orders"),
      value: totalOrders.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      color: "#4CAF50",
    },
    {
      title: t("total_sales"),
      value: formatCurrency(totalSales),
      change: "+8.2%",
      trend: "up",
      icon: <MonetizationOn sx={{ fontSize: 40 }} />,
      color: "#2196F3",
    },
    {
      title: t("average_value"),
      value: formatCurrency(averageValue),
      change: "+5.1%",
      trend: "up",
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: "#FF9800",
    },
    {
      title: t("reservations"),
      value: reservations.toLocaleString(),
      change: "+3.4%",
      trend: "up",
      icon: <EventSeat sx={{ fontSize: 40 }} />,
      color: "#9C27B0",
    },
  ];


  const totalRevenue = dailyRevenue.reduce((acc, val) => acc + val, 0);

  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      foreColor: theme.palette.text.secondary,
      background: "transparent",
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
        colors: {
          ranges: [{
            from: 0,
            to: 1000000,
            color: theme.palette.primary.main,
          }],
        },
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => {
        if (val === 0) return "";
        return formatCurrency(val);
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: [theme.palette.text.primary],
      },
      background: {
        enabled: false,
      },
    },
    xaxis: {
      categories: chartCategories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      show: true,
      labels: {
        formatter: (val) => formatCurrency(val),
        style: { colors: theme.palette.text.secondary, fontSize: "12px" },
      },
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 4,
    },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (val) => formatCurrency(val),
      },
    },
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
  };

  const series = [{ name: t("revenue") || "Revenue", data: dailyRevenue }];


  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Dashboard Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Period: ${filterLabel}`, 14, 22);
    autoTable(doc, {
      startY: 30,
      head: [["Metric", "Value"]],
      body: [
        ["Total Orders", totalOrders.toString()],
        ["Total Sales", formatCurrency(totalSales)],
        ["Average Value", formatCurrency(averageValue)],
        ["Reservations", reservations.toString()],
      ],
    });
    if (topSellingItems.length) {
      autoTable(doc, {
        head: [["#", "Item", "Orders"]],
        body: topSellingItems.map((item) => [item.rank, item.name, item.orders]),
        startY: doc.lastAutoTable.finalY + 10,
      });
    }
    if (categoryStats.length) {
      autoTable(doc, {
        head: [["Category", "Orders"]],
        body: categoryStats.map((cat) => [cat.category, cat.orders]),
        startY: doc.lastAutoTable.finalY + 10,
      });
    }
    if (activeOrders.length) {
      autoTable(doc, {
        head: [["Customer", "Status", "Table"]],
        body: activeOrders.map((order) => [order.name, order.type, order.table || "-"]),
        startY: doc.lastAutoTable.finalY + 10,
      });
    }
    doc.save(`dashboard_${filterType}.pdf`);
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const summaryData = [
      ["Metric", "Value"],
      ["Total Orders", totalOrders],
      ["Total Sales", totalSales],
      ["Average Value", averageValue],
      ["Reservations", reservations],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

    if (topSellingItems.length) {
      const itemsData = [
        ["Rank", "Item", "Orders"],
        ...topSellingItems.map((i) => [i.rank, i.name, i.orders]),
      ];
      const itemsSheet = XLSX.utils.aoa_to_sheet(itemsData);
      XLSX.utils.book_append_sheet(wb, itemsSheet, "Top Items");
    }

    if (categoryStats.length) {
      const catData = [
        ["Category", "Orders"],
        ...categoryStats.map((c) => [c.category, c.orders]),
      ];
      const catSheet = XLSX.utils.aoa_to_sheet(catData);
      XLSX.utils.book_append_sheet(wb, catSheet, "Categories");
    }

    if (activeOrders.length) {
      const activeData = [
        ["Customer", "Status", "Table"],
        ...activeOrders.map((o) => [o.name, o.type, o.table || ""]),
      ];
      const activeSheet = XLSX.utils.aoa_to_sheet(activeData);
      XLSX.utils.book_append_sheet(wb, activeSheet, "Active Orders");
    }

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `dashboard_${filterType}.xlsx`);
  };


  const filterLabel = {
    today: t("today") || "Today",
    yesterday: t("yesterday"),
    last7days: t("last7days"),
    last30days: t("last30days"),
    thisMonth: t("thisMonth"),
    lastMonth: t("lastMonth"),
    custom: t("customRange"),
  }[filterType];


  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleCustomRangeClick = (event) => {
    setFilterType("custom");
    setCustomPopoverAnchor(event.currentTarget);
    handleClose();
  };

  const handleCustomPopoverClose = () => {
    setCustomPopoverAnchor(null);
  };

  const applyFilter = (type, start = customStart, end = customEnd) => {
    setFilterType(type);
    if (type === "custom") {
      setCustomStart(start);
      setCustomEnd(end);
    }
    handleClose();
    handleCustomPopoverClose();
    refetch({
      shopId: savedStoreId,
      filter: type === "custom" ? "customRange" : type,
      dayStart: type === "custom" && start ? start.format("YYYY-MM-DD") : null,
      dayEnd: type === "custom" && end ? end.format("YYYY-MM-DD") : null,
    });
  };


  if (loading && !stats) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>{t("processing...")}</Typography>
      </Box>
    );
  }
  if (error) {
    return <ErrorPage t={t} error={error} refetch={refetch} />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box >

        <Box sx={{ mb: 4 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
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
                  {t("dashboard")}
                </Typography>
              </Breadcrumbs>
            </Box>
            <Stack direction="row" spacing={2}>
              <Tooltip title="Print Report">
                <IconButton
                  onClick={() => window.print()}
                  sx={{
                    bgcolor: "#f9fafb",
                    color: "#4a5568",

                    boxShadow: 1,
                    "&:hover": { bgcolor: "#edf2f7", color: "#2d3748" },
                  }}
                >
                  <Print />
                </IconButton>
              </Tooltip>

              <Button
                variant="contained"
                startIcon={<TableOfContents />}
                onClick={exportToExcel}

              >
                Export Excel
              </Button>

              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={exportToPDF}

              >
                Export Report
              </Button>
            </Stack>


          </Stack>

          <Box mt={2}  >

            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  select
                  fullWidth
                  value={filterType}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "custom") {

                    } else {
                      applyFilter(val);
                    }
                  }}
                  size="small"
                >
                  <MenuItem value="today">{t("today")}</MenuItem>
                  <MenuItem value="yesterday">{t("yesterday")}</MenuItem>
                  <MenuItem value="last7days">{t("last7days")}</MenuItem>
                  <MenuItem value="last30days">{t("last30days")}</MenuItem>
                  <MenuItem value="thisMonth">{t("thisMonth")}</MenuItem>
                  <MenuItem value="lastMonth">{t("lastMonth")}</MenuItem>
                  <MenuItem value="custom" onClick={handleCustomRangeClick}>
                    Custom Range
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <DatePicker
                 
                  value={customStart}
                  onChange={(newValue) => setCustomStart(newValue)}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                  disabled={filterType !== "custom"}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <DatePicker
              
                  value={customEnd}
                  onChange={(newValue) => setCustomEnd(newValue)}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                  disabled={filterType !== "custom"}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                {filterType === "custom" && (
                  <Stack direction="row" spacing={2} >
                    <Button
                      variant="contained"
                      onClick={() => applyFilter("custom", customStart, customEnd)}
                      disabled={!customStart || !customEnd}
                    >
                      Apply Custom Range
                    </Button>
                  </Stack>
                )}

              </Grid>





            </Grid>

          </Box>
        </Box>


        <Grid container spacing={3} sx={{ mb: 4 }}>
          {summaryCards.map((card, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  borderRadius: 1,

                  height: "100%",
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {card.title}
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight="700"
                        color={card.color}
                        gutterBottom
                      >
                        {card.value}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        {card.trend === "up" ? (
                          <ArrowUpward sx={{ fontSize: 16, color: "#4CAF50" }} />
                        ) : (
                          <ArrowDownward sx={{ fontSize: 16, color: "#f44336" }} />
                        )}
                        <Typography
                          variant="body2"
                          sx={{ color: card.trend === "up" ? "#4CAF50" : "#f44336" }}
                        >
                          {card.change}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          from last period
                        </Typography>
                      </Stack>
                    </Box>
                    <Box sx={{ bgcolor: `${card.color}15`, p: 1.5, borderRadius: 2 }}>
                      {card.icon}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>


        <Grid container spacing={3} sx={{ mb: 4 }}>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card
              sx={{
                borderRadius: 1,

                height: "100%",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  {t(`total_revenue`)}
                </Typography>
                <Box sx={{ height: 350, mt: 2 }}>
                  <Chart options={chartOptions} series={series} type="bar" height={350} />
                </Box>
              </CardContent>

            </Card>
          </Grid>


          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                borderRadius: 1,

                height: "100%",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Orders by Category
                </Typography>
                <Box sx={{ height: 350, mt: 2 }}>
                  {categoryPieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryPieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value) => [`${value} orders`, "Orders"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary" align="center">
                      No category data
                    </Typography>
                  )}
                </Box>
                <Stack spacing={1} mt={2}>
                  {categoryPieData.map((cat, idx) => (
                    <Stack
                      key={idx}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: cat.color,
                          }}
                        />
                        <Typography variant="body2">{cat.name}</Typography>
                      </Stack>
                      <Typography variant="body2" fontWeight="600">
                        {cat.value}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                borderRadius: 1,

                height: "100%",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                >
                  <Typography variant="h6" fontWeight="600">
                    Top Selling Items
                  </Typography>
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Stack>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Rank</TableCell>
                        <TableCell>Item</TableCell>
                        <TableCell align="right">Orders</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topSellingItems.map((item) => (
                        <TableRow key={item.rank}>
                          <TableCell>#{item.rank}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="500">
                              {item.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="600" color="#667eea">
                              {item.orders}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                      {topSellingItems.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            <Typography variant="body2" color="text.secondary">
                              No data available
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>


          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                borderRadius: 1,

                height: "100%",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                >
                  <Typography variant="h6" fontWeight="600">
                    Recent Transactions
                  </Typography>
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Stack>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Customer</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Table</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activeOrders.map((order, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="500">
                              {order.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={order.type}
                              size="small"
                              sx={{
                                bgcolor:
                                  order.type === "completed"
                                    ? "#4CAF5015"
                                    : "#FF980015",
                                color:
                                  order.type === "completed"
                                    ? "#4CAF50"
                                    : "#FF9800",
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {order.table || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                      {activeOrders.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            <Typography variant="body2" color="text.secondary">
                              No active orders
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
}