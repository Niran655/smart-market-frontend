import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import ReactApexChart from "react-apexcharts";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import * as React from "react";

// Chart component
const ApexChart = () => {
  const [state] = React.useState({
    series: [44, 55, 41, 17, 15],
    options: {
      chart: {
        type: "donut",
      },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  return (
    <ReactApexChart
      options={state.options}
      series={state.series}
      type="donut"
      width="100%"
    />
  );
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// Main component
export default function AttendanceSection() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: "none" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        //   TabIndicatorProps={{ sx: { display: "none" } }}
        >
          <Tab label="Student" {...a11yProps(0)} sx={{ outline: "none", "&:focus": { outline: "none" } }} />
          <Tab label="Teacher" {...a11yProps(1)} sx={{ outline: "none", "&:focus": { outline: "none" } }} />
          <Tab label="Staff" {...a11yProps(2)} sx={{ outline: "none", "&:focus": { outline: "none" } }} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <Typography variant="h6">Student Chart</Typography>
        <ApexChart />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Typography variant="h6">Teacher Chart</Typography>
        <ApexChart />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Typography variant="h6">Staff Chart</Typography>
        <ApexChart />
      </CustomTabPanel>
    </Box>
  );
}