import { Request, Response } from "express";

const axios = require("axios");

const getRandomNumbersList = (
  min: number,
  max: number,
  total: number
): any[] => {
  let resArr = [] as any[];
  while (resArr.length < total) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    if (resArr.indexOf(randomNumber) === -1) {
      resArr = [...resArr, axios.get(`https://pokeapi.co/api/v2/pokemon/${randomNumber}`)]
    }
  }
  return resArr;
};

const getPokemons = (lst: any[]): any => {
  const result: any[] = [];

  axios
    .all(lst)
    .then(
      axios.spread((...responses) => {
        let resp = [];
        console.log(responses.length);
        responses.map(d => {
          resp = [...resp, d.data]
        })
        return resp;
      })
    )
    .catch(errors => {
      // react on errors.
      console.error(errors);
    });

};

export function getRandomPokemons(req: Request, res: Response) {
  const lst = getPokemons(getRandomNumbersList(0, 300, 10));
  const pokemonList = getPokemons(lst);
  console.log(pokemonList)
  res.send(pokemonList);
}
