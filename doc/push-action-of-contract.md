# push action of contract (调用合约的 action)

## 准备

首先在测试网络创建测试账户: [Jungle-Testnet](https://monitor.jungletestnet.io/#home) 或者 [Kylin-Testnet](https://www.cryptokylin.io/);

本文在 [Jungle-Testnet](https://monitor.jungletestnet.io/#home) 创建了账户 `iloveeosio11`。

*温馨提示: 创建完账户后记得领取测试网络代币，用于购买 ram 和 抵押 CPU 资源*

## 智能合约

构建用于测试的智能合约，合约主要有两个 action 和一张 table 表。[合约源码](../src/contract/iloveeosio11.cpp)。
关于如何详细的构建和部署智能合约可以参考 [《智能合约开发入门教程》](https://github.com/meet-one/documentation/blob/master/docs/eosio-smart-contract-how-to-program.md)

**action 说明**

adddata:

添加数据

```
cleos -u http://jungle2.cryptolions.io:80 push action iloveeosio11 adddata '[0]' -p iloveeosio11
```

deldata:

删除数据

```
cleos -u http://jungle2.cryptolions.io:80 push action iloveeosio11 deldata '[0]' -p iloveeosio11
```

## js 脚本

首先需要导入相应的 `eosjs` 模块

```js
const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder
```

负责签署交易的私钥，私钥要妥善保存，不要暴露给其他人，这里只是开发用的。

```js
const defaultPrivateKey = "5JkGDUhWrVGu8z5qWk7AfkMZoasVAL3ixeNPoZTEMiA9LZkna6S";
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
```

连接相应网络的 JSON-RPC, 这里连接的是 jungle 测试网络

```js
const rpc = new JsonRpc('http://jungle2.cryptolions.io:80', { fetch })
```

**API**

```js
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
```

添加一条数据：

```js
api.transact({
  actions: [{
    account: 'iloveeosio11',  // 调用的 action 所在合约账户名
    name: 'adddata',      // 调用的 action 名称
    authorization: [{
      actor: 'iloveeosio11',  // 调用该 action 使用的账户权限
      pemission: 'active',
    }],
    data: {
      index : 0, // 调用的 action 需要传入的参数
    }, 
  }]
}, {
  blocksBehind: 3,
  expireSecounds: 30,
}).then(res => {
  console.log(res); // 打印日志
})
```

异步方式添加多条数据：

```js
for(let i = 0; i <= 100; ++i){
  api.transact({
    actions: [{
      account: 'iloveeosio11',  // 调用的 action 所在合约账户名
      name: 'adddata',      // 调用的 action 名称
      authorization: [{
        actor: 'iloveeosio11',  // 调用该 action 使用的账户权限
        pemission: 'active',
      }],
      data: {
        index : i, // 调用的 action 需要传入的参数
      }, 
    }]
  }, {
    blocksBehind: 3,
    expireSecounds: 30,
  }).then(res => {
    console.log(res) // 打印日志
  });
}
```
执行完后你可能认为数据是按顺序被一次添加的，其实并不是：

```
{
  "rows": [{
      "id": 0,
      "index": 9
    },{
      "id": 1,
      "index": 48
    },{
      "id": 2,
      "index": 24
    },{
      "id": 3,
      "index": 54
    },{
      "id": 4,
      "index": 10
    },{
      "id": 5,
      "index": 56
    },{
      "id": 6,
      "index": 17
    },{
      ....
    },{
      "id": 99,
      "index": 0
    },{
      "id": 100,
      "index": 43
    }
  ],
  "more": false
}
```
你会看到表中的数据并不是按顺序添加的，是因为这种方式在把交易推送给节点是以异步的方式完成的并不是只有上次完成时候再推送下一次的交易。

同步方式添加多条数据：

```js
(async () => {
  for(let i = 0; i <= 100; ++i){
    await api.transact({
      actions: [{
        account: 'iloveeosio11',  // 调用的 action 所在合约账户名
        name: 'adddata',      // 调用的 action 名称
        authorization: [{
          actor: 'iloveeosio11',  // 调用该 action 使用的账户权限
          pemission: 'active'
        }],
        data: {
          index : i, // 调用的 action 需要传入的参数
        }, 
      }]
    }, {
      blocksBehind: 3,
      expireSecounds: 30,
    }).then(res => {
      console.log(res) // 打印日志
    })
  }
})
```
这里使用了同步的方式，在上一次的交易完成是才推送下一次的交易，执行表中的数据如下：

```
{
  "rows": [{
      "id": 0,
      "index": 0
    },{
      "id": 1,
      "index": 1
    },{
      "id": 2,
      "index": 2
    },{
      "id": 3,
      "index": 3
    },{
      ....
    },{
      "id": 99,
      "index": 99
    },{
      "id": 100,
      "index": 100
    }
  ],
  "more": false
}
```

上述两种同时添加多条数据的方式执行结果不同，而且执行的时间也不同，异步的方式执行速度更快，但是不能满足顺序执行的要求，各有利弊，需要根据自己的实际要求选择合适的方式。

以上就是使用 js 调用合约 action 的相关脚本的代码。[查看源码](../)