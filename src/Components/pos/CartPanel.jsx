import React from "react";
import {
  Box,
  Stack,
  Typography,
  Divider,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import { Trash2 } from "lucide-react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import ManageHistoryOutlinedIcon from "@mui/icons-material/ManageHistoryOutlined";
import SaleHistory from "./SaleHistory";
import InvoicePending from "./InvoicePending";

const CartPanel = ({
  cart,
  orderType,
  setOrderType,
  selectedTable,
  setSelectedTable,
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
  const tables = [
    "Table 01",
    "Table 02",
    "Table 03",
    "Table 04",
    "Table 05",
    "Table 06",
  ];

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
              onViewDetails={(sale) => {
                console.log("View sale details:", sale);
              }}
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
          onChange={(e, newValue) => setOrderType(newValue)}
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

        {orderType === ORDER_TYPES.DINE_IN && (
          <Box className="customer-info">
            <TextField
              fullWidth
              placeholder={t(`customer`)}
              size="small"
              className="customer-field"
            />
            <Select
              fullWidth
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              size="small"
            >
              {tables.map((table) => (
                <MenuItem key={table} value={table} className="table-menu-item">
                  {table}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}

        <Divider className="section-divider" />

        <Box className="cart-items-container">
          {cart.map((item, idx) => (
            <Box key={idx} className="cart-item">
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
            </Box>
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