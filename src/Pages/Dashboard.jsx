import { Box, Button, Divider, Grid, Menu, MenuItem, Paper, Stack, Typography } from "@mui/material";
import { BookOpenCheck } from "lucide-react";
import { useState } from "react";

import AttendanceSection from "../Components/dashboard/AttendanceSection";
import QuickLinksSection from "../Components/dashboard/QuickLinksSection";
import CollectionChart from "../Components/dashboard/CollectionChart";
import LeaveRequests from "../Components/dashboard/LeaveRequests";
import Calendar from "../Components/dashboard/Calendar";
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
      <Stack mt={2}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper className="second-section">
              <Stack direction={"row"} justifyContent={"space-between"} mb={2}>
                <Typography className="title">Schedules</Typography>
                <Typography>Add New</Typography>
              </Stack>
              <Divider />
              <Calendar />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper className="second-section">
              <Stack direction={"row"} justifyContent={"space-between"} mb={2}>
                <Typography className="title">Attendance</Typography>
                <Typography>Today</Typography>
              </Stack>
              <Divider />
              <AttendanceSection />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper className="second-section">
              <Stack direction={"row"} justifyContent={"space-between"} mb={2}>
                <Typography className="title">Quick Links</Typography>
              </Stack>
              <Divider />
              <Box className="quick-links">
                <QuickLinksSection />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
      <Stack>
        <Grid container spacing={2} mt={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper className="second-section">
              <Stack direction={"row"} justifyContent={"space-between"} mb={2}>
                <Typography className="title">Fees Collection</Typography>
                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  variant="text"
                >
                  <Typography>This Day </Typography>
                </Button>

                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    list: {
                      "aria-labelledby": "basic-button",
                    },
                  }}
                >
                  <MenuItem onClick={handleClose}>This Day</MenuItem>
                  <MenuItem onClick={handleClose}>This Year</MenuItem>
                  <MenuItem onClick={handleClose}>Last Year</MenuItem>
                </Menu>
              </Stack>
              <Divider />
              <CollectionChart />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper className="second-section">
              <Stack direction={"row"} justifyContent={"space-between"} mb={2}>
                <Typography className="title">Leave Requests</Typography>
                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  variant="text"
                >
                  <Typography>This Day </Typography>
                </Button>

                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    list: {
                      "aria-labelledby": "basic-button",
                    },
                  }}
                >
                  <MenuItem onClick={handleClose}>This Day</MenuItem>
                  <MenuItem onClick={handleClose}>This Year</MenuItem>
                  <MenuItem onClick={handleClose}>Last Year</MenuItem>
                </Menu>
              </Stack>
              <Divider />
              <LeaveRequests />
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
