var PROTO_PATH = './proto/struct.proto';

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var struct_proto = grpc.loadPackageDefinition(packageDefinition).struct;

const client = require('./psqlConect.js');

function Found(call) {
  const query = "SELECT name, price, category, count FROM items where name like '%"+call.request.llave+"%';";
  client.query(query)
    .then(response => {
      for(const data of response.rows){
        call.write(data);
      }
      call.end();
    })
    .catch(err => {
      console.log(err);
    })
}

function main() {
  var server = new grpc.Server();
  server.addService(struct_proto.Buscador.service, {
    Found: Found
  });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('gRPC Server on port 50051');
  });
}

main();
