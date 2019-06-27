const express = require('express');
const axios = require('axios');
const ItemCol  = require('./models/ItemCol');
const Item  = require('./models/Item');
const ItemCategoria  = require('./models/ItemCategoria');

const app = express();
const port = 4400;

//urls API MELI
const urlSearch = 'https://api.mercadolibre.com/sites/MLA/search';
const urlItems = 'https://api.mercadolibre.com/items/';
const urlCategoria = 'https://api.mercadolibre.com/categories/';

const author = {name: "Gabriel",lastname:"Vallejos"};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//funcion buscador de productos
function getItems(query) {
  return axios
  .get(urlSearch,{
      params: {
        q: query
      }
    })
  .then(response => response.data)
  .catch(err => console.error(err));
}

//funcion para detalle de item
function getItemById(id) {
  return axios
  .get(`${urlItems}${id}`)
  .then(response => response.data)
  .catch(err => console.error(err));
}

//funcion para consultar categoria/s de item
function getCategoria(id) {
  return axios
  .get(`${urlCategoria}${id}`)
  .then(response => response.data)
  .catch(err => console.error(err));
}

function getItemDescription(id) {
  return axios
  .get(`${urlItems}${id}/description`)
  .then(response => response.data)
  .catch(err => console.error(err));
}

//obtengo en simultaneo los datos del item y la descripcion del mismo
function itemWithDescription(id) {
  return axios.all([getItemById(id), getItemDescription(id)])
  .then(axios
    .spread(function (item, desc) {
      let result = {};
      result['item'] = item;
      result['description'] = desc;
      return result;
    }));
}


// NOTE: ruta api search items
app.get('/api/items', function (req, res) {
  let q = req.query.q;
  getItems(q)
  .then(items => {
    //instancio los items y doy formato al json resultante
    let itemsResult = new ItemCol(author,items);
    res.send(itemsResult.items);
  });
});

// NOTE: ruta api detalle de item
app.get('/api/items/:id', function (req, res) {
  let id = req.params.id;
  itemWithDescription(id)
  .then(item => {
    //instancio el item con la descripcion y doy formato al json resultante
    let itemResult = new Item(author,item);
    res.send(itemResult.item);
  });
});

// NOTE: ruta api categoria item
app.get('/api/categoria/:id', function (req, res) {
  let id = req.params.id;
  getCategoria(id)
  .then(item => {
    //instancio el item con la descripcion y doy formato al json resultante
    let itemResult = new ItemCategoria(author,item);
    res.send(itemResult.item);
  });
});


app.listen(port, ()=> {
  console.log(`Server test práctico MELI listening on port ${port}`);
});

// NOTE: start server with "npm start" or "node server.js"
