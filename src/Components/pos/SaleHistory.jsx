import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Divider,
  IconButton,
  Stack,
  Chip,
  Card,
  CardContent,
  Tabs,
  Tab,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Menu,
  Tooltip,
} from "@mui/material";
import { X, CheckCircle, RefreshCw, MoreVertical, Eye } from 'lucide-react';
import { useQuery } from "@apollo/client/react";
import { useAuth } from "../../context/AuthContext";
import { translateLauguage } from "../../function/translate";
import { GET_SALES } from "../../../graphql/queries";

const SaleHistory = ({ open, onClose, t, shopId, onViewDetails }) => {
  const { language } = useAuth();
  const { t: translate } = translateLauguage(language);
  const [tabValue, setTabValue] = useState(0);
  const [selectedSale, setSelectedSale] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // Query to fetch sales (only completed and refunded)
  const { data, loading, error, refetch } = useQuery(GET_SALES, {
    variables: {
      shopId: shopId,
      status: tabValue === 0 ? "completed" : "refunded",
      pagination: false,
      limit: 50
    },
    skip: !open || !shopId,
  });

  const sales = data?.getSales?.data || [];

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event, sale) => {
    setAnchorEl(event.currentTarget);
    setSelectedSale(sale);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = (sale) => {
    setSelectedSale(sale);
    setOpenDetailsDialog(true);
    if (onViewDetails) {
      onViewDetails(sale);
    }
  };

  const handlePrintReceipt = (sale) => {
    console.log("Print receipt for:", sale);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "kh" ? 'km-KH' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "completed":
        return (
          <Chip
            icon={<CheckCircle size={14} />}
            label={t("completed")}
            color="success"
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        );
      case "refunded":
        return (
          <Chip
            icon={<RefreshCw size={14} />}
            label={t("refunded")}
            color="error"
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        );
      default:
        return null;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "cash":
        return "💵";
      case "card":
        return "💳";
      case "qr":
        return "📱";
      default:
        return "💰";
    }
  };
  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 600 } } }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Stack sx={{ p: 2 }} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Typography variant="h6">{t(`sale_history`)}</Typography>
            <IconButton onClick={onClose}>
              <X color="red" />
            </IconButton>
          </Stack>
          <Divider />

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label={t(`completed`)} />
            <Tab label={t(`refunded`)} />
          </Tabs>

          <Box sx={{ flex: 1, overflow: 'auto', p: 2, scrollbarWidth: "thin" }}>
            {loading ? (
              <LinearProgress />
            ) : error ? (
              <Typography color="error" align="center">

                {t(`error_fetching_data`)}
              </Typography>
            ) : sales.length === 0 ? (
              <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
                {t(`no_data_available`)}
              </Typography>
            ) : (
              <Stack spacing={2}>
                {sales.map((sale) => (
                  <Card key={sale._id} variant="outlined">
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              #{sale.saleNumber}
                            </Typography>
                            {getStatusChip(sale.status)}
                          </Stack>

                          <Typography variant="body2" color="text.secondary">
                            {formatDate(sale.createdAt)}
                          </Typography>

                          <Stack direction="row" spacing={2} mt={1}>
                            <Typography variant="body2">
                              {sale.items?.length || 0} {language === "kh" ? "ទំនិញ" : "items"}
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {t(`total`)}: ${sale.total?.toFixed(2) || "0.00"}
                            </Typography>
                          </Stack>

                          {sale.paymentMethod && (
                            <Typography variant="body2" color="text.secondary" mt={0.5}>
                              <Box component="span" sx={{ mr: 0.5 }}>
                                {getPaymentMethodIcon(sale.paymentMethod)}
                              </Box>
                              {sale.paymentMethod?.toUpperCase()}
                            </Typography>
                          )}
                        </Box>

                        <Box>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, sale)}
                          >
                            <MoreVertical size={18} />
                          </IconButton>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Menu for actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleViewDetails(selectedSale);
          handleMenuClose();
        }}>
          <Eye size={16} style={{ marginRight: 8 }} />

          {t(`view_details`)}
        </MenuItem>
        <MenuItem onClick={() => {
          handlePrintReceipt(selectedSale);
          handleMenuClose();
        }}>
          <CheckCircle size={16} style={{ marginRight: 8 }} />
          {t(`print_receipt`)}
        </MenuItem>
      </Menu>
      {/* Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">

            {t(`sale_details`)}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{
          scrollbarWidth: "none",
        }}>
          {selectedSale && (
            <Box sx={{ mt: 2 }}>
              <Stack spacing={2}>

                <Box sx={{ p: 2, borderRadius: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        #{selectedSale.saleNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(selectedSale.createdAt)}
                      </Typography>
                    </Box>
                    {getStatusChip(selectedSale.status)}
                  </Stack>
                </Box>


                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {language === "kh" ? "ទំនិញ" : "Items"} ({selectedSale.items?.length || 0})
                  </Typography>
                  {selectedSale.items?.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.quantity} × ${item.price?.toFixed(2)}
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="bold">
                        ${(item.quantity * item.price)?.toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>


                <Box sx={{ p: 2, borderRadius: 1 }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">{t("subtotal")}:</Typography>
                      <Typography variant="body1">${selectedSale.subtotal?.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">{t("tax")} (10%):</Typography>
                      <Typography variant="body1">${selectedSale.tax?.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">{t("discount")}:</Typography>
                      <Typography variant="body1">-${selectedSale.discount?.toFixed(2)}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" fontWeight="bold">{t("total_price")}:</Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        ${selectedSale.total?.toFixed(2)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {t(`payment_information`)}
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        {t(`payment_method`)}:
                      </Typography>
                      <Typography variant="body2">
                        <Box component="span" sx={{ mr: 1 }}>
                          {getPaymentMethodIcon(selectedSale.paymentMethod)}
                        </Box>
                        {selectedSale.paymentMethod?.toUpperCase()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        {t("amount_paid")}:
                      </Typography>
                      <Typography variant="body2">${selectedSale.amountPaid?.toFixed(2)}</Typography>
                    </Box>
                    {selectedSale.change > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          {t(`money_change`)}:
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          ${selectedSale.change?.toFixed(2)}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenDetailsDialog(false)}
            color="inherit"
          >
            {t(`close`)}
          </Button>
          <Button
            onClick={() => handlePrintReceipt(selectedSale)}
            variant="outlined"
          >

            {t(`print`)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SaleHistory;