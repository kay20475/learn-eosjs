const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const fetch = require('node-fetch');

const defaultPrivateKey = "5JkGDUhWrVGu8z5qWk7AfkMZoasVAL3ixeNPoZTEMiA9LZkna6S"; // signature for action just for test
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);

const rpc = new JsonRpc('http://jungle2.cryptolions.io:80', { fetch })
const { TextEncoder, TextDecoder } = require('util');   

const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

const contract = 'iloveeosio11';


// 删除指定的一条数据
exports.delOneDate = function (index) {
  rpc.get_table_rows({
    json: true,
    code: contract,   // 合约账户名
    scope: contract,  // 查表的 scope
    table: 'data',    // 表名
    lower_bound: index, // 限定查找数据范围 [lower_bound, upper_bound] 闭区间中的数据
    upper_bound: index,
    limit: 1            // 显示条数， -1 表示显示所有查找到的数据
  }).then(res => {
    console.log(res);
    if (res.rows != null) {
      // 提交删除数据的 action
      api.transact({
        actions: [{
          account: contract,
          name: 'deldata',
          authorization: [{
            actor: contract,
            permission: 'active',
          }],
          data: {
            id: res.rows[0].id,
          }
        }]
      }, {
          blocksBehind: 3,
          expireSeconds: 30
        }).then(res => {
          console.log(res);
      })
    }
  })
}

// 异步删除所有数据
exports.delAsyncData = function () {
  rpc.get_table_rows({
    json: true,         
    code: contract,        // 合约账户名
    scope: contract,       // 查表的 scope
    table: 'data',               // 表名
    limit: -1,                   // 显示数据的条数，-1 表示显示所有数据
  }).then((res) => {
    console.log(res)             // 打印结果
    if (res.rows != null) {
      for (let index in res.rows) {
        api.transact({
          actions: [{
            account: contract,
            name: 'deldata',
            authorization: [{
              actor: contract,
              permission: 'active',
            }],
            data: {
              id: res.rows[index].id,
            }
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30
        }).then(res => {
            console.log(res);
        });
      }
    }
  });
} 

// 同步删除所有数据
exports.delSyncData = function () {
  rpc.get_table_rows({
    json: true,         
    code: contract,        // 合约账户名
    scope: contract,       // 查表的 scope
    table: 'data',               // 表名
    limit: -1,                   // 显示数据的条数，-1 表示显示所有数据
  }).then((res) => {
    console.log(res)             // 打印结果
    if (res.rows != null) {
      (async () => {
        for (let index in res.rows) {
          await api.transact({
            actions: [{
              account: contract,
              name: 'deldata',
              authorization: [{
                actor: contract,
                permission: 'active',
              }],
              data: {
                id: res.rows[index].id,
              }
            }]
          }, {
              blocksBehind: 3,
              expireSeconds: 30
            }).then(res => {
              console.log(res);
            });
        }
      })();
    }
  });
} 