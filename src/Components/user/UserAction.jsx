import { IconButton, Stack } from "@mui/material";
import { SquarePen, Trash } from "lucide-react";
import React, { useState } from "react";

import DeleteUser from "./DeleteUser";
import UserForm from "./UserForm";

export default function UserAction({
  userData,
  setRefetch,
  userId,
  t,
  userName,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <IconButton className="edit-icon" onClick={handleOpen}>
          <SquarePen  size="18px" color="#36BBA7" />
        </IconButton>
        <IconButton className="delete-icon" onClick={handleOpenDelete}>
          <Trash size="18px" color="red " />
        </IconButton>
      </Stack>

      <UserForm
        open={open}
        onClose={handleClose}
        dialogTitle="Update"
        userData={userData}
        setRefetch={setRefetch}
        t={t}
      />

      <DeleteUser
        setRefetch={setRefetch}
        open={openDelete}
        onClose={handleCloseDelete}
        userId={userId}
        userName={userName}
      />
    </div>
  );
}