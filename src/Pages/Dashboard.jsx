// Dashboard.js
import { useState, useMemo, useCallback } from "react";
import {
  Box, Button, Card, CardContent, Chip, Grid, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Tooltip, Typography, LinearProgress,
  Divider, MenuItem, Avatar, Menu,
  ButtonGroup,
  ToggleButtonGroup,
  ToggleButton,
  Breadcrumbs,
} from "@mui/material";
import {
  ArrowUpward, ArrowDownward, Download, Print,
  MonetizationOn, TrendingUp, Receipt, AttachMoney,
  OpenInNew, KeyboardArrowDown,
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

 
const formatCurrency = (v) => (v != null ? `$${Number(v).toFixed(2)}` : "$0.00");
const formatDateLong = (v) => (!v ? "-" : dayjs(v).format("MMMM D, YYYY"));
const formatDateShort = (v) => (!v ? "-" : dayjs(v).format("DD MMM YYYY"));
const formatFileDate = (v = new Date()) => dayjs(v).format("YYYY-MM-DD");
 
const T = {
  orange: "#F97316",
  orangeLight: "#FDBA74",
  orangePale: "#FFF7ED",
  teal: "#0F766E",
  tealLight: "#5EEAD4",
  tealPale: "#F0FDFA",
  navy: "#0F2B4C",
  navyMid: "#1E3A5F",
  purple: "#4F63FF",
  purplePale: "#EEF2FF",
  green: "#16A34A",
  greenPale: "#DCFCE7",
  red: "#DC2626",
  redPale: "#FEE2E2",
  amber: "#D97706",
  amberPale: "#FEF3C7",
  slate: "#64748B",
  bg: "#F5F6FA",
  card: "#FFFFFF",
  border: "#E9EBF0",
};

const STATUS_COLORS = {
  completed: { bg: T.greenPale, color: T.green },
  new: { bg: T.greenPale, color: T.green },
  pending: { bg: T.amberPale, color: T.amber },
  overdue: { bg: T.redPale, color: T.red },
  paid: { bg: T.tealPale, color: T.teal },
  unpaid: { bg: T.redPale, color: T.red },
  cancelled: { bg: "#F1F5F9" },
};
const getStatusStyle = (s) => STATUS_COLORS[s?.toLowerCase()] || STATUS_COLORS.pending;
const CAT_COLORS = [T.orange, T.navy, T.teal, T.purple, "#F43F5E", "#10B981"];

const cardSx = {
  borderRadius: "12px",
  boxShadow: "0 1px 4px rgba(0,0,0,.06)",
};
const thSx = { bgcolor: "#FAFBFF", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `1px solid ${T.border}`, py: 1 };
const tdSx = { fontSize: "0.8rem", color: "#1A2332", borderBottom: `1px solid ${T.border}`, py: 1 };

const PERIOD_OPTIONS = [
  { code: "1D", label: "Today" },
  { code: "1W", label: "Weekly" },
  { code: "1M", label: "Monthly" },
  { code: "3M", label: "3 Months" },
  { code: "6M", label: "6 Months" },
  { code: "All", label: "All Time" },
];
 
const SkeletonRows = ({ count = 5, cols = 3, opacity = 0.25 }) =>
  Array.from({ length: count }).map((_, i) => (
    <TableRow key={`sk-${i}`}>
      <TableCell colSpan={cols} sx={{ borderBottom: `1px solid ${T.border}`, py: 1.1 }}>
        <Box
          sx={{
            height: 11,
            borderRadius: 1,
            bgcolor: T.border,
            opacity,
            width: `${50 + ((i * 17) % 45)}%`,
          }}
        />
      </TableCell>
    </TableRow>
  ));

 
const SkeletonCustomerRows = ({ count = 5 }) =>
  Array.from({ length: count }).map((_, i) => (
    <Stack key={`sck-${i}`} direction="row" justifyContent="space-between" alignItems="center" sx={{ opacity: 0.25 }}>
      <Stack direction="row" alignItems="center" spacing={1.2}>
        <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: T.border }} />
        <Box>
          <Box sx={{ height: 10, borderRadius: 1, bgcolor: T.border, mb: 0.5, width: `${55 + i * 10}px` }} />
          <Box sx={{ height: 8, borderRadius: 1, bgcolor: T.border, width: 70 }} />
        </Box>
      </Stack>
      <Box sx={{ height: 10, borderRadius: 1, bgcolor: T.border, width: 48 }} />
    </Stack>
  ));

 
const PeriodPills = ({ active, onChange }) => (
  <ToggleButtonGroup
    value={active}
    exclusive
    onChange={(e, value) => value && onChange(value)}
    size="small"
    sx={{
      backgroundColor: "#f3f4f6",
      borderRadius: "8px",
      padding: "2px",
      "& .MuiToggleButton-root": {
        border: "none", px: 1.5, py: 0.5,
        fontSize: "0.75rem", fontWeight: 600, textTransform: "none",
        color: "#334155", borderRadius: "6px",
      },
      "& .Mui-selected": { backgroundColor: "#fb923c !important", color: "#fff !important" },
      "& .MuiToggleButton-root:hover": { backgroundColor: "#fde68a" },
    }}
  >
    {PERIOD_OPTIONS.map(({ code }) => (
      <ToggleButton key={code} value={code}>{code}</ToggleButton>
    ))}
  </ToggleButtonGroup>
);

 
const PeriodDropdown = ({ active, onChange }) => {
  const [anchor, setAnchor] = useState(null);
  const current = PERIOD_OPTIONS.find(o => o.code === active) || PERIOD_OPTIONS[1];
  return (
    <>
      <Box
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          px: 1, py: 0.4, border: `1px solid ${T.border}`, borderRadius: 1.5,
          fontSize: "0.7rem", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 0.3,
          "&:hover": { bgcolor: T.orangePale },
        }}
      >
        {current.label} <KeyboardArrowDown sx={{ fontSize: 13 }} />
      </Box>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{ sx: { borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,.08)", border: `1px solid ${T.border}`, minWidth: 130 } }}
      >
        {PERIOD_OPTIONS.map(({ code, label }) => (
          <MenuItem
            key={code}
            selected={active === code}
            onClick={() => { onChange(code); setAnchor(null); }}
            sx={{ fontSize: "0.78rem", color: active === code ? T.orange : "#1A2332", fontWeight: active === code ? 700 : 400, "&.Mui-selected": { bgcolor: T.orangePale } }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

 
const SectionTitle = ({ children, action }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box sx={{ width: 3, height: 16, borderRadius: 2, bgcolor: T.orange }} />
      <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: "#1A2332" }}>{children}</Typography>
    </Stack>
    {action}
  </Stack>
);

const ViewAllBtn = () => (
  <Button size="small" endIcon={<OpenInNew sx={{ fontSize: 11 }} />}
    sx={{ fontSize: "0.72rem", color: T.orange, textTransform: "none", p: 0, minWidth: 0, fontWeight: 600, "&:hover": { bgcolor: "transparent", textDecoration: "underline" } }}>
    View All
  </Button>
);

const TrendPill = ({ trend, change, light }) => (
  <Stack direction="row" alignItems="center" spacing={0.3}
    sx={{
      px: 0.8, py: 0.2, borderRadius: 10, display: "inline-flex",
      bgcolor: light ? "rgba(255,255,255,.2)" : (trend === "up" ? T.greenPale : T.redPale)
    }}>
    {trend === "up"
      ? <ArrowUpward sx={{ fontSize: 11, color: light ? "#fff" : T.green }} />
      : <ArrowDownward sx={{ fontSize: 11, color: light ? "#fff" : T.red }} />}
    <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: light ? "#fff" : (trend === "up" ? T.green : T.red) }}>
      {Math.abs(change).toFixed(1)}%
    </Typography>
  </Stack>
);

// Defined OUTSIDE main component to avoid remounting
const ScrollChart = ({ children, count }) => (
  <Box sx={{ overflowX: count > 14 ? "auto" : "hidden", "&::-webkit-scrollbar": { height: 5 }, "&::-webkit-scrollbar-track": { bgcolor: "#F8F9FA", borderRadius: 10 }, "&::-webkit-scrollbar-thumb": { bgcolor: T.orangeLight, borderRadius: 10, "&:hover": { bgcolor: T.orange } } }}>
    <Box sx={{ minWidth: count > 14 ? Math.max(count * 58, 700) : "100%", width: count > 14 ? Math.max(count * 58, 700) : "100%" }}>
      {children}
    </Box>
  </Box>
);

// ─── Loading bar — always occupies space, visible only when loading ────────────
const StableProgress = ({ loading }) => (
  <LinearProgress
    sx={{
      borderRadius: 4,
      bgcolor: T.orangePale,
      "& .MuiLinearProgress-bar": { bgcolor: T.orange },
      mb: 1,
      visibility: loading ? "visible" : "hidden",
    }}
  />
);

const TX_TABS = [
  { key: "sale", label: "Sale" },
  { key: "purchase", label: "Purchase" },
  { key: "quotation", label: "Quotation" },
  { key: "expense", label: "Expenses" },
  { key: "invoice", label: "Invoice" },
];


export default function Dashboard() {
  const { language, user } = useAuth();
  const { t } = translateLauguage(language);
  const savedStoreId = localStorage.getItem("activeShopId");

   
  const [period, setPeriod] = useState("month");
  const [customStart, setCustomStart] = useState(null);
  const [customEnd, setCustomEnd] = useState(null);

  
  const [spPeriod, setSpPeriod] = useState("1M");
  const [statsPeriod, setStatsPeriod] = useState("1M");

 
  const [txTab, setTxTab] = useState("sale");
  const [txPeriod, setTxPeriod] = useState("1M");

 
  const [bottomPeriod, setBottomPeriod] = useState("1W");

 
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

  const { data: spData, loading: spLoading } = useQuery(GET_CHART_DATA, {
    variables: { shopId: savedStoreId, period: spPeriod },
    fetchPolicy: "cache-and-network",
  });

  const { data: statsData, loading: statsLoading } = useQuery(GET_CHART_DATA, {
    variables: { shopId: savedStoreId, period: statsPeriod },
    fetchPolicy: "cache-and-network",
  });

  const { data: txData, loading: txLoading } = useQuery(GET_RECENT_TRANSACTIONS_BY_TYPE, {
    variables: { shopId: savedStoreId, txType: txTab, period: txPeriod, page: 1, limit: 8 },
    fetchPolicy: "cache-and-network",
  });

  const { data: bottomData, loading: bottomLoading } = useQuery(GET_ORDER_CATEGORY_STATS, {
    variables: { shopId: savedStoreId, period: bottomPeriod },
    fetchPolicy: "cache-and-network",
  });
 
  const dashboard = data?.getFullDashboard;
  const overview = dashboard?.overview || {};
  const overallInfo = dashboard?.overallInfo || { suppliers: 0, customers: 0, orders: 0 };
  const custOverview = dashboard?.customerOverview || { firstTime: 0, return: 0, firstTimePercent: 0, returnPercent: 0 };
  const topSelling = dashboard?.topSellingProducts || [];
  const lowStock = dashboard?.lowStockProducts || [];
  const recentSales = dashboard?.recentSales || [];
  const topCustomers = dashboard?.topCustomers || [];

  const spChart = spData?.getChartData || { labels: [], sales: [], purchases: [] };
  const statsChart = statsData?.getChartData || { labels: [], sales: [], purchases: [] };
  const recentTx = txData?.getRecentTransactionsByType?.items || [];

  const bottomStats = bottomData?.getOrderCategoryStats;
  const topCategories = bottomStats?.topCategories || [];
  const catStats = bottomStats?.categoryStatistics || { totalCategories: 0, totalProducts: 0 };
  const orderStats = {
    labels: bottomStats?.orderLabels || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: bottomStats?.orderValues || [0, 0, 0, 0, 0, 0, 0],
  };

  const filterLabel = { today: "Today", week: "Week", month: "Month", year: "Year", custom: "Custom" }[period] || period;

   
  const commonChartBase = { toolbar: { show: false }, background: "transparent", fontFamily: "inherit" };

  const makeBarOpts = (chartData, stacked = false) => {
    const count = chartData.labels.length;
    return {
      chart: { ...commonChartBase, type: "bar", stacked },
      colors: [T.orange, T.teal],
      plotOptions: { bar: { borderRadius: stacked ? 0 : 3, columnWidth: count > 20 ? "78%" : (stacked ? "55%" : "48%"), dataLabels: { position: "top" } } },
      dataLabels: { enabled: false },
      stroke: { show: !stacked, width: 2, colors: ["transparent"] },
      grid: { borderColor: "#F0F2F8", strokeDashArray: 3, xaxis: { lines: { show: false } } },
      xaxis: {
        categories: chartData.labels.length > 0 ? chartData.labels : ["—"],
        axisBorder: { show: false }, axisTicks: { show: false },
        labels: { style: { colors: T.slate, fontSize: "11px" }, rotate: count > 20 ? -45 : 0, rotateAlways: count > 20 },
      },
      yaxis: { labels: { formatter: (v) => `$${(v / 1000).toFixed(0)}K`, style: { colors: T.slate, fontSize: "11px" } } },
      tooltip: { theme: "light", y: { formatter: formatCurrency } },
      legend: { position: "top", horizontalAlign: "left", markers: { width: 10, height: 10, radius: 2 }, labels: { colors: "#1A2332" }, fontSize: "12px" },
      fill: { opacity: 1 },
      noData: { text: "No data available", align: "center", verticalAlign: "middle", style: { color: T.slate, fontSize: "13px" } },
    };
  };

  const customerDonutOpts = {
    chart: { ...commonChartBase, type: "donut" },
    labels: [t("first_time") || "First Time", t("return") || "Return"],
    colors: [T.orange, T.navy],
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: "72%", labels: { show: true, total: { show: true, label: "Total", fontSize: "12px", formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString() } } } } },
    stroke: { width: 0 },
    tooltip: { y: { formatter: (v) => `${v.toLocaleString()} customers` } },
    noData: { text: "No data", align: "center", verticalAlign: "middle", style: { color: T.slate, fontSize: "12px" } },
  };

  const categoryDonutOpts = {
    chart: { ...commonChartBase, type: "donut" },
    labels: topCategories.length > 0 ? topCategories.map((c) => c.name) : ["No Data"],
    colors: topCategories.length > 0 ? CAT_COLORS : [T.border],
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: "65%" } } },
    stroke: { width: 0 },
    tooltip: { y: { formatter: formatCurrency } },
  };

  const orderStatsOpts = {
    chart: { ...commonChartBase, type: "bar" },
    colors: [T.orangeLight],
    plotOptions: { bar: { horizontal: true, borderRadius: 3, barHeight: "55%" } },
    dataLabels: { enabled: false },
    grid: { borderColor: "#F0F2F8", strokeDashArray: 3, xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
    xaxis: { categories: orderStats.labels, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: T.slate, fontSize: "11px" } } },
    yaxis: { labels: { style: { colors: T.slate, fontSize: "11px" } } },
    tooltip: { theme: "light" },
    fill: { type: "gradient", gradient: { shade: "light", gradientToColors: [T.orange], shadeIntensity: 0.4, type: "horizontal", opacityFrom: 0.85, opacityTo: 1 } },
    noData: { text: "No data available", align: "center", verticalAlign: "middle", style: { color: T.slate, fontSize: "13px" } },
  };

 
  const handlePeriodChange = (p) => {
    setPeriod(p);
    if (p !== "custom") refetch({ shopId: savedStoreId, period: p, startDate: null, endDate: null });
  };
  const applyCustomRange = () => {
    if (customStart && customEnd)
      refetch({ shopId: savedStoreId, period: "customRange", startDate: customStart.format("YYYY-MM-DD"), endDate: customEnd.format("YYYY-MM-DD") });
  };
  const handlePrint = () => setTimeout(() => window.print(), 80);

 
  const printData = useMemo(() => {
    const companyName = user?.companyName || user?.shopName || "Smart Market";
    const phone = user?.phone || "(000) 000-0000";
    const email = user?.email || "support@smartmarket.com";
    const address = user?.address || "Phnom Penh, Cambodia";
    const invoiceNumber = `DASH-${dayjs().format("YYYYMMDD")}-${String(savedStoreId || "ALL").slice(-4).toUpperCase()}`;
    const periodText = period === "custom" && customStart && customEnd
      ? `${formatDateLong(customStart)} – ${formatDateLong(customEnd)}`
      : filterLabel;
    const summaryRows = [
      ["Total Sales", formatCurrency(overview.totalSales?.value || 0), `${(overview.totalSales?.percentageChange || 0).toFixed(1)}%`],
      ["Total Sales Return", formatCurrency(overview.totalSalesReturn?.value || 0), `${(overview.totalSalesReturn?.percentageChange || 0).toFixed(1)}%`],
      ["Total Purchase", formatCurrency(overview.totalPurchase?.value || 0), `${(overview.totalPurchase?.percentageChange || 0).toFixed(1)}%`],
      ["Total Purchase Return", formatCurrency(overview.totalPurchaseReturn?.value || 0), `${(overview.totalPurchaseReturn?.percentageChange || 0).toFixed(1)}%`],
      ["Profit", formatCurrency(overview.profit?.value || 0), `${(overview.profit?.percentageChange || 0).toFixed(1)}%`],
      ["Invoice Due", formatCurrency(overview.invoiceDue?.value || 0), `${(overview.invoiceDue?.percentageChange || 0).toFixed(1)}%`],
      ["Total Expenses", formatCurrency(overview.totalExpenses?.value || 0), `${(overview.totalExpenses?.percentageChange || 0).toFixed(1)}%`],
      ["Payment Returns", formatCurrency(overview.totalPaymentReturns?.value || 0), `${(overview.totalPaymentReturns?.percentageChange || 0).toFixed(1)}%`],
    ];
    const chartRows = spChart.labels.map((l, i) => [l, formatCurrency(spChart.sales[i]), formatCurrency(spChart.purchases[i])]);
    const infoRows = [["Suppliers", overallInfo.suppliers], ["Customers", overallInfo.customers], ["Orders", overallInfo.orders]];
    const custRows = [["First Time", custOverview.firstTime, `${custOverview.firstTimePercent.toFixed(1)}%`], ["Return", custOverview.return, `${custOverview.returnPercent.toFixed(1)}%`]];
    const topProdRows = topSelling.map(p => [p.productName, p.sales, formatCurrency(p.revenue)]);
    const lowStockRows = lowStock.map(p => [p.productName, p.stock, p.minStock]);
    const rSalesRows = recentSales.map(s => [s.productName, s.category, formatCurrency(s.amount), formatDateLong(s.date)]);
    const rTxRows = recentTx.map(tx => [formatDateLong(tx.date), tx.customer, tx.quantity, formatCurrency(tx.price), tx.status, formatCurrency(tx.total)]);
    const topCustRows = topCustomers.map(c => [c.name, c.country || "-", c.orders, formatCurrency(c.totalSpent)]);
    const topCatRows = topCategories.map(c => [c.name, formatCurrency(c.salesAmount)]);
    const orderRows = orderStats.labels.map((l, i) => [l, orderStats.values[i]]);
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
    const wb = new ExcelJS.Workbook();
    const C = { blue: "FFF97316", dark: "FFEA6C10", white: "FFFFFFFF", bdr: "FFE9EBF0" };
    const tb = { top: { style: "thin", color: { argb: C.bdr } }, left: { style: "thin", color: { argb: C.bdr } }, bottom: { style: "thin", color: { argb: C.bdr } }, right: { style: "thin", color: { argb: C.bdr } } };
    const hs = { font: { name: "Calibri", size: 11, bold: true, color: { argb: C.white } }, fill: { type: "pattern", pattern: "solid", fgColor: { argb: C.blue } }, alignment: { horizontal: "center", vertical: "middle" }, border: tb };
    const addSheet = (name, title, headers, rows) => {
      const ws = wb.addWorksheet(name);
      ws.addRow([title]).font = { size: 14, bold: true, color: { argb: C.dark } };
      ws.addRow([]);
      const hr = ws.addRow(headers);
      hr.eachCell(c => { c.font = hs.font; c.fill = hs.fill; c.alignment = hs.alignment; c.border = hs.border; });
      rows.forEach(r => { const dr = ws.addRow(r); dr.eachCell((c, col) => { c.border = tb; c.alignment = { vertical: "middle", horizontal: col === 1 ? "left" : "right" }; }); });
      ws.autoFilter = { from: { row: hr.number, column: 1 }, to: { row: hr.number, column: headers.length } };
    };
    addSheet("Summary", "Dashboard Summary", ["Metric", "Value", "Change"], printData.summaryRows);
    if (printData.hasChart) addSheet("Sales & Purchase", "Sales vs Purchase", ["Period", "Sales", "Purchases"], printData.chartRows);
    addSheet("Overall Info", "Overall Information", ["Metric", "Count"], printData.infoRows);
    addSheet("Customer Overview", "Customer Overview", ["Type", "Count", "Percentage"], printData.custRows);
    if (printData.hasTopProd) addSheet("Top Products", "Top Selling Products", ["Product", "Sales", "Revenue"], printData.topProdRows);
    if (printData.hasLowStock) addSheet("Low Stock", "Low Stock Products", ["Product", "Stock", "Min Stock"], printData.lowStockRows);
    if (printData.hasRSales) addSheet("Recent Sales", "Recent Sales", ["Product", "Category", "Amount", "Date"], printData.rSalesRows);
    if (printData.hasRTx) addSheet("Transactions", "Recent Transactions", ["Date", "Customer", "Qty", "Price", "Status", "Total"], printData.rTxRows);
    if (printData.hasTopCust) addSheet("Top Customers", "Top Customers", ["Name", "Country", "Orders", "Total Spent"], printData.topCustRows);
    if (printData.hasTopCat) addSheet("Top Categories", "Top Categories", ["Category", "Sales Amount"], printData.topCatRows);
    addSheet("Order Stats", "Order Statistics", ["Label", "Orders"], printData.orderRows);
    addSheet("Category Stats", "Category Statistics", ["Metric", "Count"], printData.catStatRows);
    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `dashboard_${period}_${formatFileDate()}.xlsx`);
  };

  if (loading && !dashboard) return (
    <Box sx={{ p: 4 }}>
      <LinearProgress sx={{ borderRadius: 4, bgcolor: T.orangePale, "& .MuiLinearProgress-bar": { bgcolor: T.orange } }} />
      <Typography sx={{ mt: 2, fontSize: "0.875rem" }}>{t("loading") || "Loading..."}</Typography>
    </Box>
  );
  if (error) return <ErrorPage t={t} error={error} refetch={refetch} />;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <style>{`@media print{@page{size:A4 portrait;margin:1.2cm 0.8cm;}body *{visibility:hidden;}#pdr,#pdr *{visibility:visible;}#pdr{position:fixed;left:0;top:0;width:100%;background:#f5f6fa;}thead{display:table-header-group;}}`}</style>

      <Box sx={{ width: "100%", minHeight: "100vh", pb: 5 }}>
        <Box sx={{ "@media print": { display: "none" } }}>


          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box textAlign="start">
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
          </Stack>
          <Box

            mt={5}
          >
            {/* ── Global period filter ──────────────────────────────────────── */}
            <Grid container spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField select fullWidth size="small" label={t("period") || "Period"} value={period} onChange={(e) => handlePeriodChange(e.target.value)}>
                  <MenuItem value="today">{t("today") || "Today"}</MenuItem>
                  <MenuItem value="week">{t("week") || "Week"}</MenuItem>
                  <MenuItem value="month">{t("month") || "Month"}</MenuItem>
                  <MenuItem value="year">{t("year") || "Year"}</MenuItem>
                  <MenuItem value="custom">{t("custom_range") || "Custom Range"}</MenuItem>
                </TextField>
              </Grid>
              {period === "custom" && (
                <>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <DatePicker label={t("start_date")} value={customStart} onChange={setCustomStart}
                      slotProps={{ textField: { size: "small", fullWidth: true, sx: { "& .MuiOutlinedInput-root": { borderRadius: 2, "&.Mui-focused fieldset": { borderColor: T.orange } } } } }} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <DatePicker label={t("end_date")} value={customEnd} onChange={setCustomEnd}
                      slotProps={{ textField: { size: "small", fullWidth: true, sx: { "& .MuiOutlinedInput-root": { borderRadius: 2, "&.Mui-focused fieldset": { borderColor: T.orange } } } } }} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <Button variant="contained" onClick={applyCustomRange} disabled={!customStart || !customEnd}
                      sx={{ bgcolor: T.orange, borderRadius: 2, textTransform: "none", fontWeight: 600, height: 36, "&:hover": { bgcolor: "#EA6C10" } }}>
                      {t("apply") || "Apply"}
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>

            {/* ── Top 4 colored banner cards ────────────────────────────────── */}
            <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
              {[
                { title: t("total_sales") || "Total Sales", value: overview.totalSales?.value || 0, change: overview.totalSales?.percentageChange || 0, trend: overview.totalSales?.trend || "up", bg: T.orange },
                { title: t("total_sale_return") || "Total Sales Return", value: overview.totalSalesReturn?.value || 0, change: overview.totalSalesReturn?.percentageChange || 0, trend: overview.totalSalesReturn?.trend || "down", bg: T.navyMid },
                { title: t("total_purchase") || "Total Purchase", value: overview.totalPurchase?.value || 0, change: overview.totalPurchase?.percentageChange || 0, trend: overview.totalPurchase?.trend || "up", bg: T.teal },
                { title: t("total_purchase_return") || "Total Purchase Return", value: overview.totalPurchaseReturn?.value || 0, change: overview.totalPurchaseReturn?.percentageChange || 0, trend: overview.totalPurchaseReturn?.trend || "up", bg: T.purple },
              ].map((card, idx) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                  <Box sx={{ bgcolor: card.bg, borderRadius: "12px", px: 2.5, py: 2, position: "relative", overflow: "hidden", minHeight: 76 }}>
                    <Box sx={{ position: "absolute", right: -18, top: -18, width: 72, height: 72, borderRadius: "50%", bgcolor: "rgba(255,255,255,.1)" }} />
                    <Box sx={{ position: "absolute", right: 18, bottom: -28, width: 52, height: 52, borderRadius: "50%", bgcolor: "rgba(255,255,255,.07)" }} />
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
                      <Box>
                        <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,.8)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", mb: 0.5 }}>{card.title}</Typography>
                        <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{formatCurrency(card.value)}</Typography>
                      </Box>
                      <TrendPill trend={card.trend} change={card.change} light />
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* ── Secondary white stat cards ────────────────────────────────── */}
            <Grid container spacing={1.5} sx={{ mb: 2 }}>
              {[
                { title: t("profit") || "Profit", value: overview.profit?.value || 0, change: overview.profit?.percentageChange || 0, trend: overview.profit?.trend || "up", icon: <TrendingUp sx={{ fontSize: 18, color: T.orange }} />, iconBg: T.orangePale },
                { title: t("invoice_due") || "Invoice Due", value: overview.invoiceDue?.value || 0, change: overview.invoiceDue?.percentageChange || 0, trend: overview.invoiceDue?.trend || "up", icon: <Receipt sx={{ fontSize: 18, color: T.purple }} />, iconBg: T.purplePale },
                { title: t("total_expenses") || "Total Expenses", value: overview.totalExpenses?.value || 0, change: overview.totalExpenses?.percentageChange || 0, trend: overview.totalExpenses?.trend || "up", icon: <AttachMoney sx={{ fontSize: 18, color: T.teal }} />, iconBg: T.tealPale },
                { title: t("total_payment_returns") || "Payment Returns", value: overview.totalPaymentReturns?.value || 0, change: overview.totalPaymentReturns?.percentageChange || 0, trend: overview.totalPaymentReturns?.trend || "down", icon: <MonetizationOn sx={{ fontSize: 18, color: T.navy }} />, iconBg: "#EEF2FF" },
              ].map((card, idx) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                  <Card>
                    <CardContent sx={{ py: "14px !important", px: "16px !important" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.3 }}>{card.title}</Typography>
                          <Typography sx={{ fontSize: "1.15rem", fontWeight: 800, mb: 0.6 }}>{formatCurrency(card.value)}</Typography>
                          <Stack direction="row" alignItems="center" spacing={0.8}>
                            <TrendPill trend={card.trend} change={card.change} />
                            <Typography sx={{ fontSize: "0.65rem" }}>vs last period</Typography>
                          </Stack>
                        </Box>
                        <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: card.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>{card.icon}</Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* ── Sales & Purchase chart + Overall Info ────────────────────── */}
            <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Card sx={cardSx}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <SectionTitle>{t("sales_purchase") || "Sales & Purchase"}</SectionTitle>
                      <PeriodPills active={spPeriod} onChange={setSpPeriod} />  
                    </Stack>

                    {/* Always-present progress bar — hidden when not loading */}
                    <StableProgress loading={spLoading} />

                    {/* Chart wrapper: always rendered, fades while loading */}
                    <Box sx={{ opacity: spLoading ? 0.35 : 1, transition: "opacity .3s", minHeight: 280 }}>
                      <ScrollChart count={Math.max(spChart.labels.length, 1)}>
                        <Chart
                          options={makeBarOpts(spChart, false)}
                          series={[
                            { name: t("sales") || "Total Sales", data: spChart.sales.length > 0 ? spChart.sales : [0] },
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
                <Card sx={{ ...cardSx, height: "100%" }}>
                  <CardContent>
                    <SectionTitle>{t("overall_info") || "Overall Information"}</SectionTitle>
                    <Grid container sx={{ mb: 2 }}>
                      {[
                        { label: t("suppliers") || "Suppliers", value: overallInfo.suppliers, color: T.teal },
                        { label: t("customers") || "Customers", value: overallInfo.customers, color: T.orange },
                        { label: t("orders") || "Orders", value: overallInfo.orders, color: T.purple },
                      ].map((item, i) => (
                        <Grid size={4} key={i}>
                          <Box sx={{ textAlign: "center", py: 1.5, borderRight: i < 2 ? `1px solid ${T.border}` : "none" }}>
                            <Typography sx={{ fontWeight: 800, fontSize: "1.15rem", color: item.color }}>{item.value.toLocaleString()}</Typography>
                            <Typography sx={{ fontSize: "0.68rem", mt: 0.2 }}>{item.label}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                    <Divider sx={{ borderColor: T.border, mb: 1.5 }} />
                    <Typography sx={{ fontWeight: 700, fontSize: "0.82rem", color: "#1A2332", mb: 1 }}>{t("customer_overview") || "Customers Overview"}</Typography>

                    {/* Fixed-height row so the card never collapses when data is zero */}
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minHeight: 130 }}>
                      <Box sx={{ flexShrink: 0 }}>
                        <Chart
                          options={customerDonutOpts}
                          series={[custOverview.firstTime || 0, custOverview.return || 0]}
                          type="donut" height={130} width={130}
                        />
                      </Box>
                      <Stack spacing={1.2} flex={1}>
                        {[
                          { label: t("first_time") || "First Time", value: custOverview.firstTime, pct: custOverview.firstTimePercent, color: T.orange },
                          { label: t("return") || "Return", value: custOverview.return, pct: custOverview.returnPercent, color: T.navy },
                        ].map((row, i) => (
                          <Box key={i}>
                            <Stack direction="row" justifyContent="space-between" mb={0.3}>
                              <Stack direction="row" alignItems="center" spacing={0.6}>
                                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: row.color }} />
                                <Typography sx={{ fontSize: "0.72rem" }}>{row.label}</Typography>
                              </Stack>
                              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#1A2332" }}>{row.value.toLocaleString()}</Typography>
                            </Stack>
                            <LinearProgress variant="determinate" value={Math.min(row.pct || 0, 100)}
                              sx={{ height: 5, borderRadius: 3, bgcolor: `${row.color}20`, "& .MuiLinearProgress-bar": { bgcolor: row.color, borderRadius: 3 } }} />
                          </Box>
                        ))}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* ── Top Selling + Low Stock ───────────────────────────────────── */}
            <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
              {/* Top Selling Products */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={cardSx}>
                  <CardContent sx={{ pb: "12px !important" }}>
                    <SectionTitle action={<ViewAllBtn />}>{t("top_selling_products") || "Top Selling Products"}</SectionTitle>
                    {/* Fixed minHeight keeps the card the same size whether empty or full */}
                    <TableContainer sx={{ minHeight: 220 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={thSx}>{t("product") || "Product"}</TableCell>
                            <TableCell align="right" sx={thSx}>{t("sales") || "Sales"}</TableCell>
                            <TableCell align="right" sx={thSx}>{t("revenue") || "Revenue"}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {topSelling.length === 0
                            ? <SkeletonRows count={5} cols={3} opacity={loading ? 0.4 : 0.2} />
                            : topSelling.map((item, idx) => (
                              <TableRow key={idx} hover sx={{ "&:last-child td": { border: 0 }, "&:hover": { bgcolor: T.orangePale } }}>
                                <TableCell sx={tdSx}>
                                  <Stack direction="row" alignItems="center" spacing={1.2}>
                                    <Avatar sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: `${T.orange}15`, color: T.orange, fontSize: "0.65rem", fontWeight: 700 }}>{(item.productName || "?")[0]}</Avatar>
                                    <Box>
                                      <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#1A2332", lineHeight: 1.2 }}>{item.productName}</Typography>
                                      <Typography sx={{ fontSize: "0.65rem" }}>${(item.revenue / (item.sales || 1)).toFixed(2)} avg</Typography>
                                    </Box>
                                  </Stack>
                                </TableCell>
                                <TableCell align="right" sx={{ ...tdSx, fontWeight: 600 }}>{item.sales}</TableCell>
                                <TableCell align="right" sx={{ ...tdSx, fontWeight: 700, color: T.orange }}>{formatCurrency(item.revenue)}</TableCell>
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
                <Card sx={cardSx}>
                  <CardContent sx={{ pb: "12px !important" }}>
                    <SectionTitle action={<ViewAllBtn />}>{t("low_stock_products") || "Low Stock Products"}</SectionTitle>
                    <TableContainer sx={{ minHeight: 220 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={thSx}>{t("product") || "Product"}</TableCell>
                            <TableCell sx={thSx}>ID</TableCell>
                            <TableCell align="right" sx={thSx}>{t("stock") || "Stock"}</TableCell>
                            <TableCell align="right" sx={thSx}>{t("min_stock") || "Min"}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {lowStock.length === 0
                            ? <SkeletonRows count={5} cols={4} opacity={loading ? 0.4 : 0.2} />
                            : lowStock.map((item, idx) => (
                              <TableRow key={idx} hover sx={{ "&:last-child td": { border: 0 }, "&:hover": { bgcolor: T.orangePale } }}>
                                <TableCell sx={tdSx}>
                                  <Stack direction="row" alignItems="center" spacing={1.2}>
                                    <Avatar sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: "#F1F5F9", fontSize: "0.65rem" }}>{(item.productName || "?")[0]}</Avatar>
                                    <Typography sx={{ fontSize: "0.78rem", color: "#1A2332" }}>{item.productName}</Typography>
                                  </Stack>
                                </TableCell>
                                <TableCell sx={{ ...tdSx, fontSize: "0.7rem" }}>{item.id || "-"}</TableCell>
                                <TableCell align="right">
                                  <Chip
                                    label={item.stock <= item.minStock ? `Instock: ${item.stock}` : item.stock}
                                    size="small"
                                    sx={{
                                      fontWeight: 700, fontSize: "0.65rem", borderRadius: 6, height: 20,
                                      bgcolor: item.stock <= item.minStock ? T.redPale : T.greenPale,
                                      color: item.stock <= item.minStock ? T.red : T.green,
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="right" sx={{ ...tdSx }}>{item.minStock}</TableCell>
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

            {/* ── Sales Stats (stacked) + Recent Transactions ───────────────── */}
            <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
              {/* Sales Statistics stacked chart */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Card sx={cardSx}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <SectionTitle>{t("sales_stats") || "Sales Statistics"}</SectionTitle>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={0.6}>
                          <Box sx={{ width: 10, height: 10, borderRadius: 2, bgcolor: T.orange }} />
                          <Typography sx={{ fontSize: "0.68rem" }}>{t("sales") || "Revenue"}</Typography>
                          <Typography sx={{ fontSize: "0.78rem", fontWeight: 800, color: T.orange }}>{formatCurrency(overview.totalSales?.value || 0)}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.6}>
                          <Box sx={{ width: 10, height: 10, borderRadius: 2, bgcolor: T.teal }} />
                          <Typography sx={{ fontSize: "0.68rem" }}>{t("purchases") || "Purchase"}</Typography>
                          <Typography sx={{ fontSize: "0.78rem", fontWeight: 800, color: T.teal }}>{formatCurrency(overview.totalPurchase?.value || 0)}</Typography>
                        </Stack>
                      </Stack>
                    </Stack>

                    <Stack direction="row" justifyContent="flex-end" mb={1}>
                      <PeriodPills active={statsPeriod} onChange={setStatsPeriod} />
                    </Stack>

                    <StableProgress loading={statsLoading} />

                    <Box sx={{ opacity: statsLoading ? 0.35 : 1, transition: "opacity .3s", minHeight: 250 }}>
                      <ScrollChart count={Math.max(statsChart.labels.length, 1)}>
                        <Chart
                          options={makeBarOpts(statsChart, true)}
                          series={[
                            { name: t("sales") || "Sales", data: statsChart.sales.length > 0 ? statsChart.sales : [0] },
                            { name: t("purchases") || "Purchase", data: statsChart.purchases.length > 0 ? statsChart.purchases : [0] },
                          ]}
                          type="bar" height={250}
                        />
                      </ScrollChart>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Recent Transactions */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Card sx={{ ...cardSx, height: "100%" }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0}>
                      <SectionTitle>{t("recent_transactions") || "Recent Transactions"}</SectionTitle>
                      <PeriodPills active={txPeriod} onChange={setTxPeriod} />
                    </Stack>

                    {/* Tab bar */}
                    <Stack direction="row" sx={{ borderBottom: `1px solid ${T.border}`, mb: 1.5, overflowX: "auto", "&::-webkit-scrollbar": { display: "none" } }}>
                      {TX_TABS.map((tab) => {
                        const active = txTab === tab.key;
                        return (
                          <Typography
                            key={tab.key}
                            onClick={() => setTxTab(tab.key)}
                            sx={{
                              fontSize: "0.68rem", fontWeight: active ? 700 : 500,
                              color: active ? T.orange : T.slate,
                              pb: 0.8, px: 1,
                              borderBottom: active ? `2px solid ${T.orange}` : "2px solid transparent",
                              cursor: "pointer", whiteSpace: "nowrap",
                              "&:hover": { color: T.orange },
                              transition: "color .15s",
                            }}
                          >
                            {tab.label}
                          </Typography>
                        );
                      })}
                    </Stack>

                    <StableProgress loading={txLoading} />

                    {/* Fixed minHeight keeps card stable across tabs and data states */}
                    <TableContainer sx={{ minHeight: 260 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={thSx}>{t("customer") || "Customer"}</TableCell>
                            <TableCell sx={thSx}>{t("due_date")}</TableCell>
                            <TableCell sx={thSx}>{t("status")}</TableCell>
                            <TableCell align="right" sx={thSx}>{t("amount")}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {txLoading
                            /* Loading: animated skeleton rows */
                            ? <SkeletonRows count={6} cols={4} opacity={0.4} />
                            : recentTx.length === 0
                              /* Empty: ghost skeleton rows so height is preserved */
                              ? <SkeletonRows count={6} cols={4} opacity={0.18} />
                              : recentTx.map((item, idx) => {
                                const sc = getStatusStyle(item.status);
                                return (
                                  <TableRow key={idx} hover sx={{ "&:last-child td": { border: 0 }, "&:hover": { bgcolor: T.orangePale } }}>
                                    <TableCell sx={tdSx}>
                                      <Stack direction="row" alignItems="center" spacing={1}>
                                        <Avatar sx={{ width: 24, height: 24, bgcolor: `${CAT_COLORS[idx % CAT_COLORS.length]}20`, color: CAT_COLORS[idx % CAT_COLORS.length], fontSize: "0.6rem", fontWeight: 700 }}>
                                          {(item.customer || "?")[0]}
                                        </Avatar>
                                        <Box>
                                          <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#1A2332", lineHeight: 1.2 }}>{item.customer}</Typography>
                                          <Typography sx={{ fontSize: "0.62rem" }}>#{item.id || idx}</Typography>
                                        </Box>
                                      </Stack>
                                    </TableCell>
                                    <TableCell sx={{ ...tdSx, fontSize: "0.7rem" }}>{formatDateShort(item.date)}</TableCell>
                                    <TableCell>
                                      <Chip label={item.status} size="small" sx={{ fontWeight: 700, fontSize: "0.62rem", borderRadius: 6, height: 18, bgcolor: sc.bg, color: sc.color }} />
                                    </TableCell>
                                    <TableCell align="right" sx={{ ...tdSx, fontWeight: 700 }}>{formatCurrency(item.total)}</TableCell>
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

            {/* ── Top Customers + Top Categories + Order Statistics ─────────── */}
            <Grid container spacing={1.5}>
              {/* Top Customers */}
              <Grid size={{ xs: 12, md: 3 }}>
                <Card sx={{ ...cardSx, height: "100%" }}>
                  <CardContent>
                    <SectionTitle action={<ViewAllBtn />}>{t("top_customers") || "Top Customers"}</SectionTitle>
                    {/* Fixed minHeight + skeleton rows keep card stable when no data */}
                    <Stack spacing={1.8} sx={{ minHeight: 220 }}>
                      {topCustomers.length === 0
                        ? <SkeletonCustomerRows count={5} />
                        : topCustomers.map((item, idx) => (
                          <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" alignItems="center" spacing={1.2}>
                              <Avatar sx={{ width: 34, height: 34, bgcolor: `${CAT_COLORS[idx % CAT_COLORS.length]}18`, color: CAT_COLORS[idx % CAT_COLORS.length], fontSize: "0.72rem", fontWeight: 700 }}>
                                {(item.name || "?")[0]}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#1A2332", lineHeight: 1.2 }}>{item.name}</Typography>
                                <Typography sx={{ fontSize: "0.63rem" }}>{item.country || "-"} · {item.orders} Orders</Typography>
                              </Box>
                            </Stack>
                            <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#1A2332" }}>{formatCurrency(item.totalSpent)}</Typography>
                          </Stack>
                        ))
                      }
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Top Categories */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ ...cardSx, height: "100%" }}>
                  <CardContent>
                    <SectionTitle action={<PeriodDropdown active={bottomPeriod} onChange={setBottomPeriod} />}>
                      {t("top_categories") || "Top Categories"}
                    </SectionTitle>

                    <StableProgress loading={bottomLoading} />

                    {/* Fixed-height row so card height doesn't change while data loads */}
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minHeight: 160 }}>
                      <Box sx={{ flexShrink: 0, opacity: bottomLoading ? 0.35 : 1, transition: "opacity .3s" }}>
                        <Chart
                          options={categoryDonutOpts}
                          series={topCategories.length > 0 ? topCategories.map(c => c.salesAmount) : [1]}
                          type="donut" height={160} width={160}
                        />
                      </Box>
                      <Stack spacing={1.2} flex={1}>
                        {topCategories.length === 0
                          ? Array.from({ length: 4 }).map((_, i) => (
                            <Stack key={i} direction="row" justifyContent="space-between" alignItems="center" sx={{ opacity: 0.2 }}>
                              <Stack direction="row" alignItems="center" spacing={0.7}>
                                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: T.border }} />
                                <Box sx={{ height: 9, borderRadius: 1, bgcolor: T.border, width: `${40 + i * 12}px` }} />
                              </Stack>
                              <Box sx={{ height: 9, borderRadius: 1, bgcolor: T.border, width: 32 }} />
                            </Stack>
                          ))
                          : topCategories.slice(0, 5).map((cat, i) => (
                            <Stack key={i} direction="row" justifyContent="space-between" alignItems="center">
                              <Stack direction="row" alignItems="center" spacing={0.7}>
                                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: CAT_COLORS[i % CAT_COLORS.length] }} />
                                <Typography sx={{ fontSize: "0.72rem" }}>{cat.name}</Typography>
                              </Stack>
                              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#1A2332" }}>{cat.salesAmount?.toLocaleString()}</Typography>
                            </Stack>
                          ))
                        }
                      </Stack>
                    </Stack>

                    <Divider sx={{ my: 1.5, borderColor: T.border }} />
                    <Stack direction="row" justifyContent="space-around">
                      {[
                        { label: t("total_categories") || "Categories", value: catStats.totalCategories },
                        { label: t("total_products") || "Products", value: catStats.totalProducts },
                      ].map((s, i) => (
                        <Box key={i} sx={{ textAlign: "center" }}>
                          <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: "#1A2332" }}>{s.value}</Typography>
                          <Typography sx={{ fontSize: "0.65rem" }}>{s.label}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Order Statistics */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Card sx={{ ...cardSx, height: "100%" }}>
                  <CardContent>
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
 
        <Box id="pdr" sx={{ position: "fixed", left: "-10000px", top: 0, width: "100%", visibility: "hidden", "@media print": { position: "relative", left: 0, top: 0, visibility: "visible" } }}>
          <Box sx={{ bgcolor: "#f5f6fa", p: 2 }}>
            <Box sx={{ bgcolor: T.orange, color: "#fff", p: 2, borderRadius: "8px 8px 0 0" }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" fontWeight={800}>{printData.companyName}</Typography>
                  <Typography variant="caption">{printData.address}<br />{printData.phone}<br />{printData.email}</Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="h5" fontWeight={800}>{t("dashboard") || "Dashboard"}</Typography>
                  <Typography variant="caption"><b>Report #:</b> {printData.invoiceNumber}<br /><b>Date:</b> {printData.invoiceDate}<br /><b>Period:</b> {printData.periodText}</Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>

      </Box>
    </LocalizationProvider>
  );
}