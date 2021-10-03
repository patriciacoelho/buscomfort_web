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

  Reading.findOne({ bus: req.params.bus }, {}, { sort: { 'createdAt' : -1 } })
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

  const today = new Date();
  switch(interval) {
  case 'm':
    condition = { createdAt: { $gte: new Date().setDate(today.getDate() - 30) } };
    break;
  case 'w':
    condition = { createdAt: { $gte: new Date().setDate(today.getDate() - 7) } };
    break;
  case 'd':
  default:
    condition = { createdAt: { $gte: new Date(new Date().getTime() - (24 * 60 * 60 * 1000)) } };
  }

  Reading.find({ bus: req.params.bus, ...condition })
    .then(data => {
      if (!route && !driver) {
        res.send(data);
        return;
      }

      let result = data.filter((reading) => { // filtra por motorista e/ou rota 
        // -- não está filtrando por rota e motorista todas as rotas q vem aqui pertencem ao ônibus,
        // a questão é que tem que ver se o gpsDatetime tá dentro do intervalo da escala
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
