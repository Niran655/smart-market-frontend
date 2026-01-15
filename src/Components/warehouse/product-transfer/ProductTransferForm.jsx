import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation } from "@apollo/client/react";
import { styled } from "@mui/material/styles";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { X } from "lucide-react";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

import { CREATE_WAREHOUSE_TRANSFER } from "../../../../graphql/mutation";
import useGetAllShopAutoComplete from "../../include/includeAutoComplete";
import useGetProductWarehouse from "../../hook/useGetProductWithPagination";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": { padding: theme.spacing(2) },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));

export default function ProductTransferForm({ open, onClose, t }) {
  const { options: shopOptions, loading: shopLoading } =
    useGetAllShopAutoComplete();

  const { products, loading: productLoading } =
    useGetProductWarehouse({
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
        }
      },
    }
  );

  const emptyItem = {
    subProductId: "",
    quantity: "",
  };

  const formik = useFormik({
    initialValues: {
      toShopIds: "",
      note: "",
      items: [emptyItem],
    },
    validationSchema: Yup.object({
      toShopIds: Yup.array().min(1, t("require")),
      items: Yup.array().of(
        Yup.object({
          subProductId: Yup.string().required(t("require")),
          quantity: Yup.number().required(t("require")).min(1),
        })
      ),
    }),
    onSubmit: (values) => {
      createWarehouseTransfer({
        variables: {
          input: {
            toShopId: values.toShopIds,
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

  const { values, setValues, handleSubmit } = formik;
  console.log("formik", formik?.values)

  const addItem = () => {
    setValues({
      ...values,
      items: [...values.items, emptyItem],
    });
  };

  const deleteItem = (index) => {
    if (values.items.length === 1) return;
    const items = [...values.items];
    items.splice(index, 1);
    setValues({ ...values, items });
  };

  const updateItem = (index, field, value) => {
    const items = [...values.items];
    items[index][field] = value;
    setValues({ ...values, items });
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

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t("to_shop")}</Typography>
                <Autocomplete
                  multiple
                  options={shopOptions}
                  loading={shopLoading}
                  value={shopOptions.filter((o) =>
                    values.toShopIds.includes(o.value)
                  )}
                  getOptionLabel={(o) => o.label}
                  onChange={(e, selected) =>
                    setValues({
                      ...values,
                      toShopIds: selected.map((s) => s.value),
                    })
                  }
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography>{t("note")}</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  value={values.note}
                  onChange={(e) =>
                    setValues({ ...values, note: e.target.value })
                  }
                />
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

              <Grid size={{ xs: 12 }}>
                {values.items.map((item, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography>{t("product")}</Typography>
                      <Autocomplete
                        options={products}
                        loading={productLoading}
                        value={
                          products.find(
                            (p) => p.subProduct?._id === item.subProductId
                          ) || null
                        }
                        getOptionLabel={(p) =>
                          p?.subProduct?.parentProductId?.nameEn ||
                          p?.subProduct?.parentProductId?.nameKh ||
                          ""
                        }
                        onChange={(e, val) =>
                          updateItem(
                            index,
                            "subProductId",
                            val?.subProduct?._id || ""
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
