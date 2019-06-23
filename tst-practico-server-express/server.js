const express = require('express');
const app = express();
const port = 4400;

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(port, ()=> {
  console.log(`Server test práctico MELI listening on port ${port}`);
});

// NOTE: start server with "npm start" or "node server.js"
