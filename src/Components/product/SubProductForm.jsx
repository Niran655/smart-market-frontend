import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQuery } from "@apollo/client/react";
import { styled } from "@mui/material/styles";
import { Autocomplete, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Grid, IconButton, InputAdornment, MenuItem, Tab, Tabs, TextField, Typography } from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

import UseAutocomplete from "../include/useAutoComplete";
import { CREATE_SUB_PRODUCT, UPDATE_SUB_PRODUCT } from "../../../graphql/mutation";
import { useAuth } from "../../context/AuthContext";
import { GET_ALL_SHOP, GET_UNIT } from "../../../graphql/queries";
import UploadImage from "../../utils/UploadImage";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function SubProductForm({
  open,
  onClose,
  t,
  dialogTitle = "Create",
  subProductData,
  parentProductId,
  setRefetch,
  unit,
}) {
  const { setAlert } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [userObject, setUserObject] = useState(null);
  const { language } = useAuth();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserObject(JSON.parse(storedUser));
    }
  }, []);
  const { data: unitData, loading: unitLoading } = useQuery(GET_UNIT);
  const { data: shopData, loading: shopLoading } = useQuery(GET_ALL_SHOP, {
    variables: {
      id: userObject?._id,
    },
  });

  const units = unitData?.getUnit || [];
  const shops = shopData?.getAllShops || [];

  const [createSubProduct] = useMutation(CREATE_SUB_PRODUCT, {
    onCompleted: ({ createSubProduct }) => {
      setLoadingLocal(false);
      if (createSubProduct?.isSuccess) {
        setAlert(true, "success", createSubProduct.message);
        setRefetch && setRefetch();
        onClose();
      } else {
        setAlert(true, "error", createSubProduct?.message);
      }
    },
    onError: (err) => {
      setLoadingLocal(false);
      setAlert(true, "error", err.message);
    },
  });

  const [updateSubProduct] = useMutation(UPDATE_SUB_PRODUCT, {
    onCompleted: ({ updateSubProduct }) => {
      setLoadingLocal(false);
      if (updateSubProduct?.isSuccess) {
        setAlert(true, "success", updateSubProduct.message);
        setRefetch && setRefetch();
        onClose();
      } else {
        setAlert(true, "error", updateSubProduct?.message);
      }
    },
    onError: (err) => {
      setLoadingLocal(false);
      setAlert(true, "error", err.message);
    },
  });

  const validationSchema = Yup.object().shape({
    saleType: Yup.string().oneOf(["retail", "wholesale"]).nullable(),
    unitId: Yup.string().nullable().required(t(`require`)),
    qty: Yup.number().min(0).nullable(),
    barCode: Yup.string().nullable(),
    productDes: Yup.string().nullable(),
    servicePrice: Yup.number().min(0).nullable(),
    salePrice: Yup.number().min(0).nullable(),
    taxRate: Yup.number().min(0).nullable(),
    costPrice: Yup.number().min(0).nullable(),
    totalPrice: Yup.number().min(0).nullable(),
    parentProductId: Yup.string().nullable(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      // information
      saleType: subProductData?.saleType || "retail",
      unitId: subProductData?.unitId?._id || subProductData?.unitId || "",
      qty: subProductData?.qty ?? 0,
      stock: subProductData?.stock || 0,
      minStock: subProductData?.minStock || 0,
      barCode: subProductData?.barCode || "",
      productDes: subProductData?.productDes || "",
      productImg: subProductData?.productImg || "",
      using: subProductData?.using ?? false,
      check: subProductData?.check ?? false,
      sell: subProductData?.sell ?? false,
      shopId:
        subProductData?.shopId?.map((s) => s._id) ||
        subProductData?.shopId ||
        [],

      // price
      servicePrice: subProductData?.servicePrice ?? 0,
      salePrice: subProductData?.salePrice ?? 0,
      taxRate: subProductData?.taxRate ?? 0,
      costPrice: subProductData?.costPrice ?? 0,
      priceImg: subProductData?.priceImg || "",
      totalPrice: subProductData?.totalPrice ?? 0,
      priceDes: subProductData?.priceDes || "",

      // relation
      parentProductId:
        subProductData?.parentProductId?._id || parentProductId || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoadingLocal(true);

      const input = {
        saleType: values.saleType || null,
        unitId: values.unitId || null,
        qty: Number(values.qty || 0),
        barCode: values.barCode || "",
        productDes: values.productDes || "",
        productImg: values.productImg || "",
        using: Boolean(values.using),
        check: Boolean(values.check),
        sell: Boolean(values.sell),
        shopId: values.shopId || [],
        stock: values.stock || 0,
        minStock: values.minStock || 0,

        servicePrice: Number(values.servicePrice || 0),
        salePrice: Number(values.salePrice || 0),
        taxRate: Number(values.taxRate || 0),
        costPrice: Number(values.costPrice || 0),
        priceImg: values.priceImg || "",
        totalPrice: Number(values.totalPrice || 0),
        priceDes: values.priceDes || "",

        parentProductId: values.parentProductId || parentProductId || null,
      };

      try {
        if (dialogTitle === "Create") {
          await createSubProduct({
            variables: { parentProductId: parentProductId, input: input },
          });
        } else {
          console.log("subProductDataid", subProductData?._id);
          await updateSubProduct({
            variables: { id: subProductData?._id, input: input },
          });
        }
      } catch (err) {
        console.error(err);
        setLoadingLocal(false);
        setAlert(true, "error", err.message || "Operation failed");
      }
    },
  });

  const {
    values,
    setFieldValue,
    handleSubmit,
    getFieldProps,
    errors,
    touched,
    resetForm,
    setValues,
  } = formik;

  useEffect(() => {
    if (open) {
      if (dialogTitle === "Update" && subProductData) {
        setValues({
          saleType: subProductData?.saleType || "retail",
          unitId: subProductData?.unitId?._id || subProductData?.unitId || "",
          qty: subProductData?.qty ?? 0,
          barCode: subProductData?.barCode || "",
          productDes: subProductData?.productDes || "",
          productImg: subProductData?.productImg || "",
          using: subProductData?.using ?? false,
          stock: subProductData?.stock,
          minStock: subProductData?.minStock,
          check: subProductData?.check ?? false,
          sell: subProductData?.sell ?? false,
          shopId:
            subProductData?.shopId?.map((s) => s._id) ||
            subProductData?.shopId ||
            [],

          servicePrice: subProductData?.servicePrice ?? 0,
          salePrice: subProductData?.salePrice ?? 0,
          taxRate: subProductData?.taxRate ?? 0,
          costPrice: subProductData?.costPrice ?? 0,
          priceImg: subProductData?.priceImg || "",
          totalPrice: subProductData?.totalPrice ?? 0,
          priceDes: subProductData?.priceDes || "",

          parentProductId:
            subProductData?.parentProductId?._id || parentProductId || "",
        });
      } else {
        setFieldValue("parentProductId", parentProductId || "");
        resetForm();

        setFieldValue("parentProductId", parentProductId || "");
      }
    } else {
      resetForm();
    }
  }, [open, subProductData, parentProductId]);

  const handleClose = () => {
    resetForm();
    onClose && onClose();
  };

  const getDisplayName = (i) => i?.name || i?.nameEn || i?.nameKh || "";

  useEffect(() => {
    const service = Number(values.servicePrice || 0);
    const sale = Number(values.salePrice || 0);
    const tax = Number(values.taxRate || 0);

    const total = (service + sale) * (1 + tax / 100);

    setFieldValue("totalPrice", total.toFixed(2));
  }, [values.servicePrice, values.salePrice, values.taxRate, setFieldValue]);

  const selectedUnit = units.find((u) => u._id === values.unitId) || null;
  const selectedShops = shops.filter((s) => values.shopId?.includes(s._id));

  return (
    <BootstrapDialog open={open} fullWidth maxWidth="md">
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {dialogTitle === "Create" ? t("add_product") : t("edit_product")}
      </DialogTitle>

      <IconButton
        onClick={handleClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon color="error" />
      </IconButton>

      <Divider />

      <Tabs
        value={tabIndex}
        onChange={(e, val) => setTabIndex(val)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label={t("product_information")} />
        <Tab label={t("price")} />
        <Tab label={t("other")} />
      </Tabs>

      <FormikProvider value={formik}>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            {/* TAB 1 - Information */}
            {tabIndex === 0 && (
              <Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("sale_type")}</Typography>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      {...getFieldProps("saleType")}
                      error={Boolean(touched.saleType && errors.saleType)}
                      helperText={touched.saleType && errors.saleType}
                    >
                      <MenuItem value="retail">{t("retail")}</MenuItem>
                      <MenuItem value="wholesale">{t("wholesale")}</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <UseAutocomplete
                      name="unitId"
                      label={`${t("unit")} *`}
                      placeholder={t("select_unit")}
                      query={GET_UNIT}
                      dataKey="getUnit"
                      getOptionLabel={(item) =>
                        item?.name || item?.nameEn || item?.nameKh || ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("qty_in_unit")}</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {language == "kh" ? unit?.nameKh : unit?.nameEn}
                          </InputAdornment>
                        ),
                      }}
                      {...getFieldProps("qty")}
                      error={Boolean(touched.qty && errors.qty)}
                      helperText={touched.qty && errors.qty}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">
                      {t("bar_code") || "Bar Code"}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      {...getFieldProps("barCode")}
                      error={Boolean(touched.barCode && errors.barCode)}
                      helperText={touched.barCode && errors.barCode}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("description")}</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      {...getFieldProps("productDes")}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("image")}</Typography>
                    <UploadImage
                      value={values.productImg}
                      onChange={(url) => setFieldValue("productImg", url)}
                    />
                  </Grid>

                  {values.check && (
                    <Grid size={{ xs: 12, md: 3 }}>
                      <Typography variant="body2">
                        {t("current_stock")}
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        disabled
                        {...getFieldProps("stock")}
                        error={Boolean(touched.stock && errors.stock)}
                        helperText={touched.stock && errors.stock}
                      />
                    </Grid>
                  )}

                  {values.check && (
                    <Grid size={{ xs: 12, md: 3 }}>
                      <Typography variant="body2">{t("min_stock")}</Typography>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        {...getFieldProps("minStock")}
                        error={Boolean(touched.minStock && errors.minStock)}
                        helperText={touched.minStock && errors.minStock}
                      />
                    </Grid>
                  )}
                  <Grid size={{ xs: 12 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.sell}
                          onChange={(e) =>
                            setFieldValue("sell", e.target.checked)
                          }
                        />
                      }
                      label={t("sell") || "Sell"}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.using}
                          onChange={(e) =>
                            setFieldValue("using", e.target.checked)
                          }
                        />
                      }
                      label={t("using_purchase") || "Using Purchase"}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.check}
                          onChange={(e) =>
                            setFieldValue("check", e.target.checked)
                          }
                        />
                      }
                      label={t("check") || "Check"}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("shop")}</Typography>
                    <Autocomplete
                      multiple
                      options={shops}
                      getOptionLabel={(option) =>
                        option?.name || option?.nameEn || option?.nameKh || ""
                      }
                      value={selectedShops}
                      onChange={(e, newValue) =>
                        setFieldValue(
                          "shopId",
                          newValue.map((s) => s._id)
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder={t("select_shops")}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {tabIndex === 1 && (
              <Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">
                      {t("service_price")}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">$</InputAdornment>
                        ),
                      }}
                      {...getFieldProps("servicePrice")}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("sale_price")}</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">$</InputAdornment>
                        ),
                      }}
                      {...getFieldProps("salePrice")}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("tax_rate")}</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      {...getFieldProps("taxRate")}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("cost")}</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">$</InputAdornment>
                        ),
                      }}
                      {...getFieldProps("costPrice")}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("total_price")}</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={values.totalPrice}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">$</InputAdornment>
                        ),
                      }}
                      {...getFieldProps("totalPrice")}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">{t("image")}</Typography>
                    <UploadImage
                      value={values.priceImg}
                      onChange={(url) => setFieldValue("priceImg", url)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2">{t("description")}</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      {...getFieldProps("priceDes")}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {tabIndex === 2 && (
              <Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">Parent Product</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={values.parentProductId || ""}
                      disabled
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>

          <DialogActions>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loadingLocal}
              sx={{ minWidth: 140 }}
            >
              {loadingLocal
                ? t("processing...")
                : dialogTitle === "Create"
                ? t("create") || "Create"
                : t("update") || "Update"}
            </Button>
          </DialogActions>
        </form>
      </FormikProvider>
    </BootstrapDialog>
  );
}
