import ReactApexChart from 'react-apexcharts';
import React from 'react';

const StudentChart = () => {
  const [state] = React.useState({
    series: [
      {
        name: 'Planned Study Hours (Q1)',
        group: 'planned',
        color: '#80c7fd',
        data: [40, 55, 41, 67, 22, 43],
      },
      {
        name: 'Actual Study Hours (Q1)',
        group: 'actual',
        color: '#008FFB',
        data: [48, 50, 40, 65, 25, 40],
      },
      {
        name: 'Planned Study Hours (Q2)',
        group: 'planned',
        color: '#80f1cb',
        data: [13, 36, 20, 8, 13, 27],
      },
      {
        name: 'Actual Study Hours (Q2)',
        group: 'actual',
        color: '#00E396',
        data: [20, 40, 25, 10, 12, 28],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      dataLabels: {
        formatter: (val) => val + ' hrs',
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: {
        categories: [
          'Math',
          'Science',
          'English',
          'History',
          'Art',
          'Physical Education',
        ],
      },
      fill: {
        opacity: 1,
      },
      yaxis: {
        labels: {
          formatter: (val) => val + ' hrs',
        },
      },
      legend: {
        position: 'bottom',
        clusterGroupedSeriesOrientation: 'vertical',
      },
    },
  });

  return (
    <div id="chart">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default StudentChart;