import { IconButton, Stack, Tooltip } from "@mui/material";
import { CircleOff, ScanEye, Shuffle, Warehouse, X } from "lucide-react";
import React, { useState } from "react";

import GetProductIntoWarehouseInShop from "./GetProductIntoWarehouseInShop";
import ViewProductTransferInShop from "./ViewProductTransferInShop";

export default function GetProductInShopAction({
  editData,
  t,
  language,
  loading,
  refetch,
}) {
  const [openView, setOpenView] = useState(false);
  const [openGetProduct, setOpenGetProduct] = useState(false);

  const handleOpenview = () => setOpenView(true);
  const handleCloseView = () => setOpenView(false);

  const handleOpenGetProduct = () => setOpenGetProduct(true);
  const handleCloseGetProduct = () => setOpenGetProduct(false);

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <Tooltip title={t("view_detail")}>
          <IconButton className="edit-icon" onClick={handleOpenview}>
            <ScanEye size="18px" color="#36BBA7" />
          </IconButton>
        </Tooltip>

        <ViewProductTransferInShop
          t={t}
          language={language}
          viewData={editData}
          open={openView}
          onClose={handleCloseView}
        />

        <Tooltip title="get_product_in_warehouse">
          <IconButton className="delete-icon" onClick={handleOpenGetProduct}>
            <Warehouse size="18px" color="orange" />
          </IconButton>
        </Tooltip>

        <GetProductIntoWarehouseInShop
          t={t}
          language={language}
          editData={editData}
          open={openGetProduct}
          onClose={handleCloseGetProduct}
          loading={loading}
          refetch={refetch}
        />
      </Stack>
    </div>
  );
}
