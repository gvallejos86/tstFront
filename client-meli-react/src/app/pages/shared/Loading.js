import React, { Component } from 'react';


class Loading extends Component {
  //template a mostrar cuando no se encuentran resultados

  render() {
		return (
			<div>
        {
          <div className="pt-5 text-center">
            <div className="lds-spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        }
			</div>
		)
	}
}
export default Loading;
