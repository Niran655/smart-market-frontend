import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import { Divider, Grid, TextField } from "@mui/material";
import * as React from "react";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function UnitForm({ open, onClose, t }) {
  return (
    <BootstrapDialog
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {t(`add_unit`)}
      </DialogTitle>

      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon color="error" />
      </IconButton>

      <Divider />

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{xs:12,md:6}}>
            <Typography variant="body2" >{t(`khmer_name`)}</Typography>
            <TextField
              fullWidth
              placeholder={t(`khmer_name`)}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid size={{xs:12,md:6}}>
            <Typography variant="body2">{t(`english_name`)}</Typography>
            <TextField
              fullWidth
              placeholder={t(`english_name`)}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid size={{xs:12}}>
            <Typography variant="body2">{t(`remark`)}</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder={t(`remark`)}
              variant="outlined"
              size="small"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button fullWidth variant="contained" onClick={onClose}>
          {t(`create`)}
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
