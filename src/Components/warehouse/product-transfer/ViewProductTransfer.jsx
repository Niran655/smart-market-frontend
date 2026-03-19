import {
  Drawer,
  Stack,
  Typography,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { X, Printer } from "lucide-react";

export default function ViewProductTransfer({
  open,
  onClose,
  viewData,
  language,
  t,
}) {
  if (!viewData) return null;

  const {
    toShop,
    status,
    requestedBy,
    acceptedBy,
    remark,
    createdAt,
    acceptedAt,
    items = [],
  } = viewData;

  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = items.reduce(
    (s, i) => s + i.quantity * i.subProduct.costPrice,
    0
  );

  /* ================= PRINT ================= */
  const handlePrint = () => {
    const win = window.open("", "", "width=900,height=700");

    win.document.write(`
    <html>
      <head>
        <title>Transfer Invoice</title>
        <style>
          @page { size: A4; margin: 20mm; }

          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #000;
          }

          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }

          .title {
            font-size: 28px;
            font-weight: bold;
          }

          .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }

          .col {
            width: 32%;
          }

          .col h4 {
            font-size: 12px;
            margin-bottom: 6px;
            text-transform: uppercase;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th {
            background: #000;
            color: #fff;
            padding: 8px;
            text-align: left;
          }

          td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
          }

          td.right, th.right {
            text-align: right;
          }

          .summary {
            width: 40%;
            margin-left: auto;
            margin-top: 20px;
          }

          .summary div {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
          }

          .summary .total {
            border-top: 2px solid #000;
            font-weight: bold;
          }

          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 11px;
          }

          .line {
            height: 6px;
            background: #000;
            margin-top: 10px;
          }
        </style>
      </head>

      <body>

        <!-- HEADER -->
        <div class="header">
          <div>
            <div><b>Date:</b> ${new Date(createdAt).toLocaleDateString()}</div>
            <div><b>Status:</b> ${status}</div>
          </div>
          <div class="title">TRANSFER</div>
        </div>

        <!-- INFO -->
        <div class="row">
          <div class="col">
            <h4>To Shop</h4>
            <div>${toShop?.nameEn || "-"}</div>
          </div>

          <div class="col">
            <h4>Requested By</h4>
            <div>${requestedBy?.nameEn || "-"}</div>
          </div>

          <div class="col">
            <h4>Accepted By</h4>
            <div>${acceptedBy?.nameEn || "-"}</div>
          </div>
        </div>

        <!-- TABLE -->
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th class="right">Qty</th>
              <th class="right">Price</th>
              <th class="right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (i, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${
                    language === "en"
                      ? i.subProduct.parentProductId.nameEn
                      : i.subProduct.parentProductId.nameKh
                  }</td>
                  <td class="right">${i.quantity}</td>
                  <td class="right">${i.subProduct.costPrice}</td>
                  <td class="right">${(
                    i.quantity * i.subProduct.costPrice
                  ).toLocaleString()}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>

        <!-- SUMMARY -->
        <div class="summary">
          <div>
            <span>Total Qty</span>
            <span>${totalQty}</span>
          </div>
          <div class="total">
            <span>Total</span>
            <span>${totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div class="footer">
          <div class="line"></div>
          THANK YOU FOR YOUR BUSINESS
        </div>

      </body>
    </html>
    `);

    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  /* ================= UI ================= */
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 620 } }}
    >
      <Stack p={3} spacing={2}>
        {/* HEADER */}
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6">
            {t("view_product_transfer")}
          </Typography>

          <Stack direction="row" spacing={1}>
            <IconButton onClick={handlePrint}>
              <Printer />
            </IconButton>
            <IconButton onClick={onClose}>
              <X />
            </IconButton>
          </Stack>
        </Stack>

        <Divider />

        {/* INFO */}
        <Stack direction="row" justifyContent="space-between">
          <Box>
            <Typography>
              <b>{t("to_shop")}:</b>{" "}
              {language === "en"
                ? toShop?.nameEn
                : toShop?.nameKh}
            </Typography>

            <Typography>
              <b>{t("requested_by")}:</b> {requestedBy?.nameEn}
            </Typography>

            <Typography>
              <b>{t("accepted_by")}:</b> {acceptedBy?.nameEn || "-"}
            </Typography>
          </Box>

          <Box>
            <Typography>
              <b>{t("date")}:</b>{" "}
              {new Date(createdAt).toLocaleDateString()}
            </Typography>

            <Typography>
              <b>{t("status")}:</b>{" "}
              <Chip size="small" label={status} color="primary" />
            </Typography>

            {remark && (
              <Typography>
                <b>{t("remark")}:</b> {remark}
              </Typography>
            )}
          </Box>
        </Stack>

        <Divider />

        {/* TABLE */}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t("no")}</TableCell>
              <TableCell>{t("product")}</TableCell>
              <TableCell align="right">{t("quantity")}</TableCell>
              <TableCell align="right">{t("price")}</TableCell>
              <TableCell align="right">{t("total_price")}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  {language === "en"
                    ? row.subProduct.parentProductId.nameEn
                    : row.subProduct.parentProductId.nameKh}
                </TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">
                  {row.subProduct.costPrice}
                </TableCell>
                <TableCell align="right">
                  {(
                    row.quantity * row.subProduct.costPrice
                  ).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider />

        {/* SUMMARY */}
        <Stack spacing={1} alignItems="flex-end">
          <Typography>
            <b>{t("total_qty")}:</b> {totalQty}
          </Typography>
          <Typography>
            <b>{t("total_price")}:</b>{" "}
            {totalAmount.toLocaleString()}
          </Typography>
        </Stack>

        <Divider />

        <Button
          fullWidth
          variant="contained"
          startIcon={<Printer />}
          onClick={handlePrint}
        >
          {t("print")}
        </Button>
      </Stack>
    </Drawer>
  );
}