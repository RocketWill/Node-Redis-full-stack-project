import { Router } from 'express';
import { getPokemon } from '../controllers/getPokemon';

export const pokemonsRouter = Router();

pokemonsRouter.get('/:id', getPokemon);

export default pokemonsRouter;
