export default {
  chart: {
    height: 350,
    type: 'line',
  },
  legend: { show: false },
  stroke: { width: [0, 0, 4] },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [2]
  },
  xaxis: { show: false },
  plotOptions: {
    bar: {
      columnWidth: '50%'
    }
  },
};
