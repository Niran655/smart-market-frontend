import {
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import { X, Printer } from "lucide-react";
import React from "react";

export default function ViewProductTransfer({
  open,
  onClose,
  viewData,
  t,
  language,
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
          <title>Product Transfer</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: Arial, sans-serif; font-size: 12px; }

            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }

            .title {
              font-size: 26px;
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

            td.right {
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
              font-weight: bold;
              border-top: 2px solid #000;
              padding-top: 8px;
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

          <div class="header">
            <div>
              <div><b>Date:</b> ${new Date(createdAt).toLocaleDateString()}</div>
              <div><b>Status:</b> ${status}</div>
            </div>
            <div class="title">TRANSFER SLIP</div>
          </div>

          <div class="row">
            <div class="col">
              <h4>To Shop</h4>
              <div>${toShop?.nameEn}</div>
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

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th class="right">Qty</th>
                <th class="right">Unit Price</th>
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

          <div class="summary">
            <div>
              <span>Total Qty</span>
              <span>${totalQty}</span>
            </div>
            <div class="total">
              <span>Total Amount</span>
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
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ height: "100vh", p: 2, width: 900 }}>
        {/* HEADER */}
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight={600}>
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

        <Divider sx={{ mb: 2 }} />

        <Stack direction="row" spacing={2} height="calc(100% - 70px)">
          {/* LEFT INFO */}
          <Paper sx={{ width: 320, p: 2 }}>
            <InfoRow label="Shop (KH)" value={toShop?.nameKh} />
            <InfoRow label="Shop (EN)" value={toShop?.nameEn} />
            <InfoRow
              label="Status"
              value={<Chip size="small" label={status} color="primary" />}
            />
            <InfoRow
              label="Requested By"
              value={requestedBy?.nameEn}
            />
            <InfoRow
              label="Accepted By"
              value={acceptedBy?.nameEn || "-"}
            />
            <InfoRow
              label="Created At"
              value={new Date(createdAt).toLocaleString()}
            />
            <InfoRow
              label="Accepted At"
              value={
                acceptedAt
                  ? new Date(acceptedAt).toLocaleString()
                  : "-"
              }
            />

            <Divider sx={{ my: 1 }} />

            <Typography fontWeight={600}>{t("remark")}</Typography>
            <Typography variant="body2">
              {remark || "-"}
            </Typography>
          </Paper>

          {/* TABLE */}
          <Box flex={1} overflow="hidden">
            <TableContainer sx={{ height: "100%" }}>
              <Table stickyHeader size="small">
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
                      <TableCell align="right">
                        {row.quantity}
                      </TableCell>
                      <TableCell align="right">
                        {row.subProduct.costPrice}
                      </TableCell>
                      <TableCell align="right">
                        {(row.quantity * row.subProduct.costPrice).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 1 }} />

            <Stack alignItems="flex-end" p={1}>
              <Typography>
                <b>Total Qty:</b> {totalQty}
              </Typography>
              <Typography fontWeight={600}>
                <b>Total:</b> {totalAmount.toLocaleString()}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
}

/* ================= INFO ROW ================= */
function InfoRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" mb={0.5}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value || "-"}
      </Typography>
    </Stack>
  );
}