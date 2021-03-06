﻿# Node-Redis-simple-full-stack-project
使用 React, Express 结合 Redis，开发简易的 Pokémon 宝可梦卡片展示全栈应用
## 流程
![app flow](https://raw.githubusercontent.com/RocketWill/Node-Redis-full-stack-project/master/readme-images/app-flow.png)  
其中最右端的数据库也可以是外部应用程序，有些 API 服务可能是按次收费或限制请求次数，如此一来就有必要加入 Redis 以解决这个问题
## 应用介绍
#### Demo 地址
http://35.229.181.241  
若失效请见谅
#### 成果展示
![app demo](https://raw.githubusercontent.com/RocketWill/Node-Redis-full-stack-project/master/readme-images/app-demo.gif) 
#### 说明
1. 使用 [PokéAPI](https://pokeapi.co)，可以通过宝可梦名字或 id 查询特定宝可梦信息
2. 进入应用首页时，会随机显示 12 张宝可梦卡片，仅包含名称和 id
3. 首页上方的搜寻拦支持输入宝可梦名或 id，进行查找特定宝可梦
4. 点击首页上的卡片会进入详情页，该页显示宝可梦的相关信息
    - ID
    - Type（宝可梦属性）
    - Held Items (持有物品)
    - Profile
        - Height（身长）
        - Weight（体重）
    - Abilities（招式）
    - Stats（能力指标）
        - hp （血量）
        - attack（攻击力）
        - defense（防御力）
        - special-attack（特殊攻击力）
        - special-defense（特殊防御力）
        - speed（速度）
5. 宝可梦详情页可以点击图示下方的左右箭头切换显示前一个或后一个 id 的宝可梦
## 应用实现
#### 后端
##### 数据格式
1. 根据 `https://pokeapi.co/api/v2/pokemon/{name or id}` 得到的数据包含以下属性，具体请见[官网](https://pokeapi.co)
```
1) abilities: array
2) base_experience: number
3) forms: array
4) game_indices: array 
5) height: number
6) held_items: array
7) id: number
8) is_default: boolean
9) location_area_encounters: string
10) moves: array
11) name: string
12) order: number
13) species: object
14) sprites: object
15) stats: array
16) types: array
17) weight: number
```
2. 由于本次应用较简单，并不需要使用所有的宝可梦信息，所以在后端返回数据前将格式整理成以下形式
```
interface PokemonInfo {
    id: number;
    profile: {
        weight: number;
        height: number;
        abilities: {
            name?: string;
            utl?: string;
        }[];
    };
    held_items: {
        name?: string;
        url?: string;
    }[];
    stats: {
        name?: string;
        value?: number;
    }[];
    sprite: string;
    name: string;
    types: {
        name?: string;
        url?: string;
    }[];
}
```
##### Express API
1. `GET /random-pokemons`  
    - 用途：返回 12 个随机的宝可梦信息
    - 说明：
        - 先产生包含 12 个不同数字的随机数组。
        - 使用 Redis 的 `MGET` 方法，查询 Redis 中是否已经存在这些 id，有则返回对应数据；没有则返回 null。example：`[data, null, null, data, data, null, data, data, null, null, null, data]`
        - 使用 map 方法将 null 替换成 `axios.get(https://pokeapi.co/api/v2/pokemon/{对应id})`，此为 Promise 对象
        - 用 `Promise.all` 取得最后数据，整理后返回，同时将 Redis 中不存在的数据写入
2. `GET /pokemons/:{id or name}`  
    - 用于：返回单个宝可梦信息
    - 参数（择一）：
        - id（宝可梦 id）
        - name（宝可梦名字）
    - 说明：
        - 取得参数的 id 或 name
        - 先查看 Redis 中是否有以该 id 或 name 为 key 的值，有则直接返回
        - 若无则到外部应用查，取得数据整理后返回，同时写入 Redis 中
#### 前端
1. React 框架：[Umi.js](https://umijs.org/)
2. UI 库：[Ant Design](https://ant.design/)
#### 部署
##### 开发模式
1. 启动本机 Redis，设置端口为 `6379`
2. 后端启动
    - 进入 server-side 文件夹
    - 运行 `yarn` 安装依赖
    - 运行 `yarn start:dev` 启动
3. 前段启动
    - 进入 client-side 文件夹
    - 运行 `yarn` 安装依赖
    - 运行 `yarn start` 启动
##### Docker
使用 Docker Compose
1. server-side.dockerfile
```
FROM node:10-alpine
WORKDIR /app
COPY . ./
RUN yarn
EXPOSE 3000
```
2. client-side.dockerfile
```
FROM node:10-alpine as react-build
WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build

# Stage 2 - the production environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/dist /usr/share/nginx/html
EXPOSE 80
```
3. docker-compose.yaml
```
version: '2'
services:
  client:
    environment:
      - SERVER_IP=${SERVER_IP}
    image: pokemon-client:0.0.1
    container_name: client_side
    hostname: client
    ports:
      - 80:80
    command: "nginx -g daemon off;"

  server:
    environment:
      - PORT=3000
      - SERVER_IP=${SERVER_IP}
    image: pokemon-server:0.0.1
    container_name: server_side
    hostname: server
    links: 
      - redis
    ports:
      - 3000:3000
    command: "yarn build"

  redis:
    image: redis
    working_dir: /cache
    container_name: redis
    hostname: redis
    ports:
      - 6379
    command: "redis-server"
```
4. 运行 `docker-compose up -d` 启动
## Redis 介绍
#### 为何要使用 redis
随着用户不断地增长，后端数据库请求的需求量爆增，为了降低响应时间和巨额成本，必须做一个 Caching 来保存该死的数据库请求。

#### 缓存（Cache）
1. 客户端缓存：  
某些应用，如浏览器，为了实现能够快速响应用户的请求，会把用户之前浏览的东西（ex：图片）存在本地。在下次访问时，如果本地的缓存里有请求的内容，那么就直接展示出来，不用再次向服务器请求。
2. 服务端缓存：  
与客户端缓存目的相同，只是站在服务器角度考虑。如果每次接到客户端请求都要连接一次数据库，当用户请求多的时候，负载会过大。可以把一些经常被请求的数据存放在内存中，当有请求时直接返回，不用经过数据库。如此就可以减轻数据库的负担。

##### 术语
1. HIT（命中）  
客户端发起请求，如果请求的资源在缓存中，可以直接返回该资源给用户，称为缓存命中。
2. MISS（未命中）  
和 HIT 相反。这时需要查询数据库，并将结果写入缓存中。
3. 存储成本
当 MISS 时，会从数据库拿取数据然后加入缓存。存储成本就是把数据放进缓存所需要时间和空间的花费。
4. 失效
    - 缓存中的数据需要更新时，意味该数据已经失效了
    - 该缓存数据过了 TTL（存活时间）。由于缓存会占用内存，通常都会通过设置 TTL 来让缓存定期失效。
5. 失效策略  
如果缓存满了，且新的用户请求又没有命中缓存，就必须照着某个策略将旧资源剔除，把新资源写入缓存。失效策略就是决定要如何清除旧资源的算法。
#### 什么是 Redis？
- 根据 Redis 主页，Redis 是开源（BSD）的内存中数据结构存储，可以用作数据库、缓存或消息中间件。
- 支持多种数据结构，字串、哈希、列表、集合等。

#### 选 Redis 的理由
- 啊就是很快，底层是用 C 实现。
- NoSQL 数据库
- 被许多科技公司采用
- 降低数据库调用（可以省钱！）
- 支援大多数程式语言（JavaScript，Java，Go，C，C ++，C#，Python，Objective-C，PHP 等等）
- 数据可以从主服务器向任意数量的从服务器上同步，从服务器可以是关联其他从服务器的主服务器。这使得 Redis 可执行单层树复制。存盘可以有意无意的对数据进行写操作。由于完全实现了发布/订阅机制，使得从数据库在任何地方同步树时，可订阅一个频道并接收主服务器完整的消息发布记录。同步对读取操作的可扩展性和数据冗余很有帮助。
#### Redis 数据存储
所有的增删改查都是在 Redis 中进行，Redis 有硬盘的持久化机制，定期进行存储，保证了数据的完整性和安全性。

- 查看 redis 客户端： 
`
which redis-cli
`

- 登录：`redis-cli` (默认登录本机 `6379` 端口)
    - `info` 命令查看redis信息

## Redis 操作
#### 备份与还原
有两种方式：
1. 拷贝 rdb 文件  
    - 参考 https://www.digitalocean.com/community/tutorials/how-to-back-up-and-restore-your-redis-data-on-ubuntu-14-04
    - 缺点是只能在本机操作
2. Dump and restore 
    - 安装： `[sudo] npm i redis-dump -g`
    - 导出数据库：`redis-dump -p 6379 -h localhost -d 0 > file.txt #backup`
    - 导入数据：`cat file.txt | redis-cli`


#### 数据类型

数据类型 | 可以存储的值 | 操作
---|---|---
String | String, Float, Integer，统称为元素 | 对字串操作、对整数类型加减
List（双向链表） | 一个序列集合，且每个结点包含一个元素 | 序列两端 push、pop，修剪、查找或删除元素
Set | 哈希表实现，元素不重复 | 从集合插入或删除元素
Hash（字典） | 键值对集合（即 Map） | 根据 key 进行插入或删除
Sorted Set（有序集合） | 将Set中的元素增加一个权重参数 score，元素按 score 有序排列 | 集合插入、依照 score 范围查找

#### Keys
1. 查看全部的 Key：`keys *`
2. 判断 Key 是否存在：`EXISTS key_name`
3. 设置 Key-Value：`SET key value`
4. 取得 Key 对应的 Value： `GET key_name` 
5. 删除 Key：`DEL key_name`
6. 设置 TTL：`EXPIRE key_name second`
7. 查看剩余 TTL 时间：`TTL key_name`
8. Persisit（删除 Key 的 TTL）：`PERSIST key_name`
9. 重命名：`RENAME key_name key_new_name`
10. 清除所有内容（Key）：`FLUSHALL`
#### String 字符串
用 `SET` 方法添加的 Value 即是字符串类型  
1. `SET someKey someValue`
2. 
```
TYPE someKey
output: string
```
3. 
```
GET someKey
output: "someValue"
```
#### Hash 哈希/字典
1. 创建哈希类型数据：`HSET person name Will`  
一个 person 字典，包含一个 name 属性，值为 Will
2. 查看类型 
```
TYPE person
output: hash
```
3. 一次添加多个属性 `HSET person age 26 email will@pku.edu.cn`
4. 获得全部 Key-Value
```
HGETALL person
output:
1) "name"
2) "Will"
3) "age"
4) "26"
5) "email"
6) "will@pku.edu.cn"
```
5. 获取某个 Key 的 Value
```
HGET person email
output: 
"will@pku.edu.cn"
```
6. 查看 Key 的属性个数
```
HLEN person
output：
(integer) 3
```
#### List 列表
List 不要求里面的元素必须唯一
```
LPUSH 左进 
RPOP 右出
LLEN key_name 查看 List 有几个元素
```
1. 左插入三个数据：`LPUSH name Tom Wesley Will`
2. 查看类型：
```
TYPE name
output: list
```
3. 打印所有元素：
```
LRANGE name 0 -1
output: 
1) "Will"
2) "Wesley"
3) "Tom"
```
4. List 长度：
```
LLEN name
output: 
(integer) 3
```
#### Set 集合
1. 创建集合：
```
SADD brands Sony Hitachi Apple Dell Xiaomi HTC
output: 
(integer) 6
```
2. 查看集合内全部成员：
```
SMEMBERS brands
output:
1) "Hitachi"
2) "Sony"
3) "Apple"
4) "Xiaomi"
5) "HTC"
6) "Dell"
```
3. 集合内成员数量：
```
SCARD brands
output:
(integer) 6
```
4. 删除某个成员：
```
SREM brands Xiaomi
output:
(integer) 1
```
5. 随机删除某个成员并返回
```
SPOP brands
output:
"Apple"

SMEMBERS brands
output:
1) "Dell"
2) "Sony"
3) "HTC"
4) "Sony"
```
#### 有序集合 Sorted Set
1. 创建有序集合
```
ZADD sortedSet 10 US 20 Japan 30 Germany 40 Netherlands
output: 
(integer) 4
```
2. 查看成员数量
```
ZCARD sortedSet
output:
(integer) 4
```
3. 查看分数区间成员数量
```
ZCOUNT sortedSet 11 33
output:
(integer) 2
```
4. 查看某成员排名，按分数由小到大，从 0 开始计算
```
ZRANK sortedSet Japan
output:
(integer) 1
```
5. 查看某成员排名，由大到小
```
ZREVRANK sortedSet Japan
output:
(integer) 2
```
6. 删除某成员
```
ZREM sortedSet Japan
output:
(integer) 1
```
7. 查看某成员的分数
```
ZSCORE sortedSet Japan
output:
(nil)

ZSCORE sortedSet Netherlands
output:
"40"
```
