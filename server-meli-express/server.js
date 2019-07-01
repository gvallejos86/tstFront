const express = require('express');
const axios = require('axios');
const ItemCol  = require('./models/ItemCol');
const Item  = require('./models/Item');
const ItemCategoria  = require('./models/ItemCategoria');
const ItemSuggest  = require('./models/ItemSuggest');

const app = express();
const port = 4400;

//urls API MELI
const urlSearch = 'https://api.mercadolibre.com/sites/MLA/search';
const urlItems = 'https://api.mercadolibre.com/items/';
const urlCategoria = 'https://api.mercadolibre.com/categories/';

const urlSuggestions = 'https://http2.mlstatic.com/resources/sites/MLA/autosuggest?cacheBypassTimeStamp=1561553365036&showFilters=true&limit=6&api_version=2';

const author = { name: "Gabriel", lastname:"Vallejos" };

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//soporte paa cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//funcion buscador de productos
function getItems(query,limit) {
  var params = {
    'q': query
  }
  if (limit) {
    params['limit'] = limit;
  }
  return axios
  .get(urlSearch,{
      params: params
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

//consulta descripción de un producto
function getItemDescription(id) {
  return axios
  .get(`${urlItems}${id}/description`)
  .then(response => response.data)
  .catch(err => console.error(err));
}

//obtengo en simultaneo los datos del item y la descripcion del producto
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

//funcion sugerenias de busqueda
function getSuggestions(query) {
  var params = {
    'q': query
  }
  return axios
  .get(urlSuggestions,{
      params: params
    })
  .then(response => response.data)
  .catch(err => console.error(err));
}


// ruta api search items
app.get('/api/items', function (req, res) {
  let q = req.query.q;
  let limit = req.query.limit ? req.query.limit : 0;
  getItems(q,limit)
  .then(items => {
    //instancio los items y doy formato al json resultante
    let itemsResult = new ItemCol(author,items);
    res.send(itemsResult.items);
  });
});

// ruta api detalle de item
app.get('/api/items/:id', function (req, res) {
  let id = req.params.id;
  itemWithDescription(id)
  .then(item => {
    //instancio el item con la descripcion y doy formato al json resultante
    let itemResult = new Item(author,item);
    res.send(itemResult.item);
  });
});

// ruta api categoria item
app.get('/api/categoria/:id', function (req, res) {
  let id = req.params.id;
  getCategoria(id)
  .then(item => {
    //instancio el item con la descripcion y doy formato al json resultante
    let itemResult = new ItemCategoria(author,item);
    res.send(itemResult.item);
  });
});

//ruta para las sugerencias de busqueda
app.get('/api/suggestions', function (req, res) {
  let q = req.query.q;
  getSuggestions(q)
  .then(items => {
    //instancio los items y doy formato al json resultante
    let itemsResult = new ItemSuggest(author,items);
    res.send(itemsResult.items);
  });
});

app.listen(port, ()=> {
  console.log(`Server test práctico MELI listening on port ${port}`);
});

//start server with "npm start" or "node server.js"
