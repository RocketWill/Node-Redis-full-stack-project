import { PokemonInfo as IPokemonInfo } from '../pages/data.d';
export default {
    namespace: 'pokemons',
    state: {},
    reducers: {
      delete(state: IPokemonInfo[], { payload: id }: {payload: number}) {
        return state.filter(item => item.id !== id);
      },
      save(state: IPokemonInfo[], {payload: data}: {payload: IPokemonInfo[]}) {
          return {...state, pokemonsList: data}
      }
    },
  };
