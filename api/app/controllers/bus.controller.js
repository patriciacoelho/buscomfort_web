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
    for (i in req.body.schedules) {
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
    .then(async data => {
      const currTime = new Date();

      const promises = data.map(async bus => {
        const latestReading =  await Reading.findOne({ bus: bus.id }, {}, { sort: { 'gpsDatetime' : -1 } });

        let status = 'no-signal';
        let lastPosition = null;
        if (latestReading) {
          lastPosition = latestReading.gpsLocation;

          const elapsedTime = latestReading.gpsDatetime;
          var diffMinutes = Math.round((((currTime - elapsedTime) % 86400000) % 3600000) / 60000);

          if (diffMinutes < process.env.TIME_LIMIT) {
            status = 'watching';
          }
          // TODO - adicionar status de 'na garagem'
        }

        return { ...bus._doc, status, lastPosition };
      });

      const buses = await Promise.all(promises);
      const groupedData = groupBy(buses, (bus) => bus.status);
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

      let responseData = data;
      Schedule.find({ bus: id })
        .populate(['driver', 'route'])
        .then((schedules) => {
          const now = new Date().getTime();
          for (const j in schedules) {
            if (!schedules[j].active) {
              continue;
            }

            if (schedules[j].days.indexOf(new Date().getDay() + 1) === -1) {
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

            if (now < endDate.getTime() && now > startDate.getTime()) {
              responseData = { ...data._doc, currentSchedule: schedules[j] };
              break;
            }
          }
          res.send(responseData);
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
      for (const i in schedules) {
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

exports.findOneByNetId = (req, res) => {
  const netId = req.params.netId;
  if (!netId) {
    res.status(400).send({ message: "'netId' parameter is required!" });
    return;
  }

  Bus.find({ netId })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: "Not found Bus with netId " + netId });
        return;
      }

      res.send(data[0]);
    })
    .catch(() => {
      res.status(500)
        .send({ message: "Error retrieving Bus with netId=" + netId });
    });
};
