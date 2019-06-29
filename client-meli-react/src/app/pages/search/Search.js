import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import Suggestions from '../shared/Suggestions';

//SEO
import { Helmet } from 'react-helmet';

class Search extends Component {

  constructor (props){
        super(props);
        this.state = {  query : '', suggestions: '', showSuggestionsResult: false };
  }

  //navegación a la vista de resultados
  searchItems = (event) => {
    if (this.state.query) {
      let query = this.state.query;
      this.props.history.push(`/items/search?query=${query}`);
      this.setState({showSuggestionsResult: false});
      //evitar que se limpien los params en el evento onSubmit
      event.preventDefault();
    }else {
      //navegación a la vista default si se intenta buscar con el input vacío, queda comentado porque en el sitio de ML al estar vacío el input queda en la vista actual
      /*this.props.history.push(`/`);*/
      event.preventDefault();
    }
  }

  //obtiene el param query de la url
  getQuery(): string {
    let search = this.getUrlParams();
    if (search.get('query')) {
      this.setState({query : search.get('query')});
    }else {
      this.setState({query : ''});
    }
  }

  //obtener todos los valores de los params pasados
  getUrlParams(): URLSearchParams {
    if (!this.props.history.location.search) return new URLSearchParams();
    return new URLSearchParams(this.props.history.location.search);
  }

  //actualizar estado con valor del input search y generar sugerencias
  inputChange(query) {
    this.setState({query:query});
    if (query) {
      let queryItemsUrl = `http://localhost:4400/api/suggestions?q=${query}`;
       fetch(queryItemsUrl, {
         method: "GET",
         headers: {
           "Accept": "application/json"
         },
       }).then(response => { return response.json()})
         .then(responseData => { this.setState({ suggestions : responseData }); this.setState({showSuggestionsResult: true}); });
    }else{
      this.setState({ suggestions : '' })
    }
  }

  //se usa para mostrar los resultados de sugerencias de busqueda
  showSuggestions = () => {
    if (!this.state.showSuggestionsResult) {
      this.setState({showSuggestionsResult: true});
    }
  }

  //se usa para realizar una busqueda de la sugerencia clickeada y para ocultar las sugerencias
  hideSuggestions = (ev) => {
    if (ev.target.className === 'valueSuggestion') {
      let query = ev.target.innerHTML;
      this.setState({query:query});
      this.searchItems(ev);
    }
    if (this.state.showSuggestionsResult && ev.target.className.indexOf('inputSearch') === -1) {
      this.setState({showSuggestionsResult: false});
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
        <title>Test práctico Frontend - {this.state.query}</title>
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
                value={this.state.query} onChange={(ev)=>this.inputChange(ev.target.value)} onFocus={this.showSuggestions}/>
              <div className="input-group-prepend" onClick={(ev)=>this.searchItems(ev)}>
                <span className="input-group-text"><i className="fas fa-search"></i></span>
              </div>
              { this.state.showSuggestionsResult ? <Suggestions words={this.state.suggestions}></Suggestions> : null}
            </div>
          </form>
        </nav>
      </div>
    </div>
    );
  }
}
export default withRouter(Search);
