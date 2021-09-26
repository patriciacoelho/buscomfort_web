require('dotenv/config');

const { reading, bus } = require('../models');
const db = require('../models');
const groupBy = require('lodash.groupby');;
const mongoose = require('mongoose');
const Bus = db.bus;
const Schedule = db.schedule;
const Reading = db.reading;

exports.create = (req, res) => {
  const bus = new Bus(req.body);

  bus
  .save(bus)
  .then(data => {
    for (i in req.body.schedules) { // save schedules
      const schedule = new Schedule({
        ...req.body.schedules[i],
        bus: data.id,
      });

      schedule.save();
    }

    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || 'Some error occurred while creating the Bus.'
    });
  });
};

exports.findAll = (req, res) => {
  Bus.find()
    .then(data => {
      for (i in data) {
        const latestReading = Reading.findOne({ bus: data[i].id }, {}, { sort: { 'created_at' : -1 } }).then(reading => {
          return reading ? reading.gpsDatetime : null;
        });

        data[i].lastShot = latestReading;
      }
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving buses.'
      });
    });
};

exports.findAllGroupedByStatus = (req, res) => {
  Bus.find()
    .then(data => {
      const currTime = new Date();
      for (i in data) {
        const latestReading = Reading.findOne({ bus: data[i].id }, {}, { sort: { 'created_at' : -1 } }).then(reading => reading.gpsDatetime);
        const elapsedTime = latestReading.gpsDatetime;
        var diffMinutes = Math.round((((currTime - elapsedTime) % 86400000) % 3600000) / 60000);
        data[i].status = 'no-signal';
        if (diffMinutes < process.env.TIME_LIMIT) {
          data[i].status = 'watching';
        }

        // TODO - adicionar status de 'na garagem'
      }
      const groupedData = groupBy(data, (bus) => bus.status);
      res.send(groupedData);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving buses.'
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({ message: "'id' parameter is required!" });
    return;
  }

  Bus.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: "Not found Bus with id " + id });
        return;
      }

      Schedule.find({ bus: id }).populate(['driver', 'route']).then((schedules) => {
        res.send({...data._doc, schedules });
      });
    })
    .catch(err => {
      res.status(500)
        .send({ message: "Error retrieving Bus with id=" + id });
    });
};

exports.findOneWithCurrentSchedule = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({ message: "'id' parameter is required!" });
    return;
  }

  Bus.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: "Not found Bus with id " + id });
        return;
      }

      Schedule.findOne({ bus: id }, {}, { sort: { 'created_at' : -1 } })
        .populate(['driver', 'route'])
        .then((schedule) => {
          res.send({ ...data._doc, schedule });
        });

    })
    .catch(err => {
      res.status(500)
        .send({ message: "Error retrieving Bus with id=" + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Bus.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Bus with id=${id}. Maybe Bus was not found!`
        });
        return;
      }

      const schedules = req.body.schedules;
      for (const i in schedules) { // update schedules (seta 'active' como 'falso')
        const schedule = schedules[i];

        if (schedule.id) {
          Schedule.findByIdAndUpdate(schedule.id, schedule, { useFindAndModify: false })
            .catch(e => console.log(e));
        } else {
          const schedule = new Schedule({
            bus: id,
            ...schedules[i],
          });

          schedule.save()
            .catch(e => console.log(e));
        }
      }

      res.send({ message: "Bus was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Bus with id=" + id
      });
    });
};