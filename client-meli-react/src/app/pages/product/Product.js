import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import NoResult from '../shared/NoResult';
import Loading from '../shared/Loading';

//SEO
import { Helmet } from 'react-helmet';

class Product extends Component {

  constructor (props){
        super(props);
        this.state = {
                        item: '',
                        showProduct: false,
                        categories: ''
                      };
  }

  componentDidMount() {
    //cargar producto
    this.getProduct();
  }

  // obtengo items en base al valor de busqueda
  getProduct = () => {
    this.setState({ showProduct : false });
    let param = this.props.match.params.id ? this.props.match.params.id : null;
    if (param) {
      let queryItemUrl = `http://localhost:4400/api/items/${param}`;
       fetch(queryItemUrl, {
         method: "GET",
         headers: {
           "Accept": "application/json"
         },
       }).then(response => { return response.json()})
         .then(responseData => {
           this.setState({ item : responseData, showProduct : true });
           let categoriaUrl = `http://localhost:4400/api/categoria/${responseData.category_id}`;
            fetch(categoriaUrl, {
              method: "GET",
              headers: {
                "Accept": "application/json"
              },
            })
            .then(responseCat => { return responseCat.json()})
            .then(responseDataCat => { this.setState({ categories : responseDataCat }) });
         });
    }
  }

  //volver a la pagina anterior si previamente hubo navegacion
  goBack = () => {
    if (this.props.location.state && this.props.location.state.from){
      this.props.history.goBack();
    }
  }

  //template a renderizar si hay items
  template() {
    return (
      <div className="container main-cont mb-5">
        <Helmet>
          {
            this.state.item.item
              ? <meta name="description" content={this.state.item.item.title} />
              : null
          }
        </Helmet>
        <div className="row">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 justify-content-center">
              {
                this.state.categories.categories
                  ?
                    this.state.categories.categories.map((current, index, categories)=>{
                      if (index === categories.length - 1) {
                        return <li key={index} className="breadcrumb-item active" aria-current="page">{current.name}</li>
                      }else {
                        return <li key={index} className="breadcrumb-item">{current.name}</li>
                      }
                    })
                  : null
              }
            </ol>
            {
              this.props.location.state && this.props.location.state.from
                ?
                  <div><button type="button" className="btn btn-link" onClick={this.goBack}>Volver</button></div>
                : null
            }
          </nav>
        </div>
        <article className="container-fluid bg-items rounded">
          {
            this.state.item.item
              ?
                <div>
                  <div className="row flex-row justify-content-between p-3 pt-5">
                    <div className="col-12 col-md-8 col-xl-9 p-0">
                      <div className="w-100 text-center">
                        <img className="img-product" src={this.state.item.item.picture} alt="imagen producto"/>
                      </div>
                    </div>
                    <div className="col-12 col-md-4 col-xl-3">
                      <p className="m-0">
                        <small>
                          {
                            this.state.item.item.condition === 'new'
                            ? 'Nuevo'
                            : this.state.item.item.condition === 'used'
                            ? 'Usado'
                            : ''
                          }
                          <span className="mx-1">-</span>
                          { this.state.item.item.sold_quantity } vendidos
                        </small>
                      </p>
                      <p className="m-0 product-title">
                        { this.state.item.item.title }
                      </p>
                      <div className="product-price d-block">
                        <span className="mr-1">
                          { this.state.item.item.price.currency === 'USD'
                            ? 'U$S'
                            : '$'
                          }
                        </span>
                        <span>{ this.state.item.item.price.amount.toLocaleString('de-DE') }</span>
                        <span className="amount-decimals">
                          {
                            this.state.item.item.price.decimals  === 0
                            ? '00'
                            : this.state.item.item.price.decimals
                          }
                        </span>
                      </div>
                      <span className="free-shipping-product d-block mb-3">
                        {
                          this.state.item.item.free_shipping
                          ? <small>Envío gratis</small>
                          : null
                        }
                      </span>
                      <div className="d-block">
                        <button type="button" className="btn btn-primary w-100">Comprar</button>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-md-8 col-xl-9">
                      <p className="description-title px-3 px-md-0 mt-0 mt-md-5">Descripción del producto</p>
                      <p className="description-content px-3 px-md-0">
                          { this.state.item.item.description }
                      </p>
                    </div>
                  </div>
                </div>
              :
                //mensaje cuando no hay resultados
                <NoResult></NoResult>
          }
        </article>
      </div>
    );
  }

  render() {
		return (
			<div>
				{ this.state.showProduct ? this.template() :  <Loading></Loading> }
			</div>
		)
	}
}
export default withRouter(Product);
