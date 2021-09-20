const db = require('../models');
const Route = db.route;

exports.create = (req, res) => {
  const route = new Route(req.body);

  route
    .save(route)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Route.'
      });
    });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  const prefix = req.query.prefix;
  let condition;

  if (name) {
    condition = { name: { $regex: new RegExp(name), $options: 'i' } };
  } else {
    condition = prefix ? { prefix: { $regex: new RegExp(prefix), $options: 'i' } } : {};
  }

  Route.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving routes.'
      });
    });
};

exports.findAllByBus = (req, res) => {
  if (!req.params.bus) {
    res.status(400).send({ message: "'bus' parameter can not be empty!" });
    return;
  }

  const name = req.query.name;
  const prefix = req.query.prefix;
  let condition;

  if (name) {
    condition = { name: { $regex: new RegExp(name), $options: 'i' } };
  } else {
    condition = prefix ? { prefix: { $regex: new RegExp(prefix), $options: 'i' } } : {};
  }

  Route.find({ bus: req.params.bus, ...condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving routes to that bus.'
      });
    });
};
