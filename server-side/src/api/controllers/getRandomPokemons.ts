import { Request, Response, response } from "express";
import { arrayTypeAnnotation } from "@babel/types";
import * as Promise from 'bluebird';

const axios = require("axios");
const redis = require('redis');
const redisClient = redis.createClient(6379, '127.0.0.1');
redisClient.on('connect', function() {
  console.log('Redis client connected');
});

redisClient.on('error', function (err) {
  console.log('Something went wrong ' + err);
});

const newClient = Promise.promisifyAll(redisClient)


const getRandomNumbersList = (
  min: number,
  max: number,
  total: number
): any[] => {
  let resArr = [] as any[];
  let totalNum = total;
  let inRedis = [];
  while (resArr.length < total) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    // 保证list里的数字不重复
    if (resArr.indexOf(randomNumber) === -1) {
      resArr.push(randomNumber);
    }
  }
  console.log(resArr)
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

const getRedisKeys = () => {
  redisClient.keys('*', (e, d) => {
    return d;
  })
}

const getPokemons = (lst, res) => {
  // const pokemonsInfo = lst.map(pokemonId => {
  //   // redisClient.get(pokemonId, async (err, data) => {
  //   //   if (data) {
  //   //     return await JSON.parse(data);
  //   //   }
  //   //   else{
  //   //     return (
  //   //       await axios (`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
  //   //         .then(d => d.data)
  //   //         // .catch(err => console.error(err))
  //   //     )
  //   //   }
  //   // })
  //   // return (
  //   //   axios (`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
  //   //     .then(d => d.data)
  //   //     .catch(err => console.error(err))
  //   // )
  // })
  redisClient.mget(lst, (err, data) => {
    // console.log(data)
    const f = data.map(d => JSON.parse(d))
    res.send(f)
  })
  // return pokemonsInfo;
}



export function getRandomPokemons(req: Request, res: Response) {
  // const lst = getRandomNumbersList(0, 100, 12);
  const lst = [51, 69, 1, 357, 47, 29, 43, 31, 237, 128, 6, 414]
  // const pokemonList = getPokemons(lst, res)

  getPokemons(lst, res)

  //pokemonList.then(s => console.log(s))

  // Promise.all(pokemonList).then((values) => {
  //   const finalData = values.map(value => {
  //     if (Object.keys(value).length > 7) {
  //       console.log("origin")
  //       const modifiedData = sortOutData(value);
  //       redisClient.set(modifiedData['id'], JSON.stringify(modifiedData))
  //       return modifiedData;
  //     }
  //     else {
  //       console.log("output redis")
  //       return value;
  //     };
  //   })
  //   res.send(finalData)
  // });
}
