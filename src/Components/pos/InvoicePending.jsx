import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Divider, IconButton, Stack } from "@mui/material";
import { X } from 'lucide-react';
export default function InvoicePending({open,onClose,t}) {
  return (
    <div>
  

      <Drawer
        anchor="right"        
        open={open}
        onClose={onClose}
      >
        <Box
          sx={{ width: 500, p: 2 }}
          role="presentation"
          // onClick={toggleDrawer(false)}
          // onKeyDown={toggleDrawer(false)}
        >
          <Stack mb={2} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
             <Typography variant="h6">{t(`sale_pending`)}</Typography>
              <IconButton onClick={onClose} >
                <X color="red"/>
              </IconButton>
          </Stack>
          <Divider/>

        </Box>
      </Drawer>
    </div>
  );
}