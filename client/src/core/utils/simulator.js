import BusService from '../../services/BusService';
import ReadingService from '../../services/ReadingService';

const gpsPoints = [
  [-9.390965337036407, -40.497488856527994],
  [-9.388865217865824, -40.49508315424393],
  [-9.386613103580391, -40.497863745020986],
  [-9.388786574168245, -40.501539874386786],
  [-9.391120039730906, -40.502276451783445],
  [-9.394933555262245, -40.50375636417384],
  [-9.396286943173719, -40.50503354881732],
  [-9.398707027584852, -40.505060579197206],
  [-9.400720418232543, -40.504107758903665],
  [-9.402633795184933, -40.5037293338152],
  [-9.404761179992853, -40.504202821384396],
  [-9.407089607431217, -40.5047429768281],
  [-9.409547552482083, -40.505307609067145],
  [-9.411930299150058, -40.50585537890223],
  [-9.413049414923657, -40.506926452509354],
  [-9.413308627156251, -40.5108917517599],
  [-9.413695536919338, -40.51514048915374],
  [-9.412315239991266, -40.51464867920375],
  [-9.411171058842246, -40.51139321945974],
  [-9.411313290517043, -40.50823044127584],
  [-9.411313290517043, -40.506013793356615],
  [-9.410708805482967, -40.50524787842517],
  [-9.409330931234157, -40.50522985689738],
  [-9.40681348812178, -40.504696652766135],
  [-9.403989737756259, -40.504052386261364],
  [-9.401718944392268, -40.50362967227255],
  [-9.400003223285205, -40.5041703181065],
  [-9.399416498053357, -40.50371076914764],
  [-9.39952317544222, -40.502386186854444],
  [-9.398225264940553, -40.50216091773971],
  [-9.39541579982485, -40.50192009866239],
  [-9.392577455164181, -40.501668709348245],
  [-9.39022160784804, -40.50016391175828],
  [-9.390034917381415, -40.498514941964714],
  [-9.390968368708522, -40.497460682588496],
];

const sensors = {
  temperature: {
    base: 25,
    min: 21,
    max: 36,
  },
  humidity: {
    base: 0.45,
    min: 0.28,
    max: 0.72,
  },
  noise: {
    base: 45,
    min: 20,
    max: 90,
  },
  jerk: {
    base: 1.6,
    min: 0.8,
    max: 2.0,
  },
};

var busIds = null;

function generateSensorValue(type) {
  const factor = Math.random() * (0.15 - (-0.15)) + (-0.15);

  const currentValue = type === 'noise' || type === 'jerk'
    ? currentReading[type][1] : currentReading[type];
  let newValue = currentValue * (1 + factor);

  newValue = newValue > sensors[type].max
    || newValue < sensors[type].min 
    ? currentValue * (1 - factor) : newValue;
  return newValue;
}

function computeNoiseComfort() {
  const sum = currentReading.noise.reduce((a, b) => a + b);

  return 6 - parseInt(5*(
      currentReading.noise[0] * 0.0 +
      currentReading.noise[1] * 0.25 +
      currentReading.noise[2] * 0.5 +
      currentReading.noise[3] * 0.75 +
      currentReading.noise[4]
    ) / sum);
}

function computeThermalComfort() {
  return Math.floor(Math.random() * (5 - 1)) + 1;
}

function computeRideComfort() {
  return Math.floor(Math.random() * (5 - 1)) + 1;
}

var currentReading = {
  gpsLocation: null,
  gpsDatetime: null,
  temperature: sensors.temperature.base,
  humidity: sensors.humidity.base,
  noise: [sensors.noise.base, sensors.noise.base, sensors.noise.base, sensors.noise.base, sensors.noise.base],
  jerk: [sensors.jerk.base, sensors.jerk.base, sensors.jerk.base],
  noiseComfort: null,
  maxNoise: null,
  // thermalComfort: null,
  // rideComfort: null,
  bus: null,
};
var currentIndex = [0, 20];
function newReading(busIndex) {
  currentIndex[busIndex]++;
  if (currentIndex[busIndex] >= gpsPoints.length) {
    currentIndex[busIndex] = 0;
  }

  currentReading.temperature = parseInt(generateSensorValue('temperature'));
  currentReading.humidity = generateSensorValue('humidity').toFixed(2);
  currentReading.noise = [
    parseInt(generateSensorValue('noise')),
    parseInt(generateSensorValue('noise')),
    parseInt(generateSensorValue('noise')),
    parseInt(generateSensorValue('noise')),
    parseInt(generateSensorValue('noise')),
  ];
  currentReading.jerk = [
    generateSensorValue('jerk').toFixed(1),
    generateSensorValue('jerk').toFixed(1),
    generateSensorValue('jerk').toFixed(1),
  ];
  currentReading.noiseComfort = computeNoiseComfort();
  // currentReading.thermalComfort = computeThermalComfort();
  // currentReading.rideComfort = computeRideComfort();
  currentReading.bus = busIds[busIndex];
  currentReading.gpsLocation = busIndex ? gpsPoints[currentIndex[busIndex]] : gpsPoints[gpsPoints.length - (currentIndex[busIndex] + 1)];
  currentReading.gpsDatetime = new Date();
  currentReading.maxNoise = currentReading.noise.reduce((a, b) => Math.max(a, b));

  ReadingService.create(currentReading).then(({ data }) => {
    if (data) {
      console.log('Nova leitura salva.');
    }
  })
  .catch(e => console.log(e));
}

var updateReadingsClock1 = null;
var updateReadingsClock2 = null;
function simulateReadings(value) {
  console.log(value);
  if (!value) {
    clearInterval(updateReadingsClock1);
    clearInterval(updateReadingsClock2);
    return;
  }

  BusService.getAll().then(({ data }) => {
    busIds = data.map((bus) => bus.id);

    updateReadingsClock1 = setInterval(() => newReading(0), 60000);
    updateReadingsClock2 = setInterval(() => newReading(1), 55000);
  }).catch((e) => console.log(e));
}

export default simulateReadings;
