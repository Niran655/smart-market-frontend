import { IconButton, Stack, Tooltip } from "@mui/material";
import { Shrink, Shuffle, SquarePen, Trash } from "lucide-react";
import React, { useState } from "react";

import AdjustStockForm from "./AdjustStockForm";

export default function ProductWarehouseAction({
  subProductId,
  t,
  setRefetch,
  unit
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
        <Tooltip title={t("adjust_stock")}>
          <IconButton className="edit-icon" onClick={handleOpen}>
            <Shrink size="18px" color="#36BBA7" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
          <IconButton className="delete-icon" onClick={handleOpenDelete}>
            <Trash size="18px" color="red" />
          </IconButton>
        </Tooltip>

     
        {open && (
          <AdjustStockForm
            open={open}
            unit={unit}
            onClose={handleClose}
            subProductId={subProductId}
            setRefetch={setRefetch}
            t={t}
          />
        )}
      </Stack>
    </div>
  );
}
