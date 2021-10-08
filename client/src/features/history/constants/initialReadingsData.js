import { TEMPERATURE, HUMIDITY, NOISE, KINETIC } from '../../../core/constants/historyTabs';

const unitOfMeasure = (index) => {
  switch(index) {
  case KINETIC:
    return 'm/s³';
  case NOISE:
    return 'db(A)';
  case HUMIDITY:
    return '%';
  case TEMPERATURE:
  default:
    return 'ºC';
  }
};

export const initialReadingData = {
  temperature: {
    comfortChart: [0, 0, 0, 0, 0],
    lineChart: { name: 'Temperatura', data: [] },
    comboChart: {
      labels: [],
      series: [
        { name: 'Mínima', data: [], type: 'column' },
        { name: 'Máxima', data: [], type: 'column' },
        { name: 'Média', data: [], type: 'line' }
      ]
    },
    unitOfMeasure: unitOfMeasure(TEMPERATURE),
    limits: {
      max: 50,
      min: 12,
      maxComfortable: 27,
      minComfortable: 19,
    },
  },
  humidity: {
    comfortChart: [0, 0, 0, 0, 0],
    lineChart: { name: 'Umidade', data: [] },
    comboChart: {
      labels: [],
      series: [
        { name: 'Mínima', data: [], type: 'column' },
        { name: 'Máxima', data: [], type: 'column' },
        { name: 'Média', data: [], type: 'line' }
      ]
    },
    unitOfMeasure: unitOfMeasure(HUMIDITY),
    limits: {
      max: 100,
      min: 0,
      maxComfortable: 80,
      minComfortable: 30,
    },
  },
  noise: {
    comfortChart: [0, 0, 0, 0, 0],
    lineChart: { name: 'Ruído', data: [] },
    comboChart: {
      labels: [],
      series: [
        { name: 'Mínima', data: [], type: 'column' },
        { name: 'Máxima', data: [], type: 'column' },
        { name: 'Média', data: [], type: 'line' }
      ]
    },
    unitOfMeasure: unitOfMeasure(NOISE),
    limits: {
      max: 120,
      min: 20,
      maxComfortable: 80,
      minComfortable: 20,
    },
  },
  jerk: {
    comfortChart: [0, 0, 0, 0, 0],
    lineChart: { name: 'Jerk', data: [] },
    comboChart: {
      labels: [],
      series: [
        { name: 'Mínima', data: [], type: 'column' },
        { name: 'Máxima', data: [], type: 'column' },
        { name: 'Média', data: [], type: 'line' }
      ]
    },
    unitOfMeasure: unitOfMeasure(KINETIC),
    limits: {
      max: 2.0,
      min: 0.6,
      maxComfortable: 1.6,
      minComfortable: 0.6,
    },
  },
};
