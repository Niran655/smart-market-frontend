import { Box, Divider, Stack, Typography } from "@mui/material";
import React from "react";

import Teacher from "../../assets/Image/teacher.png";

const teachers = [
  {
    name: "James",
    subject: "Physics Teacher",
    leave: "12 -13 May",
    applied: "11 May",
  },
  {
    name: "Sophia",
    subject: "Math Teacher",
    leave: "10 -11 May",
    applied: "9 May",
  },
  {
    name: "David",
    subject: "Chemistry Teacher",
    leave: "15 -16 May",
    applied: "14 May",
  },
  {
    name: "Emily",
    subject: "Biology Teacher",
    leave: "18 -19 May",
    applied: "17 May",
  },
];

const LeaveRequests = () => {
  return (
    <Box>
      {teachers.map((teacher, index) => (
        <Box key={index} mb={2}>
          <Stack direction={"row"} mt={2} mb={1} spacing={2}>
            <Box>
              <img src={Teacher} alt="teacher" width={40} height={40} />
            </Box>
            <Stack direction={"column"} textAlign={"start"}>
              <Typography>{teacher.name}</Typography>
              <Typography>{teacher.subject}</Typography>
            </Stack>
          </Stack>
          <Divider />
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mt={1}
          >
            <Typography>Leave : {teacher.leave}</Typography>
            <Typography>Apply on : {teacher.applied}</Typography>
          </Stack>
        </Box>
      ))}
    </Box>
  );
};

export default LeaveRequests;
