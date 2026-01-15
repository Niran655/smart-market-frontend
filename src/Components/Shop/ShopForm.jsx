import CloseIcon from "@mui/icons-material/Close";
import { useMutation } from "@apollo/client/react";
import { styled } from "@mui/material/styles";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

import { CREATE_SHOP, UPDATE_SHOP } from "../../../graphql/mutation";
import { useAuth } from "../../context/AuthContext";
import UploadImage from "../../utils/UploadImage";
import { supabase } from "../../supabaseClient";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": { padding: theme.spacing(2) },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));

export default function ShopForm({
  open,
  onClose,
  t,
  shopData,
  dialogTitle,
  setRefetch,
}) {
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadedFilePath, setUploadedFilePath] = useState(null);

  const [createShop] = useMutation(CREATE_SHOP, {
    onCompleted: ({ createShop }) => {
      setLoading(false);
      if (createShop?.isSuccess) {
        setAlert(true, "success", createShop?.message);
        setUploadedFilePath(null);
        onClose();
        setRefetch();
      } else setAlert(true, "error", createShop?.message);
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", {
        messageEn: error.message,
        messageKh: error.message,
      });
    },
  });

  const [updateShop] = useMutation(UPDATE_SHOP, {
    onCompleted: ({ updateShop }) => {
      setLoading(false);
      if (updateShop?.isSuccess) {
        setAlert(true, "success", updateShop?.message);
        onClose();
        setRefetch();
      } else setAlert(true, "error", updateShop?.message);
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", {
        messageEn: error.message,
        messageKh: error.message,
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      nameKh: "",
      nameEn: "",
      code: "",
      image: "",
      type: "",
      remark: "",
      address: "",
      active: true,
    },
    validationSchema: Yup.object({
      nameKh: Yup.string().required(t(`require`)),
      nameEn: Yup.string().required(t(`require`)),
      code: Yup.string(),
      image: Yup.string(),
      type: Yup.string(),
      remark: Yup.string(),
      address: Yup.string(),
      active: Yup.boolean(),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);
      if (dialogTitle === "Create")
        createShop({ variables: { input: values } });
      else updateShop({ variables: { id: shopData?._id, input: values } });
      resetForm();
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    setValues,
  } = formik;

  useEffect(() => {
    if (shopData) {
      setValues({
        nameKh: shopData?.nameKh || "",
        nameEn: shopData?.nameEn || "",
        code: shopData?.code || "",
        image: shopData?.image || "",
        type: shopData?.type || "",
        remark: shopData?.remark || "",
        address: shopData?.address || "",
        active: shopData?.active ?? true,
      });
      if (shopData?.image) setUploadedFilePath(shopData.image.split("/").pop());
    }
  }, [shopData, setValues]);

  const handleClose = async () => {
    if (dialogTitle === "Create" && uploadedFilePath) {
      await supabase.storage.from("images").remove([uploadedFilePath]);
      setUploadedFilePath(null);
    }
    onClose();
  };

  return (
    <BootstrapDialog
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {dialogTitle === "Create" ? t("add_shop") : t("update_shop")}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon color="error" />
      </IconButton>

      <Divider />
      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <UploadImage
                  value={formik.values.image}
                  onChange={(url) => setFieldValue("image", url)}
                  setFilePath={setUploadedFilePath}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2">{t(`khmer_name`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`khmer_name`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("nameKh")}
                  helperText={touched.nameKh && errors.nameKh}
                  error={Boolean(touched.nameKh && errors.nameKh)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2">{t(`english_name`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`english_name`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("nameEn")}
                  helperText={touched.nameEn && errors.nameEn}
                  error={Boolean(touched.nameEn && errors.nameEn)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2">{t(`code`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`code`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("code")}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2">{t(`type`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`type`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("type")}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2">{t(`remark`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`remark`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("remark")}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2">{t(`address`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`address`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("address")}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2">{t(`active`)}</Typography>
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  size="small"
                  {...getFieldProps("active")}
                >
                  <MenuItem value={true}>{t(`active`)}</MenuItem>
                  <MenuItem value={false}>{t(`inactive`)}</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              variant="contained"
            >
              {loading
                ? t(`loading`)
                : dialogTitle === "Create"
                ? t(`create`)
                : t(`update`)}
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </BootstrapDialog>
  );
}
