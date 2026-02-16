import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation } from "@apollo/client/react";
import { styled } from "@mui/material/styles";
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import { X } from "lucide-react";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

import useGetProductWarehouse from "../../hook/useGetProductWithPagination";
import useGetAllShopAutoComplete from "../../include/includeAutoComplete";
import { CREATE_WAREHOUSE_TRANSFER } from "../../../../graphql/mutation";
import { useAuth } from "../../../context/AuthContext";
import useGetProductWarehouseWithPagination from "../../hook/useGetProductWarehouseWithPagination";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": { padding: theme.spacing(2) },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));

const emptyItem = {
  subProductId: "",
  quantity: "",
};

export default function ProductTransferForm({
  open,
  onClose,
  t,
  language,
  setRefetch,
}) {
  const {
    options: shopOptions,
    loading: shopLoading,
    refetch,
  } = useGetAllShopAutoComplete();
  const { setAlert } = useAuth();
  const { productWarehouseWithPagination, loading: productLoading } = useGetProductWarehouseWithPagination({
    page: 1,
    limit: 20,
    pagination: false,
  });

  const [createWarehouseTransfer, { loading }] = useMutation(
    CREATE_WAREHOUSE_TRANSFER,
    {
      onCompleted: ({ createWarehouseTransfer }) => {
        if (createWarehouseTransfer?.isSuccess) {
          onClose();
          refetch();
          setRefetch();
          setAlert(true, "success", createWarehouseTransfer?.message);
        } else {
          setAlert(true, "error", createWarehouseTransfer?.message);
        }
      },
      onError: (error) => {
        setAlert(true, "error", createWarehouseTransfer?.message);
      },
    },
  );

  const formik = useFormik({
    initialValues: {
      toShopIds: [],
      note: "",
      items: [emptyItem],
    },
    validationSchema: Yup.object({
      toShopIds: Yup.array().min(1, t("require")),
      items: Yup.array().of(
        Yup.object({
          subProductId: Yup.string().required(t("require")),
          quantity: Yup.number()
            .typeError(t("require"))
            .required(t("require"))
            .min(1),
        }),
      ),
    }),
    onSubmit: (values) => {
      createWarehouseTransfer({
        variables: {
          input: {
            toShopIds: values.toShopIds,
            note: values.note,
            items: values.items.map((i) => ({
              subProductId: i.subProductId,
              quantity: Number(i.quantity),
            })),
          },
        },
      });
    },
  });

  const { values, errors, touched, handleSubmit, setValues } = formik;

  const addItem = () => {
    setValues({
      ...values,
      items: [...values.items, emptyItem],
    });
  };

  const deleteItem = (index) => {
    if (values.items.length === 1) return;
    const newItems = values.items.filter((_, i) => i !== index);
    setValues({ ...values, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...values.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setValues({ ...values, items: newItems });
  };

  return (
    <BootstrapDialog open={open} fullWidth maxWidth="md">
      <DialogTitle>
        {t("create_transfer")}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {/* TO SHOP */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t("to_shop")}</Typography>
                <Autocomplete
                  multiple
                  placeholder={t(`select_shop`)}
                  options={shopOptions}
                  loading={shopLoading}
                  value={shopOptions.filter((o) =>
                    values.toShopIds.includes(o.value),
                  )}
                  getOptionLabel={(o) => o.label}
                  onChange={(e, selected) =>
                    setValues({
                      ...values,
                      toShopIds: selected.map((s) => s.value),
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      error={Boolean(touched.toShopIds && errors.toShopIds)}
                      helperText={touched.toShopIds && errors.toShopIds}
                    />
                  )}
                />
              </Grid>
              ​
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t("remark")}</Typography>
                <TextField
                  fullWidth
                  multiline
                  placeholder={t(`remark`)}
                  size="small"
                  value={values.note}
                  onChange={(e) =>
                    setValues({ ...values, note: e.target.value })
                  }
                />
              </Grid>
              {/* PRODUCT HEADER */}
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
              {/* PRODUCT LIST */}
              <Grid size={{ xs: 12 }}>
                {values.items.map((item, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography>{t("product")}</Typography>
                      <Autocomplete
                        options={productWarehouseWithPagination}
                        loading={productLoading}
                        value={
                          productWarehouseWithPagination.find(
                            (p) => p.subProduct?._id === item.subProductId,
                          ) || null
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.subProduct?._id === value.subProduct?._id
                        }
                        getOptionLabel={(p) => {
                          const productName =
                            language === "en"
                              ? p?.subProduct?.parentProductId?.nameEn ||
                                "Unnamed"
                              : p?.subProduct?.parentProductId?.nameKh ||
                                "គ្មានឈ្មោះ";

                          const unitKh =
                            p?.subProduct?.unitId?.nameKh || "គ្មានឯកតា";
                          const unitEn =
                            p?.subProduct?.unitId?.nameEn || "No Unit";

                          return `${productName} (${unitKh} / ${unitEn})`;
                        }}
                        onChange={(e, val) =>
                          updateItem(
                            index,
                            "subProductId",
                            val?.subProduct?._id || "",
                          )
                        }
                        renderInput={(params) => (
                          <TextField {...params} size="small" />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <Typography>{t("quantity")}</Typography>
                      <TextField
                        size="small"
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", e.target.value)
                        }
                        error={Boolean(
                          touched.items?.[index]?.quantity &&
                          errors.items?.[index]?.quantity,
                        )}
                        helperText={
                          touched.items?.[index]?.quantity &&
                          errors.items?.[index]?.quantity
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                      <Typography>{t("delete")}</Typography>
                      <IconButton onClick={() => deleteItem(index)}>
                        <X color="red" />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
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
