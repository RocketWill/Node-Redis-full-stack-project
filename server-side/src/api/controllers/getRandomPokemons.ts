import { Request, Response, response } from "express";
import { arrayTypeAnnotation } from "@babel/types";
import * as Promise from "bluebird";
import { json } from "body-parser";
import { sortOutData } from "./utils";


const axios = require("axios");
const redis = require("redis");
const redisClient = redis.createClient(6379, "127.0.0.1");
redisClient.on("connect", function() {
  console.log("Redis client connected");
});

redisClient.on("error", function(err) {
  console.log("Something went wrong " + err);
});

const newClient = Promise.promisifyAll(redisClient);

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
  console.log(resArr);
  return resArr;
};

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
  // redisClient.mget(lst, (err, data) => {
  //   // console.log(data)
  //   const f = data.map(d => JSON.parse(d))
  //   res.send(f)
  // })
  // return pokemonsInfo;

  newClient
    .mgetAsync(lst)
    .then(infoList => {
      const finalInfoList = [];
      for (let i = 0; i < infoList.length; i++) {
        // console.log(infoList[i])
        if (infoList[i]) {
          finalInfoList.push(JSON.parse(infoList[i]));
        } else {
          finalInfoList.push(
            axios(`https://pokeapi.co/api/v2/pokemon/${lst[i]}`).then(
              d => d.data
            )
          );
        }
      }
      return finalInfoList;
    })
    .then(finalInfoList => {
      Promise.all(finalInfoList).then(values => {
        const finalData = values.map(value => {
          if (Object.keys(value).length > 7) {
            console.log("origin");
            const modifiedData = sortOutData(value);
            redisClient.set(modifiedData["id"], JSON.stringify(modifiedData));
            return modifiedData;
          } else {
            console.log("output redis");
            return value;
          }
        });
        res.send(finalData);
      });
    });
  // return pokemonsInfo;
};

export function getRandomPokemons(req: Request, res: Response) {
  const lst = getRandomNumbersList(1, 180, 12);
  // const lst = [ 46, 35, 0, 24, 23, 52, 48, 88, 13, 19, 67, 78 ]
  getPokemons(lst, res);
  // newClient.getAsync(11).then(d => console.log(d))

  // console.log(aaa)

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
