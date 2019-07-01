const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const fetch = require('node-fetch');

const defaultPrivateKey = "5JkGDUhWrVGu8z5qWk7AfkMZoasVAL3ixeNPoZTEMiA9LZkna6S"; // signature for action just for test
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);

const rpc = new JsonRpc('http://jungle2.cryptolions.io:80', { fetch })
const { TextEncoder, TextDecoder } = require('util');

const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

const contract = 'iloveeosio11';


// 添加一条数据
exports.addOneData = function (index) {
  api.transact({
    actions: [{
      account: contract,  // 调用的 action 所在合约账户名
      name: 'adddata',      // 调用的 action 名称
      authorization: [{
        actor: contract,  // 调用该 action 使用的账户权限
        permission: 'active',
      }],
      data: {
        index: index, // 调用的 action 需要传入的参数
      },
    }]
  }, {
      blocksBehind: 3,
      expireSeconds: 30,
    }).then(res => {
      console.log(res); // 打印日志
    });
}

// 异步添加多条数据 
exports.asyncAddData = function () {
  for (let i = 0; i <= 100; ++i) {
    api.transact({
      actions: [{
        account: contract,
        name: 'adddata',
        authorization: [{
          actor: contract,
          permission: 'active',
        }],
        data: {
          index: i,
        }
      }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
      }).then((res) => {
        console.log(res)
      });
  }
}

// 同步添加多条数据
exports.syncAddData = function () {
  (async () => {
    for (let i = 0; i <= 100; ++i) {
      await api.transact({
        actions: [{
          account: contract,
          name: 'adddata',
          authorization: [{
            actor: contract,
            permission: 'active',
          }],
          data: {
            index: i,
          }
        }]
      }, {
          blocksBehind: 3,
          expireSeconds: 30,
        }).then((res) => {
          console.log(res)
        })
    }
  })();
}
