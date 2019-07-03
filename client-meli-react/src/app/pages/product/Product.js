import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { getItemDetail, hideProductResult } from '../../actions/actions';

import NoResult from '../shared/NoResult';
import Loading from '../shared/Loading';

//SEO
import { Helmet } from 'react-helmet';

class Product extends Component {

  componentDidMount() {
    //cargar producto
    this.getProduct();
  }

  // obtengo items en base al valor de busqueda
  getProduct = () => {
    this.props.hideProductResult();
    let param = this.props.match.params.id ? this.props.match.params.id : null;
    if (param) {
      this.props.getItemDetail(param);
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
            this.props.result.item
              ? <meta name="description" content={this.props.result.item.title} />
              : null
          }
        </Helmet>
        <div className="row">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 justify-content-center">
              {
                this.props.categoriesResult.categories
                  ?
                    this.props.categoriesResult.categories.map((current, index, categories)=>{
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
            this.props.result.item
              ?
                <div>
                  <div className="row flex-row justify-content-between p-3 pt-5">
                    <div className="col-12 col-md-8 col-xl-9 p-0">
                      <div className="w-100 text-center">
                        <img className="img-product" src={this.props.result.item.picture} alt="imagen producto"/>
                      </div>
                    </div>
                    <div className="col-12 col-md-4 col-xl-3">
                      <p className="m-0">
                        <small>
                          {
                            this.props.result.item.condition === 'new'
                            ? 'Nuevo'
                            : this.props.result.item.condition === 'used'
                            ? 'Usado'
                            : ''
                          }
                          <span className="mx-1">-</span>
                          { this.props.result.item.sold_quantity } vendidos
                        </small>
                      </p>
                      <p className="m-0 product-title">
                        { this.props.result.item.title }
                      </p>
                      <div className="product-price d-block">
                        <span className="mr-1">
                          { this.props.result.item.price.currency === 'USD'
                            ? 'U$S'
                            : '$'
                          }
                        </span>
                        <span>{ this.props.result.item.price.amount.toLocaleString('de-DE') }</span>
                        <span className="amount-decimals">
                          {
                            this.props.result.item.price.decimals  === 0
                            ? '00'
                            : this.props.result.item.price.decimals
                          }
                        </span>
                      </div>
                      <span className="free-shipping-product d-block mb-3">
                        {
                          this.props.result.item.free_shipping
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
                          { this.props.result.item.description }
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
				{ this.props.showProduct ? this.template() :  <Loading></Loading> }
			</div>
		)
	}
}

//uno de los argumentos usados en el connect, para conectar el store de redux con el componente
const mapStateToProps = (state) => {
  return {
    result: state.product.item,
    showProduct: state.product.showProduct,
    categoriesResult: state.product.categories
  }
}

export default connect(
  mapStateToProps,
  { getItemDetail, hideProductResult }
) (withRouter(Product));
