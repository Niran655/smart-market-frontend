import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import { CircleOff, ScanEye, Shuffle, Warehouse, X } from "lucide-react";
import React, { useState } from "react";

import GetProductIntoWarehouseInShop from "./GetProductIntoWarehouseInShop";
import ViewProductTransferInShop from "./ViewProductTransferInShop";

export default function GetProductAction({ t }) {
  // const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openGetProduct, setOpenGetProduct] = useState(false);

  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  const handleOpenview = () => setOpenView(true);
  const handleCloseView = () => setOpenView(false);

  const handleOpenGetProduct = () => setOpenGetProduct(true);
  const handleCloseGetProduct = () => setOpenGetProduct(false);

  // const [openDelete, setOpenDelete] = useState(false);
  // const handleOpenDelete = () => setOpenDelete(true);
  // const handleCloseDelete = () => setOpenDelete(false);

  return (
    <div>
      <Stack direction="row" justifyContent={"flex-end"} spacing={2}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleCloseGetProduct}
        >
          {t(`reject`)}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleCloseGetProduct}
        >
          {t(`approve`)}
        </Button>
      </Stack>
    </div>
  );
}
