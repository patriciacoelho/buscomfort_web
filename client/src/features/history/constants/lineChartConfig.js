export default {
  chart: {
    type: 'area',
    stacked: false,
    height: 200,
  },
  dataLabels: { enabled: false },
  markers: { size: 0 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 90, 100]
    }
  },
  tooltip: {
    shared: false,
    y: {
      formatter: function(val) {
        return val;
        // return `${val} ºC`;
      }
    }
  }
};
