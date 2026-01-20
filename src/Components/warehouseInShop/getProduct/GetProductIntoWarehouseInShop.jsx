import { useMutation } from "@apollo/client/react";
import { Box, Button, Chip, Divider, Drawer, IconButton, Paper, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

import "../../../Styles/TableStyle.scss";
import { ACCEPT_WAREHOUSE_TRANSFER, REJECT_WAREHOUSE_TRANSFER } from "../../../../graphql/mutation";
import EmptyData from "../../../include/EmptyData";
import CircularIndeterminate from "../../../include/Loading";
import GetProductAction from "./GetProductAction";

export default function GetProductIntoWarehouseInShop({
  open,
  onClose,
  editData,
  t,
  language,
  loading,
  refetch,
}) {
  if (!editData) return null;
  const {
    toShop,
    status,
    requestedBy,
    acceptedBy,
    remark,
    createdAt,
    acceptedAt,
    items = [],
  } = editData;
  const [acceptWarehouseTransfer] = useMutation(ACCEPT_WAREHOUSE_TRANSFER);
  const [rejectWarehouseTransfer] = useMutation(REJECT_WAREHOUSE_TRANSFER);

  
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (items?.length) {
      const initialQuantities = {};
      items.forEach((item, index) => {
        initialQuantities[index] = item.quantity;
      });
      setQuantities(initialQuantities);
    }
  }, [items]);

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
            {t(`get_product_transfer`)}
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

            <InfoRow label="Accepted By" value={acceptedBy?.nameEn || "-"} />

            <InfoRow
              label="Created At"
              value={new Date(createdAt).toLocaleString()}
            />

            <InfoRow
              label="Accepted At"
              value={acceptedAt ? new Date(acceptedAt).toLocaleString() : "-"}
            />

            <Divider sx={{ my: 1 }} />

            <Typography variant="subtitle2" fontWeight={600}>
              {t(`remark`)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {remark || "-"}
            </Typography>
            <Stack spacing={2} mt={4}>
              <Button variant="contained" color="error" fullWidth>
                {t(`reject_all_product`)}
              </Button>
              <Button variant="contained" fullWidth>
                {t(`confirm_getting_all_product`)}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ flex: 1, overflow: "hidden" }}>
            <TableContainer className="table-container ">
              <Table stickyHeader className="table">
                <TableHead className="table-header">
                  <TableRow>
                    <TableCell>{t(`no`)}</TableCell>

                    <TableCell>{t(`product`)}</TableCell>
                    <TableCell>{t(`price_in_unit`)}</TableCell>
                    <TableCell>{t(`quantity`)}</TableCell>
                    <TableCell>{t(`total_price`)}</TableCell>
                    <TableCell>{t(`remaining_goods`)}</TableCell>
                    <TableCell align="right">{t(`action`)}</TableCell>
                  </TableRow>
                </TableHead>
                {loading ? (
                  <CircularIndeterminate />
                ) : editData.length === 0 ? (
                  <EmptyData />
                ) : (
                  <TableBody>
                    {items.map((row, index) => (
                      <TableRow className="table-row" key={index}>
                        <TableCell>{index + 1}</TableCell>

                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <img
                              src={row.subProduct?.productImg}
                              alt={row.subProduct?.nameEn}
                              width={50}
                              height={50}
                            />
                            <Box>
                              {language == "en"
                                ? row.subProduct?.parentProductId?.nameEn
                                : row.subProduct?.parentProductId?.nameKh}
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>$ {row.subProduct?.costPrice}</TableCell>
                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <TextField
                              type="number"
                              size="small"
                              value={quantities[index] || ""}
                              inputProps={{
                                min: 0,
                                max: row.quantity,
                              }}
                              slotProps={{
                                input: {
                                  endAdornment: (
                                    <Typography
                                      variant="caption"
                                      display="block"
                                    >
                                      {language === "en"
                                        ? row.subProduct?.unitId?.nameEn
                                        : row.subProduct?.unitId?.nameKh}
                                    </Typography>
                                  ),
                                },
                              }}
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value <= row.quantity) {
                                  setQuantities({
                                    ...quantities,
                                    [index]: value,
                                  });
                                }
                              }}
                              sx={{ width: 90 }}
                            />
                          </Stack>
                        </TableCell>

                        <TableCell>
                          {" "}
                          ${" "}
                          {(quantities[index] || 0) * row.subProduct?.costPrice}
                        </TableCell>

                        <TableCell>
                          {row?.quantity - (quantities[index] || 0)}
                        </TableCell>

                        <TableCell align="right">
                          <GetProductAction t={t} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
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
