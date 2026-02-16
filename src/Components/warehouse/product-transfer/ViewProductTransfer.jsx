import { Box, Chip, Divider, Drawer, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { X } from "lucide-react";
import React from "react";

import "../../../Styles/TableStyle.scss";
export default function ViewProductTransfer({ open, onClose, viewData, t, language }) {
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

  return (
    <Drawer anchor="top" open={open} onClose={onClose}>
      <Box sx={{ height: "100vh", p: 2 }}>
        {/* ================= HEADER ================= */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight={600}>
            {t(`view_product_transfer`)}
          </Typography>
          <IconButton onClick={onClose}>
            <X />
          </IconButton>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ height: "calc(100% - 80px)" }}
        >

          <Box
            sx={{
              width: { xs: "100%", md: 320 },

              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              {t(`transfer_information`)}
            </Typography>

            <InfoRow label="Shop (KH)" value={toShop?.nameKh} />
            <InfoRow label="Shop (EN)" value={toShop?.nameEn} />

            <InfoRow
              label="Status"
              value={<Chip size="small" label={status} color="primary" />}
            />

            <InfoRow
              label="Requested By"
              value={requestedBy?.nameEn || requestedBy?.nameKh}
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

            <Typography variant="subtitle2" fontWeight={600}>
              {t(`remark`)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {remark || "-"}
            </Typography>
          </Box>


          <Box sx={{ flex: 1, overflow: "hidden" }}>
            <TableContainer
              className="table-container "
            >
              <Table stickyHeader className="table">
                <TableHead className="table-header">
                  <TableRow>
                    <TableCell>{t(`no`)}</TableCell>
                    <TableCell>{t(`bar_code`)}</TableCell>
                    <TableCell>{t(`product`)}</TableCell>
                    <TableCell align="right">{t(`quantity`)}</TableCell>
                    <TableCell align="right">{t(`price_in_unit`)}</TableCell>
                    <TableCell align="right">{t(`total_price`)}</TableCell>
                    
                  </TableRow>
                </TableHead>

                <TableBody>
                  {items.map((row, index) => (
                    <TableRow className="table-row" key={index}  >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.subProduct?.barCode}</TableCell>
                      <TableCell>
                        {language == "en" ? row.subProduct?.parentProductId?.nameEn : row.subProduct?.parentProductId?.nameKh}

                      </TableCell>
                      <TableCell align="right">
                        {row.quantity} ({language == "en" ? row.subProduct?.unitId?.nameEn : row.subProduct?.unitId?.nameKh})
                      </TableCell>
                      <TableCell align="right">
                        {row.subProduct?.costPrice} 
                      </TableCell>
                      <TableCell align="right">
                      $ {row.quantity * row.subProduct?.costPrice} 
                      </TableCell>
                 
                    </TableRow>
                  ))}

                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No products
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
}

/* ================= SMALL COMPONENT ================= */
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
