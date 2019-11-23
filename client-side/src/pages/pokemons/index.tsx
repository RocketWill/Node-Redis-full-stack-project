import React, { Component } from 'react';
import RandomPokemons from './components/RandomPokemons';
import style from './index.css';

class index extends Component {
  render() {
    return (
      <div>
        {/* <Products /> */}
        <RandomPokemons />
      </div>
    );
  }
}

export default index;
