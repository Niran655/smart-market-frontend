import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { Autocomplete, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, FormGroup, Grid, IconButton, MenuItem, Tab, Tabs, TextField, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import React, { useEffect, useState } from "react";

import UploadImage from "../../utils/UploadImage";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": { padding: theme.spacing(2) },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));

export default function ReusableForm({
  open,
  onClose,
  initialValues,
  validationSchema,
  onSubmit,
  dialogTitle,
  tabs = [],
  loading,
  t
}) {
  const [tabIndex, setTabIndex] = useState(0);

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const {
    values,
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    setValues,
  } = formik;

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues, setValues]);

  const renderField = (field) => {
    const placeholder = field?.label;
    switch (field.type) {
      case "image":
        return (
          <UploadImage
            value={values[field.name]}
            onChange={(url) => setFieldValue(field.name, url)}
          />
        );

      case "autocomplete":
        return (
          <Autocomplete
            multiple={field.multiple}
            options={field.options || []}
            getOptionLabel={(opt) => opt.label}
            value={
              field.multiple
                ? field.options?.filter((o) =>
                  values[field.name]?.includes(o.id)
                ) || []
                : field.options?.find(
                  (o) => o.id === values[field.name]
                ) || null
            }
            onChange={(e, v) =>
              setFieldValue(
                field.name,
                field.multiple ? v.map((x) => x.id) : v?.id || ""
              )
            }
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                error={Boolean(touched[field.name] && errors[field.name])}
                helperText={touched[field.name] && errors[field.name]}
              />
            )}
          />
        );

      case "date":
        return (
          <DatePicker
            value={values[field.name] || null}
            onChange={(v) => setFieldValue(field.name, v)}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                error: Boolean(touched[field.name] && errors[field.name]),
                helperText: touched[field.name] && errors[field.name],
              },
            }}
          />
        );

      case "select":
        return (
          <TextField
            select
            fullWidth
            size="small"
            {...getFieldProps(field.name)}
            error={Boolean(touched[field.name] && errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
          >
            {field.options?.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        );

      case "checkbox":
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(values[field.name])}
                onChange={(e) =>
                  setFieldValue(field.name, e.target.checked)
                }
              />
            }
            label={field.label}
          />
        );

      case "checkbox-group":
        return (
          <FormGroup>
            {field.options?.map((opt) => (
              <FormControlLabel
                key={opt.value}
                control={
                  <Checkbox
                    checked={values[field.name]?.includes(opt.value)}
                    onChange={(e) => {
                      const current = values[field.name] || [];
                      setFieldValue(
                        field.name,
                        e.target.checked
                          ? [...current, opt.value]
                          : current.filter((v) => v !== opt.value)
                      );
                    }}
                  />
                }
                label={opt.label}
              />
            ))}
          </FormGroup>
        );

      default:
        return (
          <TextField
            fullWidth
            size="small"
            rows={field.rows || null}
            multiline={Boolean(field.rows)}
            placeholder={placeholder}
            {...getFieldProps(field.name)}
            error={Boolean(touched[field.name] && errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
          />
        );
    }
  };

  return (
    <BootstrapDialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>
        {dialogTitle}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon color="error" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit}>
          {tabs.length > 1 && (
            <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)}>
              {tabs.map((t, i) => (
                <Tab key={i} label={t.label} />
              ))}
            </Tabs>
          )}

          <DialogContent dividers>
            {tabs.map(
              (tab, i) =>
                tabIndex === i && (
                  <Grid container spacing={2} key={i}>
                    {tab.fields.map((field) => (
                      <Grid
                        size={{
                          xs: field.grid?.xs || null,
                          sm: field.grid?.sm || null,
                          md: field.grid?.md || null,
                          lg: field.grid?.lg || null,
                          xl: field.grid?.xl || null,
                        }}
                        key={field.name}
                      >
                        {field.type !== "checkbox" && (
                          <Typography variant="body2" mb={0.5}>
                            {field.label}
                          </Typography>
                        )}
                        {renderField(field)}
                      </Grid>
                    ))}
                  </Grid>
                )
            )}
          </DialogContent>

          <DialogActions>
            <Button disabled={loading} type="submit" fullWidth variant="contained">
              {loading
                ? t("processing...") || "Processing..."
                : `${dialogTitle}`}
              
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </BootstrapDialog>
  );
}
