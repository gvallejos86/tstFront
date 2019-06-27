import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import NoResult from '../shared/NoResult';
import Loading from '../shared/Loading';

class SearchResults extends Component {
  listenUrlChanges;
  //cantidad de resultados de busqueda a mostrar
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
    //actualizar resultados de busqueda en cada cambio de ruta solo cuando la ruta no es '/'
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
  getUrlParameter = (name) => {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(this.props.history.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  // obtengo items en base al valor de busqueda
  getItems = () => {
    this.setState({ showItems : false });
    let query = this.getUrlParameter('query');
    if (query) {
      let queryItemsUrl = `http://localhost:4400/api/items?q=${query}`;
       fetch(queryItemsUrl, {
         method: "GET",
         headers: {
           "Accept": "application/json"
         },
       }).then(response => { return response.json()})
         .then(responseData => { this.setState({ items : responseData, showItems : true }) });
    }
  }

  //se reemplaza por toLocaleString('de-DE') para separar con punto las unidades de mil
  /*dotSeparator(number) {
    return number.toString().replace(/\B(?=(\d{3}))/g, '.');
  }*/

  template() {
    return (
    <div className="container mb-5">
      <div className="row">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
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
                        <Link to={`/items/${current.id}`}><img src={current.picture} alt="imagen producto"/></Link>
                      </div>
                      <div className="pl-md-3 pl-0 pr-0 pr-md-5 pt-3 text-center text-md-left flex-auto">
                        <p className="mb-0 item-price"><span className="mr-1">$</span><span>{current.price.amount.toLocaleString('de-DE')}</span></p>
                        <p className="mb-0 mt-2 item-title"><Link to={`/items/${current.id}`}>{current.title}</Link></p>
                        {
                          current.free_shipping
                          ? <div className="alert alert-success alert alert-success d-inline-flex py-0 mt-2" role="alert"><small>Envío gratis</small></div>
                          : null
                        }
                      </div>
                      <div className="pr-2 pr-lg-5 pt-lg-5 pl-2 pl-lg-0 text-center text-md-left">
                        <small>
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
