import CloseIcon from "@mui/icons-material/Close";
import { useMutation } from "@apollo/client/react";
import { styled } from "@mui/material/styles";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

import { CREATE_USER, UPDATE_USER } from "../../../graphql/mutation";
import { useAuth } from "../../context/AuthContext";
import UploadImage from "../../utils/UploadImage";
import { supabase } from "../../supabaseClient";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": { padding: theme.spacing(2) },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));

export default function UserForm({ open, onClose, t, userData, dialogTitle, setRefetch }) {
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadedFilePath, setUploadedFilePath] = useState(null);

  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: ({ createUser }) => {
      setLoading(false);
      if (createUser?.isSuccess) {
        setAlert(true, "success", createUser?.message);
        setUploadedFilePath(null);
        onClose();
        setRefetch();
      } else setAlert(true, "error", createUser?.message);
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
    },
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: ({ updateUser }) => {
      setLoading(false);
      if (updateUser?.isSuccess) {
        setAlert(true, "success", updateUser?.message);
        onClose();
        setRefetch();
      } else setAlert(true, "error", updateUser?.message);
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", { messageEn: error.message, messageKh: error.message });
    },
  });

  const formik = useFormik({
    initialValues: {
      nameKh: "",
      nameEn: "",
      image: "",
      phone: "",
      gender: "male",
      email: "",
      role: "admin",
      active: true,
      password: "",
    },
    validationSchema: Yup.object({
      nameKh: Yup.string().required(t(`require`)),
      nameEn: Yup.string().required(t(`require`)),
      phone: Yup.string().required(t(`require`)),
      email: Yup.string().email("Email មិនត្រឹមត្រូវ").required(t(`require`)),
      image: Yup.string(),
      gender: Yup.string().required(t(`require`)),
      role: Yup.string().required(t(`require`)),
      active: Yup.boolean(),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);
      if (dialogTitle === "Create") createUser({ variables: { input: values } });
      else updateUser({ variables: { id: userData?._id, input: values } });
      resetForm();
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, setFieldValue, setValues } = formik;
  
  useEffect(() => {
    if (userData) {
      setValues({
        email: userData?.email || "",
        gender: userData?.gender || "male",
        nameKh: userData?.nameKh || "",
        nameEn: userData?.nameEn || "",
        phone: userData?.phone || "",
        role: userData?.role || "admin",
        image: userData?.image || "",
        active: userData?.active ?? true,
        password: "",
      });
      if (userData?.image) setUploadedFilePath(userData.image.split("/").pop());
    }
  }, [userData, setValues]);

  const handleClose = async () => {
    if (dialogTitle === "Create" && uploadedFilePath) {
      await supabase.storage.from("images").remove([uploadedFilePath]);
      setUploadedFilePath(null);
    }
    onClose();
  };



  return (
    <BootstrapDialog aria-labelledby="customized-dialog-title" open={open} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {dialogTitle === "Create" ? t("add_user") : t("update_user")}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({ position: "absolute", right: 8, top: 8, color: theme.palette.grey[500] })}
      >
        <CloseIcon color="error" />
      </IconButton>

      <Divider />
      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{xs:12}}>
                <UploadImage
                  value={formik.values.image}
                  onChange={(url) => setFieldValue("image", url)}
                  setFilePath={setUploadedFilePath}
                />
              </Grid>

              <Grid size={{xs:12,md:6}}>
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

              <Grid size={{xs:12,md:6}}>
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

              <Grid size={{xs:12,md:6}}>
                <Typography variant="body2">{t(`gender`)}</Typography>
                <TextField
                  fullWidth
                  select
                  placeholder={t(`gender`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("gender")}
                  helperText={touched.gender && errors.gender}
                  error={Boolean(touched.gender && errors.gender)}
                >
                  <MenuItem value="male">{t(`male`)}</MenuItem>
                  <MenuItem value="female">{t(`female`)}</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{xs:12,md:6}}>
                <Typography variant="body2">{t(`phone`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`phone`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("phone")}
                  helperText={touched.phone && errors.phone}
                  error={Boolean(touched.phone && errors.phone)}
                />
              </Grid>

              <Grid size={{xs:12,md:6}}>
                <Typography variant="body2">{t(`email`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`email`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("email")}
                  helperText={touched.email && errors.email}
                  error={Boolean(touched.email && errors.email)}
                />
              </Grid>

              <Grid size={{xs:12,md:6}}>
                <Typography variant="body2">{t(`role`)}</Typography>
                <TextField
                  fullWidth
                  select
                  placeholder={t(`role`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("role")}
                  helperText={touched.role && errors.role}
                  error={Boolean(touched.role && errors.role)}
                >
                  <MenuItem value="superAdmin">{t(`super_admin`)}</MenuItem>
                  <MenuItem value="admin">{t(`admin`)}</MenuItem>
                  <MenuItem value="manager">{t(`manager`)}</MenuItem>
                  <MenuItem value="cashier">{t(`cashier`)}</MenuItem>
                  <MenuItem value="stockController">{t(`stock_controller`)}</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{xs:12,md:6}}>
                <Typography variant="body2">{t(`password`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`password`)}
                  variant="outlined"
                  size="small"
                  {...getFieldProps("password")}
                  helperText={touched.password && errors.password}
                  error={Boolean(touched.password && errors.password)}
                />
              </Grid>

              <Grid size={{xs:12,md:6}}>
                <Typography variant="body2">{t(`confirm_password`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`confirm_password`)}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
         
            <Button type="submit" fullWidth disabled={loading} variant="contained">
              {loading
                ? t(`processing...`)
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
