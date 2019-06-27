import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';


class Search extends Component {
  constructor (props){
        super(props);
        this.state = {  query : '' };
  }

  searchItems = (event) => {
    if (this.state.query) {
      let query = this.state.query;
      this.props.history.push(`/items/search?query=${query}`);
      event.preventDefault();
    }else {
      this.props.history.push(`/`);
      event.preventDefault();
    }
  }

  render() {
    return (
    <div className="nav-header">
      <div className="container">
        <nav className="navbar navbar-light justify-content-center px-0">
          <div className="nav-logo mr-3"></div>
          <form className="form-inline no-focus w-75" onSubmit={this.searchItems}>
            <div className="input-group w-100">
              <input
                type="text"
                className="form-control"
                placeholder="Nunca dejes de buscar"
                value={this.state.query} onChange={(ev)=>this.setState({query:ev.target.value})}/>
              <div className="input-group-prepend" onClick={this.searchItems}>
                <span className="input-group-text"><i className="fas fa-search"></i></span>
              </div>
            </div>
          </form>
        </nav>
      </div>
    </div>
    );
  }
}
export default withRouter(Search);
