import React, { Component } from 'react';

class PokemonInfo extends Component {
  render() {
    return (
      <div>
        <h1>{`Hello id ${this.props.match.params.id}`}</h1>
      </div>
    );
  }
}

export default PokemonInfo;
