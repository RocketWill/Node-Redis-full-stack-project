import { Request, Response } from "express";
import * as Promise from "bluebird";
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

const redisClientAsync = Promise.promisifyAll(redisClient);

const getPokemonInfo = (id: any, res: Response) => {
    // 先检查是否在 redis 中
    redisClientAsync.getAsync(id).then(info => {
        if(info) {
            res.send(JSON.parse(info))
        } else {
            // 不在redis里
            if(typeof id === 'string') id = id.toLowerCase();
            axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
                .then(d => d.data)
                .then(d => sortOutData(d))
                .then(d => {
                    redisClient.setex(d.id, 7200, JSON.stringify(d));
                    redisClient.setex(d.name, 7200, JSON.stringify(d));
                    res.send(d);
                })
                .catch(err => console.error(err))
        }
    })
}

export function getPokemon(req: Request, res: Response) {
    const {id} = req.params;
    getPokemonInfo(id, res);
    // res.send(result)
}
