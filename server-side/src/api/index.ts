import * as express from 'express';
import { randomPokemonsRouter } from './routes/';

const api = express();
// You may add api specific middlewares here
// TODO: move all controllers in the src/api/controllers folder

api.use('/random-pokemons', randomPokemonsRouter);

export default api;
