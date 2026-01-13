import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from "@apollo/client/react";
import { styled } from "@mui/material/styles";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, MenuItem, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { X } from "lucide-react";
import { Form, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { GET_PRDUCT_WAREHOUSE_WITH_PAGINATION } from "../../../../graphql/queries";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": { padding: theme.spacing(2) },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));

export default function ProductTransferForm({ open, onClose, t }) {
  const [loading, setLoading] = useState(false);

 
  const { data } = useQuery(GET_PRDUCT_WAREHOUSE_WITH_PAGINATION, {
    variables: { page: 1, limit: 50, pagination: true, keyword: "" },
  });

  const products =
    data?.getProductWareHouseWithPagination?.data || [];

 
  const emptyItem = () => ({
    productObj: null,
    productId: "",
    quantity: "",
    price: "",
    total: 0,
  });

  const emptyTab = () => ({
    id: Date.now(),
    shop: "",
    items: [emptyItem()],
    grandTotal: 0,
  });

  const [tabs, setTabs] = useState([emptyTab()]);
  const [activeTab, setActiveTab] = useState(0);

 
  const formik = useFormik({
    initialValues: tabs[activeTab],
    enableReinitialize: true,
    validationSchema: Yup.object({
      shop: Yup.string().required(t("require")),
    }),
    onSubmit: () => {
      setLoading(true);
      console.log("TRANSFER PAYLOAD 👉", tabs);
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 1000);
    },
  });

  const { values, handleSubmit, setValues } = formik;

  useEffect(() => {
    setValues(tabs[activeTab]);
  }, [activeTab]);

 
  const recalcTabTotal = (tab) => {
    tab.grandTotal = tab.items.reduce(
      (sum, i) => sum + Number(i.total || 0),
      0
    );
  };

  const updateItem = (index, field, value) => {
    const updatedTabs = [...tabs];
    const item = updatedTabs[activeTab].items[index];
    item[field] = value;

    if (field === "quantity" || field === "price") {
      item.total =
        Number(item.quantity || 0) * Number(item.price || 0);
    }

    recalcTabTotal(updatedTabs[activeTab]);
    setTabs(updatedTabs);
    setValues(updatedTabs[activeTab]);
  };

  const addItem = () => {
    const updatedTabs = [...tabs];
    updatedTabs[activeTab].items.push(emptyItem());
    setTabs(updatedTabs);
    setValues(updatedTabs[activeTab]);
  };

  const deleteItem = (index) => {
    const updatedTabs = [...tabs];
    if (updatedTabs[activeTab].items.length === 1) return;
    updatedTabs[activeTab].items.splice(index, 1);
    recalcTabTotal(updatedTabs[activeTab]);
    setTabs(updatedTabs);
    setValues(updatedTabs[activeTab]);
  };

  const addTab = () => {
    setTabs([...tabs, emptyTab()]);
    setActiveTab(tabs.length);
  };

  const deleteTab = (index) => {
    if (tabs.length === 1) return;
    const updated = tabs.filter((_, i) => i !== index);
    setTabs(updated);
    setActiveTab(Math.max(0, index - 1));
  };

  return (
    <BootstrapDialog open={open} fullWidth maxWidth="md">
      <DialogTitle>
        {t("create_transfer")}
        <IconButton onClick={addTab} sx={{ ml: 1 }}>
          <AddBoxOutlinedIcon />
        </IconButton>
      </DialogTitle>

      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>

      <Divider />

  
      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
        {tabs.map((_, i) => (
          <Tab
            key={i}
            label={
              <Box display="flex" alignItems="center" gap={1}>
                Shop {i + 1}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTab(i);
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            }
          />
        ))}
      </Tabs>

      {/* ================= FORM ================= */}
      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
               
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t("shop")}</Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={values.shop}
                  onChange={(e) => {
                    const updated = [...tabs];
                    updated[activeTab].shop = e.target.value;
                    setTabs(updated);
                    setValues(updated[activeTab]);
                  }}
                >
                  <MenuItem value="shop1">Shop 1</MenuItem>
                  <MenuItem value="shop2">Shop 2</MenuItem>
                </TextField>
              </Grid>

               
              <Grid size={{ xs: 12 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>{t("product_list")}</Typography>
                  <IconButton onClick={addItem}>
                    <AddBoxOutlinedIcon />
                  </IconButton>
                </Stack>
              </Grid>

              {values.items.map((item, index) => (
                <Grid container spacing={2} key={index}>
                 
                  <Grid size={{ xs: 12, md: 4 }}>
                     <Typography>{t("product")}</Typography>
                    <Autocomplete
                      options={products}
                      getOptionLabel={(p) =>
                        p?.subProduct?.parentProductId?.nameEn ||
                        p?.subProduct?.parentProductId?.nameKh ||
                        ""
                      }
                      value={item.productObj}
                      onChange={(e, val) => {
                        updateItem(index, "productObj", val);
                        updateItem(
                          index,
                          "productId",
                          val?.subProduct?._id || ""
                        );
                        updateItem(index, "price", val?.subProduct?.qty || 0);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <Typography>{t("quantity")}</Typography>
                    <TextField
                      size="small"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <Typography>{t("qty_in_unit")}</Typography>
                    <TextField
                      size="small"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(index, "price", e.target.value)
                      }
                    />
                  </Grid>

                  

                  <Grid size={{ xs: 12, md: 2 }}>
                    <Typography>{t("total")}</Typography>
                    <TextField size="small" value={item.total} disabled />
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <Typography>{t("delete")}</Typography>
                    <IconButton onClick={() => deleteItem(index)}>
                      <X color="red" />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Grid size={{ xs: 12 }}>
                <Typography align="right">
                  {t("total")} : {values.grandTotal}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
            >
              {loading ? t("processing...") : t("create")}
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </BootstrapDialog>
  );
}
