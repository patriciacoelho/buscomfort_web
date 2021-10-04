require('dotenv/config');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const path = require('path');
const randomId = require('random-id');

const app = express();
const PORT = process.env.PORT || 3080;

var corsOptions = {
  origin: [
    'http://localhost:8081',
    'http://localhost:8080'
  ],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../client/dist')));

const db = require('./app/models');

db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to the database!');
  }).catch(err => {
    console.log('Cannot connect to the database!', err);
    console.log(process.env.MONGO_ATLAS_CLUSTER);
    process.exit();
  });

const buses = require('./app/controllers/bus.controller');
const drivers = require('./app/controllers/driver.controller');
const routes = require('./app/controllers/route.controller');
const readings = require('./app/controllers/reading.controller');

app.get('/api/drivers', drivers.findAll);
app.get('/api/drivers/by-bus/:bus', drivers.findAllByBus);
app.post('/api/drivers', drivers.create);

app.get('/api/routes', routes.findAll);
app.get('/api/routes/by-bus/:bus', routes.findAllByBus);
app.post('/api/routes', routes.create);

app.post('/api/buses', buses.create);
app.get('/api/buses/list', buses.findAll);
app.get('/api/buses/grouped-by-status', buses.findAllGroupedByStatus);
app.get('/api/buses/:id', buses.findOne);
app.get('/api/buses/:id/current-schedule', buses.findOneWithCurrentSchedule);
app.put('/api/buses/:id', buses.update);

app.post('/api/readings', readings.create);
app.get('/api/readings/:bus/latest', readings.findLatestByBus);
app.get('/api/readings/:bus', readings.findAllByBus);
app.get('/api/readings/:bus/week-amounts', readings.weekAmounts);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on the port::${PORT}`);
});
