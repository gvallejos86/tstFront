import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import NoResult from '../shared/NoResult';
import Loading from '../shared/Loading';

class SearchResults extends Component {
  listenUrlChanges;
  //cantidad de resultados de busqueda a mostrar, lo limito al recorrer el resultado del endpoint y tambien al hacer la llamada a la api
  cantidadResultados = 4;

  constructor (props){
        super(props);
        this.state = {  items : {},
                        item: '',
                        showItems: false
                      };
  }

  componentDidMount() {
    //buscar items en la primera carga del componente
    this.getItems();
    //actualizar resultados de busqueda en cada cambio de ruta
    this.listenUrlChanges = this.props.history.listen((location, action) => {
      if (action === 'PUSH' && location.pathname.indexOf('/items/search') > -1) {
        this.getItems();
      }
    });
  }

  componentWillUnmount() {
    //desuscribir history listen
    this.listenUrlChanges();
  }

  //extraer de la url el parametro de busqueda
  getUrlParameter(query): URLSearchParams {
    let results = null;
    if (this.props.history.location.search) {
      let search = new URLSearchParams(this.props.history.location.search);
      if (search.get(query)) {
        results = search.get(query);
      }
    }
    return results;
  }

  // obtengo items en base al valor de busqueda
  getItems = () => {
    this.setState({ showItems : false });
    let query = this.getUrlParameter('query');
    if (query) {
      let queryItemsUrl = `http://localhost:4400/api/items?q=${query}&limit=${this.cantidadResultados}`;
       fetch(queryItemsUrl, {
         method: "GET",
         headers: {
           "Accept": "application/json"
         },
       }).then(response => { return response.json()})
         .then(responseData => { this.setState({ items : responseData, showItems : true }) });
    }
  }

  template() {
    return (
    <div className="container mb-5 main-cont">
      <div className="row">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0 justify-content-center">
            {
              this.state.items.categories
                ?
                  this.state.items.categories.map((current, index, categories)=>{
                    if (index === categories.length - 1) {
                      return <li key={index} className="breadcrumb-item active" aria-current="page">{current}</li>
                    }else {
                      return <li key={index} className="breadcrumb-item">{current}</li>
                    }
                  })
                : null
            }
          </ol>
        </nav>
      </div>
      <article className="container-fluid bg-items rounded">
        {
          this.state.items.items
            ?
              this.state.items.items.map((current, index)=>{
                if (index < this.cantidadResultados) {
                  return ( <div className="row flex-row justify-content-between item-container p-2" key={index}>
                    <div className="d-flex flex-md-row flex-column w-100">
                      <div className="items-img-cont mx-auto mx-md-1">
                        <Link to={{pathname: `/items/${current.id}`, state: { from: this.props.location.pathname }}}><img className="thumb-product" src={current.picture} alt="imagen producto"/></Link>
                      </div>
                      <div className="pl-md-3 pl-0 pr-0 pr-md-5 pt-3 text-center text-md-left flex-auto">
                        <div className="mb-4 item-price d-flex align-items-center justify-content-center justify-content-md-start">
                          <span className="mr-1">
                            { current.price.currency === 'USD'
                              ? 'U$S'
                              : '$'
                            }
                          </span>
                          <span>{current.price.amount.toLocaleString('de-DE')}</span>
                          <small>
                            {
                              current.free_shipping
                              ? <div className="alert alert-success alert alert-success d-inline-flex py-0 mt-0 mb-1 ml-2 px-0 rounded-circle justify-content-center align-items-center free-sheep-cont" role="alert"><small className="d-flex justify-content-center"><i className="fas fa-truck"></i></small></div>
                              : null
                            }
                          </small>
                        </div>
                        <p className="mb-0 mt-2 item-title"><Link to={{pathname: `/items/${current.id}`, state: { from: this.props.location.pathname }}}>{current.title}</Link></p>
                      </div>
                      <div className="pr-2 pr-lg-5 pt-lg-5 pl-2 pl-lg-0 text-center text-md-left">
                        <small className="result-condition">
                          { current.condition === 'new'
                            ? 'Nuevo'
                            : current.condition === 'used' ? 'Usado'
                            : ''
                          }
                        </small>
                      </div>
                    </div>
                  </div> )
                }
                return null
              })
            :
              <NoResult></NoResult>
        }
      </article>
    </div>
    );
  }

  render() {
		return (
			<div>
				{ this.state.showItems ? this.template() : <Loading></Loading> }
			</div>
		)
	}
}
export default withRouter(SearchResults);
