import React, { Component } from 'react';
import Products from './components/products';
import RandomPokemons from './components/RandomPokemons';

class index extends Component {
  render() {
    return (
      <div>
        <Products />
        <RandomPokemons />
      </div>
    );
  }
}

export default index;
