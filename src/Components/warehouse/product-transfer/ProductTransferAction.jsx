import { IconButton, Stack, Tooltip } from "@mui/material";
import { FilePenLine, ScanEye, Shuffle, Trash } from "lucide-react";
import React, { useState } from "react";

import ViewProductTransfer from "./ViewProductTransfer";

export default function ProductTransferAction({ editData, t, language }) {
 
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenview = () => setOpenView(true);
  const handleCloseView = () => setOpenView(false);
 
  const [cancelTransfer,setCancelTransfer] = useState(false);
  const handleOpenCancelTransfer = () => setCancelTransfer(true);
  const handleCloseCancelTransfer = () =>setCancelTransfer(false);


  return (
    <div>
      <Stack direction="row" spacing={2}>
        <Tooltip title={t("view_stock")}>
          <IconButton className="edit-icon" onClick={handleOpenview}>
            <ScanEye size="18px" color="#36BBA7" />
          </IconButton>
        </Tooltip>
        <ViewProductTransfer
          t={t}
          language={language}
          viewData={editData}
          open={openView}
          onClose={handleCloseView}
        />
        
        <Tooltip title="Delete">
          <IconButton className="delete-icon" onClick={handleOpenCancelTransfer}>
            <Trash size="18px" color="red" />
          </IconButton>
        </Tooltip>
      </Stack>
    </div>
  );
}
