const db = require('../models');
const Reading = db.reading;
const schedule = db.schedule;

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

  Reading.findOne({ bus: req.params.bus }, {}, { sort: { 'created_at' : -1 } })
    .populate('bus')
    .then(data => {
      res.send(data);
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

  switch(interval) {
  case 'm':
    condition = { created_at: { $gte: new Date().setDate(today.getDate() - 30) } };
    break;
  case 'w':
    condition = { created_at: { $gte: new Date().setDate(today.getDate() - 7) } };
    break;
  case 'd':
  default:
    condition = { created_at: { $gte: new Date(new Date().getTime() - (24 * 60 * 60 * 1000)) } };
  }

  Reading.find({ bus: req.params.bus, ...condition }, {}, { sort: { 'created_at' : -1 } })
    .then(data => {
      if (!route && !driver) {
        res.send(data);
        return;
      }

      let result = data.filter((reading) => { // filtra por motorista e/ou rota
        const schedules = Schedule.find({ bus: req.params.bus }).populate(['driver', 'route']).then((schedules) => schedules);

        for (i in schedules) {
          if (
            (!route || schedules[i].route === route)
            && (!driver || schedules[i].driver === driver)
          ) {
            return reading;
          }
        }
      });

      res.send(result);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving readings to that bus.'
      });
    });
};
