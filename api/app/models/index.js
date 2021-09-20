const dbConfig = require('../config/db.config');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.bus = require('./bus.model.js')(mongoose);
db.driver = require('./driver.model.js')(mongoose);
db.reading = require('./reading.model.js')(mongoose);
db.route = require('./route.model.js')(mongoose);
db.schedule = require('./schedule.model.js')(mongoose);

module.exports = db;
