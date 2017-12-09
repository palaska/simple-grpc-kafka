'use strict';

const avro = require('avsc');
const kafka = require('kafka-node');
const coordinateSchema = require('./coordinate_schema.js');
const avroType = avro.parse(coordinateSchema);

const HighLevelConsumer = kafka.HighLevelConsumer;
const kafkaClient = new kafka.Client('localhost:2181');
const topics = [{
  topic: 'LOCATION_CHANGE'
}];


const options = {
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024,
  encoding: 'buffer'
};

const consumer = new HighLevelConsumer(kafkaClient, topics, options);

consumer.on('message', (message) => {
  const buf = new Buffer(message.value, 'binary'); // Read string into a buffer.
  const decodedMessage = avroType.fromBuffer(buf.slice(0)); // Skip prefix.
  console.log(decodedMessage);
});

consumer.on('error', (err) => {
  console.log('error', err);
});

process.on('SIGINT', () => {
  consumer.close(true, () => {
    process.exit();
  });
});
