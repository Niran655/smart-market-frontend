import { Box, Button, Divider, Grid, Menu, MenuItem, Paper, Stack, Typography } from "@mui/material";
import { BookOpenCheck } from "lucide-react";
import { useState } from "react";

import Student from "../assets/Image/student.png";
import Teacher from "../assets/Image/teacher.png";
import Staff from "../assets/Image/staff.png";
import Book from "../assets/Image/book.png";
import "../Styles/dashboard.scss";
export default function Dashboard() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <Paper className="dashboard-card" sx={{ p: 3 }}>
            <Stack direction={"column"}>
              <Stack direction={"row"} spacing={2} mb={2}>
                <Box className="image-box">
                  <img className="image" src={Student} width={50} height={50} />
                </Box>

                <Stack direction={"column"} textAlign={"start"}>
                  <Typography className="price">4325</Typography>
                  <Typography className="text">Total Student</Typography>
                </Stack>
              </Stack>
              <Divider />
              <Stack mt={2} direction={"row"} justifyContent={"space-between"}>
                <Box>
                  <Typography>
                    Active: <span className="num">100</span>{" "}
                  </Typography>
                </Box>
                <Box className="inactive">
                  <Typography>
                    Inactive: <span className="num">150</span>{" "}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <Paper className="dashboard-card" sx={{ p: 3 }}>
            <Stack direction={"column"}>
              <Stack direction={"row"} spacing={2} mb={2}>
                <Box className="image-box">
                  <img className="image" src={Teacher} width={50} height={50} />
                </Box>

                <Stack direction={"column"} textAlign={"start"}>
                  <Typography className="price">4325</Typography>
                  <Typography className="text">Total Teacher</Typography>
                </Stack>
              </Stack>
              <Divider />
              <Stack mt={2} direction={"row"} justifyContent={"space-between"}>
                <Box>
                  <Typography>
                    Active: <span className="num">100</span>{" "}
                  </Typography>
                </Box>
                <Box className="inactive">
                  <Typography>
                    Inactive: <span className="num">150</span>{" "}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <Paper className="dashboard-card" sx={{ p: 3 }}>
            <Stack direction={"column"}>
              <Stack direction={"row"} spacing={2} mb={2}>
                <Box className="image-box">
                  <img className="image" src={Staff} width={50} height={50} />
                </Box>

                <Stack direction={"column"} textAlign={"start"}>
                  <Typography className="price">4325</Typography>
                  <Typography className="text">Total Staff</Typography>
                </Stack>
              </Stack>
              <Divider />
              <Stack mt={2} direction={"row"} justifyContent={"space-between"}>
                <Box>
                  <Typography>
                    Active: <span className="num">100</span>{" "}
                  </Typography>
                </Box>
                <Box className="inactive">
                  <Typography>
                    Inactive: <span className="num">150</span>{" "}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <Paper className="dashboard-card" sx={{ p: 3 }}>
            <Stack direction={"column"}>
              <Stack direction={"row"} spacing={2} mb={2}>
                <Box className="image-box">
                  <img className="image" src={Book} width={50} height={50} />
                </Box>

                <Stack direction={"column"} textAlign={"start"}>
                  <Typography className="price">4325</Typography>
                  <Typography className="text">Total Subject</Typography>
                </Stack>
              </Stack>
              <Divider />
              <Stack mt={2} direction={"row"} justifyContent={"space-between"}>
                <Box>
                  <Typography>
                    Active: <span className="num">100</span>{" "}
                  </Typography>
                </Box>
                <Box className="inactive">
                  <Typography>
                    Inactive: <span className="num">150</span>{" "}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
  
    </Box>
  );
}
