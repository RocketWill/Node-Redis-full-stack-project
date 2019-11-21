import { Router } from 'express';
import { getRandomPokemons } from '../controllers/getRandomPokemons';

export const randomPokemonsRouter = Router();

randomPokemonsRouter.get('/', getRandomPokemons);

export default randomPokemonsRouter;
