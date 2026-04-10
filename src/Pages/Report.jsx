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
  Typography,
  CircularProgress,
  Alert
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { GET_REPORT_STATS } from "../../graphql/queries";
import { useAuth } from "../context/AuthContext";
import { translateLauguage } from "../function/translate";

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

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const formatFileDate = (value = new Date()) => {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return "report";
  return value.toISOString().slice(0, 10);
};

// Helper to detect if a value is numeric or a currency string
const isNumericOrCurrency = (val) => {
  if (val === null || val === undefined) return false;
  if (typeof val === 'number') return true;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[$,]/g, '');
    return !isNaN(parseFloat(cleaned)) && isFinite(cleaned);
  }
  return false;
};

const ReportPage = ({ shopId = null }) => {
  const { language, user } = useAuth();
  const { t } = translateLauguage(language);
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [dateRange, setDateRange] = useState({
    start: thirtyDaysAgo,
    end: today,
  });
  const [reportType, setReportType] = useState("sales");
  const [searchQuery, setSearchQuery] = useState("");
  const [printSection, setPrintSection] = useState("default");

  const { data, loading, error } = useQuery(GET_REPORT_STATS, {
    variables: {
      type: reportType.toUpperCase(),
      shopId,
      startDate: dateRange.start ? dateRange.start.toISOString() : null,
      endDate: dateRange.end ? dateRange.end.toISOString() : null,
    },
  });

  const reportStat = data?.getReportStats;

  const handlePrint = (section = "default") => {
    setPrintSection(section);
    setTimeout(() => {
      window.print();
    }, 80);
  };

  const handleExport = async () => {
    if (!reportStat) return;

    const generatedDate = new Date();
    const invoiceDate = dateRange.end || generatedDate;
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 7);
    const invoiceNumber = `INV-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${String(shopId || "ALL").slice(-4).toUpperCase()}`;
    const companyName =
      user?.companyName || user?.shopName || user?.nameEn || user?.name || "Smart Market";
    const phone = user?.phone || user?.phoneNumber || "(000) 000-0000";
    const email = user?.email || "support@smartmarket.com";
    const address = user?.address || "Phnom Penh, Cambodia";

    let mainTableTitle = "Details";
    let mainHeaders = ["Description", "Quantity", "Unit Price", "Total"];
    let mainRows = [];
    let secondTableTitle = "";
    let secondHeaders = [];
    let secondRows = [];
    let paymentMethod = "Store Payment";
    let notes = [];
    let subtotal = 0;
    let taxRate = 0;

    if (reportType === "sales") {
      const sales = reportStat.sales || {};
      const topProducts = sales.topProducts || [];
      const recentTransactions = sales.recentTransactions || [];

      mainTableTitle = "Top Selling Products";
      mainHeaders = ["Product", "Units Sold", "Unit Price", "Revenue"];
      mainRows = topProducts.map((item) => {
        const qty = toNumber(item.sales);
        const total = toNumber(item.revenue);
        const unit = qty > 0 ? total / qty : 0;
        return [
          item.name || "-",
          qty ? String(qty) : "0",
          formatCurrency(unit),
          formatCurrency(total),
        ];
      });

      secondTableTitle = "Recent Transactions";
      secondHeaders = ["Transaction", "Customer", "Type", "Amount"];
      secondRows = recentTransactions.map((tx) => [
        tx.id || "-",
        tx.customer || "-",
        tx.type || "-",
        formatCurrency(tx.amount),
      ]);

      subtotal = toNumber(sales.totalRevenue);
      taxRate = 0.07;
      paymentMethod = "Sales Collection";
      notes = [
        `Top selling rows: ${topProducts.length}`,
        `Recent transactions: ${recentTransactions.length}`,
        `Printed range: ${formatDateLong(dateRange.start)} - ${formatDateLong(dateRange.end)}`,
      ];
    } else if (reportType === "staff") {
      const staff = reportStat.staff || {};
      const performance = staff.performance || [];
      mainTableTitle = "Staff Performance";
      mainHeaders = ["Staff", "Hours", "Sales / Hour", "Sales"];
      mainRows = performance.map((item) => {
        const hours = toNumber(item.hours);
        const sales = toNumber(item.sales);
        const salesPerHour = hours > 0 ? sales / hours : 0;
        return [
          `${item.nameEn || "-"} (${item.role || "-"})`,
          String(hours),
          formatCurrency(salesPerHour),
          formatCurrency(sales),
        ];
      });
      subtotal = performance.reduce((sum, p) => sum + toNumber(p.sales), 0);
      paymentMethod = "Staff Performance";
      notes = [
        `Total staff: ${staff.totalStaff ?? 0}`,
        `Active staff: ${staff.activeStaff ?? 0}`,
      ];
    } else if (reportType === "inventory") {
      const inventory = reportStat.inventory || {};
      const items = inventory.items || [];
      mainTableTitle = "Inventory Items";
      mainHeaders = ["Item", "Stock", "Unit Price", "Value"];
      mainRows = items.map((item) => {
        const stock = toNumber(item.stock);
        const value = toNumber(item.value);
        const unitPrice = stock > 0 ? value / stock : 0;
        return [
          `${item.name || "-"} (${item.category || "-"})`,
          String(stock),
          formatCurrency(unitPrice),
          formatCurrency(value),
        ];
      });
      subtotal = toNumber(inventory.totalValue);
      paymentMethod = "Inventory Valuation";
      notes = [
        `Total items: ${inventory.totalItems ?? 0}`,
        `Low stock items: ${inventory.lowStockCount ?? 0}`,
      ];
    }

    if (!mainRows.length) {
      mainRows = [["No data available", "-", "-", "-"]];
    }

    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Smart Market";
    workbook.created = new Date();

    const ws = workbook.addWorksheet("Invoice", {
      views: [{ showGridLines: false }],
      properties: { defaultRowHeight: 21 },
    });

    ws.pageSetup = {
      paperSize: 9,
      orientation: "portrait",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: { left: 0.25, right: 0.25, top: 0.25, bottom: 0.25, header: 0, footer: 0 },
    };

    ws.columns = [
      { width: 14 },
      { width: 10 },
      { width: 10 },
      { width: 10 },
      { width: 10 },
      { width: 10 },
      { width: 10 },
      { width: 10 },
      { width: 10 },
      { width: 10 },
      { width: 10 },
      { width: 10 },
    ];

    const C = {
      blue: "FF3F73C7",
      blueDark: "FF2F60B3",
      yellow: "FFF4CC3D",
      light: "FFF2F2F2",
      white: "FFFFFFFF",
      text: "FF1F2A44",
      border: "FFD9DEE8",
    };

    const applyStyle = (cell, style = {}) => {
      if (style.font) cell.font = style.font;
      if (style.fill) cell.fill = style.fill;
      if (style.alignment) cell.alignment = style.alignment;
      if (style.border) cell.border = style.border;
      if (style.numFmt) cell.numFmt = style.numFmt;
    };

    const styleRange = (r1, c1, r2, c2, style = {}) => {
      for (let r = r1; r <= r2; r += 1) {
        for (let c = c1; c <= c2; c += 1) {
          applyStyle(ws.getCell(r, c), style);
        }
      }
    };

    const mergeWrite = (r1, c1, r2, c2, value, style = {}) => {
      ws.mergeCells(r1, c1, r2, c2);
      const cell = ws.getCell(r1, c1);
      cell.value = value;
      applyStyle(cell, style);
      return cell;
    };

    const thinBorder = {
      top: { style: "thin", color: { argb: C.border } },
      left: { style: "thin", color: { argb: C.border } },
      bottom: { style: "thin", color: { argb: C.border } },
      right: { style: "thin", color: { argb: C.border } },
    };

    const blueTopBorder = {
      top: { style: "medium", color: { argb: C.blueDark } },
    };

    const grayFill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: C.light },
    };
    styleRange(1, 1, 58, 12, { fill: grayFill });

    styleRange(1, 1, 6, 12, {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: C.blue },
      },
    });
    styleRange(7, 1, 7, 12, {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: C.yellow },
      },
    });

    mergeWrite(2, 1, 2, 6, companyName, {
      font: { name: "Calibri", size: 18, bold: true, color: { argb: C.white } },
      alignment: { horizontal: "left", vertical: "middle" },
    });
    mergeWrite(3, 1, 3, 6, "cleaning service", {
      font: { name: "Calibri", size: 11, color: { argb: C.white } },
      alignment: { horizontal: "left", vertical: "middle" },
    });
    mergeWrite(4, 1, 4, 6, address, {
      font: { name: "Calibri", size: 10, color: { argb: C.white } },
      alignment: { horizontal: "left", vertical: "middle" },
    });
    mergeWrite(5, 1, 5, 6, phone, {
      font: { name: "Calibri", size: 10, color: { argb: C.white } },
      alignment: { horizontal: "left", vertical: "middle" },
    });
    mergeWrite(6, 1, 6, 6, email, {
      font: { name: "Calibri", size: 10, color: { argb: C.white } },
      alignment: { horizontal: "left", vertical: "middle" },
    });

    mergeWrite(2, 8, 3, 12, "INVOICE", {
      font: { name: "Calibri", size: 44, bold: true, color: { argb: C.yellow } },
      alignment: { horizontal: "right", vertical: "middle" },
    });
    mergeWrite(4, 8, 4, 12, `Invoice Number: ${invoiceNumber}`, {
      font: { name: "Calibri", size: 11, bold: true, color: { argb: C.white } },
      alignment: { horizontal: "right", vertical: "middle" },
    });
    mergeWrite(5, 8, 5, 12, `Invoice Date: ${formatDateLong(invoiceDate)}`, {
      font: { name: "Calibri", size: 11, bold: true, color: { argb: C.white } },
      alignment: { horizontal: "right", vertical: "middle" },
    });
    mergeWrite(6, 8, 6, 12, `Due Date: ${formatDateLong(dueDate)}`, {
      font: { name: "Calibri", size: 11, bold: true, color: { argb: C.white } },
      alignment: { horizontal: "right", vertical: "middle" },
    });

    mergeWrite(9, 2, 9, 4, "Invoice To", {
      font: { name: "Calibri", size: 16, bold: true, color: { argb: C.blueDark } },
      alignment: { horizontal: "center", vertical: "middle" },
    });
    mergeWrite(9, 7, 9, 12, companyName, {
      font: { name: "Calibri", size: 16, bold: true, color: { argb: C.blueDark } },
      alignment: { horizontal: "center", vertical: "middle" },
    });
    mergeWrite(10, 7, 10, 12, address, {
      font: { name: "Calibri", size: 11, color: { argb: C.text } },
      alignment: { horizontal: "center", vertical: "middle" },
    });
    mergeWrite(11, 7, 11, 12, phone, {
      font: { name: "Calibri", size: 11, color: { argb: C.text } },
      alignment: { horizontal: "center", vertical: "middle" },
    });

    const writeSectionTitle = (row, title) => {
      mergeWrite(row, 1, row, 12, title, {
        font: { name: "Calibri", size: 14, bold: true, color: { argb: C.blueDark } },
        alignment: { horizontal: "left", vertical: "middle" },
        border: blueTopBorder,
      });
    };

    const writeFourColumnTable = (startRow, title, headers, rows) => {
      writeSectionTitle(startRow, title);
      const headerRow = startRow + 1;
      const defs = [
        { label: headers?.[0] || "Description", from: 1, to: 5, align: "left" },
        { label: headers?.[1] || "Quantity", from: 6, to: 8, align: "center" },
        { label: headers?.[2] || "Unit Price", from: 9, to: 10, align: "center" },
        { label: headers?.[3] || "Total", from: 11, to: 12, align: "right" },
      ];

      defs.forEach((h) => {
        mergeWrite(headerRow, h.from, headerRow, h.to, h.label, {
          font: { name: "Calibri", size: 13, bold: true, color: { argb: C.white } },
          alignment: { horizontal: h.align, vertical: "middle" },
          fill: { type: "pattern", pattern: "solid", fgColor: { argb: C.blue } },
          border: thinBorder,
        });
      });

      let r = headerRow + 1;
      rows.forEach((row) => {
        const rowDefs = [
          { value: row[0], from: 1, to: 5, align: "left" },
          { value: row[1], from: 6, to: 8, align: "center" },
          { value: row[2], from: 9, to: 10, align: "center" },
          { value: row[3], from: 11, to: 12, align: "right" },
        ];

        rowDefs.forEach((item) => {
          mergeWrite(r, item.from, r, item.to, item.value ?? "-", {
            font: { name: "Calibri", size: 12, color: { argb: C.text } },
            alignment: { horizontal: item.align, vertical: "middle" },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: C.white } },
            border: thinBorder,
          });
        });

        r += 1;
      });

      return r;
    };

    let cursor = writeFourColumnTable(13, mainTableTitle, mainHeaders, mainRows);

    if (secondRows.length) {
      cursor += 1;
      cursor = writeFourColumnTable(cursor, secondTableTitle, secondHeaders, secondRows);
    }

    const totalsStart = cursor + 1;
    mergeWrite(totalsStart, 9, totalsStart, 10, "Sub Total", {
      font: { name: "Calibri", size: 12, bold: true, color: { argb: C.text } },
      alignment: { horizontal: "left", vertical: "middle" },
      border: blueTopBorder,
    });
    mergeWrite(totalsStart, 11, totalsStart, 12, formatCurrency(subtotal), {
      font: { name: "Calibri", size: 12, color: { argb: C.text } },
      alignment: { horizontal: "right", vertical: "middle" },
      border: blueTopBorder,
    });

    mergeWrite(totalsStart + 1, 9, totalsStart + 1, 10, `Tax (${Math.round((taxRate || 0) * 100)}%)`, {
      font: { name: "Calibri", size: 12, bold: true, color: { argb: C.text } },
      alignment: { horizontal: "left", vertical: "middle" },
    });
    mergeWrite(totalsStart + 1, 11, totalsStart + 1, 12, formatCurrency(taxAmount), {
      font: { name: "Calibri", size: 12, color: { argb: C.text } },
      alignment: { horizontal: "right", vertical: "middle" },
    });

    mergeWrite(totalsStart + 2, 9, totalsStart + 2, 10, "TOTAL", {
      font: { name: "Calibri", size: 16, bold: true, color: { argb: C.blueDark } },
      alignment: { horizontal: "left", vertical: "middle" },
      border: {
        top: { style: "medium", color: { argb: C.blueDark } },
        bottom: { style: "medium", color: { argb: C.blueDark } },
      },
    });
    mergeWrite(totalsStart + 2, 11, totalsStart + 2, 12, formatCurrency(totalAmount), {
      font: { name: "Calibri", size: 16, bold: true, color: { argb: C.blueDark } },
      alignment: { horizontal: "right", vertical: "middle" },
      border: {
        top: { style: "medium", color: { argb: C.blueDark } },
        bottom: { style: "medium", color: { argb: C.blueDark } },
      },
    });

    const paymentTitleRow = totalsStart + 4;
    mergeWrite(paymentTitleRow, 1, paymentTitleRow, 12, "Payment Information", {
      font: { name: "Calibri", size: 20, bold: true, color: { argb: C.blueDark } },
      alignment: { horizontal: "center", vertical: "middle" },
      border: blueTopBorder,
    });

    let payRow = paymentTitleRow + 1;
    const paymentRows = [
      ["Payment Method", paymentMethod],
      ["Bank Name", `${companyName} Bank`],
      ["Account Name", `${companyName} Services`],
      ["Account Number", "9876 5432 1234 5678"],
      ["Routing Number", "123456789"],
    ];

    paymentRows.forEach((item) => {
      mergeWrite(payRow, 1, payRow, 5, `${item[0]}:`, {
        font: { name: "Calibri", size: 12, bold: true, color: { argb: C.text } },
        alignment: { horizontal: "right", vertical: "middle" },
      });
      mergeWrite(payRow, 6, payRow, 12, item[1] || "-", {
        font: { name: "Calibri", size: 12, color: { argb: C.text } },
        alignment: { horizontal: "center", vertical: "middle" },
      });
      payRow += 1;
    });

    mergeWrite(payRow + 1, 1, payRow + 1, 12, `Please make checks payable to ${companyName}.`, {
      font: { name: "Calibri", size: 11, color: { argb: C.text } },
      alignment: { horizontal: "center", vertical: "middle" },
    });

    mergeWrite(payRow + 3, 1, payRow + 3, 12, `Thank you for choosing ${companyName} for your service needs.`, {
      font: { name: "Calibri", size: 11, italic: true, color: { argb: C.text } },
      alignment: { horizontal: "center", vertical: "middle" },
      border: blueTopBorder,
    });

    notes.forEach((note, idx) => {
      mergeWrite(payRow + 4 + idx, 1, payRow + 4 + idx, 12, `- ${note}`, {
        font: { name: "Calibri", size: 11, color: { argb: C.text } },
        alignment: { horizontal: "center", vertical: "middle" },
      });
    });

    const bottomYellowRow = Math.max(58, payRow + notes.length + 8);
    const bottomBlueRow = bottomYellowRow + 1;
    styleRange(bottomYellowRow, 1, bottomYellowRow, 12, {
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: C.yellow } },
    });
    styleRange(bottomBlueRow, 1, bottomBlueRow, 12, {
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: C.blue } },
    });

    ws.printArea = `A1:L${bottomBlueRow}`;

    const addDataSheet = (sheetName, headers, rows) => {
      const sh = workbook.addWorksheet(sheetName);
      sh.pageSetup = {
        paperSize: 9,
        orientation: "portrait",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        margins: { left: 0.25, right: 0.25, top: 0.25, bottom: 0.25, header: 0, footer: 0 },
      };
      sh.views = [{ showGridLines: true }];
      sh.columns = (headers || []).map((header, idx) => ({
        header,
        key: `col_${idx}`,
        width: idx === 0 ? 40 : 24,
      }));

      const hdr = sh.getRow(1);
      hdr.height = 24;
      hdr.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: C.white } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.blue } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = thinBorder;
      });

      rows.forEach((row) => {
        const rowDefs = [
          row[0] ?? "-",
          row[1] ?? "-",
          row[2] ?? "-",
          row[3] ?? "-",
        ];
        const dataRow = sh.addRow(rowDefs);
        dataRow.eachCell((cell, col) => {
          cell.border = thinBorder;
          cell.alignment = {
            vertical: "middle",
            horizontal: col === 1 ? "left" : col === 4 ? "right" : "center",
          };
        });
      });

      sh.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: headers.length },
      };
    };

    if (reportType === "sales") {
      addDataSheet("Top Selling Data", mainHeaders, mainRows);
      addDataSheet("Recent Transactions Data", secondHeaders, secondRows);
    } else {
      addDataSheet("Data", mainHeaders, mainRows);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${reportType}-report-${formatFileDate(new Date())}.xlsx`);
  };

  // Custom filter for staff performance (search by nameEn or nameKh)
  const filterStaff = (items, query) => {
    if (!query) return items || [];
    return (items || []).filter(item =>
      (item.nameEn || "").toLowerCase().includes(query.toLowerCase()) ||
      (item.nameKh || "").toLowerCase().includes(query.toLowerCase())
    );
  };

  // Generic filter for other data (uses a single field)
  const filterData = (items, field) => {
    if (!searchQuery || !items) return items || [];
    return items.filter((item) =>
      String(item[field]).toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    const resetPrintSection = () => {
      setPrintSection("default");
    };
    window.addEventListener("afterprint", resetPrintSection);
    return () => {
      window.removeEventListener("afterprint", resetPrintSection);
    };
  }, []);

  const printData = useMemo(() => {
    if (!reportStat) return null;

    const invoiceDate = dateRange.end || new Date();
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 7);

    const invoiceNumber = `INV-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${String(shopId || "ALL").slice(-4).toUpperCase()}`;

    const companyName =
      user?.companyName || user?.shopName || user?.nameEn || user?.name || "Smart Market";
    const phone = user?.phone || user?.phoneNumber || "(000) 000-0000";
    const email = user?.email || "support@smartmarket.com";
    const address = user?.address || "Phnom Penh, Cambodia";

    let tableHeaders = [];
    let tableRows = [];
    let subtotal = 0;
    let paymentMethod = "Store Payment";
    let notes = [];

    if (reportType === "sales") {
      const sales = reportStat.sales || {};
      const products = filterData(sales.topProducts || [], "name");
      const transactions = filterData(sales.recentTransactions || [], "customer");
      const isRecentTransactionsReport = printSection === "recentTransactions";

      if (isRecentTransactionsReport) {
        tableHeaders = ["Transaction", "Customer", "Amount", "Status"];
        tableRows = transactions.map((tx) => [
          tx.id || "-",
          tx.customer || "-",
          formatCurrency(tx.amount),
          tx.status || "-",
        ]);
        subtotal = transactions.reduce((sum, tx) => sum + toNumber(tx.amount), 0);
        paymentMethod = "Transactions Summary";
        notes = [
          `Recent transactions count: ${transactions.length}`,
          `Printed range: ${formatDateLong(dateRange.start)} - ${formatDateLong(dateRange.end)}`,
        ];
      } else {
        tableHeaders = ["Product", "Units Sold", "Revenue"];
        tableRows = products.map((item) => {
          const qty = toNumber(item.sales);
          const total = toNumber(item.revenue);
          return [item.name || "-", qty || "-", formatCurrency(total)];
        });
        subtotal = toNumber(sales.totalRevenue);
        paymentMethod = "Sales Collection";
        notes = [
          `Total orders: ${sales.totalOrders ?? 0}`,
          `Average order value: ${formatCurrency(sales.averageOrderValue)}`,
        ];
      }
    } else if (reportType === "staff") {
      const staff = reportStat.staff || {};
      const performance = filterStaff(staff.performance, searchQuery);
      tableHeaders = ["Staff", "Role", "Hours", "Sales", "Orders"];
      tableRows = performance.map((item) => [
        language === "kh" ? item.nameKh : item.nameEn,
        item.role,
        item.hours || "-",
        item.sales ? formatCurrency(item.sales) : "-",
        item.orders || "-",
      ]);
      subtotal = performance.reduce((sum, p) => sum + toNumber(p.sales), 0);
      paymentMethod = "Staff Performance";
      notes = [
        `Total staff: ${staff.totalStaff ?? 0}`,
        `Active staff: ${staff.activeStaff ?? 0}`,
      ];
    } else if (reportType === "inventory") {
      const inventory = reportStat.inventory || {};
      const items = filterData(inventory.items || [], "name");
      tableHeaders = ["Item", "Category", "Stock", "Reorder Level", "Value"];
      tableRows = items.map((item) => [
        item.name || "-",
        item.category || "-",
        item.stock || "-",
        item.reorderLevel || "-",
        formatCurrency(item.value),
      ]);
      subtotal = toNumber(inventory.totalValue);
      paymentMethod = "Inventory Valuation";
      notes = [
        `Total items: ${inventory.totalItems ?? 0}`,
        `Low stock items: ${inventory.lowStockCount ?? 0}`,
      ];
    }

    const taxRate = reportType === "sales" && printSection !== "recentTransactions" ? 0.07 : 0;
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    const reportLabel =
      reportType === "sales"
        ? printSection === "recentTransactions"
          ? "Recent Transactions Report"
          : "Top Selling Report"
        : `${reportType.charAt(0).toUpperCase()}${reportType.slice(1)} Report`;

    return {
      companyName,
      phone,
      email,
      address,
      invoiceNumber,
      invoiceDate: formatDateLong(invoiceDate),
      dueDate: formatDateLong(dueDate),
      reportLabel,
      tableHeaders,
      tableRows,
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      paymentInfoRows: [
        ["Payment Method", paymentMethod],
        ["Bank Name", `${companyName} Bank`],
        ["Account Name", `${companyName} Services`],
        ["Account Number", "9876 5432 1234 5678"],
        ["Routing Number", "123456789"],
      ],
      notes,
    };
  }, [reportStat, reportType, dateRange.start, dateRange.end, shopId, user, searchQuery, printSection, language]);

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
          {t("failed_to_load_report")}: {error.message}
        </Alert>
      );
    }

    if (!reportStat) return null;

    const { sales, staff, inventory } = reportStat;

    switch (reportType) {
      case "sales":
        if (!sales) return <Typography>{t("no_sale_data_avialble")}</Typography>;
        const filteredTopProducts = filterData(sales.topProducts, "name");
        const filteredRecentTransactions = filterData(sales.recentTransactions, "customer");
        return (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">{t("total_revenue")}</Typography>
                  <Typography variant="h5" fontWeight="600" color="primary.main">
                    {formatCurrency(sales.totalRevenue)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">{t("total_orders")}</Typography>
                  <Typography variant="h5" fontWeight="600" color="success.main">
                    {sales.totalOrders ?? 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">{t("average_orders_value")}</Typography>
                  <Typography variant="h5" fontWeight="600" color="warning.main">
                    {formatCurrency(sales.averageOrderValue)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1}
              sx={{ mt: 4, mb: 2 }}
            >
              <Typography variant="h6" fontWeight="600">
                {t("top_selling_products")}
              </Typography>
              <Button
                size="small"
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={() => handlePrint("default")}
                disabled={!filteredTopProducts.length}
              >
                {t("print")}
              </Button>
            </Stack>
            <TableContainer component={Paper} sx={{ borderRadius: 1, mb: 4, overflowX: "auto" }}>
              <Table sx={{ minWidth: 620 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("product")}</TableCell>
                    <TableCell align="right">{t("unit_sold")}</TableCell>
                    <TableCell align="right">{t("total_revenue")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTopProducts.map((product) => (
                    <TableRow sx={{ borderSpacing: "none" }} key={product.id}>
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

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1}
              sx={{ mt: 4, mb: 2 }}
            >
              <Typography variant="h6" fontWeight="600">
                {t("recent_transactions")}
              </Typography>
              <Button
                size="small"
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={() => handlePrint("recentTransactions")}
                disabled={!filteredRecentTransactions.length}
              >
                {t("print")}
              </Button>
            </Stack>
            <TableContainer component={Paper} sx={{ borderRadius: 1, overflowX: "auto" }}>
              <Table sx={{ minWidth: 680 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("transactions")}</TableCell>
                    <TableCell>{t("customer")}</TableCell>
                    <TableCell align="right">{t("amount")}</TableCell>
                    <TableCell align="center">{t("status")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRecentTransactions.map((tx) => (
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
        if (!staff) return <Typography>{t("no_staff_data_avialble")}</Typography>;
        const filteredStaffPerformance = filterStaff(staff.performance, searchQuery);
        return (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">{t("total_staff")}</Typography>
                  <Typography variant="h5" fontWeight="600" color="primary.main">
                    {staff.totalStaff ?? 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">{t("active_staff")}</Typography>
                  <Typography variant="h5" fontWeight="600" color="success.main">
                    {staff.activeStaff ?? 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">{t("total_hours")}</Typography>
                  <Typography variant="h5" fontWeight="600" color="warning.main">
                    {staff.totalHours ?? 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">{t("sale_staff")}</Typography>
                  <Typography variant="h5" fontWeight="600" color="secondary.main">
                    {formatCurrency(staff.totalSales)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 4, mb: 2 }}
            >
              <Typography variant="h6" fontWeight="600">
                {t("staff_performance")}
              </Typography>
              <Button
                size="small"
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={() => handlePrint("default")}
                disabled={!filteredStaffPerformance.length}
              >
                {t("print")}
              </Button>
            </Stack>
            <TableContainer component={Paper} sx={{ borderRadius: 1, overflowX: "auto" }}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("staff")}</TableCell>
                    <TableCell>{t("role")}</TableCell>
                    <TableCell align="right">{t("hours")}</TableCell>
                    <TableCell align="right">{t("sale")}</TableCell>
                    <TableCell align="right">{t("orders")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStaffPerformance.map((staffMember) => (
                    <TableRow key={staffMember.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {language === "kh" ? staffMember.nameKh : staffMember.nameEn}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {staffMember.role === "admin" && t("admin")}
                        {staffMember.role === "superAdmin" && t("super_admin")}
                        {staffMember.role === "cashier" && t("cashier")}
                        {staffMember.role === "manager" && t("manager")}
                        {staffMember.role === "stockController" && t("stock_controller")}
                      </TableCell>
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
        if (!inventory) return <Typography>{t("no_inventory_data_available")}</Typography>;
        const filteredInventoryItems = filterData(inventory.items, "name");
        return (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">{t("total_items")}</Typography>
                  <Typography variant="h5" fontWeight="600" color="primary.main">
                    {inventory.totalItems ?? 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">{t("low_stock_items")}</Typography>
                  <Typography variant="h5" fontWeight="600" color="error.main">
                    {inventory.lowStockCount ?? 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, textAlign: "center", borderRadius: 1 }}>
                  <Typography color="text.secondary" variant="body2">{t("total_value")}</Typography>
                  <Typography variant="h5" fontWeight="600" color="success.main">
                    {formatCurrency(inventory.totalValue)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 4, mb: 2 }}
            >
              <Typography variant="h6" fontWeight="600">
                {t("inventory_items")}
              </Typography>
              <Button
                size="small"
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={() => handlePrint("default")}
                disabled={!filteredInventoryItems.length}
              >
                {t("print")}
              </Button>
            </Stack>
            <TableContainer component={Paper} sx={{ borderRadius: 1, overflowX: "auto" }}>
              <Table sx={{ minWidth: 720 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("items")}</TableCell>
                    <TableCell>{t("category")}</TableCell>
                    <TableCell align="right">{t("stock")}</TableCell>
                    <TableCell align="right">{t("reorder_level")}</TableCell>
                    <TableCell align="right">{t("value")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInventoryItems.map((item) => {
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
          /* Hide everything except the print root */
          body * {
            visibility: hidden !important;
          }
          #print-report-root,
          #print-report-root * {
            visibility: visible !important;
          }
          #print-report-root {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            overflow: visible;
            background: #f2f2f2;
          }
          /* Table header repeat on each page */
          thead {
            display: table-header-group;
          }
          tr, td, th {
            break-inside: avoid;
          }
        }
      `}</style>

      <Box sx={{ width: "100%", maxWidth: "100%", mx: "auto", mt: 2, px: { xs: 1, sm: 2, md: 0 } }}>
        <Box sx={{ "@media print": { display: "none" } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            mb={3}
          >
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
                {t(`report`)}
              </Typography>
            </Breadcrumbs>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={() => handlePrint("default")}
                sx={{ bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }}
              >
                {t("print")}
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleExport}
                sx={{ bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }}
              >
                {t("export_excel")}
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ mb: 4, borderRadius: 1, textAlign: "left" }}>
            <Grid container spacing={3} alignItems="flex-start">
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth size="small">
                  <Typography id="report-type-label" sx={{ textAlign: "left", mb: 0.5 }}>
                    {t("report_type")}
                  </Typography>
                  <Select
                    labelId="report-type-label"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <MenuItem value="sales">{t("sale")}</MenuItem>
                    <MenuItem value="staff">{t("staff")}</MenuItem>
                    <MenuItem value="inventory">{t("inventory")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <Typography sx={{ textAlign: "left", mb: 0.5 }}>
                  {t("start_date")}
                </Typography>
                <DatePicker
                  value={dateRange.start}
                  onChange={(newValue) =>
                    setDateRange({ ...dateRange, start: newValue })
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <Typography sx={{ textAlign: "left", mb: 0.5 }}>
                  {t("end_date")}
                </Typography>
                <DatePicker
                  value={dateRange.end}
                  onChange={(newValue) =>
                    setDateRange({ ...dateRange, end: newValue })
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <Typography sx={{ textAlign: "left", mb: 0.5 }}>
                  {t("search")}
                </Typography>
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

        {/* Print section */}
        <Box
          id="print-report-root"
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
          {printData && (
            <Box sx={{ bgcolor: "#f2f2f2", width: "100%", maxWidth: "100%", p: 0 }}>
              <Box sx={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
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
                        {t(`invoice`)}
                      </Typography>
                      <Box sx={{ borderTop: "1px solid rgba(255,255,255,.7)", mt: 0.8, pt: 0.8 }}>
                        <Typography sx={{ fontSize: 10.5, color: "#ffff" }}><b>{t("invoice_num")}:</b> {printData.invoiceNumber}</Typography>
                        <Typography sx={{ fontSize: 10.5, color: "#ffff" }}><b>{t("invoice_date")}:</b> {printData.invoiceDate}</Typography>
                        <Typography sx={{ fontSize: 10.5, color: "#ffff" }}><b>{t("due_date")}:</b> {printData.dueDate}</Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>

                <Box sx={{ bgcolor: "#f5c633", height: 9, mb: 1.4 }} />

                <Grid container spacing={1.6} sx={{ px: 1.2, mb: 1.4 }}>
                  <Grid size={{ xs: 4 }}>
                    <Typography sx={{ fontSize: 18, color: "#1f78c9", fontWeight: 700 }}>{t("invoice_to")}</Typography>
                  </Grid>
                  <Grid size={{ xs: 8 }}>
                    <Typography sx={{ fontSize: 16, color: "#1f78c9", fontWeight: 700 }}>{printData.companyName}</Typography>
                    <Typography sx={{ fontSize: 11 }}>{printData.address}</Typography>
                    <Typography sx={{ fontSize: 11 }}>{printData.phone}</Typography>
                  </Grid>
                </Grid>

                <Box sx={{ px: 1.2 }}>
                  <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: "#1f78c9" }}>
                        <TableRow>
                          {printData.tableHeaders.map((header, idx) => (
                            <TableCell
                              key={idx}
                              sx={{ fontWeight: 700, color: "#fff", py: 0.8 }}
                              align={
                                idx === 0
                                  ? "left"
                                  : idx === printData.tableHeaders.length - 1
                                  ? "right"
                                  : "center"
                              }
                            >
                              {header}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {printData.tableRows.map((row, rowIdx) => (
                          <TableRow key={rowIdx}>
                            {row.map((cell, colIdx) => {
                              const isLastColumn = colIdx === row.length - 1;
                              const shouldAlignRight = isLastColumn && isNumericOrCurrency(cell);
                              return (
                                <TableCell
                                  key={colIdx}
                                  sx={{ py: 0.6, fontSize: 10.5 }}
                                  align={colIdx === 0 ? "left" : shouldAlignRight ? "right" : "center"}
                                >
                                  {cell}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                    <Box sx={{ width: 260 }}>
                      <Stack direction="row" justifyContent="space-between" sx={{ borderTop: "2px solid #1f78c9", pt: 0.7 }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 700 }}>{t("subtotal")}</Typography>
                        <Typography sx={{ fontSize: 11 }}>{formatCurrency(printData.subtotal)}</Typography>
                      </Stack>
                      {printData.taxRate > 0 && (
                        <Stack direction="row" justifyContent="space-between" sx={{ pt: 0.2 }}>
                          <Typography sx={{ fontSize: 11, fontWeight: 700 }}>Tax ({Math.round(printData.taxRate * 100)}%)</Typography>
                          <Typography sx={{ fontSize: 11 }}>{formatCurrency(printData.taxAmount)}</Typography>
                        </Stack>
                      )}
                      <Stack direction="row" justifyContent="space-between" sx={{ borderTop: "2px solid #1f78c9", borderBottom: "2px solid #1f78c9", py: 0.5, mt: 0.6 }}>
                        <Typography sx={{ fontSize: 12.5, fontWeight: 800 }}>{t("total")}</Typography>
                        <Typography sx={{ fontSize: 12.5, fontWeight: 800 }}>{formatCurrency(printData.totalAmount)}</Typography>
                      </Stack>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ px: 1.2, mt: 1.1 }}>
                  <Box sx={{ borderTop: "2px solid #1f78c9", pt: 0.7 }}>
                    <Typography sx={{ fontSize: 18, color: "#1f78c9", fontWeight: 700, mb: 0.5 }}>{t("payment_information")}</Typography>
                    {printData.paymentInfoRows.map((row, idx) => (
                      <Stack key={`${row[0]}-${idx}`} direction="row" sx={{ mb: 0.2 }}>
                        <Typography sx={{ width: "40%", fontSize: 10.5, fontWeight: 700 }}>{row[0]}:</Typography>
                        <Typography sx={{ width: "60%", fontSize: 10.5 }}>{row[1]}</Typography>
                      </Stack>
                    ))}
                    <Typography sx={{ fontSize: 10.5, mt: 0.8 }}>
                      Please make checks payable to {printData.companyName}.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ px: 1.2, mt: 1.1 }}>
                  <Box sx={{ borderTop: "2px solid #1f78c9", pt: 0.7 }}>
                    <Typography sx={{ fontSize: 10.5, fontStyle: "italic", mb: 0.35 }}>
                      Thank you for choosing {printData.companyName} for your service needs.
                    </Typography>
                    {printData.notes.map((note, idx) => (
                      <Typography key={`${note}-${idx}`} sx={{ fontSize: 10.2, mb: 0.2 }}>
                        - {note}
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ bgcolor: "#f5c633", height: 7, mt: "auto" }} />
                <Box sx={{ bgcolor: "#1f78c9", height: 17 }} />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default ReportPage;