import { combineReducers } from 'redux'
import {
  SUGGESTIONS_LOADED,
  SHOW_SUGGESTIONS,
  HIDE_SUGGESTIONS,
  QUERY_SEARCH,
  SEARCH_RESULTS_LOADED,
  HIDE_ITEMS,
  CATEGORY_PRODUCT_LOADED,
  PRODUCT_DETAILS_LOADED,
  HIDE_PRODUCT
} from '../actions/actions';

//sugerencias de busqueda
const suggestions = (
  state = {
    items: [],
    showSuggestionsResult: false
  },
  action
) => {
  switch (action.type) {
    case SUGGESTIONS_LOADED:
      return {
        ...state,
        items: action.payload
      }
    case HIDE_SUGGESTIONS:
      return {
        ...state,
        showSuggestionsResult: false
      }
    case SHOW_SUGGESTIONS:
      return {
        ...state,
        showSuggestionsResult: true
      }
    default:
      return state
  }
}

//buscador
const query = (
  state = {
    q: ''
  },
  action
) => {
  switch (action.type) {
    case QUERY_SEARCH:
      return {
        ...state,
        q: action.payload
      }
    default:
      return state
  }
}

//resultados de busqueda
const search = (
  state = {
    items: {},
    showItems: false
  },
  action
) => {
  switch (action.type) {
    case SEARCH_RESULTS_LOADED:
    return {
      ...state,
      items: action.payload,
      showItems: action.showResults
    }
    case HIDE_ITEMS:
    return {
      ...state,
      showItems: false
    }
    default:
      return state
  }
}

//detalle de producto
const product = (
  state = {
    item: {},
    showProduct: false,
    categories: []
  },
  action
) => {
  switch (action.type) {
    case CATEGORY_PRODUCT_LOADED:
    return {
      ...state,
      categories: action.payload
    }
    case PRODUCT_DETAILS_LOADED:
    return {
      ...state,
      showProduct: action.showProduct,
      item: action.payload
    }
    case HIDE_PRODUCT:
    return {
      ...state,
      showProduct: false
    }
    default:
    return state
  }
}

const rootReducer = combineReducers({
  suggestions,
  query,
  search,
  product
});

export default rootReducer
