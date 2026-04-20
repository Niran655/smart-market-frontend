import ManageHistoryOutlinedIcon from "@mui/icons-material/ManageHistoryOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Divider, IconButton, MenuItem, Paper, Select, Stack, Tab, Tabs, TextField, Tooltip, Typography } from "@mui/material";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import InvoicePending from "./InvoicePending";
import SaleHistory from "./SaleHistory";

const CartPanel = ({
  cart,
  orderType,
  setOrderType,
  selectedTable,
  setSelectedTable,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  updateQty,
  removeFromCart,
  clearCart,
  subtotal,
  tax,
  total,
  t,
  language,
  creating,
  onPayNow,
  onStopInvoice,
  openHistory,
  openSalePending,
  onOpenHistory,
  onCloseHistory,
  onOpenSalePending,
  onCloseSalePending,
  shopId,
  onSelectPendingSale,
}) => {
  const tables = ["Table 01", "Table 02", "Table 03", "Table 04", "Table 05", "Table 06"];

  const ORDER_TYPES = {
    DINE_IN: "dine_in",
    TAKEAWAY: "take_away",
    DELIVERY: "delivery",
  };

  const orderTypes = [
    { key: "dine_in", label: t("dine_in") },
    { key: "take_away", label: t("take_away") },
    { key: "delivery", label: t("delivery") },
  ];

 
  const [localCustomerName, setLocalCustomerName] = useState(customerName || "");
  const [localCustomerPhone, setLocalCustomerPhone] = useState(customerPhone || "");
  const [localTable, setLocalTable] = useState(selectedTable || tables[0]);

  useEffect(() => {
    if (customerName !== undefined && customerName !== null) setLocalCustomerName(customerName);
  }, [customerName]);
  useEffect(() => {
    if (customerPhone !== undefined && customerPhone !== null) setLocalCustomerPhone(customerPhone);
  }, [customerPhone]);
  useEffect(() => {
    if (selectedTable !== undefined && selectedTable !== null) setLocalTable(selectedTable);
  }, [selectedTable]);

  const handleCustomerNameChange = (v) => {
    if (setCustomerName) setCustomerName(v);
    else setLocalCustomerName(v);
  };
  const handleCustomerPhoneChange = (v) => {
    if (setCustomerPhone) setCustomerPhone(v);
    else setLocalCustomerPhone(v);
  };
  const handleTableChange = (v) => {
    if (setSelectedTable) setSelectedTable(v);
    else setLocalTable(v);
  };

  return (
    <Box>
      <Box className="cart-panel" sx={{ overflow: "auto", height: "100%" }}>
        <Box className="cart-header">
          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <Typography className="cart-title">{t(`current_order`)}</Typography>
            <Tooltip title="View history">
              <IconButton onClick={onOpenHistory}>
                <ReceiptOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="View Pending Invoices">
              <IconButton onClick={onOpenSalePending}>
                <ManageHistoryOutlinedIcon />
              </IconButton>
            </Tooltip>
            <SaleHistory
              open={openHistory}
              onClose={onCloseHistory}
              t={t}
              shopId={shopId}
              onViewDetails={(sale) => console.log("View sale details:", sale)}
            />
            <InvoicePending
              t={t}
              open={openSalePending}
              onClose={onCloseSalePending}
              shopId={shopId}
              onLoadToCart={onSelectPendingSale}
            />
          </Stack>
          <Stack direction={"row"} spacing={2}>
            {cart.length > 0 && (
              <Button size="small" color="error" onClick={clearCart}>
                <Typography color="error">{t(`clear`)}</Typography>
              </Button>
            )}
          </Stack>
        </Box>
        <Divider />
        <Tabs
          value={orderType}
          onChange={(e, newValue) => setOrderType && setOrderType(newValue)}
          variant="fullWidth"
          className="order-type-tabs"
        >
          {orderTypes.map((type) => (
            <Tab
              key={type.key}
              label={type.label}
              value={type.key}
              component={Button}
              sx={{
                mx: 0.2,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "white",
                  borderRadius: "5px",
                },
              }}
            />
          ))}
        </Tabs>
        <Divider />
        <Box className="customer-info">
          <TextField
            fullWidth
            placeholder={t(`customer`)}
            sx={{ mt: 1 }}
            size="small"
            className="customer-field"
            value={(customerName !== undefined && customerName !== null) ? customerName : localCustomerName}
            onChange={(e) => handleCustomerNameChange(e.target.value)}
          />
          <TextField
            fullWidth
            placeholder={t(`phone`) || "Phone"}
            size="small"
            sx={{ mt: 1 }}
            value={(customerPhone !== undefined && customerPhone !== null) ? customerPhone : localCustomerPhone}
            onChange={(e) => handleCustomerPhoneChange(e.target.value)}
          />
          {orderType === ORDER_TYPES.DINE_IN && (
            <Select
              fullWidth
              value={(selectedTable !== undefined && selectedTable !== null) ? selectedTable : localTable}
              onChange={(e) => handleTableChange(e.target.value)}
              size="small"
              sx={{ mt: 1 }}
            >
              {tables.map((table) => (
                <MenuItem key={table} value={table} className="table-menu-item">
                  {table}
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>
        <Divider className="section-divider" />
        <Box className="cart-items-container">
          {cart.map((item, idx) => (
            <Paper key={item.id} className="cart-item">
              <img
                src={item.img || "/placeholder-food.jpg"}
                className="cart-item-image"
                alt={item.name}
              />
              <Stack direction={"column"} className="cart-item-details">
                <Typography className="cart-item-name">{item.name}</Typography>
                <Typography className="cart-item-price">
                  {item.price.toLocaleString()}$
                </Typography>
              </Stack>
              <Box className="cart-item-spacer"></Box>
              <Typography className="cart-item-total">
                {t(`total_price`)}: {(item.qty * item.price).toLocaleString()}$
              </Typography>
              <Box className="quantity-controls">
                <IconButton
                  size="small"
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  className="qty-button"
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <TextField
                  value={item.qty}
                  onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 0)}
                  size="small"
                  className="qty-input"
                />
                <IconButton
                  size="small"
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  className="qty-button"
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box className="cart-item-actions">
                <IconButton onClick={() => removeFromCart(item.id)} className="delete-button">
                  <Trash2 size={16} />
                </IconButton>
              </Box>
            </Paper>
          ))}
          {cart.length === 0 && (
            <Typography className="empty-cart-message">{t(`cart_empty`)}</Typography>
          )}
        </Box>
        <Divider className="section-divider" />
        <Box className="order-summary">
          <Box className="summary-row">
            <Typography className="summary-label">{t(`subtotal`)}</Typography>
            <Typography className="summary-value">{subtotal.toLocaleString()}$</Typography>
          </Box>
          <Box className="summary-row">
            <Typography className="summary-label">{t(`tax`)} (10%)</Typography>
            <Typography className="summary-value">{tax.toLocaleString()}$</Typography>
          </Box>
          <Box className="summary-row">
            <Typography className="summary-label">{t(`discount`)}</Typography>
            <Typography className="summary-value">0$</Typography>
          </Box>
          <Divider />
          <Box className="total-row">
            <Typography className="total-label">{t(`total_price`)}</Typography>
            <Typography className="total-value">{total.toLocaleString()}$</Typography>
          </Box>
        </Box>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <Button
            fullWidth
            variant="contained"
            size="medium"
            disabled={cart.length === 0 || creating}
            className="pay-button"
            sx={{ bgcolor: "warning.main", "&:hover": { bgcolor: "warning.dark" } }}
            onClick={onStopInvoice}
          >
            {t(`stop_invoice`)}
          </Button>
          <Button
            fullWidth
            variant="contained"
            size="medium"
            onClick={onPayNow}
            disabled={cart.length === 0 || creating}
            className="pay-button"
          >
            {t(`pay_now`)} {total.toLocaleString()}$
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default CartPanel;