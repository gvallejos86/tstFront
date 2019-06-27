import React, { Component } from 'react';


class Loading extends Component {
  //template a mostrar cuando no se encuentran resultados

  render() {
		return (
			<div>
        {
          <div className="pt-5 text-center">
            <i className="fa fa-spinner" aria-hidden="true"></i>
            <i>Buscando...</i>
          </div>
        }
			</div>
		)
	}
}
export default Loading;
