import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.scss';
import Search from './pages/search/Search';
import SearchResults from './pages/search-results/SearchResults';
import Product from './pages/product/Product';

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Search></Search>
        <Switch>
          <Route exact path='/items/search' component={SearchResults}/>
          <Route exact path='/items/:id' component={Product}/>
        </Switch>
        <footer className="px-2 d-flex align-items-center justify-content-center">Test práctico Frontend | 06-2019</footer>
      </div>
    )
    return (
      <Switch>
        <App />
      </Switch>
    );
  }
}

export default App;
