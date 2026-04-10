import { useState, useMemo, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
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
  Breadcrumbs,
  useTheme,
  Paper
} from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  Download,
  Print,
  MonetizationOn,
  TrendingUp,
  ShoppingCart,
  EventSeat,
  Search,
  MoreVert
} from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from "recharts";
import { TableOfContents } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { translateLauguage } from "../function/translate";
import { useQuery } from "@apollo/client/react";
import { DASHBOARD_STATS } from "../../graphql/queries";
import Chart from "react-apexcharts";
import ErrorPage from "../include/ErrorPage";

import Dashboard1 from "../assets/Image/dashboard-card1.png";
import Dashboard2 from "../assets/Image/dashboard-card2.png";
import Dashboard3 from "../assets/Image/dashboard-card3.png";
import Dashboard4 from "../assets/Image/dashboard-card4.png";

const formatCurrency = (value) =>
  value != null ? `$${Number(value).toFixed(2)}` : "$0.00";

const formatDateLong = (value) => {
  if (!value) return "-";
  const d = dayjs(value);
  return d.format("MMMM D, YYYY");
};

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const formatFileDate = (value = new Date()) => {
  return dayjs(value).format("YYYY-MM-DD");
};

// Helper to detect numeric/currency values for alignment
const isNumericOrCurrency = (val) => {
  if (val === null || val === undefined) return false;
  if (typeof val === 'number') return true;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[$,]/g, '');
    return !isNaN(parseFloat(cleaned)) && isFinite(cleaned);
  }
  return false;
};

export default function Dashboard() {
  const theme = useTheme();
  const { language, user } = useAuth();
  const { t } = translateLauguage(language);
  const savedStoreId = localStorage.getItem("activeShopId");
  const [filterType, setFilterType] = useState("today");
  const [customStart, setCustomStart] = useState(null);
  const [customEnd, setCustomEnd] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [customPopoverAnchor, setCustomPopoverAnchor] = useState(null);
  const images = [Dashboard1, Dashboard2, Dashboard3, Dashboard4];

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
  const dailyRevenue = stats?.dailyRevenue?.length ? stats.dailyRevenue : [];
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
      color: "#ffffff",
    },
    {
      title: t("total_sales"),
      value: formatCurrency(totalSales),
      change: "+8.2%",
      trend: "up",
      icon: <MonetizationOn sx={{ fontSize: 40 }} />,
      color: "#ffffff",
    },
    {
      title: t("average_value"),
      value: formatCurrency(averageValue),
      change: "+5.1%",
      trend: "up",
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: "#ffffff",
    },
    {
      title: t("reservations"),
      value: reservations.toLocaleString(),
      change: "+3.4%",
      trend: "up",
      icon: <EventSeat sx={{ fontSize: 40 }} />,
      color: "#ffffff",
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

  // ==================== PRINT FUNCTIONALITY ====================
  const printData = useMemo(() => {
    const companyName = user?.companyName || user?.shopName || user?.nameEn || user?.name || "Smart Market";
    const phone = user?.phone || user?.phoneNumber || "(000) 000-0000";
    const email = user?.email || "support@smartmarket.com";
    const address = user?.address || "Phnom Penh, Cambodia";
    const invoiceDate = new Date();
    const invoiceNumber = `DASH-${dayjs().format("YYYYMMDD")}-${String(savedStoreId || "ALL").slice(-4).toUpperCase()}`;

    // Summary table rows
    const summaryRows = [
      ["Total Orders", totalOrders.toLocaleString()],
      ["Total Sales", formatCurrency(totalSales)],
      ["Average Order Value", formatCurrency(averageValue)],
      ["Reservations", reservations.toLocaleString()],
      ["Total Revenue (Chart Sum)", formatCurrency(totalRevenue)],
    ];

    // Revenue data rows
    const revenueRows = revenueData.map(item => [item.day, formatCurrency(item.revenue)]);

    // Top selling items rows
    const topItemsRows = topSellingItems.map(item => [item.rank, item.name, item.orders]);

    // Category stats rows
    const categoryRows = categoryStats.map(cat => [cat.category, cat.orders]);

    // Active orders rows
    const activeOrdersRows = activeOrders.map(order => [order.name, order.type, order.table || "-"]);

    return {
      companyName,
      phone,
      email,
      address,
      invoiceNumber,
      invoiceDate: formatDateLong(invoiceDate),
      filterLabel,
      filterPeriod: filterType === "custom" && customStart && customEnd
        ? `${formatDateLong(customStart)} - ${formatDateLong(customEnd)}`
        : filterLabel,
      summaryRows,
      revenueRows,
      topItemsRows,
      categoryRows,
      activeOrdersRows,
      hasRevenueData: revenueRows.length > 0,
      hasTopItems: topItemsRows.length > 0,
      hasCategoryData: categoryRows.length > 0,
      hasActiveOrders: activeOrdersRows.length > 0,
    };
  }, [totalOrders, totalSales, averageValue, reservations, totalRevenue, revenueData, topSellingItems, categoryStats, activeOrders, filterType, customStart, customEnd, user, savedStoreId]);

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 80);
  };

  // ==================== EXCEL EXPORT USING EXCELJS (styled like ReportPage) ====================
  const handleExportExcel = async () => {
    const companyName = user?.companyName || user?.shopName || user?.nameEn || user?.name || "Smart Market";
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Smart Market";
    workbook.created = new Date();

    const C = {
      blue: "FF3F73C7",
      blueDark: "FF2F60B3",
      yellow: "FFF4CC3D",
      light: "FFF2F2F2",
      white: "FFFFFFFF",
      text: "FF1F2A44",
      border: "FFD9DEE8",
    };

    const thinBorder = {
      top: { style: "thin", color: { argb: C.border } },
      left: { style: "thin", color: { argb: C.border } },
      bottom: { style: "thin", color: { argb: C.border } },
      right: { style: "thin", color: { argb: C.border } },
    };

    const headerStyle = {
      font: { name: "Calibri", size: 12, bold: true, color: { argb: C.white } },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: C.blue } },
      alignment: { horizontal: "center", vertical: "middle" },
      border: thinBorder,
    };

    const addStyledSheet = (sheetName, title, headers, rows, addFooter = false) => {
      const ws = workbook.addWorksheet(sheetName);
      ws.pageSetup = {
        paperSize: 9,
        orientation: "portrait",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        margins: { left: 0.25, right: 0.25, top: 0.25, bottom: 0.25 },
      };

      // Title
      const titleRow = ws.addRow([title]);
      titleRow.font = { name: "Calibri", size: 16, bold: true, color: { argb: C.blueDark } };
      titleRow.alignment = { horizontal: "center", vertical: "middle" };
      ws.addRow([]); // spacer

      // Headers
      const headerRow = ws.addRow(headers);
      headerRow.eachCell((cell) => {
        cell.font = headerStyle.font;
        cell.fill = headerStyle.fill;
        cell.alignment = headerStyle.alignment;
        cell.border = headerStyle.border;
      });

      // Data rows
      rows.forEach((row) => {
        const dataRow = ws.addRow(row);
        dataRow.eachCell((cell, colNumber) => {
          cell.border = thinBorder;
          const isNumeric = typeof row[colNumber - 1] === 'number' || (!isNaN(parseFloat(row[colNumber - 1])) && isFinite(row[colNumber - 1]));
          cell.alignment = {
            vertical: "middle",
            horizontal: colNumber === 1 ? "left" : (isNumeric ? "right" : "center"),
          };
        });
      });

      // Auto-filter
      ws.autoFilter = {
        from: { row: headerRow.number, column: 1 },
        to: { row: headerRow.number, column: headers.length },
      };

      // Adjust column widths
      ws.columns.forEach((col, idx) => {
        col.width = idx === 0 ? 30 : 20;
      });
    };

    // Summary Sheet
    addStyledSheet("Summary", "Dashboard Summary", ["Metric", "Value"], printData.summaryRows);
    // Revenue Data Sheet
    if (printData.hasRevenueData) {
      addStyledSheet("Revenue Details", "Revenue by Period", ["Period", "Revenue"], printData.revenueRows);
    }
    // Top Selling Items Sheet
    if (printData.hasTopItems) {
      addStyledSheet("Top Selling Items", "Top Selling Items", ["Rank", "Item", "Orders"], printData.topItemsRows);
    }
    // Category Stats Sheet
    if (printData.hasCategoryData) {
      addStyledSheet("Category Stats", "Orders by Category", ["Category", "Orders"], printData.categoryRows);
    }
    // Active Orders Sheet
    if (printData.hasActiveOrders) {
      addStyledSheet("Active Orders", "Active Orders", ["Customer", "Status", "Table"], printData.activeOrdersRows);
    }

    // Cover sheet with company info
    const coverWs = workbook.addWorksheet("Dashboard Report");
    coverWs.mergeCells(1, 1, 1, 4);
    const titleCell = coverWs.getCell(1, 1);
    titleCell.value = `${companyName} - Dashboard Report`;
    titleCell.font = { name: "Calibri", size: 18, bold: true, color: { argb: C.blueDark } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    coverWs.mergeCells(2, 1, 2, 4);
    const dateCell = coverWs.getCell(2, 1);
    dateCell.value = `Generated: ${formatDateLong(new Date())}`;
    dateCell.font = { name: "Calibri", size: 11 };
    dateCell.alignment = { horizontal: "center" };

    coverWs.mergeCells(3, 1, 3, 4);
    const periodCell = coverWs.getCell(3, 1);
    periodCell.value = `Period: ${printData.filterPeriod}`;
    periodCell.font = { name: "Calibri", size: 11 };
    periodCell.alignment = { horizontal: "center" };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `dashboard_${filterType}_${formatFileDate(new Date())}.xlsx`);
  };

  // Legacy simple export (keep for backward compatibility, but we'll replace the button)
  const exportToExcelSimple = () => {
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
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 1.2cm 0.8cm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background: #fff !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden !important;
          }
          #print-dashboard-root,
          #print-dashboard-root * {
            visibility: visible !important;
          }
          #print-dashboard-root {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            overflow: visible;
            background: #f2f2f2;
          }
          thead {
            display: table-header-group;
          }
          tr, td, th {
            break-inside: avoid;
          }
        }
      `}</style>

      <Box sx={{ width: "100%", maxWidth: "100%", mx: "auto", px: { xs: 1, sm: 2, md: 0 } }}>

        <Box sx={{ "@media print": { display: "none" } }}>
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
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
                  <Button
                    onClick={handlePrint}
                    variant="contained"
                    sx={{


                      boxShadow: 1,
                      "&:hover": { bgcolor: "#edf2f7", color: "#2d3748" },
                    }}
                  >
                    <Print />
                  </Button>
                </Tooltip>

                <Button
                  variant="contained"
                  startIcon={<TableOfContents />}
                  onClick={handleExportExcel}
                >
                  {t("export_excel")}
                </Button>

                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={handlePrint}
                >
                  {t("export_report")}
                </Button>
              </Stack>
            </Stack>

            <Box mt={2}>
              <Grid container spacing={3} alignItems="center">
                <Grid size={{ xs: 12, md: 2 }}>
                  <TextField
                    select
                    fullWidth
                    value={filterType}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "custom") {
                        // handled by custom range click
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
                    <Stack direction="row" spacing={2}>
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

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {summaryCards.map((card, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                {/* <Card
                  sx={{
                    borderRadius: 1,
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    color: "#fff",
                    backgroundImage: `url(${images[index % images.length]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
   */}
                    <Card
                      sx={{
                        borderRadius: 1,
                        height: "100%",
                        position: "relative",
                        overflow: "hidden",
                        color: "#fff",
                        backgroundImage: `url(${images[index % images.length]})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: "sepia(0.6) hue-rotate(10deg) saturate(1.4) brightness(1.05)",
                      }}
  > 
                  
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.4)",
                      // background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.85))",
                      zIndex: 1,
                    }}
                  />

                  <CardContent sx={{ position: "relative", zIndex: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="h6" sx={{ mb: 0.5, color: "#fff", textAlign: "left" }}>
                          {card.title}
                        </Typography>

                        <Typography variant="h4" fontWeight={700} sx={{ color: card.color, mb: 1, color: "#fff", textAlign: "left" }}>
                          {card.value}
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          {card.trend === "up" ? (
                            <ArrowUpward sx={{ fontSize: 16, color: "#22c55e" }} />
                          ) : (
                            <ArrowDownward sx={{ fontSize: 16, color: "#ef4444" }} />
                          )}

                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: card.trend === "up" ? "#22c55e" : "#ef4444",
                            }}
                          >
                            {card.change}
                          </Typography>

                          <Typography variant="body2" sx={{ color: "#ddd" }}>
                            vs last period
                          </Typography>
                        </Stack>
                      </Box>

                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "6px",


                          background: "rgba(255, 255, 255, 0.15)",
                          backdropFilter: "blur(10px)",
                          WebkitBackdropFilter: "blur(10px)",


                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",

                          color: "#fff",
                        }}
                      >
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
              <Card sx={{ borderRadius: 1, height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {t("total_revenue")}
                  </Typography>
                  <Box sx={{ height: 350, mt: 2 }}>
                    <Chart options={chartOptions} series={series} type="bar" height={350} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: 1, height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {t("orders_by_category")}
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
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip formatter={(value) => [`${value} orders`, "Orders"]} />
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
                      <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: cat.color }} />
                          <Typography variant="body2">{cat.name}</Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight="600">{cat.value}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tables */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 1, height: "100%" }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" fontWeight="600">{t("top_selling_items")}</Typography>
                    <IconButton size="small"><MoreVert /></IconButton>
                  </Stack>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t("Rank")}</TableCell>
                          <TableCell>{t("items")}</TableCell>
                          <TableCell align="right">{t("orders")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topSellingItems.map((item) => (
                          <TableRow key={item.rank}>
                            <TableCell>#{item.rank}</TableCell>
                            <TableCell><Typography variant="body2" fontWeight="500">{item.name}</Typography></TableCell>
                            <TableCell align="right"><Typography fontWeight="600" color="#667eea">{item.orders}</Typography></TableCell>
                          </TableRow>
                        ))}
                        {topSellingItems.length === 0 && (
                          <TableRow><TableCell colSpan={3} align="center">No data available</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 1, height: "100%" }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" fontWeight="600">{t("recent_transactions")}</Typography>
                    <IconButton size="small"><MoreVert /></IconButton>
                  </Stack>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t("customer")}</TableCell>
                          <TableCell>{t("status")}</TableCell>
                          <TableCell align="right">{t("table")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {activeOrders.map((order, idx) => (
                          <TableRow key={idx}>
                            <TableCell><Typography variant="body2" fontWeight="500">{order.name}</Typography></TableCell>
                            <TableCell>
                              <Chip label={order.type} size="small" sx={{ bgcolor: order.type === "completed" ? "#4CAF5015" : "#FF980015", color: order.type === "completed" ? "#4CAF50" : "#FF9800", fontWeight: 500 }} />
                            </TableCell>
                            <TableCell align="right">{order.table || "-"}</TableCell>
                          </TableRow>
                        ))}
                        {activeOrders.length === 0 && (
                          <TableRow><TableCell colSpan={3} align="center">No active orders</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box
          id="print-dashboard-root"
          sx={{
            position: "fixed",
            left: "-10000px",
            top: 0,
            width: "100%",
            visibility: "hidden",
            pointerEvents: "none",
            "@media print": {
              position: "relative",
              left: 0,
              top: 0,
              visibility: "visible",
              pointerEvents: "auto",
            },
          }}
        >
          <Box sx={{ bgcolor: "#f2f2f2", width: "100%", maxWidth: "100%", p: 0 }}>
            <Box sx={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
              {/* Header */}
              <Box sx={{ bgcolor: "#1f78c9", color: "#fff", px: 2.5, py: 2.2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography sx={{ fontSize: 18, fontWeight: 700 }}>{printData.companyName}</Typography>
                    <Typography sx={{ fontSize: 11 }}>cleaning service</Typography>
                    <Typography sx={{ fontSize: 10.5, mt: 1.1, color: "#ffff" }}>{printData.address}</Typography>
                    <Typography sx={{ fontSize: 10.5, color: "#ffff" }}>{printData.phone}</Typography>
                    <Typography sx={{ fontSize: 10.5, color: "#ffff" }}>{printData.email}</Typography>
                  </Box>
                  <Box sx={{ minWidth: 220 }}>
                    <Typography sx={{ fontSize: 50, lineHeight: 1, fontWeight: 800, color: "#f5c633" }}>
                      {t("dashboard")}
                    </Typography>
                    <Box sx={{ borderTop: "1px solid rgba(255,255,255,.7)", mt: 0.8, pt: 0.8 }}>
                      <Typography sx={{ fontSize: 10.5, color: "#ffff" }}><b>{t("report")} #:</b> {printData.invoiceNumber}</Typography>
                      <Typography sx={{ fontSize: 10.5, color: "#ffff" }}><b>{t("date")}:</b> {printData.invoiceDate}</Typography>
                      <Typography sx={{ fontSize: 10.5, color: "#ffff" }}><b>{t("period")}:</b> {printData.filterPeriod}</Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>
              <Box sx={{ bgcolor: "#f5c633", height: 9, mb: 1.4 }} />

              {/* Summary Table */}
              <Box sx={{ px: 1.2, mb: 2 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#1f78c9", mb: 1 }}>{t("summary_metrics")}</Typography>
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "#1f78c9" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: "#fff", py: 0.8 }}>{t("metrics")}</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#fff", py: 0.8 }} align="right">{t("value")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {printData.summaryRows.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ py: 0.6, fontSize: 10.5 }}>{row[0]}</TableCell>
                          <TableCell sx={{ py: 0.6, fontSize: 10.5 }} align="right">{row[1]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Revenue Details */}
              {printData.hasRevenueData && (
                <Box sx={{ px: 1.2, mb: 2 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#1f78c9", mb: 1 }}>{t("revenue_by_period")}</Typography>
                  <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: "#1f78c9" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, color: "#fff", py: 0.8 }}>{t("period")}</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#fff", py: 0.8 }} align="right">{t("revenue")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {printData.revenueRows.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ py: 0.6, fontSize: 10.5 }}>{row[0]}</TableCell>
                            <TableCell sx={{ py: 0.6, fontSize: 10.5 }} align="right">{row[1]}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Top Selling Items */}
              {printData.hasTopItems && (
                <Box sx={{ px: 1.2, mb: 2 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#1f78c9", mb: 1 }}>{t("top_selling_items")}</Typography>
                  <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: "#1f78c9" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, color: "#fff", py: 0.8 }}>{t("Rank")}</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#fff", py: 0.8 }}>{t("items")}</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#fff", py: 0.8 }} align="right">{t("orders")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {printData.topItemsRows.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ py: 0.6, fontSize: 10.5 }}>{row[0]}</TableCell>
                            <TableCell sx={{ py: 0.6, fontSize: 10.5 }}>{row[1]}</TableCell>
                            <TableCell sx={{ py: 0.6, fontSize: 10.5 }} align="right">{row[2]}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Category Stats */}
              {printData.hasCategoryData && (
                <Box sx={{ px: 1.2, mb: 2 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#1f78c9", mb: 1 }}>Orders by Category</Typography>
                  <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: "#1f78c9" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, color: "#fff", py: 0.8 }}>Category</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#fff", py: 0.8 }} align="right">Orders</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {printData.categoryRows.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ py: 0.6, fontSize: 10.5 }}>{row[0]}</TableCell>
                            <TableCell sx={{ py: 0.6, fontSize: 10.5 }} align="right">{row[1]}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Active Orders */}
              {printData.hasActiveOrders && (
                <Box sx={{ px: 1.2, mb: 2 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#1f78c9", mb: 1 }}>Active Orders</Typography>
                  <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: "#1f78c9" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, color: "#fff", py: 0.8 }}>Customer</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#fff", py: 0.8 }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#fff", py: 0.8 }} align="right">Table</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {printData.activeOrdersRows.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ py: 0.6, fontSize: 10.5 }}>{row[0]}</TableCell>
                            <TableCell sx={{ py: 0.6, fontSize: 10.5 }}>{row[1]}</TableCell>
                            <TableCell sx={{ py: 0.6, fontSize: 10.5 }} align="right">{row[2]}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              <Box sx={{ bgcolor: "#f5c633", height: 7, mt: 2 }} />
              <Box sx={{ bgcolor: "#1f78c9", height: 17 }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}