export const SUGGESTIONS_LOADED = 'SUGGESTIONS_LOADED';
export const SHOW_SUGGESTIONS = 'SHOW_SUGGESTIONS';
export const HIDE_SUGGESTIONS = 'HIDE_SUGGESTIONS';
//query, valor input buscador
export const QUERY_SEARCH = 'QUERY_SEARCH';
//search results
export const SEARCH_RESULTS_LOADED = 'SEARCH_RESULTS_LOADED';
export const HIDE_ITEMS = 'HIDE_ITEMS';
//products detail
export const PRODUCT_DETAILS_LOADED = 'PRODUCT_DETAILS_LOADED';
export const CATEGORY_PRODUCT_LOADED = 'CATEGORY_PRODUCT_LOADED';
export const HIDE_PRODUCT = 'HIDE_PRODUCT';

//sugerencias de busqueda
export const getSuggestions = (query) => {
  return dispatch => {
    let queryItemsUrl = `http://localhost:4400/api/suggestions?q=${query}`;
    return fetch(queryItemsUrl, {
     method: "GET",
     headers: {
       "Accept": "application/json"
     },
    }).then(response => { return response.json()})
     .then(responseData => {
       dispatch({ type: 'SUGGESTIONS_LOADED', payload: responseData });
     });
  }
}

export const showSuggestionSt = () => {
  return dispatch => {
    dispatch({ type: 'SHOW_SUGGESTIONS' });
  };
}

export const hideSuggestionSt = () => {
  return dispatch => {
    dispatch({ type: 'HIDE_SUGGESTIONS' });
  };
}

//query de busqueda
export const setQuery = (q) => {
  return dispatch => {
    dispatch({ type: 'QUERY_SEARCH', payload: q });
  }
}

//resultados de busqueda
export const getSearchResults = (query, cantidadResultados) => {
  return dispatch => {
    let queryItemsUrl = `http://localhost:4400/api/items?q=${query}&limit=${cantidadResultados}`;
     fetch(queryItemsUrl, {
       method: "GET",
       headers: {
         "Accept": "application/json"
       },
     }).then(response => { return response.json()})
       .then(responseData => {
         dispatch({ type: 'SEARCH_RESULTS_LOADED', payload: responseData, showResults: true });
       });
  }
}

export const hideSearchResults = () => {
  return dispatch => {
      dispatch({ type: 'HIDE_ITEMS' });
  }
}

//detalle de producto
export const getItemDetail = (param) => {
  return dispatch => {
    let queryItemUrl = `http://localhost:4400/api/items/${param}`;
     fetch(queryItemUrl, {
       method: "GET",
       headers: {
         "Accept": "application/json"
       },
     }).then(response => { return response.json()})
       .then(responseData => {
         dispatch({ type: 'PRODUCT_DETAILS_LOADED', payload: responseData, showProduct: true });
         let categoriaUrl = `http://localhost:4400/api/categoria/${responseData.category_id}`;
          fetch(categoriaUrl, {
            method: "GET",
            headers: {
              "Accept": "application/json"
            },
          })
          .then(responseCat => { return responseCat.json()})
          .then(responseDataCat => {
            dispatch({ type: 'CATEGORY_PRODUCT_LOADED', payload: responseDataCat });
          });
       });
  }
}

export const hideProductResult = () => {
  return dispatch => {
    dispatch({ type: 'HIDE_PRODUCT' });
  }
}
