import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { UserRoundCheck } from 'lucide-react';

import "../../Styles/event.scss";
export default function Calendar() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "100%" }}>
        <DateCalendar />
      </Box>
      <Box sx={{ textAlign: "start" }}>
        <Typography variant="h6">Upcoming Events</Typography>
        <Stack spacing={2} mt={2}>
          <Box className="event-box">
            <Stack direction={"row"} alignItems={"center"} spacing={2} mb={2}>
                <UserRoundCheck/>
              <Stack direction={"column"}>
                <Typography>Parents, Teacher Meet</Typography>
                <Typography>15 July 2024</Typography>
              </Stack>
            </Stack>
            <Divider />
            <Stack direction={"row"} mt={2}>
              <Typography>09:10AM - 10:50PM</Typography>
            </Stack>
          </Box>
        </Stack>
         <Stack spacing={2} mt={2}>
          <Box className="event-box">
            <Stack direction={"row"} alignItems={"center"} spacing={2} mb={2}>
                <UserRoundCheck/>
              <Stack direction={"column"}>
                <Typography>Parents, Teacher Meet</Typography>
                <Typography>15 July 2024</Typography>
              </Stack>
            </Stack>
            <Divider />
            <Stack direction={"row"} mt={2}>
              <Typography>09:10AM - 10:50PM</Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}
