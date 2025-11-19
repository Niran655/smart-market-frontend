import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { Avatar, Divider, Grid, MenuItem, Stack, TextField } from "@mui/material";
import * as React from "react";

import Profile from "../../assets/Image/profile.png";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function StudentForm({ open, onClose, t }) {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <BootstrapDialog
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {t(`add_student`)}
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

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label={t("personal")} />
        <Tab label={t("parents")} />
        <Tab label={t("sibilings")} />
        <Tab label={t("more")} />
      </Tabs>

      <DialogContent dividers>
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Box display="flex" justifyContent="center">
                <Avatar
                  src={Profile}
                  alt="Profile"
                  sx={{ width: 100, height: 100 }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
              <Typography>{t(`first_name`)}</Typography>
              <TextField
                fullWidth
                placeholder={t(`first_name`)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
              <Typography>{t(`last_name`)}</Typography>
              <TextField
                fullWidth
                placeholder={t(`last_name`)}
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
              <Typography>{t(`class`)}</Typography>
              <TextField
                fullWidth
                select
                variant="outlined"
                size="small"
                defaultValue="active"
              >
                <MenuItem value="a">A</MenuItem>
                <MenuItem value="b">B</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
              <Typography>{t(`section`)}</Typography>
              <TextField
                fullWidth
                select
                variant="outlined"
                size="small"
                defaultValue={t(`morning`)}
              >
                <MenuItem value="a">{t(`morning`)}</MenuItem>
                <MenuItem value="b">{t(`evening`)}</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
              <Typography>{t(`gender`)}</Typography>
              <TextField
                fullWidth
                select
                placeholder="Gender"
                variant="outlined"
                size="small"
                defaultValue={t(`male`)}
              >
                <MenuItem value="a">{t(`male`)}</MenuItem>
                <MenuItem value="b">{t(`female`)}</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
              <Typography>{t(`date_of_birth`)}</Typography>
              <TextField
                fullWidth
                placeholder={t(`date_of_birth`)}
                type="date"
                LabelProps={{ shrink: true }}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
              <Typography>{t(`email`)}</Typography>
              <TextField
                fullWidth
                placeholder={t(`email`)}
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
              <Typography>{t(`status`)}</Typography>
              <TextField
                fullWidth
                select
                variant="outlined"
                size="small"
                defaultValue="active"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 4 }}></Grid>
            <Grid size={{ xs: 12 }}>
              <Typography>{t(`address`)}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <Typography>{t(`village`)}</Typography>
              <TextField
                fullWidth
                select
                variant="outlined"
                size="small"
                defaultValue="active"
              >
                <MenuItem value="active">គោកត្រាច</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <Typography>{t(`commune`)}</Typography>
              <TextField
                fullWidth
                select
                variant="outlined"
                size="small"
                defaultValue="active"
              >
                <MenuItem value="active">រើល</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <Typography>{t(`district`)}</Typography>
              <TextField
                fullWidth
                select
                variant="outlined"
                size="small"
                defaultValue="active"
              >
                <MenuItem value="active">ពួក</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <Typography>{t(`province`)}</Typography>
              <TextField
                fullWidth
                select
                variant="outlined"
                size="small"
                defaultValue="active"
              >
                <MenuItem value="active">សៀមរាប</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </TabPanel>
        {/* ============= */}
        <TabPanel value={tabValue} index={1}>
          <Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4, md: 6 }}>
                <Typography>{t(`farther_name`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`farther_name`)}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 6 }}>
                <Typography>{t(`email`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`email`)}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4, md: 6 }}>
                <Typography>{t(`phone`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`phone`)}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 6 }}>
                <Typography>{t(`father_occupation`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`phone`)}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 6 }}>
                <Typography>{t(`mother_name`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`mother_name`)}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 6 }}>
                <Typography>{t(`email`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`email`)}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4, md: 6 }}>
                <Typography>{t(`phone`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`phone`)}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 6 }}>
                <Typography>{t(`mother_occupation`)}</Typography>
                <TextField
                  fullWidth
                  placeholder={t(`phone`)}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>
          </Typography>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Typography>{t("tab3_content")}</Typography>
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <Typography>{t("tab4_content")}</Typography>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button fullWidth variant="contained" onClick={onClose}>
          {t(`create`)}
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
