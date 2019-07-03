import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { getSuggestions, showSuggestionSt, hideSuggestionSt, setQuery } from '../../actions/actions';

import Suggestions from '../shared/Suggestions';

//SEO
import { Helmet } from 'react-helmet';

class Search extends Component {

  //navegación a la vista de resultados
  searchItems = (event) => {
    if (this.props.query) {
      let query = this.props.query;
      this.props.history.push(`/items/search?query=${query}`);
      this.props.hideSuggestionSt();
      //evitar que se limpien los params en el evento onSubmit
      event.preventDefault();
      //sacar focus del input
      document.activeElement.blur();
    }else {
      //navegación a la vista default si se intenta buscar con el input vacío, queda comentado porque en el sitio de ML al estar vacío el input queda en la vista actual
      /*this.props.history.push(`/`);*/
      event.preventDefault();
    }
  }

  //obtiene el param query de la url
  getQuery: string = () => {
    let search = this.getUrlParams();
    if (search.get('query')) {
      this.props.setQuery(search.get('query'));
    }else {
      this.props.setQuery('');
    }
  }

  //obtener todos los valores de los params pasados
  getUrlParams: URLSearchParams = () => {
    if (!this.props.history.location.search) return new URLSearchParams();
    return new URLSearchParams(this.props.history.location.search);
  }

  //actualizar estado con valor del input search y generar sugerencias
  inputChange(query) {
    this.props.setQuery(query);
    if (query) {
      this.props.getSuggestions(query);
      if (!this.props.showSuggestionsResult) {
        this.props.showSuggestionSt();
      }
    }else{
      this.props.hideSuggestionSt();
    }
  }

  //se usa para mostrar los resultados de sugerencias de busqueda
  showSuggestions = () => {
    if (!this.props.showSuggestionsResult && this.props.suggestions) {
      this.props.showSuggestionSt();
    }
  }

  //se usa para realizar una busqueda de la sugerencia clickeada y para ocultar las sugerencias
  hideSuggestions = (ev) => {
    if (ev.target.className === 'valueSuggestion') {
      let query = ev.target.innerHTML;
      this.props.setQuery(query);
      this.searchItems(ev);
    }
    if (this.props.showSuggestionsResult && ev.target.className.indexOf('inputSearch') === -1) {
      this.props.hideSuggestionSt();
    }
  }

  componentDidMount() {
    this.getQuery();
    //limpiar input buscador cuando la ruta no es la de resultados
    this.listenUrlChanges = this.props.history.listen((location, action) => {
    //insertar valor del query al input si se navega por url a los resultados de busqueda o limpiar input en caso contrario
    this.getQuery();
    });
    //escuchar los clicks para ocultar las sugerencias al clickear fuera del listado
    document.addEventListener('mousedown', this.hideSuggestions);
  }

  render() {
    return (
    <div className="nav-header">
      <Helmet>
        <title>Test práctico Frontend - {this.props.query}</title>
        <meta name="description" content="test práctico Frontend MELI" />
        <meta name="keywords" content="react,Express,test,frontend" />
      </Helmet>
      <div className="container">
        <nav className="navbar navbar-light justify-content-center px-0">
          <Link to="/"><div className="nav-logo mr-3"></div></Link>
          <form className="form-inline no-focus w-75" onSubmit={(ev)=>this.searchItems(ev)}>
            <div className="input-group w-100">
              <input
                type="text"
                className="form-control inputSearch"
                placeholder="Nunca dejes de buscar"
                value={this.props.query} onChange={(ev)=>this.inputChange(ev.target.value)} onFocus={this.showSuggestions}/>
              <div className="input-group-prepend" onClick={(ev)=>this.searchItems(ev)}>
                <span className="input-group-text"><i className="fas fa-search"></i></span>
              </div>
              { this.props.showSuggestionsResult ? <Suggestions words={this.props.suggestions}></Suggestions> : null}
            </div>
          </form>
        </nav>
      </div>
    </div>
    );
  }
}

//uno de los argumentos usados en el connect, para conectar el store de redux con el componente
const mapStateToProps = (state) => {
  return {
    suggestions: state.suggestions.items,
    showSuggestionsResult: state.suggestions.showSuggestionsResult,
    query: state.query.q
  }
}

export default connect(
  mapStateToProps,
  { getSuggestions, showSuggestionSt, hideSuggestionSt, setQuery }
) (withRouter(Search));
