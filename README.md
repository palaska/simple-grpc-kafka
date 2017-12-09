## Simple gRPC + Kafka implementation

### Requirements
- Node.js
- Apache Kafka

### Installation
Run `npm install` to download necessary packages.

### How to Run
- Run Zookeeper
```zkserver start```

- Run Kafka
```kafka-server-start /usr/local/etc/kafka/server.properties```

- Start the server
```node server.js```

- Start the client
```node client.js```

- Start the Kafka consumer
```node kafka_consumer.js```
