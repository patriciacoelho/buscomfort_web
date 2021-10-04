const { reading } = require('../models');
const db = require('../models');
const Reading = db.reading;
const Schedule = db.schedule;

exports.create = (req, res) => {
  const reading = new Reading(req.body);

  reading
    .save(reading)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Reading.'
      });
    });
};

exports.findLatestByBus = (req, res) => {
  if (!req.params.bus) {
    res.status(400).send({ message: "'bus' parameter can not be empty!" });
    return;
  }

  Reading.findOne({ bus: req.params.bus }, {}, { sort: { 'gpsDatetime' : -1 } })
    .populate('bus')
    .then(data => {
      let responseData = data;
      Schedule.find({ bus: req.params.bus })
        .populate(['driver', 'route'])
        .then((schedules) => {
          const reading = data;
          const readingDatetime = new Date(reading.gpsDatetime).getTime();
          for (const j in schedules) {
            if (!schedules[j].active && schedules[j].updatedAt.getTime() < readingDatetime) {
              continue;
            }

            if (schedules[j].days.indexOf(new Date(reading.gpsDatetime).getDay() + 1) === -1) {
              continue;
            }

            const startDate = new Date();
            startDate.setHours(
              schedules[j].time.start.split(':')[0],
              schedules[j].time.start.split(':')[1],
              0
            );

            const endDate = new Date();
            endDate.setHours(
              schedules[j].time.end.split(':')[0],
              schedules[j].time.end.split(':')[1],
              0
            );

            if (readingDatetime < endDate.getTime() && readingDatetime > startDate.getTime()) {
              responseData = { ...data._doc, currentSchedule: schedules[j] };
              break;
            }
          }
          res.send(responseData);
        });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving latest reading.'
      });
    });
};

exports.findAllByBus = (req, res) => {
  if (!req.params.bus) {
    res.status(400).send({ message: "'bus' parameter can not be empty!" });
    return;
  }

  const interval = req.query.interval;
  const route = req.query.route;
  const driver = req.query.driver;
  let condition;

  const now = new Date();
  switch(interval) {
  case 'm':
    condition = { gpsDatetime: { $gte: new Date().setDate(now.getDate() - 30) } };
    break;
  case 'w':
    condition = { gpsDatetime: { $gte: new Date().setDate(now.getDate() - 7) } };
    break;
  case 'd':
  default:
    condition = { gpsDatetime: { $gte: new Date(now.getTime() - (24 * 60 * 60 * 1000)) } };
  }

  Reading.find({ bus: req.params.bus, ...condition }, {}, { sort: { 'gpsDatetime' : -1 } })
    .then(async (data) => {
      if (!route && !driver) {
        res.send(data);
        return;
      }

      let scheduleConditions = {};
      if (route) scheduleConditions.route = route;
      if (driver) scheduleConditions.driver = driver;

      const filteredData = [];
      Schedule.find({ ...scheduleConditions, bus: req.params.bus })
        .populate(['driver', 'route'])
        .then((schedules) => {
          for (const i in data) {
            const reading = data[i];
            const readingDatetime = new Date(reading.gpsDatetime).getTime();
            for (const j in schedules) {
              if (!schedules[j].active && schedules[j].updatedAt.getTime() < readingDatetime) {
                continue;
              }

              if (!interval || interval === 'd') {
                if (schedules[j].days.indexOf(now.getDay() + 1) === -1) {
                  continue;
                }

                const startDate = new Date();
                startDate.setHours(
                  schedules[j].time.start.split(':')[0],
                  schedules[j].time.start.split(':')[1],
                  0
                );

                const endDate = new Date();
                endDate.setHours(
                  schedules[j].time.end.split(':')[0],
                  schedules[j].time.end.split(':')[1],
                  0
                );

                if (readingDatetime < endDate.getTime() && readingDatetime > startDate.getTime()) {
                  filteredData.push(reading);
                }
              }
              // TODO - para semanal e mensal tem que gerar os 'new Date()' com base nas combinações de dia da semana e hora
              // filtra ('if') as leituras cujo gpsDatetime está entre os pares [start, end] das combinações das escalas
              if (interval === 'w') {
                // feed dates[] da semana e verifica se data de leitura está entre startDate e endDate
              }
              if (interval === 'm') {
                // feed dates[] do mês e verifica se data de leitura está entre startDate e endDate
              }
            }
          }

          res.send(filteredData);
        });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving readings to that bus.'
      });
    });
};

exports.weekAmounts = (req, res) => {
  if (!req.params.bus) {
    res.status(400).send({ message: "'bus' parameter can not be empty!" });
    return;
  }

  const now = new Date();
  const condition = { gpsDatetime: { $gte: new Date().setDate(now.getDate() - 7) } };
  let responseData = { temperature: [], humidity: [], maxNoise: [], jerk: [],};
  Reading.find({ bus: req.params.bus, ...condition }, {}, { sort: { 'gpsDatetime' : -1 } })
    .then(async (data) => {
      let groupedData = [[], [], [], [], [], [], []];
      for (const i in data) {
        const reading = data[i];
        const datetime = new Date(reading.gpsDatetime).getDay();
        groupedData[datetime].push(reading);
      }

      for (let j = 0; j < 7; j++) {
        const weekDay = new Date(new Date().setDate(now.getDate() - (6 - j))).getDay();

        const sensors = ['temperature', 'humidity', 'maxNoise', 'jerk']
        for (const k in sensors) {
          const sensorReading = groupedData[weekDay].map( el => {
            if (sensors[k] === 'humidity') {
              return parseFloat(el.humidity) * 100;
            }
            return parseFloat(sensors[k] !== 'jerk' ? el[sensors[k]] : el.jerk[1]);
          });

          const length = sensorReading.length;
          if (!length) {
            responseData[sensors[k]].push({ weekDay: weekDay + 1 });
            continue;
          }

          const max = sensorReading.reduce((a, b) => Math.max(a, b));
          const min = sensorReading.reduce((a, b) => Math.min(a, b));
          const sum = sensorReading.reduce((sum, curr) => sum + curr);
          responseData[sensors[k]].push({
            weekDay: weekDay + 1,
            mean: parseFloat((sum / length).toFixed(1)),
            max,
            min,
          });
        }
      }

      res.send(responseData);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving readings to that bus.'
      });
    });
}
