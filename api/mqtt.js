// Créditos: Ruan Bahia & Patrícia Coelho
const { response } = require('express');
const mqtt = require('mqtt');

var readData = Buffer.from('');

const client = mqtt.connect('mqtt://192.168.0.181'); // colocar como variável de ambiente
const port = null;

// Nosso pacote de dados do busModule recebido pelo LoRa tem 45 bytes no total
// 2 bytes de id + 41 bytes de dados + 2 bytes de CRC
var frameDict = {
  ID: 0, // Int16 LittleEndian from 0 to 2
  DAY: 2,
  MONTH: 3,
  YEAR: 4,
  HOURS: 5,
  MINUTES: 6,
  SECONDS: 7,
  STATUS: 8,
  LATITUDE: 9, // LittleEndian from 9 to 12
  LATITUDE_0: 9,
  LATITUDE_1: 10,
  LATITUDE_2: 11,
  LATITUDE_3: 12,
  LONGITUDE: 13, // LittleEndian from 13 to 16
  LONGITUDE_0: 13,
  LONGITUDE_1: 14,
  LONGITUDE_2: 15,
  LONGITUDE_3: 16,
  SPEED: 17, // LittleEndian from 17 to 20
  SPEED_0: 17,
  SPEED_1: 18,
  SPEED_2: 19,
  SPEED_3: 20,
  TEMPERATURE: 21,
  HUMIDITY: 22,
  MAXNOISEDB: 23, // LittleEndian from 23 to 26
  MAXNOISEDB_0: 23,
  MAXNOISEDB_1: 24,
  MAXNOISEDB_2: 25,
  MAXNOISEDB_3: 26,
  NOISECOUNT0: 27,
  NOISECOUNT0_0: 27,
  NOISECOUNT0_1: 28,
  NOISECOUNT1: 29,
  NOISECOUNT1_0: 29,
  NOISECOUNT1_1: 30,
  NOISECOUNT2: 31,
  NOISECOUNT2_0: 31,
  NOISECOUNT2_1: 32,
  NOISECOUNT3: 33,
  NOISECOUNT3_0: 33,
  NOISECOUNT3_1: 34,
  NOISECOUNT4: 35,
  NOISECOUNT4_0: 35,
  NOISECOUNT4_1: 36,
  JXCOUNT0: 37,
  JXCOUNT0_0: 37,
  JXCOUNT0_1: 38,
  JYCOUNT0: 39,
  JYCOUNT0_0: 39,
  JYCOUNT0_1: 40,
  JZCOUNT0: 41,
  JZCOUNT0_0: 41,
  JZCOUNT0_1: 42,
  CRC: 43 // Int16 LittleEndian from 43 to 44
};

function ComputeCRC(frameBuffer) {
  i = 0;
  bitbang = 0;
  j = 0;
  crc_calc = 0xc181;

  for (i = 0; i < frameBuffer.byteLength - 2; i++) {
    crc_calc ^= frameBuffer.readUInt8(i) & 0x00ff;

    for (j = 0; j < 8; j++) {
      bitbang = crc_calc;
      crc_calc >>= 1;

      if (bitbang & 1) {
        crc_calc ^= 0xa001;
      }
    }
  }
  return crc_calc & 0xffff;
}

function decodeFrameParams(frameBuffer) {
  // Verificação do CRC da mensagem, caso seja inválido, então temos que limpar o buffer completamente
  crc = frameBuffer.readUInt16LE(frameDict.CRC);
  computed_crc = ComputeCRC(frameBuffer);

  if (parseInt(crc) !== parseInt(computed_crc)) {
    if (port)
      port.flush(() => {});
    console.log('CRC ERROR, CRC: ', crc, 'CRC_COMPUTED: ', computed_crc);
    return 'CRC_ERROR';
  }

  id = frameBuffer.readUInt16LE(frameDict.ID);
  day = frameBuffer.readUInt8(frameDict.DAY);
  month = frameBuffer.readUInt8(frameDict.MONTH);
  year = frameBuffer.readUInt8(frameDict.YEAR);
  hours = frameBuffer.readUInt8(frameDict.HOURS);
  minutes = frameBuffer.readUInt8(frameDict.MINUTES);
  seconds = frameBuffer.readUInt8(frameDict.SECONDS);
  status = frameBuffer.readUInt8(frameDict.STATUS);
  latitude = frameBuffer.readFloatLE(frameDict.LATITUDE);
  longitude = frameBuffer.readFloatLE(frameDict.LONGITUDE);
  speed = frameBuffer.readFloatLE(frameDict.SPEED);
  temperature = frameBuffer.readUInt8(frameDict.TEMPERATURE);
  humidity = frameBuffer.readUInt8(frameDict.HUMIDITY);
  maxNoise = frameBuffer.readFloatLE(frameDict.MAXNOISEDB);
  noisecount0 = frameBuffer.readUInt16LE(frameDict.NOISECOUNT0);
  noisecount1 = frameBuffer.readUInt16LE(frameDict.NOISECOUNT1);
  noisecount2 = frameBuffer.readUInt16LE(frameDict.NOISECOUNT2);
  noisecount3 = frameBuffer.readUInt16LE(frameDict.NOISECOUNT3);
  noisecount4 = frameBuffer.readUInt16LE(frameDict.NOISECOUNT4);
  jxcount0 = frameBuffer.readUInt16LE(frameDict.JXCOUNT0);
  jycount0 = frameBuffer.readUInt16LE(frameDict.JYCOUNT0);
  jzcount0 = frameBuffer.readUInt16LE(frameDict.JZCOUNT0);

  const noiseTotalReadings = noisecount0 + noisecount1 + noisecount2 + noisecount3 + noisecount4;
  noiseComfort =
    (noisecount0 * 0.0 +
      noisecount1 * 0.25 +
      noisecount2 * 0.5 +
      noisecount3 * 0.75 +
      noisecount4) /
    noiseTotalReadings;

  year = 2000 + year;
  params = {
    state: 200,
    netId: id,
    status: status,
    gpsDatetime: new Date(
        Date.UTC(year, month - 1, day, hours, minutes, seconds)
      ).toUTCString(),
    gpsLocation: [latitude, longitude],
    temperature,
    humidity,
    // thermalComfort,
    maxNoise,
    noise: [ noisecount0, noisecount1, noisecount2, noisecount3, noisecount4 ],
    noiseComfort,
    jerk: [ jxcount0, jycount0, jzcount0 ],
    speed,
    // rideComfort,
    // comfort,
  };
  console.log(params);
  return params;
}

const request = require('request'); // TODO - trocar por 'axios'
function saveReading(params) {
  const getBusIdOptions = {
    uri: `http://localhost:3080/api/buses/by-net-id/${params.netId}`, // colocar como variável de ambiente
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  request(getBusIdOptions, function (error, response) {
    console.log(error, response.body);
    const postReadingOptions = {
      uri: 'http://localhost:3080/api/readings', // colocar como variável de ambiente
      body: JSON.stringify({...params, bus: response.body.id}),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    request(postReadingOptions, function (error, response) {
      console.log(error, response.body);
      return;
    });
    return;
  });
}

client.on('connect', function () {
  client.subscribe('bus/data', function (err) {
    console.log('trying');
    if (!err) {
      client.publish('bus/data', 'Hello mqtt');
    }
  });
});

client.on('message', function (topic, message) {
  if (message.byteLength == 45) {
    const dados = decodeFrameParams(message);
    if (dados !== 'CRC_ERROR') {
      const state = dados.status;
      saveReading(dados);
      if (state) {
        switch (state) {
          case 0x86:
            global.gpsData = {
              state: 404,
              msg: 'Sinal não encontrado!'
            };
            break;
          case 0x41:
            global.gpsData = dados;
            break;
          default:
            global.gpsData = {
              state: 404,
              msg: 'Sinal não encontrado!'
            };
        }
      }
    } else {
      console.log('CRC ERROR');
    }
  }
});

if (port) {
  port.on('data', function (data) {
    readData = Buffer.concat([readData, data]);

    if (readData.byteLength == 29) {
      const dados = decodeFrameParams(readData);
      if (dados !== 'CRC_ERROR') {
        const state = dados.status;
        if (state) {
          switch (state) {
            case 0x86:
              global.gpsData = {
                state: 404,
                msg: 'Sinal não encontrado!'
              };
              break;
            case 0x41:
              global.gpsData = dados;
              break;
            default:
              global.gpsData = {
                state: 404,
                msg: 'Sinal não encontrado!'
              };
          }
        }
      }
      readData = Buffer.from('');
    } else if (readData.byteLength > 29) {
      port.flush(() => {});
      readData = Buffer.from('');
    }
  });
};
