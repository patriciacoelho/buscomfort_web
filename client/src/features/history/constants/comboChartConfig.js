export default {
  chart: {
    height: 350,
    type: 'line',
  },
  legend: { show: false },
  stroke: { width: [0, 4] },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [1]
  },
  xaxis: { type: 'datetime', show: false },
  yaxis: [{}, { opposite: true, show: false, } ],
};
