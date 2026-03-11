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

const Profile = () => {
  const { userId } = useParams();
  const id = userId || null;
  const { profile, loading } = useGetProfileById({ _id: id });
  const [open, setOpen] = useState(false);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Paper sx={{ p: 4, borderRadius: 1 }}>
        <Grid container spacing={4}>
          
          <Grid size={{xs:12,md:3}} >
            <Stack spacing={2} alignItems="center">
              <Avatar
                src={profile?.image}
                sx={{ width: 120, height: 120, borderRadius: 1, cursor: "pointer" }}
                onClick={() => setOpen(true)}
              />

              <Typography variant="h6">{profile?.nameEn}</Typography>
              <Typography color="text.secondary">{profile?.role}</Typography>

              <Stack direction="row" spacing={1}>
                <Button variant="contained">Send Message</Button>
                <Button variant="outlined">Contact</Button>
              </Stack>
            </Stack>
          </Grid>

          
          <Grid size={{xs:12,md:9}} textAlign="start">
            <Typography variant="h5" mb={2}>
              Profile Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid size={{xs:6}}>
                <Typography color="text.secondary">Email</Typography>
                <Typography>{profile?.email}</Typography>
              </Grid>

              <Grid size={{xs:6}}>
                <Typography color="text.secondary">Phone</Typography>
                <Typography>{profile?.phone}</Typography>
              </Grid>

              <Grid size={{xs:6}}>
                <Typography color="text.secondary">Gender</Typography>
                <Typography>{profile?.gender}</Typography>
              </Grid>

              <Grid size={{xs:6}}>
                <Typography color="text.secondary">Status</Typography>
                <Typography>{profile?.active ? "Active" : "Inactive"}</Typography>
              </Grid>

              <Grid size={{xs:6}}>
                <Typography color="text.secondary">Created At</Typography>
                <Typography>{profile?.createdAt}</Typography>
              </Grid>

              <Grid size={{xs:6}}>
                <Typography color="text.secondary">Updated At</Typography>
                <Typography>{profile?.updatedAt}</Typography>
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