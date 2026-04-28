// ReportPage.js
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TextField,
  Typography,
  Alert,
  Tab,
  Tabs,
  TableBody,
  Card,
  CardContent,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@apollo/client/react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  GET_SALE_REPORT,
  GET_PURCHASE_REPORT,
  GET_INVENTORY_REPORT,
  GET_INVOICE_REPORT,
  GET_SUPPLIER_REPORT,
  GET_SUPPLIER_DUE_REPORT,
  GET_CUSTOMER_REPORT,
  GET_CUSTOMER_DUE_REPORT,
  GET_PRODUCT_REPORT,
  GET_PRODUCT_EXPIRY_REPORT,
  GET_PRODUCT_QUANTITY_ALERT,
  GET_EXPENSE_REPORT,
  GET_INCOME_REPORT,
  GET_TAX_REPORT,
  GET_PROFIT_LOSS_REPORT,
  GET_ANNUAL_REPORT,
} from "../../graphql/queries";
import { useAuth } from "../Context/AuthContext";
import { translateLauguage } from "../function/translate";
import FooterPagination from "../include/FooterPagination";
import EmptyData from "../include/EmptyData";
import CircularIndeterminate from "../include/Loading";

// -------------------- Helper Functions --------------------
const formatCurrency = (value) =>
  value == null
    ? "$0.00"
    : `$${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

const formatDateLong = (value) => {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return "-";
  return value.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateShort = (value) => {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return "-";
  return value.toLocaleDateString("en-US");
};

const formatFileDate = (value = new Date()) => {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return "report";
  return value.toISOString().slice(0, 10);
};

// -------------------- Main Component --------------------
const ReportPage = ({ shopId = null }) => {
  const { language, user } = useAuth();
  const { t } = translateLauguage(language);
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

 
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label: t("sale_report") || "Sale Report", value: "sale" },
    { label: t("purchase_report") || "Purchase Report", value: "purchase" },
    { label: t("inventory_report") || "Inventory Report", value: "inventory" },
    { label: t("invoice_report") || "Invoice Report", value: "invoice" },
    { label: t("supplier_report") || "Supplier Report", value: "supplier" },
    { label: t("supplier_due") || "Supplier Due", value: "supplierDue" },
    { label: t("customer_report") || "Customer Report", value: "customer" },
    { label: t("customer_due") || "Customer Due", value: "customerDue" },
    { label: t("product_report") || "Product Report", value: "product" },
    { label: t("product_expiry") || "Product Expiry", value: "productExpiry" },
    { label: t("product_alert") || "Product Alert", value: "productAlert" },
    { label: t("expense_report") || "Expense Report", value: "expense" },
    { label: t("income_report") || "Income Report", value: "income" },
    { label: t("tax_report") || "Tax Report", value: "tax" },
    { label: t("profit_loss") || "Profit & Loss", value: "pnl" },
    { label: t("annual_report") || "Annual Report", value: "annual" },
  ];

   
  const [dateRange, setDateRange] = useState({ start: thirtyDaysAgo, end: today });
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [daysThreshold, setDaysThreshold] = useState(30);
  const [categoryId, setCategoryId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
 
  const [saleDetailView, setSaleDetailView] = useState("bestSellers");
  const saleDetailOptions = [
    { value: "bestSellers", label: t("best_sellers") || "Best Sellers" },
    { value: "paymentMethod", label: t("sales_by_payment_method") || "Sales by Payment Method" },
    { value: "orderType", label: t("sales_by_order_type") || "Sales by Order Type" },
    { value: "dailySales", label: t("daily_sales") || "Daily Sales" },
    { value: "recentTransactions", label: t("recent_transactions") || "Recent Transactions" },
  ];

 
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination] = useState(true);

 
  useEffect(() => {
    setPage(1);
    setSearchQuery("");
  }, [activeTab, dateRange, selectedYear, categoryId, saleDetailView]);

  
  const getQueryVariables = () => {
    const common = { shopId, page, limit, pagination };
    const currentTab = tabs[activeTab].value;
    switch (currentTab) {
      case "sale":
      case "purchase":
      case "invoice":
      case "customer":
      case "expense":
      case "income":
        return {
          ...common,
          startDate: dateRange.start?.toISOString(),
          endDate: dateRange.end?.toISOString(),
        };
      case "inventory":
        return {
          shopId,
          startDate: dateRange.start?.toISOString(),
          endDate: dateRange.end?.toISOString(),
          page,
          limit,
          pagination,
        };
      case "supplier":
      case "supplierDue":
        return { shopId };
      case "customerDue":
        return { shopId, page, limit, pagination };
      case "product":
        return { shopId, categoryId: categoryId || undefined, page, limit, pagination };
      case "productExpiry":
        return { shopId, daysThreshold, page, limit, pagination };
      case "productAlert":
        return { shopId, page, limit, pagination };
      case "tax":
      case "pnl":
        return {
          shopId,
          startDate: dateRange.start?.toISOString(),
          endDate: dateRange.end?.toISOString(),
        };
      case "annual":
        return { shopId, year: selectedYear };
      default:
        return {};
    }
  };

  const getQuery = () => {
    const currentTab = tabs[activeTab].value;
    switch (currentTab) {
      case "sale": return GET_SALE_REPORT;
      case "purchase": return GET_PURCHASE_REPORT;
      case "inventory": return GET_INVENTORY_REPORT;
      case "invoice": return GET_INVOICE_REPORT;
      case "supplier": return GET_SUPPLIER_REPORT;
      case "supplierDue": return GET_SUPPLIER_DUE_REPORT;
      case "customer": return GET_CUSTOMER_REPORT;
      case "customerDue": return GET_CUSTOMER_DUE_REPORT;
      case "product": return GET_PRODUCT_REPORT;
      case "productExpiry": return GET_PRODUCT_EXPIRY_REPORT;
      case "productAlert": return GET_PRODUCT_QUANTITY_ALERT;
      case "expense": return GET_EXPENSE_REPORT;
      case "income": return GET_INCOME_REPORT;
      case "tax": return GET_TAX_REPORT;
      case "pnl": return GET_PROFIT_LOSS_REPORT;
      case "annual": return GET_ANNUAL_REPORT;
      default: return null;
    }
  };

  const query = getQuery();
  const variables = getQueryVariables();
  const { data, loading, error } = useQuery(query, {
    variables,
    skip: !query,
    fetchPolicy: "network-only",
  });

  const reportData = data?.[Object.keys(data || {})[0]];

 
  const getTableHeaders = () => {
    const currentTab = tabs[activeTab].value;
    if (currentTab === "sale") {
      switch (saleDetailView) {
        case "bestSellers":
          return [t("product") || "Product", t("units_sold") || "Units Sold", t("revenue") || "Revenue"];
        case "paymentMethod":
          return [t("payment_method") || "Payment Method", t("orders_count") || "Orders Count", t("total_amount") || "Total Amount"];
        case "orderType":
          return [t("order_type") || "Order Type", t("orders_count") || "Orders Count", t("total_amount") || "Total Amount"];
        case "dailySales":
          return [t("date") || "Date", t("orders") || "Orders", t("revenue") || "Revenue"];
        case "recentTransactions":
          return [t("transaction_id") || "Transaction ID", t("date") || "Date", t("customer") || "Customer", t("type") || "Type", t("amount") || "Amount", t("status") || "Status"];
        default:
          return [t("product") || "Product", t("units_sold") || "Units Sold", t("revenue") || "Revenue"];
      }
    }
 
    switch (currentTab) {
      case "purchase": return [t("order_#") || "Order #", t("supplier") || "Supplier", t("total_amount") || "Total Amount", t("status") || "Status", t("date") || "Date"];
      case "inventory": return [t("product") || "Product", t("stock") || "Stock", t("unit_cost") || "Unit Cost", t("total_value") || "Total Value"];
      case "invoice": return [t("invoice_#") || "Invoice #", t("customer") || "Customer", t("total") || "Total", t("paid") || "Paid", t("due") || "Due", t("status") || "Status"];
      case "supplier": return [t("supplier") || "Supplier", t("total_orders") || "Total Orders", t("total_purchased") || "Total Purchased", t("last_order_date") || "Last Order Date"];
      case "supplierDue": return [t("supplier") || "Supplier", t("due_amount") || "Due Amount", t("overdue_days") || "Overdue Days"];
      case "customer": return [t("customer") || "Customer", t("phone") || "Phone", t("total_orders") || "Orders", t("total_spent") || "Total Spent"];
      case "customerDue": return [t("customer") || "Customer", t("phone") || "Phone", t("due_amount") || "Due Amount"];
      case "product": return [t("product") || "Product", t("category") || "Category", t("status") || "Status"];
      case "productExpiry": return [t("product") || "Product", t("batch") || "Batch", t("expiry_date") || "Expiry Date", t("stock") || "Stock", t("days_left") || "Days Left"];
      case "productAlert": return [t("product") || "Product", t("current_stock") || "Current Stock", t("min_stock_level") || "Min Stock Level"];
      case "expense": return [t("category") || "Category", t("amount") || "Amount", t("date") || "Date", t("description") || "Description"];
      case "income": return [t("source") || "Source", t("amount") || "Amount", t("date") || "Date", t("description") || "Description"];
      case "tax": return [t("tax_rate") || "Tax Rate", t("taxable_sales") || "Taxable Sales", t("tax_amount") || "Tax Amount"];
      case "pnl": return [t("metric") || "Metric", t("amount") || "Amount"];
      case "annual": return [t("month") || "Month", t("revenue") || "Revenue", t("orders") || "Orders"];
      default: return [];
    }
  };

  const getTableRows = () => {
    const currentTab = tabs[activeTab].value;
    const data = reportData;
    if (!data) return [];

    // Sale Report dynamic rows
    if (currentTab === "sale") {
      switch (saleDetailView) {
        case "bestSellers": {
          const items = data.bestSellers || [];
          return items.map(item => [item.productName, item.totalQuantity, formatCurrency(item.totalRevenue)]);
        }
        case "paymentMethod": {
          const methods = data.salesByPaymentMethod || [];
          return methods.map(m => [m.method, m.count, formatCurrency(m.amount)]);
        }
        case "orderType": {
          const types = data.salesByOrderType || [];
          return types.map(t => [t.type, t.count, formatCurrency(t.amount)]);
        }
        case "dailySales": {
          const days = data.dailySales || [];
          return days.map(d => [formatDateShort(new Date(d.date)), d.orders, formatCurrency(d.revenue)]);
        }
        case "recentTransactions": {
          const transactions = data.recentTransactions || [];
          return transactions.map(tx => [
            tx.id, formatDateShort(new Date(tx.date)), tx.customer, tx.type, formatCurrency(tx.amount), tx.status
          ]);
        }
        default:
          return [];
      }
    }

 
    switch (currentTab) {
      case "purchase": {
        const recent = data.recentPurchases || [];
        return recent.map(p => [p.orderNumber, p.supplierName, formatCurrency(p.totalAmount), p.status, formatDateShort(new Date(p.createdAt))]);
      }
      case "inventory": {
        const items = data.inventoryValuation || [];
        return items.map(i => [i.productName, i.stockQty, formatCurrency(i.unitCost), formatCurrency(i.totalValue)]);
      }
      case "invoice": {
        const invoices = data.invoices || [];
        return invoices.map(inv => [inv.invoiceNumber, inv.customerName, formatCurrency(inv.total), formatCurrency(inv.paid), formatCurrency(inv.due), inv.status]);
      }
      case "supplier": {
        const perf = data.supplierPerformance || [];
        return perf.map(s => [s.supplierName, s.totalOrders, formatCurrency(s.totalPurchased), formatDateShort(new Date(s.lastOrderDate))]);
      }
      case "supplierDue": {
        const dues = data.suppliersWithDue || [];
        return dues.map(d => [d.supplierName, formatCurrency(d.dueAmount), d.overdueDays]);
      }
      case "customer": {
        const customers = data.customers || [];
        return customers.map(c => [c.customerName, c.customerPhone, c.totalOrders, formatCurrency(c.totalSpent)]);
      }
      case "customerDue": {
        const dues = data.customersWithDue || [];
        return dues.map(d => [d.customerName, d.customerPhone, formatCurrency(d.dueAmount)]);
      }
      case "product": {
        const products = data.productList || [];
        return products.map(p => [p.productName, p.category, p.status]);
      }
      case "productExpiry": {
        const expired = data.expiredProducts || [];
        return expired.map(e => [e.productName, e.batchNo, formatDateShort(new Date(e.expiryDate)), e.stock, e.daysUntilExpiry]);
      }
      case "productAlert": {
        const low = data.lowStockProducts || [];
        return low.map(l => [l.productName, l.currentStock, l.minStockLevel]);
      }
      case "expense": {
        const expenses = data.expensesList || [];
        return expenses.map(e => [e.category, formatCurrency(e.amount), formatDateShort(new Date(e.date)), e.description || ""]);
      }
      case "income": {
        const incomes = data.incomesList || [];
        return incomes.map(i => [i.source, formatCurrency(i.amount), formatDateShort(new Date(i.date)), i.description || ""]);
      }
      case "tax": {
        const breakdown = data.taxBreakdown || [];
        return breakdown.map(t => [`${t.taxRate * 100}%`, formatCurrency(t.taxableSales), formatCurrency(t.taxAmount)]);
      }
      case "pnl": {
        const b = data.breakdown || {};
        return [
          [t("sales_revenue") || "Sales Revenue", formatCurrency(b.salesRevenue)],
          [t("other_income") || "Other Income", formatCurrency(b.otherIncome)],
          [t("cost_of_goods_sold") || "Cost of Goods Sold", formatCurrency(b.costOfGoodsSold)],
          [t("gross_profit") || "Gross Profit", formatCurrency(data.grossProfit)],
          [t("operating_expenses") || "Operating Expenses", formatCurrency(data.operatingExpenses)],
          [t("net_profit") || "Net Profit", formatCurrency(data.netProfit)],
          [t("profit_margin") || "Profit Margin", `${data.profitMargin?.toFixed(2)}%`],
        ];
      }
      case "annual": {
        const monthly = [];
        for (let i = 1; i <= 12; i++) {
          const monthName = new Date(data.year, i - 1, 1).toLocaleString("default", { month: "long" });
          monthly.push([monthName, formatCurrency(0), "-"]);
        }
        return monthly;
      }
      default: return [];
    }
  };

 
  const getPaginator = () => {
    const currentTab = tabs[activeTab].value;
    if (!reportData) return null;
    
 
    if (currentTab === "sale") {
      if (saleDetailView === "recentTransactions") {
        return reportData.paginator;
      }
      return null;
    }
    
   
    switch (currentTab) {
      case "purchase": return reportData.paginator;
      case "inventory": return reportData.valuationPaginator;
      case "invoice": return reportData.paginator;
      case "customer": return reportData.paginator;
      case "customerDue": return reportData.paginator;
      case "product": return reportData.paginator;
      case "productExpiry": return reportData.expiredPaginator;
      case "productAlert": return reportData.lowStockPaginator;
      case "expense": return reportData.paginator;
      case "income": return reportData.paginator;
      default: return null;
    }
  };

  const paginator = getPaginator();
 
  const totalPages = paginator?.totalPages && paginator.totalDocs > 0 ? paginator.totalPages : 0;
  const totalDocs = paginator?.totalDocs || 0;

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

 
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const doc = printWindow.document;
    const reportTitle = tabs[activeTab].label;
    const companyName = user?.companyName || user?.shopName || user?.nameEn || "Smart Market";
    const phone = user?.phone || "";
    const email = user?.email || "";
    const address = user?.address || "Phnom Penh, Cambodia";
    const headers = getTableHeaders();
    const rows = getTableRows();
    const totalRevenue = reportData?.totalRevenue || reportData?.totalIncome || 0;
    const generatedDate = formatDateLong(new Date());

    const detailViewLabel = tabs[activeTab].value === "sale"
      ? saleDetailOptions.find(o => o.value === saleDetailView)?.label || ""
      : "";

    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${reportTitle}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          @page { size: A4 portrait; margin: 1.8cm 1.5cm; }
          body {
            font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
            background: white;
            color: #1e293b;
            line-height: 1.5;
          }
          .print-container { max-width: 100%; margin: 0 auto; }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #1f78c9;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .company-info h1 {
            font-size: 28px;
            font-weight: 700;
            color: #1f78c9;
            margin-bottom: 8px;
          }
          .company-info p {
            font-size: 12px;
            color: #475569;
            margin: 2px 0;
          }
          .report-info {
            text-align: right;
          }
          .report-info h2 {
            font-size: 24px;
            font-weight: 600;
            color: #1f78c9;
            margin-bottom: 8px;
          }
          .report-info p {
            font-size: 12px;
            color: #475569;
          }
          .filters {
            background: #f8fafc;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }
          th {
            background: #1f78c9;
            color: white;
            padding: 12px 8px;
            font-weight: 600;
            font-size: 13px;
            text-align: left;
            border: 1px solid #2d6a9f;
          }
          td {
            padding: 10px 8px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 12px;
          }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .totals {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
            padding-top: 12px;
            border-top: 2px solid #1f78c9;
          }
          .totals-box { width: 300px; }
          .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            font-size: 13px;
          }
          .totals-row.total {
            font-weight: 700;
            font-size: 16px;
            border-top: 1px solid #cbd5e1;
            margin-top: 6px;
            padding-top: 8px;
          }
          .footer {
            margin-top: 32px;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
          }
          @media print {
            body { margin: 0; padding: 0; }
            .filters { background: none; border: 1px solid #ddd; }
            th { background: #1f78c9 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="header">
            <div class="company-info">
              <h1>${companyName}</h1>
              <p>${address}</p>
              <p>📞 ${phone} | ✉️ ${email}</p>
            </div>
            <div class="report-info">
              <h2>${reportTitle}</h2>
              ${detailViewLabel ? `<p>${t("view") || "View"}: ${detailViewLabel}</p>` : ""}
              <p>${t("date") || "Date"}: ${generatedDate}</p>
              <p>${t("shop") || "Shop"}: ${shopId || t("all_shops") || "All Shops"}</p>
            </div>
          </div>
          
          <div class="filters">
            <span><strong>${t("period") || "Period"}:</strong> ${formatDateLong(dateRange.start)} - ${formatDateLong(dateRange.end)}</span>
            <span><strong>${t("generated") || "Generated"}:</strong> ${generatedDate}</span>
          </div>
          
          <table>
            <thead>
              <tr>
                ${headers.map(h => `<th>${h}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => `
                <tr>
                  ${row.map((cell, idx) => {
                    const isNumeric = typeof cell === 'string' && cell.startsWith('$');
                    const align = idx === 0 ? 'left' : (isNumeric ? 'right' : 'center');
                    return `<td style="text-align: ${align}">${cell}</td>`;
                  }).join("")}
                </tr>
              `).join("")}
              ${rows.length === 0 ? `<tr><td colspan="${headers.length}" style="text-align:center;">${t("no_data") || "No data available"}</td>` : ""}
            </tbody>
          </table>
          
          ${totalRevenue && tabs[activeTab].value === "sale" && saleDetailView !== "recentTransactions" ? `
          <div class="totals">
            <div class="totals-box">
              <div class="totals-row"><span>${t("total_revenue") || "Total Revenue"}</span><span>${formatCurrency(totalRevenue)}</span></div>
              <div class="totals-row total"><span>${t("grand_total") || "GRAND TOTAL"}</span><span>${formatCurrency(totalRevenue)}</span></div>
            </div>
          </div>
          ` : ""}
          
          <div class="footer">
            <p>${t("thank_you") || "Thank you for choosing"} ${companyName} | ${t("system_generated") || "This report is system generated"}</p>
          </div>
        </div>
      </body>
      </html>
    `);
    doc.close();
    printWindow.print();
  };

 
  const handleExport = async () => {
    if (!reportData) return;
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet(tabs[activeTab].label);
    ws.columns = getTableHeaders().map(() => ({ width: 20 }));
    ws.addRow(getTableHeaders());
    getTableRows().forEach(row => ws.addRow(row));
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `${tabs[activeTab].label}-${formatFileDate()}.xlsx`);
  };

 
  const renderContent = () => {
    if (loading) return <CircularIndeterminate />;
    if (error) return <Alert severity="error" sx={{ my: 2 }}>{t("failed_to_load_report")}: {error.message}</Alert>;
    if (!reportData) return <EmptyData />;

    const rows = getTableRows();
    const headers = getTableHeaders();

    return (
      <>
        {/* Summary Cards for Sale Report (hide when viewing recentTransactions) */}
        {tabs[activeTab].value === "sale" && saleDetailView !== "recentTransactions" && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">{t("total_revenue")}</Typography>
                  <Typography variant="h5" color="primary.main" fontWeight="bold">{formatCurrency(reportData.totalRevenue)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">{t("total_orders")}</Typography>
                  <Typography variant="h5" color="success.main" fontWeight="bold">{reportData.totalSalesCount || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">{t("average_order_value")}</Typography>
                  <Typography variant="h5" color="warning.main" fontWeight="bold">{formatCurrency(reportData.averageOrderValue)}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {tabs[activeTab].value === "pnl" && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">{t("net_profit")}</Typography>
                  <Typography variant="h5" color="primary.main" fontWeight="bold">{formatCurrency(reportData.netProfit)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">{t("profit_margin")}</Typography>
                  <Typography variant="h5" color="success.main" fontWeight="bold">{reportData.profitMargin?.toFixed(2)}%</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Main Table */}
        <TableContainer component={Paper} sx={{ mb: 2, overflowX: "auto", borderRadius: 2 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: "primary.main" }}>
              <TableRow>
                {headers.map((h, idx) => (
                  <TableCell key={idx} sx={{ color: "white", fontWeight: 600, py: 1.5 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            {rows.length > 0 ? (
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow key={i}>
                    {row.map((cell, j) => (
                      <TableCell key={j}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <EmptyData />
            )}
          </Table>
        </TableContainer>

        {/* Pagination - only shown when totalDocs > 0 and totalPages > 0 */}
        {paginator && totalDocs > 0 && totalPages > 0 && (
          <FooterPagination
            totalPages={totalPages}
            totalDocs={totalDocs}
            limit={limit}
            page={page}
            setPage={setPage}
            handleLimit={handleLimitChange}
            Type={tabs[activeTab].value}
          />
        )}
      </>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          thead { display: table-header-group; }
          tr, td, th { break-inside: avoid; }
        }
      `}</style>

      <Box sx={{ width: "100%", maxWidth: "100%", mx: "auto" , px: { xs: 1, sm: 2, md: 0 } }}>
         
        <Box className="no-print">
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} mb={2}>
            <Breadcrumbs aria-label="breadcrumb">
              <Typography variant="h6" sx={{ borderLeft: "3px solid #1D4592", pl: 1.5, fontWeight: 600 }}>{t("reports")}</Typography>
            </Breadcrumbs>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>{t("print")}</Button>
              <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleExport}>{t("export_excel")}</Button>
            </Stack>
          </Stack>

          <Tabs value={activeTab} onChange={(e, newVal) => setActiveTab(newVal)} variant="scrollable" scrollButtons="auto" sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}>
            {tabs.map((tab, idx) => <Tab key={idx} label={tab.label} />)}
          </Tabs>

          <Grid container spacing={2} alignItems="flex-end" textAlign={"left"} sx={{ mb: 3 }}>
            {!["supplier", "supplierDue", "productAlert", "annual"].includes(tabs[activeTab].value) && (
              <>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="body2">{t("start_date")}</Typography>
                  <DatePicker value={dateRange.start} onChange={(newVal) => setDateRange({ ...dateRange, start: newVal })} slotProps={{ textField: { size: "small", fullWidth: true } }} />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="body2">{t("end_date")}</Typography>
                  <DatePicker value={dateRange.end} onChange={(newVal) => setDateRange({ ...dateRange, end: newVal })} slotProps={{ textField: { size: "small", fullWidth: true } }} />
                </Grid>
              </>
            )}
            {tabs[activeTab].value === "annual" && (
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="body2">{t("year")}</Typography>
                <TextField type="number" size="small" fullWidth value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value) || 2025)} />
              </Grid>
            )}
            {tabs[activeTab].value === "productExpiry" && (
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="body2">{t("days_threshold")}</Typography>
                <TextField type="number" size="small" fullWidth value={daysThreshold} onChange={(e) => setDaysThreshold(parseInt(e.target.value) || 30)} />
              </Grid>
            )}
            {tabs[activeTab].value === "product" && (
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="body2">{t("category")}</Typography>
                <TextField size="small" fullWidth placeholder={t("category_id")} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
              </Grid>
            )}
 
            {tabs[activeTab].value === "sale" && (
              <Grid size={{ xs: 12, md: 3 }}>
                   <Typography variant="body2">{t("view")}</Typography>
                <FormControl fullWidth size="small">
                
                  <Select
                    value={saleDetailView}
                    onChange={(e) => setSaleDetailView(e.target.value)}
                     
                  >
                    {saleDetailOptions.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid size={{ xs: 12, md: tabs[activeTab].value === "sale" ? 3 : 3 }}>
              <Typography variant="body2">{t("search")}</Typography>
              <TextField fullWidth size="small" placeholder={t("search")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
            </Grid>
          </Grid>
        </Box>

        {/* Print area */}
        <Box id="print-area" sx={{ display: "none", "@media print": { display: "block" } }} />

        {/* Main content */}
        <Box>
          {renderContent()}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default ReportPage;