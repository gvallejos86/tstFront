import React, { Component } from 'react';


class NoResult extends Component {
  //template a mostrar cuando no se encuentran resultados

  render() {
		return (
			<div>
        {
          <div className="p-5 text-center">
            <i className="fa fa-exclamation-triangle mr-2" aria-hidden="true"></i>
            <i>Lo sentimos. No se encontraron resultados</i>
          </div>
        }
			</div>
		)
	}
}
export default NoResult;
