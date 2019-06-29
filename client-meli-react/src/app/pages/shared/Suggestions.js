import React, { Component } from 'react';


class Suggestions extends Component {
  //template sugerencias de busqueda
  render() {
		return (
			<div className="position-absolute w-100 suggestions" style={{display:this.props.words.suggestions?'block':'none'}}>
        { this.props.words.suggestions ?
          this.props.words.suggestions.map((word, index)=>{
            return <div key={index} className="p-2 d-flex flex-row"><i className="fas fa-search text-secondary d-flex align-items-center"></i><p className="valueSuggestion">{word}</p></div>
          })
          : null
        }
			</div>
		)
	}
}
export default Suggestions;
