// Dashboard.js — Theme‑aware Modern Dashboard
import { useState, useMemo, useCallback } from "react";
import {
  Box, Button, Card, CardContent, Chip, Grid, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Tooltip, Typography, LinearProgress,
  Divider, MenuItem, Avatar, Menu,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ArrowUpward, ArrowDownward, Download, Print,
  MonetizationOn, TrendingUp, Receipt, AttachMoney,
  OpenInNew, KeyboardArrowDown, Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import { useQuery } from "@apollo/client/react";
import {
  GET_FULL_DASHBOARD,
  GET_CHART_DATA,
  GET_RECENT_TRANSACTIONS_BY_TYPE,
  GET_ORDER_CATEGORY_STATS,
} from "../../graphql/queries";
import ErrorPage from "../include/ErrorPage";
import Chart from "react-apexcharts";
import DashboardSkeleton from "../Components/dashboard/DashboardSkeleton";

 
const formatCurrency = (v) => (v != null ? `$${Number(v).toFixed(2)}` : "$0.00");
const formatDateLong = (v) => (!v ? "-" : dayjs(v).format("MMMM D, YYYY"));
const formatDateShort = (v) => (!v ? "-" : dayjs(v).format("DD MMM YYYY"));
const formatFileDate = (v = new Date()) => dayjs(v).format("YYYY-MM-DD");

const PERIOD_OPTIONS = [
  { code: "1D",  label: "Today"    },
  { code: "1W",  label: "Weekly"   },
  { code: "1M",  label: "Monthly"  },
  { code: "3M",  label: "3 Months" },
  { code: "6M",  label: "6 Months" },
  { code: "All", label: "All Time" },
];

 
const getStatusStyle = (status, theme) => {
  const s = status?.toLowerCase();
  if (s === "completed" || s === "paid" || s === "new")
    return { bg: theme.palette.success.light + "30", color: theme.palette.success.main };
  if (s === "pending")
    return { bg: theme.palette.warning.light + "30", color: theme.palette.warning.main };
  if (s === "overdue" || s === "unpaid" || s === "cancelled")
    return { bg: theme.palette.error.light + "30", color: theme.palette.error.main };
  return { bg: theme.palette.action.hover, color: theme.palette.text.secondary };
};

// ─── Shared SX helpers that use theme ──────────────────────────────────────────
const cardSx = (theme) => ({
  borderRadius: "16px",
  boxShadow: theme.shadows[1],
  border: `1px solid ${theme.palette.divider}`,
  transition: "box-shadow 0.2s",
  "&:hover": { boxShadow: theme.shadows[4] },
});

const thSx = (theme) => ({
  bgcolor: theme.palette.action.hover,
  fontSize: "0.70rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: theme.palette.text.primary,
  borderBottom: `2px solid ${theme.palette.divider}`,
  py: 1.2,
});

const tdSx = (theme) => ({
  fontSize: "0.80rem",
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  py: 1.1,
});

// ─── Skeleton Components ──────────────────────────────────────────────────────
const SkeletonRows = ({ count = 5, cols = 3, opacity = 0.25 }) => {
  const theme = useTheme();
  return Array.from({ length: count }).map((_, i) => (
    <TableRow key={`sk-${i}`}>
      <TableCell colSpan={cols} sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.2 }}>
        <Box sx={{ height: 10, borderRadius: 2, bgcolor: theme.palette.divider, opacity, width: `${50 + ((i * 17) % 45)}%` }} />
      </TableCell>
    </TableRow>
  ));
};

const SkeletonCustomerRows = ({ count = 5 }) => {
  const theme = useTheme();
  return Array.from({ length: count }).map((_, i) => (
    <Stack key={`sck-${i}`} direction="row" justifyContent="space-between" alignItems="center" sx={{ opacity: 0.22 }}>
      <Stack direction="row" alignItems="center" spacing={1.4}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2.5, bgcolor: theme.palette.divider }} />
        <Box>
          <Box sx={{ height: 10, borderRadius: 2, bgcolor: theme.palette.divider, mb: 0.6, width: `${55 + i * 10}px` }} />
          <Box sx={{ height: 8,  borderRadius: 2, bgcolor: theme.palette.divider, width: 70 }} />
        </Box>
      </Stack>
      <Box sx={{ height: 10, borderRadius: 2, bgcolor: theme.palette.divider, width: 52 }} />
    </Stack>
  ));
};

// ─── Period Pills (theme aware) ─────────────────────────────────────────────
const PeriodPills = ({ active, onChange }) => {
  const theme = useTheme();
  return (
    <ToggleButtonGroup
      value={active}
      exclusive
      onChange={(e, value) => value && onChange(value)}
      size="small"
      sx={{
        backgroundColor: theme.palette.action.hover,
        borderRadius: "5px",
        padding: "3px",
        border: `1px solid ${theme.palette.divider}`,
        "& .MuiToggleButton-root": {
          border: "none", px: 1.4, py: 0.45,
          fontSize: "0.72rem", fontWeight: 600, textTransform: "none",
          color: theme.palette.text.secondary, borderRadius: "7px !important",
          lineHeight: 1.4,
        },
        "& .Mui-selected": {
          backgroundColor: `${theme.palette.primary.main} !important`,
          color: theme.palette.common.white,
          boxShadow: `0 2px 8px ${theme.palette.primary.main}70`,
        },
        "& .MuiToggleButton-root:hover": { backgroundColor: theme.palette.action.selected, color: theme.palette.primary.main },
      }}
    >
      {PERIOD_OPTIONS.map(({ code }) => (
        <ToggleButton key={code} value={code}>
          {code}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

const PeriodDropdown = ({ active, onChange }) => {
  const theme = useTheme();
  const [anchor, setAnchor] = useState(null);
  const current = PERIOD_OPTIONS.find(o => o.code === active) || PERIOD_OPTIONS[1];
  return (
    <>
      <Box
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          px: 1.2, py: 0.45, border: `1px solid ${theme.palette.divider}`, borderRadius: 1,
          fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", color: theme.palette.primary.main,
          display: "flex", alignItems: "center", gap: 0.4, bgcolor: theme.palette.action.hover,
          "&:hover": { bgcolor: theme.palette.action.selected, borderColor: theme.palette.primary.main },
          transition: "all 0.15s",
        }}
      >
        {current.label} <KeyboardArrowDown sx={{ fontSize: 14 }} />
      </Box>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius:1,
            boxShadow: theme.shadows[8],
            border: `1px solid ${theme.palette.divider}`,
            minWidth: 140,
            mt: 0.5,
          },
        }}
      >
        {PERIOD_OPTIONS.map(({ code, label }) => (
          <MenuItem
            key={code}
            selected={active === code}
            onClick={() => { onChange(code); setAnchor(null); }}
            sx={{
              fontSize: "0.78rem",
              color: active === code ? theme.palette.primary.main : theme.palette.text.primary,
              fontWeight: active === code ? 700 : 400,
              borderRadius: 1 ,
              "&.Mui-selected": { bgcolor: theme.palette.action.selected },
              "&:hover": { bgcolor: theme.palette.action.hover, color: theme.palette.primary.main },
            }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const SectionTitle = ({ children, action }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.8}>
      <Stack direction="row" alignItems="center" spacing={1.2}>
        <Box sx={{ width: 3.5, height: 18, borderRadius: 4, bgcolor: theme.palette.primary.main }} />
        <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: theme.palette.text.primary, letterSpacing: "-0.01em" }}>
          {children}
        </Typography>
      </Stack>
      {action}
    </Stack>
  );
};

const ViewAllBtn = () => {
  const theme = useTheme();
  return (
    <Button
      size="small"
      endIcon={<OpenInNew sx={{ fontSize: 11 }} />}
      sx={{
        fontSize: "0.72rem", color: theme.palette.primary.main, textTransform: "none",
        p: 0, minWidth: 0, fontWeight: 600,
        "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
      }}
    >
      View All
    </Button>
  );
};

const TrendPill = ({ trend, change, light }) => {
  const theme = useTheme();
  const isUp = trend === "up";
  const color = isUp ? theme.palette.success.main : theme.palette.error.main;
  const bgColor = light
    ? "rgba(255,255,255,.18)"
    : isUp
      ? theme.palette.success.light + "30"
      : theme.palette.error.light + "30";
  const Icon = isUp ? ArrowUpward : ArrowDownward;
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.3}
      sx={{
        px: 0.9, py: 0.25, borderRadius: 10, display: "inline-flex",
        bgcolor: bgColor,
      }}
    >
      <Icon sx={{ fontSize: 10, color: light ? "#fff" : color }} />
      <Typography sx={{ fontSize: "0.67rem", fontWeight: 700, color: light ? "#fff" : color }}>
        {Math.abs(change).toFixed(1)}%
      </Typography>
    </Stack>
  );
};

const ScrollChart = ({ children, count }) => (
  <Box
    sx={{
      overflowX: count > 14 ? "auto" : "hidden",
      "&::-webkit-scrollbar": { height: 5 },
      "&::-webkit-scrollbar-track": { bgcolor: "action.hover", borderRadius: 10 },
      "&::-webkit-scrollbar-thumb": { bgcolor: "primary.light", borderRadius: 10, "&:hover": { bgcolor: "primary.main" } },
    }}
  >
    <Box sx={{ minWidth: count > 14 ? Math.max(count * 58, 700) : "100%", width: count > 14 ? Math.max(count * 58, 700) : "100%" }}>
      {children}
    </Box>
  </Box>
);

const StableProgress = ({ loading }) => {
  const theme = useTheme();
  return (
    <LinearProgress
      sx={{
        borderRadius: 4,
        bgcolor: theme.palette.action.hover,
        "& .MuiLinearProgress-bar": { bgcolor: theme.palette.primary.main },
        mb: 1,
        visibility: loading ? "visible" : "hidden",
      }}
    />
  );
};

const TX_TABS = [
  { key: "sale",      label: "Sale"      },
  { key: "purchase",  label: "Purchase"  },
  { key: "quotation", label: "Quotation" },
  { key: "expense",   label: "Expenses"  },
  { key: "invoice",   label: "Invoice"   },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const theme = useTheme();
  const { language, user } = useAuth();
  const { t } = translateLauguage(language);
  const savedStoreId = localStorage.getItem("activeShopId");

  const [period,      setPeriod]      = useState("month");
  const [customStart, setCustomStart] = useState(null);
  const [customEnd,   setCustomEnd]   = useState(null);
  const [spPeriod,    setSpPeriod]    = useState("1M");
  const [statsPeriod, setStatsPeriod] = useState("1M");
  const [txTab,       setTxTab]       = useState("sale");
  const [txPeriod,    setTxPeriod]    = useState("1M");
  const [bottomPeriod,setBottomPeriod]= useState("1W");

  const getQueryVars = () => {
    if (period === "custom")
      return { period: "customRange", startDate: customStart?.format("YYYY-MM-DD") || null, endDate: customEnd?.format("YYYY-MM-DD") || null };
    return { period, startDate: null, endDate: null };
  };

  const { data, loading, error, refetch } = useQuery(GET_FULL_DASHBOARD, {
    variables: { shopId: savedStoreId, ...getQueryVars() },
    skip: period === "custom" && (!customStart || !customEnd),
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const { data: spData,     loading: spLoading    } = useQuery(GET_CHART_DATA, { variables: { shopId: savedStoreId, period: spPeriod },    fetchPolicy: "cache-and-network" });
  const { data: statsData,  loading: statsLoading  } = useQuery(GET_CHART_DATA, { variables: { shopId: savedStoreId, period: statsPeriod }, fetchPolicy: "cache-and-network" });
  const { data: txData,     loading: txLoading     } = useQuery(GET_RECENT_TRANSACTIONS_BY_TYPE, { variables: { shopId: savedStoreId, txType: txTab, period: txPeriod, page: 1, limit: 8 }, fetchPolicy: "cache-and-network" });
  const { data: bottomData, loading: bottomLoading } = useQuery(GET_ORDER_CATEGORY_STATS, { variables: { shopId: savedStoreId, period: bottomPeriod }, fetchPolicy: "cache-and-network" });

  const dashboard   = data?.getFullDashboard;
  const overview    = dashboard?.overview || {};
  const overallInfo = dashboard?.overallInfo || { suppliers: 0, customers: 0, orders: 0 };
  const custOverview= dashboard?.customerOverview || { firstTime: 0, return: 0, firstTimePercent: 0, returnPercent: 0 };
  const topSelling  = dashboard?.topSellingProducts || [];
  const lowStock    = dashboard?.lowStockProducts || [];
  const recentSales = dashboard?.recentSales || [];
  const topCustomers= dashboard?.topCustomers || [];

  const spChart     = spData?.getChartData    || { labels: [], sales: [], purchases: [] };
  const statsChart  = statsData?.getChartData || { labels: [], sales: [], purchases: [] };
  const recentTx    = txData?.getRecentTransactionsByType?.items || [];

  const bottomStats  = bottomData?.getOrderCategoryStats;
  const topCategories= bottomStats?.topCategories || [];
  const catStats     = bottomStats?.categoryStatistics || { totalCategories: 0, totalProducts: 0 };
  const orderStats   = {
    labels: bottomStats?.orderLabels || ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    values: bottomStats?.orderValues || [0,0,0,0,0,0,0],
  };

  const filterLabel = { today:"Today", week:"Week", month:"Month", year:"Year", custom:"Custom" }[period] || period;

  // ─── Chart Options (theme aware) ────────────────────────────────────────────
  const commonChartBase = {
    toolbar: { show: false },
    background: "transparent",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  };

  const makeBarOpts = (chartData, stacked = false) => {
    const count = chartData.labels.length;
    return {
      chart: { ...commonChartBase, type: "bar", stacked },
      colors: [theme.palette.primary.main, theme.palette.secondary.main],
      plotOptions: {
        bar: {
          borderRadius: stacked ? 2 : 4,
          columnWidth: count > 20 ? "78%" : (stacked ? "52%" : "44%"),
          dataLabels: { position: "top" },
        },
      },
      dataLabels: { enabled: false },
      stroke: { show: !stacked, width: 2, colors: ["transparent"] },
      grid: { borderColor: theme.palette.divider, strokeDashArray: 4, xaxis: { lines: { show: false } } },
      xaxis: {
        categories: chartData.labels.length > 0 ? chartData.labels : ["—"],
        axisBorder: { show: false }, axisTicks: { show: false },
        labels: { style: { colors: theme.palette.text.secondary, fontSize: "11px", fontFamily: "inherit" }, rotate: count > 20 ? -45 : 0 },
      },
      yaxis: {
        labels: {
          formatter: (v) => `$${(v / 1000).toFixed(0)}K`,
          style: { colors: theme.palette.text.secondary, fontSize: "11px", fontFamily: "inherit" },
        },
      },
      tooltip: { theme: theme.palette.mode === "dark" ? "dark" : "light", y: { formatter: formatCurrency } },
      legend: {
        position: "top", horizontalAlign: "left",
        markers: { width: 9, height: 9, radius: 3 },
        labels: { colors: theme.palette.text.primary },
        fontSize: "12px",
      },
      fill: { opacity: stacked ? 0.92 : 1 },
      noData: { text: "No data available", align: "center", verticalAlign: "middle", style: { color: theme.palette.text.secondary, fontSize: "13px" } },
    };
  };

  const customerDonutOpts = {
    chart: { ...commonChartBase, type: "donut" },
    labels: [t("first_time") || "First Time", t("return") || "Return"],
    colors: [theme.palette.primary.main, theme.palette.primary.dark],
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: { donut: { size: "72%", labels: { show: true, total: { show: true, label: "Total", fontSize: "12px", formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString() } } } },
    },
    stroke: { width: 0 },
    tooltip: { y: { formatter: (v) => `${v.toLocaleString()} customers` } },
    noData: { text: "No data", align: "center", verticalAlign: "middle", style: { color: theme.palette.text.secondary, fontSize: "12px" } },
  };

  // Category donut colors from theme palette
  const categoryColors = useMemo(() => {
    return [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
    ];
  }, [theme]);

  const categoryDonutOpts = {
    chart: { ...commonChartBase, type: "donut" },
    labels: topCategories.length > 0 ? topCategories.map((c) => c.name) : ["No Data"],
    colors: topCategories.length > 0 ? categoryColors : [theme.palette.divider],
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: "65%" } } },
    stroke: { width: 0 },
    tooltip: { y: { formatter: formatCurrency } },
  };

  const orderStatsOpts = {
    chart: { ...commonChartBase, type: "bar" },
    colors: [theme.palette.primary.light],
    plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: "52%" } },
    dataLabels: { enabled: false },
    grid: { borderColor: theme.palette.divider, strokeDashArray: 4, xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
    xaxis: {
      categories: orderStats.labels, axisBorder: { show: false }, axisTicks: { show: false },
      labels: { style: { colors: theme.palette.text.secondary, fontSize: "11px" } },
    },
    yaxis: { labels: { style: { colors: theme.palette.text.secondary, fontSize: "11px" } } },
    tooltip: { theme: theme.palette.mode === "dark" ? "dark" : "light" },
    fill: {
      type: "gradient",
      gradient: { shade: "light", gradientToColors: [theme.palette.primary.main], shadeIntensity: 0.5, type: "horizontal", opacityFrom: 0.75, opacityTo: 1 },
    },
    noData: { text: "No data available", align: "center", verticalAlign: "middle", style: { color: theme.palette.text.secondary, fontSize: "13px" } },
  };

  // ─── Actions ──────────────────────────────────────────────────────────────────
  const handlePeriodChange = (p) => {
    setPeriod(p);
    if (p !== "custom") refetch({ shopId: savedStoreId, period: p, startDate: null, endDate: null });
  };
  const applyCustomRange = () => {
    if (customStart && customEnd)
      refetch({ shopId: savedStoreId, period: "customRange", startDate: customStart.format("YYYY-MM-DD"), endDate: customEnd.format("YYYY-MM-DD") });
  };
  const handlePrint = () => setTimeout(() => window.print(), 80);

  // ─── Print Data (unchanged logic) ────────────────────────────────────────────
  const printData = useMemo(() => {
    const companyName   = user?.companyName || user?.shopName || "Smart Market";
    const phone         = user?.phone || "(000) 000-0000";
    const email         = user?.email || "support@smartmarket.com";
    const address       = user?.address || "Phnom Penh, Cambodia";
    const invoiceNumber = `DASH-${dayjs().format("YYYYMMDD")}-${String(savedStoreId || "ALL").slice(-4).toUpperCase()}`;
    const periodText    = period === "custom" && customStart && customEnd
      ? `${formatDateLong(customStart)} – ${formatDateLong(customEnd)}`
      : filterLabel;

    const summaryRows = [
      ["Total Sales",            formatCurrency(overview.totalSales?.value || 0),           `${(overview.totalSales?.percentageChange || 0).toFixed(1)}%`],
      ["Total Sales Return",     formatCurrency(overview.totalSalesReturn?.value || 0),      `${(overview.totalSalesReturn?.percentageChange || 0).toFixed(1)}%`],
      ["Total Purchase",         formatCurrency(overview.totalPurchase?.value || 0),         `${(overview.totalPurchase?.percentageChange || 0).toFixed(1)}%`],
      ["Total Purchase Return",  formatCurrency(overview.totalPurchaseReturn?.value || 0),   `${(overview.totalPurchaseReturn?.percentageChange || 0).toFixed(1)}%`],
      ["Profit",                 formatCurrency(overview.profit?.value || 0),                `${(overview.profit?.percentageChange || 0).toFixed(1)}%`],
      ["Invoice Due",            formatCurrency(overview.invoiceDue?.value || 0),            `${(overview.invoiceDue?.percentageChange || 0).toFixed(1)}%`],
      ["Total Expenses",         formatCurrency(overview.totalExpenses?.value || 0),         `${(overview.totalExpenses?.percentageChange || 0).toFixed(1)}%`],
      ["Payment Returns",        formatCurrency(overview.totalPaymentReturns?.value || 0),   `${(overview.totalPaymentReturns?.percentageChange || 0).toFixed(1)}%`],
    ];
    const chartRows   = spChart.labels.map((l, i) => [l, formatCurrency(spChart.sales[i]), formatCurrency(spChart.purchases[i])]);
    const infoRows    = [["Suppliers", overallInfo.suppliers], ["Customers", overallInfo.customers], ["Orders", overallInfo.orders]];
    const custRows    = [["First Time", custOverview.firstTime, `${custOverview.firstTimePercent.toFixed(1)}%`], ["Return", custOverview.return, `${custOverview.returnPercent.toFixed(1)}%`]];
    const topProdRows = topSelling.map(p  => [p.productName, p.sales, formatCurrency(p.revenue)]);
    const lowStockRows= lowStock.map(p    => [p.productName, p.stock, p.minStock]);
    const rSalesRows  = recentSales.map(s => [s.productName, s.category, formatCurrency(s.amount), formatDateLong(s.date)]);
    const rTxRows     = recentTx.map(tx   => [formatDateLong(tx.date), tx.customer, tx.quantity, formatCurrency(tx.price), tx.status, formatCurrency(tx.total)]);
    const topCustRows = topCustomers.map(c  => [c.name, c.country || "-", c.orders, formatCurrency(c.totalSpent)]);
    const topCatRows  = topCategories.map(c => [c.name, formatCurrency(c.salesAmount)]);
    const orderRows   = orderStats.labels.map((l, i) => [l, orderStats.values[i]]);
    const catStatRows = [["Total Categories", catStats.totalCategories], ["Total Products", catStats.totalProducts]];

    return {
      companyName, phone, email, address, invoiceNumber,
      invoiceDate: formatDateLong(new Date()), periodText,
      summaryRows, chartRows, infoRows, custRows, topProdRows, lowStockRows, rSalesRows, rTxRows, topCustRows, topCatRows, orderRows, catStatRows,
      hasChart: chartRows.length > 0, hasTopProd: topProdRows.length > 0, hasLowStock: lowStockRows.length > 0,
      hasRSales: rSalesRows.length > 0, hasRTx: rTxRows.length > 0, hasTopCust: topCustRows.length > 0, hasTopCat: topCatRows.length > 0,
    };
  }, [dashboard, period, customStart, customEnd, user, savedStoreId, filterLabel, overview, spChart, overallInfo, custOverview, topSelling, lowStock, recentSales, recentTx, topCustomers, topCategories, orderStats, catStats]);

   
  const handleExportExcel = async () => {
    const wb  = new ExcelJS.Workbook();
    const C   = { blue: theme.palette.primary.main.replace("#",""), dark: "FF0D2B52", white: "FFFFFFFF", bdr: theme.palette.divider.replace("#","") };
    const tb  = { top: { style: "thin", color: { argb: C.bdr } }, left: { style: "thin", color: { argb: C.bdr } }, bottom: { style: "thin", color: { argb: C.bdr } }, right: { style: "thin", color: { argb: C.bdr } } };
    const hs  = { font: { name: "Calibri", size: 11, bold: true, color: { argb: C.white } }, fill: { type: "pattern", pattern: "solid", fgColor: { argb: C.blue } }, alignment: { horizontal: "center", vertical: "middle" }, border: tb };
    const addSheet = (name, title, headers, rows) => {
      const ws = wb.addWorksheet(name);
      ws.addRow([title]).font = { size: 14, bold: true, color: { argb: C.dark } };
      ws.addRow([]);
      const hr = ws.addRow(headers);
      hr.eachCell(c => { c.font = hs.font; c.fill = hs.fill; c.alignment = hs.alignment; c.border = hs.border; });
      rows.forEach(r => { const dr = ws.addRow(r); dr.eachCell((c, col) => { c.border = tb; c.alignment = { vertical: "middle", horizontal: col === 1 ? "left" : "right" }; }); });
      ws.autoFilter = { from: { row: hr.number, column: 1 }, to: { row: hr.number, column: headers.length } };
    };
    addSheet("Summary",       "Dashboard Summary",    ["Metric", "Value", "Change"],                           printData.summaryRows);
    if (printData.hasChart)   addSheet("Sales & Purchase", "Sales vs Purchase",  ["Period","Sales","Purchases"],   printData.chartRows);
    addSheet("Overall Info",  "Overall Information",  ["Metric","Count"],                                       printData.infoRows);
    addSheet("Customer Overview","Customer Overview", ["Type","Count","Percentage"],                             printData.custRows);
    if (printData.hasTopProd) addSheet("Top Products",  "Top Selling Products",  ["Product","Sales","Revenue"],    printData.topProdRows);
    if (printData.hasLowStock)addSheet("Low Stock",     "Low Stock Products",    ["Product","Stock","Min Stock"],  printData.lowStockRows);
    if (printData.hasRSales)  addSheet("Recent Sales",  "Recent Sales",          ["Product","Category","Amount","Date"], printData.rSalesRows);
    if (printData.hasRTx)     addSheet("Transactions",  "Recent Transactions",   ["Date","Customer","Qty","Price","Status","Total"], printData.rTxRows);
    if (printData.hasTopCust) addSheet("Top Customers", "Top Customers",         ["Name","Country","Orders","Total Spent"], printData.topCustRows);
    if (printData.hasTopCat)  addSheet("Top Categories","Top Categories",        ["Category","Sales Amount"],      printData.topCatRows);
    addSheet("Order Stats",   "Order Statistics",     ["Label","Orders"],                                        printData.orderRows);
    addSheet("Category Stats","Category Statistics",  ["Metric","Count"],                                        printData.catStatRows);
    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `dashboard_${period}_${formatFileDate()}.xlsx`);
  };

   
  if (loading && !dashboard) return (
    <Box >
      {/* <LinearProgress sx={{ borderRadius: 4, bgcolor: theme.palette.action.hover, "& .MuiLinearProgress-bar": { bgcolor: theme.palette.primary.main } }} />
      <Typography sx={{ mt: 2, fontSize: "0.875rem", color: theme.palette.text.secondary }}>{t("loading") || "Loading..."}</Typography> */}
      <DashboardSkeleton/>
    </Box>
  );
  if (error) return <ErrorPage t={t} error={error} refetch={refetch} />;

 
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <style>{`@media print{@page{size:A4 portrait;margin:1.2cm 0.8cm;}body *{visibility:hidden;}#pdr,#pdr *{visibility:visible;}#pdr{position:fixed;left:0;top:0;width:100%;background:#f4f6fb;}thead{display:table-header-group;}}`}</style>

      <Box sx={{ width: "100%",  bgcolor: theme.palette.background.default, pb: 5 }}>
        <Box sx={{ "@media print": { display: "none" } }}>

          {/* Page Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box sx={{
                width: 38, height: 38, borderRadius: 2.5,
                bgcolor: theme.palette.primary.main, display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 14px ${theme.palette.primary.main}70`,
              }}>
                <DashboardIcon sx={{ fontSize: 20, color: theme.palette.common.white }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: theme.palette.text.primary, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                  {t("dashboard") || "Dashboard"}
                </Typography>
                <Typography sx={{ fontSize: "0.72rem", color: theme.palette.text.secondary }}>
                  {formatDateLong(new Date())}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                onClick={handleExportExcel}
                size="small"
                startIcon={<Download sx={{ fontSize: 15 }} />}
                sx={{
                  fontSize: "0.75rem", fontWeight: 600, textTransform: "none",
                  color: theme.palette.primary.main, border: `1px solid ${theme.palette.divider}`, borderRadius: 0.5,
                  bgcolor: theme.palette.background.paper, px: 1.5,
                  "&:hover": { bgcolor: theme.palette.action.hover, borderColor: theme.palette.primary.main },
                }}
              >
                Export
              </Button>
              <Button
                onClick={handlePrint}
                size="small"
                startIcon={<Print sx={{ fontSize: 15 }} />}
                sx={{
                  fontSize: "0.75rem", fontWeight: 600, textTransform: "none",
                  color: theme.palette.common.white, borderRadius: 0.5, bgcolor: theme.palette.primary.main, px: 1.5,
                  boxShadow: `0 2px 8px ${theme.palette.primary.main}70`,
                  "&:hover": { bgcolor: theme.palette.primary.dark },
                }}
              >
                Print
              </Button>
            </Stack>
          </Stack>

          <Box>
       
            <Box
              sx={{
                bgcolor: theme.palette.background.paper, borderRadius: 1, border: `1px solid ${theme.palette.divider}`,
                px: 2.5, py: 1.8, mb: 2.5,
                 
              }}
            >
              <Grid container spacing={1.5} alignItems="center">
                <Grid size={{ xs: 12, md: 2 }}>
                  <TextField
                    select fullWidth size="small"
                    label={t("period") || "Period"}
                    value={period}
                    onChange={(e) => handlePeriodChange(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        textAlign: "left", 
                        "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.primary.main },
                    }}
                  >
                    <MenuItem value="today">{t("today")  || "Today"}</MenuItem>
                    <MenuItem value="week"> {t("week")   || "Week"}</MenuItem>
                    <MenuItem value="month">{t("month")  || "Month"}</MenuItem>
                    <MenuItem value="year"> {t("year")   || "Year"}</MenuItem>
                    <MenuItem value="custom">{t("custom_range") || "Custom Range"}</MenuItem>
                  </TextField>
                </Grid>

                {period === "custom" && (
                  <>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <DatePicker
                        label={t("start_date")}
                        value={customStart}
                        onChange={setCustomStart}
                        slotProps={{ textField: { size: "small", fullWidth: true, sx: { "& .MuiOutlinedInput-root": { borderRadius: 2, "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main } } } } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <DatePicker
                        label={t("end_date")}
                        value={customEnd}
                        onChange={setCustomEnd}
                        slotProps={{ textField: { size: "small", fullWidth: true, sx: { "& .MuiOutlinedInput-root": { borderRadius: 2, "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main } } } } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <Button
                        variant="contained"
                        onClick={applyCustomRange}
                        disabled={!customStart || !customEnd}
                        sx={{
                          bgcolor: theme.palette.primary.main, borderRadius: 1, textTransform: "none",
                          fontWeight: 600, height: 36, px: 2.5,
                          boxShadow: `0 2px 8px ${theme.palette.primary.main}70`,
                          "&:hover": { bgcolor: theme.palette.primary.dark },
                        }}
                      >
                        {t("apply")}
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>

             
            <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
              {[
                {
                  title: t("total_sales") || "Total Sales",
                  value: overview.totalSales?.value || 0,
                  change: overview.totalSales?.percentageChange || 0,
                  trend: overview.totalSales?.trend || "up",
                  bg: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                },
                {
                  title: t("total_sale_return") || "Total Sales Return",
                  value: overview.totalSalesReturn?.value || 0,
                  change: overview.totalSalesReturn?.percentageChange || 0,
                  trend: overview.totalSalesReturn?.trend || "down",
                  bg: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
                },
                {
                  title: t("total_purchase") || "Total Purchase",
                  value: overview.totalPurchase?.value || 0,
                  change: overview.totalPurchase?.percentageChange || 0,
                  trend: overview.totalPurchase?.trend || "up",
                  bg: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.light} 100%)`,
                },
                {
                  title: t("total_purchase_return") || "Total Purchase Return",
                  value: overview.totalPurchaseReturn?.value || 0,
                  change: overview.totalPurchaseReturn?.percentageChange || 0,
                  trend: overview.totalPurchaseReturn?.trend || "up",
                  bg: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
                },
              ].map((card, idx) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                  <Box sx={{
                    background: card.bg,
                    borderRadius: "8px",
                    px: 2.5, py: 2.2,
                    position: "relative", overflow: "hidden",
                    minHeight: 82,
                    boxShadow: `0 4px 18px ${theme.palette.primary.main}40`,
                  }}>
                    <Box sx={{ position: "absolute", right: -20, top: -20, width: 80, height: 80, borderRadius: "50%", bgcolor: "rgba(255,255,255,.08)" }} />
                    <Box sx={{ position: "absolute", right: 22, bottom: -30, width: 56, height: 56, borderRadius: "50%", bgcolor: "rgba(255,255,255,.05)" }} />
                    <Box sx={{ position: "absolute", left: -14, bottom: -14, width: 48, height: 48, borderRadius: "50%", bgcolor: "rgba(255,255,255,.05)" }} />

                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ position: "relative", zIndex: 1 }}>
                      <Box>
                        <Typography sx={{ fontSize: "0.67rem", color: "rgba(255,255,255,.8)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.6 }}>
                          {card.title}
                        </Typography>
                        <Typography sx={{ fontSize: "1.55rem", fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-0.02em" }}>
                          {formatCurrency(card.value)}
                        </Typography>
                      </Box>
                      <TrendPill trend={card.trend} change={card.change} light />
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>

          
            <Grid container spacing={1.5} sx={{ mb: 2 }}>
              {[
                { title: t("profit") || "Profit",                value: overview.profit?.value || 0,              change: overview.profit?.percentageChange || 0,              trend: overview.profit?.trend || "up",   icon: <TrendingUp    sx={{ fontSize: 18, color: theme.palette.primary.main   }} />, iconBg: theme.palette.primary.light + "30" },
                { title: t("invoice_due") || "Invoice Due",      value: overview.invoiceDue?.value || 0,          change: overview.invoiceDue?.percentageChange || 0,          trend: overview.invoiceDue?.trend || "up",icon: <Receipt       sx={{ fontSize: 18, color: theme.palette.warning.main }} />, iconBg: theme.palette.warning.light + "30" },
                { title: t("total_expenses") || "Total Expenses",value: overview.totalExpenses?.value || 0,       change: overview.totalExpenses?.percentageChange || 0,       trend: overview.totalExpenses?.trend || "up",icon: <AttachMoney  sx={{ fontSize: 18, color: theme.palette.info.main    }} />, iconBg: theme.palette.info.light + "30" },
                { title: t("total_payment_returns") || "Payment Returns", value: overview.totalPaymentReturns?.value || 0, change: overview.totalPaymentReturns?.percentageChange || 0, trend: overview.totalPaymentReturns?.trend || "down", icon: <MonetizationOn sx={{ fontSize: 18, color: theme.palette.secondary.main }} />, iconBg: theme.palette.secondary.light + "30" },
              ].map((card, idx) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                  <Card >
                    <CardContent sx={{ py: "16px !important", px: "18px !important" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: theme.palette.text.secondary, mb: 0.4 }}>
                            {card.title}
                          </Typography>
                          <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: theme.palette.text.primary, mb: 0.7, letterSpacing: "-0.02em" }}>
                            {formatCurrency(card.value)}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={0.8}>
                            <TrendPill trend={card.trend} change={card.change} />
                            <Typography sx={{ fontSize: "0.64rem", color: theme.palette.text.secondary }}>vs last period</Typography>
                          </Stack>
                        </Box>
                        <Box sx={{
                          width: 42, height: 42, borderRadius: 1,
                          bgcolor: card.iconBg,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: `0 2px 8px ${theme.palette.primary.main}20`,
                        }}>
                          {card.icon}
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

         
            <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Card sx={cardSx(theme)}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.2}>
                      <SectionTitle>{t("sales_purchase") || "Sales & Purchase"}</SectionTitle>
                      <PeriodPills active={spPeriod} onChange={setSpPeriod} />
                    </Stack>
                    <StableProgress loading={spLoading} />
                    <Box sx={{ opacity: spLoading ? 0.35 : 1, transition: "opacity .3s", minHeight: 280 }}>
                      <ScrollChart count={Math.max(spChart.labels.length, 1)}>
                        <Chart
                          options={makeBarOpts(spChart, false)}
                          series={[
                            { name: t("sales")     || "Total Sales",    data: spChart.sales.length     > 0 ? spChart.sales     : [0] },
                            { name: t("purchases") || "Total Purchase", data: spChart.purchases.length > 0 ? spChart.purchases : [0] },
                          ]}
                          type="bar" height={280}
                        />
                      </ScrollChart>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ ...cardSx(theme), height: "100%" }}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <SectionTitle>{t("overall_info") || "Overall Information"}</SectionTitle>

                    <Grid container sx={{ mb: 2 }}>
                      {[
                        { label: t("suppliers") || "Suppliers", value: overallInfo.suppliers, color: theme.palette.success.main },
                        { label: t("customer") || "Customers", value: overallInfo.customers, color: theme.palette.primary.main },
                        { label: t("orders")    || "Orders",    value: overallInfo.orders,    color: theme.palette.warning.main },
                      ].map((item, i) => (
                        <Grid size={4} key={i}>
                          <Box sx={{
                            textAlign: "center", py: 1.5,
                            borderRight: i < 2 ? `1px solid ${theme.palette.divider}` : "none",
                          }}>
                            <Typography sx={{ fontWeight: 800, fontSize: "1.2rem", color: item.color, letterSpacing: "-0.02em" }}>
                              {item.value.toLocaleString()}
                            </Typography>
                            <Typography sx={{ fontSize: "0.66rem", color: theme.palette.text.secondary, mt: 0.2 }}>{item.label}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    <Divider sx={{ borderColor: theme.palette.divider, mb: 1.8 }} />

                    <Typography sx={{ fontWeight: 700, fontSize: "0.82rem", color: theme.palette.text.primary, mb: 1.2 }}>
                      {t("customer_overview") || "Customers Overview"}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minHeight: 130 }}>
                      <Box sx={{ flexShrink: 0 }}>
                        <Chart
                          options={customerDonutOpts}
                          series={[custOverview.firstTime || 0, custOverview.return || 0]}
                          type="donut" height={130} width={130}
                        />
                      </Box>
                      <Stack spacing={1.4} flex={1}>
                        {[
                          { label: t("first_time") || "First Time", value: custOverview.firstTime, pct: custOverview.firstTimePercent, color: theme.palette.primary.main  },
                          { label: t("return")     || "Return",     value: custOverview.return,    pct: custOverview.returnPercent,    color: theme.palette.primary.dark },
                        ].map((row, i) => (
                          <Box key={i}>
                            <Stack direction="row" justifyContent="space-between" mb={0.4}>
                              <Stack direction="row" alignItems="center" spacing={0.7}>
                                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: row.color }} />
                                <Typography sx={{ fontSize: "0.72rem", color: theme.palette.text.secondary }}>{row.label}</Typography>
                              </Stack>
                              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: theme.palette.text.primary }}>
                                {row.value.toLocaleString()}
                              </Typography>
                            </Stack>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(row.pct || 0, 100)}
                              sx={{
                                height: 5, borderRadius: 3,
                                bgcolor: `${row.color}1A`,
                                "& .MuiLinearProgress-bar": { bgcolor: row.color, borderRadius: 3 },
                              }}
                            />
                          </Box>
                        ))}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            
            <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
          
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={cardSx(theme)}>
                  <CardContent sx={{ pb: "12px !important", p: "20px !important" }}>
                    <SectionTitle action={<ViewAllBtn />}>{t("top_selling_products") || "Top Selling Products"}</SectionTitle>
                    <TableContainer sx={{ minHeight: 220 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={thSx(theme)}>{t("product") || "Product"}</TableCell>
                            <TableCell align="right" sx={thSx(theme)}>{t("sales") || "Sales"}</TableCell>
                            <TableCell align="right" sx={thSx(theme)}>{t("revenue") || "Revenue"}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {topSelling.length === 0
                            ? <SkeletonRows count={5} cols={3} opacity={loading ? 0.4 : 0.2} />
                            : topSelling.map((item, idx) => (
                              <TableRow key={idx} hover sx={{ "&:last-child td": { border: 0 }, "&:hover": { bgcolor: theme.palette.action.hover } }}>
                                <TableCell sx={tdSx(theme)}>
                                  <Stack direction="row" alignItems="center" spacing={1.4}>
                                    <Avatar sx={{
                                      width: 30, height: 30, borderRadius: 2,
                                      bgcolor: `${theme.palette.primary.main}15`, color: theme.palette.primary.main,
                                      fontSize: "0.68rem", fontWeight: 700,
                                    }}>
                                      {(item.productName || "?")[0]}
                                    </Avatar>
                                    <Box>
                                      <Typography sx={{ fontSize: "0.79rem", fontWeight: 600, color: theme.palette.text.primary, lineHeight: 1.2 }}>{item.productName}</Typography>
                                      <Typography sx={{ fontSize: "0.64rem", color: theme.palette.text.secondary }}>${(item.revenue / (item.sales || 1)).toFixed(2)} avg</Typography>
                                    </Box>
                                  </Stack>
                                </TableCell>
                                <TableCell align="right" sx={{ ...tdSx(theme), fontWeight: 600 }}>{item.sales}</TableCell>
                                <TableCell align="right" sx={{ ...tdSx(theme), fontWeight: 700, color: theme.palette.primary.main }}>{formatCurrency(item.revenue)}</TableCell>
                              </TableRow>
                            ))
                          }
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Low Stock Products */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={cardSx(theme)}>
                  <CardContent sx={{ pb: "12px !important", p: "20px !important" }}>
                    <SectionTitle action={<ViewAllBtn />}>{t("low_stock_products") || "Low Stock Products"}</SectionTitle>
                    <TableContainer sx={{ minHeight: 220 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={thSx(theme)}>{t("product") || "Product"}</TableCell>
                            <TableCell sx={thSx(theme)}>ID</TableCell>
                            <TableCell align="right" sx={thSx(theme)}>{t("stock") || "Stock"}</TableCell>
                            <TableCell align="right" sx={thSx(theme)}>{t("min_stock") || "Min"}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {lowStock.length === 0
                            ? <SkeletonRows count={5} cols={4} opacity={loading ? 0.4 : 0.2} />
                            : lowStock.map((item, idx) => (
                              <TableRow key={idx} hover sx={{ "&:last-child td": { border: 0 }, "&:hover": { bgcolor: theme.palette.action.hover } }}>
                                <TableCell sx={tdSx(theme)}>
                                  <Stack direction="row" alignItems="center" spacing={1.4}>
                                    <Avatar sx={{ width: 30, height: 30, borderRadius: 2, bgcolor: theme.palette.action.hover, color: theme.palette.text.secondary, fontSize: "0.65rem" }}>
                                      {(item.productName || "?")[0]}
                                    </Avatar>
                                    <Typography sx={{ fontSize: "0.79rem", color: theme.palette.text.primary }}>{item.productName}</Typography>
                                  </Stack>
                                </TableCell>
                                <TableCell sx={{ ...tdSx(theme), fontSize: "0.7rem", color: theme.palette.text.secondary }}>{item.id || "-"}</TableCell>
                                <TableCell align="right">
                                  <Chip
                                    label={item.stock <= item.minStock ? `${item.stock} low` : item.stock}
                                    size="small"
                                    sx={{
                                      fontWeight: 700, fontSize: "0.64rem", borderRadius: 6, height: 20,
                                      bgcolor: item.stock <= item.minStock ? theme.palette.error.light + "30" : theme.palette.success.light + "30",
                                      color:   item.stock <= item.minStock ? theme.palette.error.main      : theme.palette.success.main,
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="right" sx={tdSx(theme)}>{item.minStock}</TableCell>
                              </TableRow>
                            ))
                          }
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Sales Stats + Recent Transactions */}
            <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Card sx={cardSx(theme)}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={0.8}>
                      <SectionTitle>{t("sales_stats") || "Sales Statistics"}</SectionTitle>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={0.6}>
                          <Box sx={{ width: 9, height: 9, borderRadius: 2, bgcolor: theme.palette.primary.main }} />
                          <Typography sx={{ fontSize: "0.67rem", color: theme.palette.text.secondary }}>{t("sales") || "Revenue"}</Typography>
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 800, color: theme.palette.primary.main }}>{formatCurrency(overview.totalSales?.value || 0)}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.6}>
                          <Box sx={{ width: 9, height: 9, borderRadius: 2, bgcolor: theme.palette.secondary.main }} />
                          <Typography sx={{ fontSize: "0.67rem", color: theme.palette.text.secondary }}>{t("purchases") || "Purchase"}</Typography>
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 800, color: theme.palette.secondary.main }}>{formatCurrency(overview.totalPurchase?.value || 0)}</Typography>
                        </Stack>
                      </Stack>
                    </Stack>

                    <Stack direction="row" justifyContent="flex-end" mb={1.2}>
                      <PeriodPills active={statsPeriod} onChange={setStatsPeriod} />
                    </Stack>

                    <StableProgress loading={statsLoading} />

                    <Box sx={{ opacity: statsLoading ? 0.35 : 1, transition: "opacity .3s", minHeight: 250 }}>
                      <ScrollChart count={Math.max(statsChart.labels.length, 1)}>
                        <Chart
                          options={makeBarOpts(statsChart, true)}
                          series={[
                            { name: t("sales")     || "Sales",    data: statsChart.sales.length     > 0 ? statsChart.sales     : [0] },
                            { name: t("purchases") || "Purchase", data: statsChart.purchases.length > 0 ? statsChart.purchases : [0] },
                          ]}
                          type="bar" height={250}
                        />
                      </ScrollChart>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <Card sx={{ ...cardSx(theme), height: "100%" }}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <SectionTitle>{t("recent_transactions") || "Recent Transactions"}</SectionTitle>
                      <PeriodPills active={txPeriod} onChange={setTxPeriod} />
                    </Stack>

                    <Stack
                      direction="row"
                      sx={{
                        borderBottom: `2px solid ${theme.palette.divider}`, mb: 1.8,
                        overflowX: "auto", "&::-webkit-scrollbar": { display: "none" },
                      }}
                    >
                      {TX_TABS.map((tab) => {
                        const active = txTab === tab.key;
                        return (
                          <Typography
                            key={tab.key}
                            onClick={() => setTxTab(tab.key)}
                            sx={{
                              fontSize: "0.69rem", fontWeight: active ? 700 : 500,
                              color: active ? theme.palette.primary.main : theme.palette.text.secondary,
                              pb: 0.9, px: 1.1,
                              borderBottom: active ? `2px solid ${theme.palette.primary.main}` : "2px solid transparent",
                              mb: "-2px",
                              cursor: "pointer", whiteSpace: "nowrap",
                              "&:hover": { color: theme.palette.primary.main },
                              transition: "color .15s",
                            }}
                          >
                            {tab.label}
                          </Typography>
                        );
                      })}
                    </Stack>

                    <StableProgress loading={txLoading} />

                    <TableContainer sx={{ minHeight: 260 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={thSx(theme)}>{t("customer") || "Customer"}</TableCell>
                            <TableCell sx={thSx(theme)}>{t("due_date")}</TableCell>
                            <TableCell sx={thSx(theme)}>{t("status")}</TableCell>
                            <TableCell align="right" sx={thSx(theme)}>{t("amount")}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {txLoading
                            ? <SkeletonRows count={6} cols={4} opacity={0.4} />
                            : recentTx.length === 0
                              ? <SkeletonRows count={6} cols={4} opacity={0.18} />
                              : recentTx.map((item, idx) => {
                                const sc = getStatusStyle(item.status, theme);
                                return (
                                  <TableRow key={idx} hover sx={{ "&:last-child td": { border: 0 }, "&:hover": { bgcolor: theme.palette.action.hover } }}>
                                    <TableCell sx={tdSx(theme)}>
                                      <Stack direction="row" alignItems="center" spacing={1.1}>
                                        <Avatar sx={{
                                          width: 26, height: 26,
                                          bgcolor: `${categoryColors[idx % categoryColors.length]}18`,
                                          color: categoryColors[idx % categoryColors.length],
                                          fontSize: "0.62rem", fontWeight: 700,
                                        }}>
                                          {(item.customer || "?")[0]}
                                        </Avatar>
                                        <Box>
                                          <Typography sx={{ fontSize: "0.76rem", fontWeight: 600, color: theme.palette.text.primary, lineHeight: 1.2 }}>{item.customer}</Typography>
                                          <Typography sx={{ fontSize: "0.62rem", color: theme.palette.text.secondary }}>#{item.id || idx}</Typography>
                                        </Box>
                                      </Stack>
                                    </TableCell>
                                    <TableCell sx={{ ...tdSx(theme), fontSize: "0.7rem", color: theme.palette.text.secondary }}>{formatDateShort(item.date)}</TableCell>
                                    <TableCell>
                                      <Chip
                                        label={item.status}
                                        size="small"
                                        sx={{ fontWeight: 700, fontSize: "0.62rem", borderRadius: 6, height: 19, bgcolor: sc.bg, color: sc.color }}
                                      />
                                    </TableCell>
                                    <TableCell align="right" sx={{ ...tdSx(theme), fontWeight: 700, color: theme.palette.primary.main }}>{formatCurrency(item.total)}</TableCell>
                                  </TableRow>
                                );
                              })
                          }
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Bottom row: Top Customers, Top Categories, Order Statistics */}
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, md: 3 }}>
                <Card sx={{ ...cardSx(theme), height: "100%" }}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <SectionTitle action={<ViewAllBtn />}>{t("top_customers") || "Top Customers"}</SectionTitle>
                    <Stack spacing={2} sx={{ minHeight: 220 }}>
                      {topCustomers.length === 0
                        ? <SkeletonCustomerRows count={5} />
                        : topCustomers.map((item, idx) => (
                          <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" alignItems="center" spacing={1.3}>
                              <Avatar sx={{
                                width: 36, height: 36, borderRadius: 2.5,
                                bgcolor: `${categoryColors[idx % categoryColors.length]}15`,
                                color: categoryColors[idx % categoryColors.length],
                                fontSize: "0.74rem", fontWeight: 700,
                              }}>
                                {(item.name || "?")[0]}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontSize: "0.79rem", fontWeight: 600, color: theme.palette.text.primary, lineHeight: 1.2 }}>{item.name}</Typography>
                                <Typography sx={{ fontSize: "0.63rem", color: theme.palette.text.secondary }}>{item.country || "-"} · {item.orders} orders</Typography>
                              </Box>
                            </Stack>
                            <Typography sx={{ fontSize: "0.79rem", fontWeight: 700, color: theme.palette.primary.main }}>{formatCurrency(item.totalSpent)}</Typography>
                          </Stack>
                        ))
                      }
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ ...cardSx(theme), height: "100%" }}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <SectionTitle action={<PeriodDropdown active={bottomPeriod} onChange={setBottomPeriod} />}>
                      {t("top_categories") || "Top Categories"}
                    </SectionTitle>

                    <StableProgress loading={bottomLoading} />

                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minHeight: 160 }}>
                      <Box sx={{ flexShrink: 0, opacity: bottomLoading ? 0.35 : 1, transition: "opacity .3s" }}>
                        <Chart
                          options={categoryDonutOpts}
                          series={topCategories.length > 0 ? topCategories.map(c => c.salesAmount) : [1]}
                          type="donut" height={160} width={160}
                        />
                      </Box>
                      <Stack spacing={1.3} flex={1}>
                        {topCategories.length === 0
                          ? Array.from({ length: 4 }).map((_, i) => (
                            <Stack key={i} direction="row" justifyContent="space-between" alignItems="center" sx={{ opacity: 0.22 }}>
                              <Stack direction="row" alignItems="center" spacing={0.8}>
                                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: theme.palette.divider }} />
                                <Box sx={{ height: 9, borderRadius: 2, bgcolor: theme.palette.divider, width: `${40 + i * 12}px` }} />
                              </Stack>
                              <Box sx={{ height: 9, borderRadius: 2, bgcolor: theme.palette.divider, width: 32 }} />
                            </Stack>
                          ))
                          : topCategories.slice(0, 5).map((cat, i) => (
                            <Stack key={i} direction="row" justifyContent="space-between" alignItems="center">
                              <Stack direction="row" alignItems="center" spacing={0.8}>
                                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: categoryColors[i % categoryColors.length] }} />
                                <Typography sx={{ fontSize: "0.72rem", color: theme.palette.text.secondary }}>{cat.name}</Typography>
                              </Stack>
                              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: theme.palette.text.primary }}>{cat.salesAmount?.toLocaleString()}</Typography>
                            </Stack>
                          ))
                        }
                      </Stack>
                    </Stack>

                    <Divider sx={{ my: 1.8, borderColor: theme.palette.divider }} />
                    <Stack direction="row" justifyContent="space-around">
                      {[
                        { label: t("total_categories") || "Categories", value: catStats.totalCategories },
                        { label: t("total_products")   || "Products",   value: catStats.totalProducts   },
                      ].map((s, i) => (
                        <Box key={i} sx={{ textAlign: "center" }}>
                          <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: theme.palette.primary.main, letterSpacing: "-0.02em" }}>{s.value}</Typography>
                          <Typography sx={{ fontSize: "0.65rem", color: theme.palette.text.secondary }}>{s.label}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <Card sx={{ ...cardSx(theme), height: "100%" }}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <SectionTitle action={<PeriodDropdown active={bottomPeriod} onChange={setBottomPeriod} />}>
                      {t("order_statistics") || "Order Statistics"}
                    </SectionTitle>

                    <StableProgress loading={bottomLoading} />

                    <Box sx={{ opacity: bottomLoading ? 0.35 : 1, transition: "opacity .3s", minHeight: 260 }}>
                      <Chart
                        options={orderStatsOpts}
                        series={[{ name: t("orders") || "Orders", data: orderStats.values }]}
                        type="bar" height={260}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Print View (unchanged) */}
        <Box id="pdr" sx={{ position: "fixed", left: "-10000px", top: 0, width: "100%", visibility: "hidden", "@media print": { position: "relative", left: 0, top: 0, visibility: "visible" } }}>
          <Box sx={{ bgcolor: theme.palette.background.default, p: 2 }}>
            <Box sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`, color: "#fff", p: 2.5, borderRadius: "12px 12px 0 0" }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" fontWeight={800}>{printData.companyName}</Typography>
                  <Typography variant="caption">{printData.address}<br />{printData.phone}<br />{printData.email}</Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="h5" fontWeight={800}>{t("dashboard") || "Dashboard"}</Typography>
                  <Typography variant="caption">
                    <b>Report #:</b> {printData.invoiceNumber}<br />
                    <b>Date:</b> {printData.invoiceDate}<br />
                    <b>Period:</b> {printData.periodText}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}