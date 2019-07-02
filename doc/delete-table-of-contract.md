# delete table of contract (删除智能合约的 table 数据)

## 相关测试账户、智能合约以及测试网络的信息

查看[《push action of contract (调用智能合约的 action)》](./push-action-of-contract.md)

## 查找智能合约中的需要删除的 table

在删除智能合约的 table 之前需要先查找到对应的表格先:

```js
rpc.get_table_rows({
  json: true,         
  code: 'iloveeosio11',        // 合约账户名
  scope: 'iloveeosio11',       // 查表的 scope
  table: 'data',               // 表名
  limit: -1,                   // 显示数据的条数，-1 表示显示所有数据
}).then((res) => {
  console.log(res)             // 打印结果
});
```

## 删除指定一条数据

```js
function delOneDate(index) {
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
```

## 异步删除所有数据

```js
function delAsyncData() {
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
```

## 同步删除所有数据

```js
function delSyncData () {
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
```

异步删除 table 数据的速度要比同步的方式要很多，但是容易出现 `Expired Transaction` 的错误，同步则可以按表从头到尾或者从尾到头依次删除数据，不容易出错。

上述相关源码，[请点击这里](../src/deldata.js)