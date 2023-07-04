var PROTO_PATH = './proto/struct.proto';

var parseArgs = require('minimist');
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

var client = new struct_proto.Buscador('gRPC_server:50051',grpc.credentials.createInsecure());

module.exports = client;