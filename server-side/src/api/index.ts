import * as express from 'express';
import { randomPokemonsRouter, pokemonsRouter } from './routes/';

const api = express();
// You may add api specific middlewares here
// TODO: move all controllers in the src/api/controllers folder

api.use('/random-pokemons', randomPokemonsRouter);
api.use('/pokemon', pokemonsRouter);


export default api;
