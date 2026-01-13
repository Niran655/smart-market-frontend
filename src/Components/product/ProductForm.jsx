import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery } from "@apollo/client/react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import { Checkbox, Divider, FormControlLabel, Grid, TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import * as React from "react";
import { useEffect } from "react";
import * as Yup from "yup";

import UseAutocomplete from "../include/useAutoComplete";
import { CREATE_PRODUCT, UPDATE_PRODUCT } from "../../../graphql/mutation";
import { useAuth } from "../../context/AuthContext";
import { GET_CATEGORY, GET_UNIT } from "../../../graphql/queries";
import UploadImage from "../../utils/UploadImage";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function ProductForm({
  open,
  onClose,
  t,
  dialogTitle,
  productData,
  setRefetch,
}) {
  console.log("productData", productData);
  const [loading, setLoading] = React.useState(false);
  const { setAlert } = useAuth();
  const { data: CategoryData } = useQuery(GET_CATEGORY);
  const { data: UnitData } = useQuery(GET_UNIT);
  const [uploadedFilePath, setUploadedFilePath] = React.useState(null);

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    onCompleted: ({ createProduct }) => {
      console.log("createProduct", createProduct);
      if (createProduct?.isSuccess) {
        setLoading(false);
        setRefetch();
        onClose();
        setUploadedFilePath(null);
        setAlert(true, "success", createProduct?.message);
      } else {
        setLoading(false);
        setAlert(true, "error", createProduct?.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      console.error("Error", error);
      setAlert(true, "error", error.message);
    },
  });

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    onCompleted: ({ updateProduct }) => {
      if (updateProduct?.isSuccess) {
        setLoading(false);
        setRefetch();
        setAlert(true, "success", updateProduct?.message);
        onClose?.();
      } else {
        setLoading(false);
        setAlert(true, "error", updateProduct?.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      console.error("Error", error);
      setAlert(true, "error", error.message);
    },
  });

  const formik = useFormik({
    initialValues: {
      image: "",
      type: "",
      nameKh: "",
      nameEn: "",
      categoryId: "",
      unitId: "",
      active: true,
      remark: "",
    },
    validationSchema: Yup.object({
      image: Yup.string(),
      type: Yup.string(),
      nameKh: Yup.string().required(t("require")),
      nameEn: Yup.string().required(t("require")),
      categoryId: Yup.string().required(t("require")),
      unitId: Yup.string().required(t("require")),
      remark: Yup.string(),
      active: Yup.boolean(),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);
      const input = {
        image: values?.image,
        nameKh: values.nameKh,
        nameEn: values.nameEn,
        type: values.type,
        categoryId: values.categoryId,
        unitId: values.unitId,
        remark: values.remark,
        active: values.active,
      };

      if (dialogTitle === "Create") {
        createProduct({
          variables: {
            input: input,
          },
        });
      } else {
        updateProduct({
          variables: {
            id: productData?._id,
            input: input,
          },
        });
      }
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    setValues,
    resetForm,
    values,
  } = formik;

  useEffect(() => {
    if (open) {
      if (productData && dialogTitle === "Update") {
        setValues({
          image: productData?.image || "",
          nameKh: productData.nameKh || "",
          nameEn: productData.nameEn || "",
          categoryId:
            productData?.categoryId?._id || productData?.categoryId || "",
          unitId: productData?.unitId?._id || productData?.unitId || "",
          remark: productData.remark || "",
          active: productData.active !== undefined ? productData.active : true,
        });
        if (productData?.image)
          setUploadedFilePath(productData.image.split("/").pop());
      } else {
        resetForm();
      }
    }
  }, [open, productData, dialogTitle, setValues, resetForm]);

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
        {dialogTitle === "Create" ? t(`add_product`) : t(`edit_product`)}
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
                <Typography variant="body2">{t(`khmer_name`)} *</Typography>
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
                <Typography variant="body2">{t(`english_name`)} *</Typography>
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
                <UseAutocomplete
                  name="categoryId"
                  label={`${t("category")} *`}
                  placeholder={t("select_category")}
                  query={GET_CATEGORY}
                  dataKey="getCategory"
                  getOptionLabel={(item) =>
                    item?.name || item?.nameEn || item?.nameKh || ""
                  }
                />
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

              <Grid size={{ xs: 12 }}>
                <Typography variant="body2">{t(`remark`)}</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder={t(`remark`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("remark")}
                  helperText={touched.remark && errors.remark}
                  error={Boolean(touched.remark && errors.remark)}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.active}
                      onChange={(e) =>
                        setFieldValue("active", e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label={t(`active`)}
                />
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
                ? `${t(`processing...`)}`
                : dialogTitle === "Create"
                ? `${t(`create`)}`
                : `${t(`update`)}`}
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </BootstrapDialog>
  );
}
