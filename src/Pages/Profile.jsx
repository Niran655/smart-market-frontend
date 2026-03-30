import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
  Divider,
  Dialog,
} from "@mui/material";
import { useState } from "react";
import useGetProfileById from "../Components/hook/useGetProfileById";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { translateLauguage } from "../function/translate";

const Profile = () => {
  const { userId } = useParams();
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const id = userId || null;
  const { profile, loading } = useGetProfileById({ _id: id });
  const [open, setOpen] = useState(false);

  if (loading) return <Typography>Loading...</Typography>;
const formatDateDDMMMYYYY = (date, lang = "en") => {
  if (!date) return "";

  const d = new Date(date);

  // جلوگیری invalid date
  if (isNaN(d)) return "";

  const locale = lang === "en" ? "en-US" : "km-KH";

  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString(locale, { month: "short" });
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};
  return (
    <Box>
      <Paper sx={{ p: 4, borderRadius: 1 }}>
        <Grid container spacing={4}>

          <Grid size={{ xs: 12, md: 3 }} >
            <Stack spacing={2} alignItems="center">
              <Avatar
                src={profile?.image}
                sx={{ width: 120, height: 120, borderRadius: 1, cursor: "pointer" }}
                onClick={() => setOpen(true)}
              />

              <Typography variant="h6">{language === "en" ? profile?.nameEn : profile?.nameKh}</Typography>
              <Typography color="text.secondary">


                {profile.role === "admin" && t("admin")}
                {profile.role === "superAdmin" && t("super_admin")}
                {profile.role === "cashier" && t("cashier")}
                {profile.role === "manager" && t("manager")}
                {profile.role === "stockController" && t("stock_controller")}
              </Typography>

              <Stack direction="row" spacing={1}>
                <Button variant="contained">{t("send_message")}</Button>
                <Button variant="outlined">{t("contact")}</Button>
              </Stack>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 9 }} textAlign="start">
            <Typography variant="h5" mb={2}>
              {t("profile_information")}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography color="text.secondary">{t("email")}</Typography>
                <Typography>{profile?.email}</Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography color="text.secondary">{t("phone")}</Typography>
                <Typography>{profile?.phone}</Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography color="text.secondary">{t("gender")}</Typography>
                <Typography>

                  {profile.gender === "male" && t("male")}
                  {profile.gender === "female" && t("female")}
                  
                  </Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography color="text.secondary">{t("status")}</Typography>
                <Typography>
                  {profile?.active ? t("active") : t("inactive")}
                  </Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography color="text.secondary">{t("create_at")}</Typography>
                <Typography>{formatDateDDMMMYYYY(profile?.createdAt)}</Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography color="text.secondary">{t("update_at")}</Typography>
                <Typography>{formatDateDDMMMYYYY(profile?.updatedAt)}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>


      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <Box sx={{ textAlign: "center", p: 2 }}>
          <img
            src={profile?.image}
            alt="Profile"
            style={{ maxWidth: "100%", borderRadius: 8 }}
          />
        </Box>
      </Dialog>
    </Box>
  );
};

export default Profile;