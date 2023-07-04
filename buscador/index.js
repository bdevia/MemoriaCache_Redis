const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
const redis = require("redis");
app.use(cors());
app.use(express.json());


const client_redis = redis.createClient({
    socket: {
      port: 6379,
      host: 'redis',
    }
  });

const client = require('./gRPC-client.js');
const { json } = require('body-parser');

(async () => {
    await client_redis.connect();
})();

client_redis.on('connect', () => {  
    console.log('Redis Connected!');
});

client_redis.on("error", (err) => {
    console.log(`Error:${err}`);
});

app.get('/', (req, res) => {
  (async () => {
    res.send('Hello World');
  })();
})

app.get('/search', (req, res) => {
  (async () => {
    res.send('Buscador API REST: /search/"palabra_a_buscar"');
  })();
})

app.get('/search/:llave', (req, res) => {
  (async () => {
    const dato = await client_redis.get(req.params.llave); // Buscamos el dato en cache
    if (dato){
      res.json({Search_Result_Cache: JSON.parse(dato)});
    } else { // El dato no esta en cache, llamamos a procedimiento remoto

      const rows = [];
      const call = client.Found({llave: req.params.llave});

      call.on('data', function(data){
        rows.push(data);
      })
      call.on('end', function(){
        (async () => {
          await client_redis.set(req.params.llave, JSON.stringify(rows)); // Almacenamos el dato en cache
          res.json({Search_Result_BD: rows});
        })();
      })
      call.on('error', function(err){
        res.send(err);
      })
     
    }
  })();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})