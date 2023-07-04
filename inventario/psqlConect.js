const { Client } = require('pg')

const connectionData = {
    user: 'postgres',
    host: 'postgres',
    database: 'tiendita',
    password: '2022',
    port: 5432,
  }

const client = new Client(connectionData);
client.connect();

module.exports = client;