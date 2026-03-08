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
} from "@mui/material";
import { X, Printer } from "lucide-react";
import { useRef } from "react";

export default function PurchaseOrderView({
  open,
  onClose,
  purchaseOrder,
  language,
  t,
}) {
  const printRef = useRef();

  if (!purchaseOrder) return null;


  const totalQty = purchaseOrder.items.reduce(
    (sum, i) => sum + i.quantity,
    0
  );

  const totalAmount = purchaseOrder.items.reduce(
    (sum, i) => sum + i.quantity * i.costPrice,
    0
  );


  const handlePrint = () => {
    const win = window.open("", "", "width=900,height=700");

    const supplierName =
      language === "en"
        ? purchaseOrder.supplier?.nameEn
        : purchaseOrder.supplier?.nameKh;

    const totalAmount = purchaseOrder.items.reduce(
      (sum, i) => sum + i.quantity * i.costPrice,
      0
    );

    win.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <style>
          @page { size: A4; margin: 20mm; }

          body {
            font-family: Arial, sans-serif;
            color: #000;
            font-size: 12px;
          }

          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }

          .invoice-title {
            font-size: 28px;
            font-weight: bold;
          }

          .info small {
            display: block;
            margin-bottom: 4px;
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
            margin-bottom: 6px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          th {
            background: #000;
            color: #fff;
            padding: 8px;
            font-size: 12px;
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
            font-size: 14px;
          }

          .footer {
            margin-top: 50px;
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
          <div class="info">
            <small><b>Invoice No:</b> ${purchaseOrder._id.slice(-6)}</small>
            <small><b>Date:</b> ${new Date(purchaseOrder.createdAt).toLocaleDateString()}</small>
          </div>
          <div class="invoice-title">INVOICE</div>
        </div>

        <!-- SELLER / BILL TO / PAYMENT -->
        <div class="row">
          <div class="col">
            <h4>Seller</h4>
            <div>POS System</div>
            <div>Phnom Penh</div>
          </div>

          <div class="col">
            <h4>Bill To</h4>
            <div>${supplierName}</div>
          </div>

          <div class="col">
            <h4>Payment Details</h4>
            <div>Status: ${purchaseOrder.status}</div>
          </div>
        </div>

        <!-- TABLE -->
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th class="right">Qty</th>
              <th class="right">Unit Price</th>
              <th class="right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${purchaseOrder.items
        .map(
          (item, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${language === "en"
              ? item.subProduct.parentProductId.nameEn
              : item.subProduct.parentProductId.nameKh
            }</td>
                  <td class="right">${item.quantity}</td>
                  <td class="right">${item.costPrice.toLocaleString()}</td>
                  <td class="right">${(
              item.quantity * item.costPrice
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
            <span>Subtotal</span>
            <span>${totalAmount.toLocaleString()}</span>
          </div>
          <div>
            <span>Tax</span>
            <span>0</span>
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
            {t("purchase_order_invoice")}
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


        <Box ref={printRef}>

          <Stack spacing={1} direction={"row"} justifyContent={"space-between"} >
            <Box>
              <Typography>
                <b>{t("suppliers")}:</b>{" "}
                {language === "en"
                  ? purchaseOrder.supplier?.nameEn
                  : purchaseOrder.supplier?.nameKh}
              </Typography>

              <Typography>
                <b>{t("status")}:</b> {purchaseOrder.status}
              </Typography>
            </Box>

            <Box>
              <Typography>
                <b>{t("date")}:</b>{" "}
                {new Date(purchaseOrder.createdAt).toLocaleDateString()}
              </Typography>

              {purchaseOrder.remark && (
                <Typography>
                  <b>{t("remark")}:</b> {purchaseOrder.remark}
                </Typography>
              )}
            </Box>

          </Stack>

          <Divider sx={{ my: 2 }} />


          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t(`no`)}</TableCell>
                <TableCell>{t("product")}</TableCell>
                <TableCell align="right">{t("quantity")}</TableCell>
                <TableCell align="right">{t("received")}</TableCell>
                <TableCell align="right">{t("price")}</TableCell>
                <TableCell align="right">{t("total_price")}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {purchaseOrder.items.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    {language === "en"
                      ? item.subProduct?.parentProductId?.nameEn
                      : item.subProduct?.parentProductId?.nameKh}
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{item.receivedQty}</TableCell>
                  <TableCell align="right">
                    {item.costPrice.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    {(item.quantity * item.costPrice).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Divider sx={{ my: 2 }} />

          {/* SUMMARY */}
          <Stack spacing={1} alignItems="flex-end">
            <Typography>
              <b>{t("total_qty")}:</b> {totalQty}
            </Typography>
            <Typography  >
              <b>{t("total_price")}:</b>{" "}
              {totalAmount.toLocaleString()}
            </Typography>
          </Stack>
        </Box>

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