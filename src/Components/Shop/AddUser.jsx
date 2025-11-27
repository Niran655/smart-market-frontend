import { useMutation, useQuery } from "@apollo/client/react";
import { Button, Chip, CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, Grid, IconButton, MenuItem, OutlinedInput, Select, Stack, Typography } from "@mui/material";
import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";

import "../../Styles/dialogStyle.scss";
import { ADD_USER_CONTROLL_SHOP, DELETE_USER_FROM_SHOP } from "../../../graphql/mutation";
import { useAuth } from "../../context/AuthContext";
import { GET_SHOP_BY_SHOP_ID, GET_USER_WITH_PAGINATION } from "../../../graphql/queries";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function AddUser({
  open,
  onClose,
  setRefetch,
  t,
  shopId,
  userId,
}) {
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { language } = useAuth();
  const {
    data,
    refetch,
    loading: queryLoading,
  } = useQuery(GET_USER_WITH_PAGINATION, {
    variables: { page: 1, limit: 10, pagination: false, keyword: "", role: "" },
  });

  const [deleteUserFromShop] = useMutation(DELETE_USER_FROM_SHOP, {
    onCompleted: ({ deleteUserFromShop }) => {
      setDeleteLoading(false);
      if (deleteUserFromShop?.isSuccess) {
        setAlert(true, "success", deleteUserFromShop?.message);
        setRefetch?.();
        refetchShop();
        refetch();
      } else {
        setAlert(true, "error", deleteUserFromShop?.message);
      }
    },
    onError: (error) => {
      setDeleteLoading(false);
      console.error("Delete Error", error);
    },
  });

  const {
    data: shopData,
    loading: shopLoading,
    refetch: refetchShop,
  } = useQuery(GET_SHOP_BY_SHOP_ID, {
    variables: { shopId: shopId, id: userId },
    // skip: !shopId,
  });

  const [addUserControllShop] = useMutation(ADD_USER_CONTROLL_SHOP, {
    onCompleted: ({ addUserControllShop }) => {
      setLoading(false);
      if (addUserControllShop?.isSuccess) {
        onClose?.();
        setAlert(true, "success", addUserControllShop?.message);
        setRefetch?.();
        setSelectedUsers([]);
        refetchShop();
        refetch();
      } else {
        setAlert(true, "error", addUserControllShop?.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      console.error("Error", error);
      setAlert(true, "error", t("add_failed"));
    },
  });

  const existingUsers = shopData?.getShopByShopId?.user || [];
  console.log("exitting user",existingUsers)
  const existingUserIds = existingUsers.map((user) => user._id || user.id);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedUsers(typeof value === "string" ? value.split(",") : value);
  };

  const handleSubmit = () => {
    if (!shopId || selectedUsers.length === 0) {
      setAlert(true, "error", t("missing_data") || "Missing data");
      return;
    }

    const newUsers = selectedUsers.filter(
      (id) => !existingUserIds.includes(id)
    );

    if (newUsers.length === 0) {
      setAlert(
        true,
        "error",
        t("no_new_user_selected") || "No new users selected"
      );
      return;
    }

    setLoading(true);
    addUserControllShop({
      variables: {
        id: shopId,
        userId: newUsers,
      },
    });
  };

  const handleDeleteUser = (userIdToDelete) => {
    console.log("userIdToDelete", userIdToDelete);
    if (!shopId || !userIdToDelete) {
      setAlert(true, "error", "Missing shop or user ID");
      return;
    }

    setDeleteLoading(true);
    deleteUserFromShop({
      variables: {
        id: shopId,
        userId: userIdToDelete,
      },
    });
  };

  useEffect(() => {
    if (!open) {
      setSelectedUsers([]);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      className="dialog-container"
      PaperProps={{
        style: { position: "absolute", width: "450px", borderRadius: "8px" },
      }}
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Typography>{t("add_user")}</Typography>
          <IconButton onClick={onClose}>
            <CircleX className="dialog-close-icon" />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText>
          <Stack margin="0px 0px 20px 0px" spacing={3}>
            <Stack spacing={1}>
              <Typography variant="subtitle1" fontWeight="bold">
                {t("current_users") || "Current Users"}
              </Typography>
              {shopLoading ? (
                <CircularProgress size={20} />
              ) : existingUsers.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {t("no_users_assigned")}
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {existingUsers.map((user) => (
                    <Stack
                      key={user._id || user.id}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        p: 1,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography>
                        {language == "en" ? user.nameEn : user.nameKh}
                      </Typography>
                      <Typography>{user.role || user.role}</Typography>
                      <Button
                        size="small"
                        color="error"
                        disabled={deleteLoading}
                        onClick={() => handleDeleteUser(user._id || user.id)}
                      >
                        {deleteLoading ? (
                          <CircularProgress size={16} />
                        ) : (
                          "Remove"
                        )}
                      </Button>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Typography variant="subtitle1" fontWeight="bold">
                {t("add_new_users")}
              </Typography>
              {queryLoading ? (
                <CircularProgress />
              ) : (
                <FormControl sx={{ width: "100%" }}>
                  <Select
                    multiple
                    value={selectedUsers}
                    size="small"
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" />}
                    renderValue={(selected) => (
                      <Stack direction="row" flexWrap="wrap" gap={0.5}>
                        {selected.map((id) => {
                          const user = data?.getUsersWithPagination?.data.find(
                            (u) => u._id === id || u.id === id
                          );
                          return (
                            <Chip
                              key={id}
                              label={user?.nameKh || user?.nameEn || id}
                              onDelete={() =>
                                setSelectedUsers((prev) =>
                                  prev.filter((uid) => uid !== id)
                                )
                              }
                              onMouseDown={(event) => {
                                event.stopPropagation();
                              }}
                            />
                          );
                        })}
                      </Stack>
                    )}
                    MenuProps={MenuProps}
                  >
                    {data?.getUsersWithPagination?.data.map((user) => {
                      const isAdded = existingUserIds.includes(
                        user._id || user.id
                      );
                      return (
                        <MenuItem
                          key={user._id || user.id}
                          value={user._id || user.id}
                          disabled={isAdded}
                        >
                          {user.nameKh || user.nameEn || user._id}
                          {isAdded ? " (Already added)" : ""}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              )}
            </Stack>

            <Button
              className="btn-primary"
              fullWidth
              onClick={handleSubmit}
              disabled={loading || selectedUsers.length === 0}
              variant="contained"
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <Typography className="txt-btn">{t("create")}</Typography>
              )}
            </Button>
          </Stack>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
