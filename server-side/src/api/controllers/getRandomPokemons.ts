import { Request, Response, response } from "express";

const axios = require("axios");
const fetch = require("node-fetch");

const getRandomNumbersList = (
  min: number,
  max: number,
  total: number
): any[] => {
  let resArr = [] as any[];
  while (resArr.length < total) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    if (resArr.indexOf(randomNumber) === -1) {
      resArr.push(randomNumber);
    }
  }
  return resArr;
};

const sortOutData = (rawData) => {
  const id = rawData['id'];
  const profile = {
    weight: rawData['weight'],
    height: rawData['height'],
    abilities: rawData['abilities'].map(ability => ability['ability']),
  }
  const held_items = rawData['held_items'].map(item => item['item'])
  const stats = rawData['stats'].map(stat => ({name: stat['stat']['name'], value: stat['base_stat']}))
  const sprite = rawData['sprites']['front_default']
  const name = rawData['name']
  const types = rawData['types'].map(type => type['type'])

  return({
    id,
    profile,
    held_items,
    stats,
    sprite,
    name,
    types
  })
}

const getPokemons = lst => {
  const pokemonsInfo = lst.map( pokemonId => (
    axios (`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      .then(d => d.data)
  ))
  return pokemonsInfo;
}

export function getRandomPokemons(req: Request, res: Response) {
  const lst = getRandomNumbersList(0, 300, 10);
  const pokemonList = getPokemons(lst)
  Promise.all(pokemonList).then((values) => {
    const finalData = values.map(value => sortOutData(value))
    res.send(finalData)
  });
}
