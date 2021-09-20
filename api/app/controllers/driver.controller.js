const { schedule } = require('../models');
const db = require('../models');
const Driver = db.driver;
const Schedule = db.schedule;

exports.create = (req, res) => {
  const driver = new Driver(req.body);

  driver
    .save(driver)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Driver.'
      });
    });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  const cpf = req.query.cpf;
  let condition;

  if (name) {
    condition = { name: { $regex: new RegExp(name), $options: 'i' } };
  } else {
    condition = cpf ? { cpf: { $regex: new RegExp(cpf), $options: 'i' } } : {};
  }

  Driver.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving drivers.'
      });
    });
};

exports.findAllByBus = (req, res) => {
  if (!req.params.bus) {
    res.status(400).send({ message: "'bus' parameter can not be empty!" });
    return;
  }

  const name = req.query.name;
  const cpf = req.query.cpf;
  const route = req.query.route;
  let condition;

  if (name) {
    condition = { name: { $regex: new RegExp(name), $options: 'i' } };
  } else {
    condition = cpf ? { cpf: { $regex: new RegExp(cpf), $options: 'i' } } : {};
  }

  Driver.find({ bus: req.params.bus, ...condition })
    .then(data => {
      if (!route) {
        res.send(data);
        return;
      }

      let result = data.filter((driver) => { // filtra motorista por escalação de rota
        const schedules = Schedule.find({ driver: driver.id }).then((schedules) => schedules);

        for (i in schedules) {
          if (schedules[i].route === route) return driver;
        }
      });

      res.send(result);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving drivers to that bus.'
      });
    });
};
