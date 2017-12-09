'use strict';

const grpc = require('grpc');
const avro = require('avsc');
const kafka = require('kafka-node');
const coordinateSchema = require('./coordinate_schema.js');

const avroType = avro.parse(coordinateSchema);
const defaultProto = grpc.load(__dirname + '/default.proto');
const HighLevelProducer = kafka.HighLevelProducer;
const kafkaClient = new kafka.Client('localhost:2181', '001', {
  sessionTimeout: 300,
  spinDelay: 100,
  retries: 2
});
const producer = new HighLevelProducer(kafkaClient);

// save all coordinates in memory
const savedCoordinates = [];
function saveInMemory(data) {
  savedCoordinates.push(data);
}

// For this demo we just log client errors to the console.
kafkaClient.on('error', function(error) {
  console.error(error);
});

// Implements the ProcessCoordinate RPC method.
function processCoordinate(call) {
  const data = {
    latitude: call.request.lat,
    longitude: call.request.lng,
    timestamp: Date.now()
  }

  // saving the data in savedCoordinates array
  saveInMemory(data);

  // Create message and encode to Avro buffer
  const messageBuffer = avroType.toBuffer(data);

  // Create a new payload
  const payload = [{
    topic: 'LOCATION_CHANGE',
    messages: messageBuffer
  }];

  //Send payload to Kafka and log result/error
  producer.send(payload, (error, result) => {
    if (error) {
      console.error(error);
    }
  });
}

// Starts an RPC server that receives requests for the Coordinate service
function startGrpcServer() {
  const server = new grpc.Server();
  server.addService(defaultProto.CoordinateHandler.service, { processCoordinate });
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
}

producer.on('ready', () => {
  startGrpcServer();
});

producer.on('error', (error) => {
  console.error(error);
});
