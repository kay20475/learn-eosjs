let addData = require("./src/adddata");
let delData = require("./src/deldata");
let getData = require("./src/getdata");

function run() {
  // 添加一条数据
  // addData.addOneData(0);
  // 异步添加多条数据 
  // addData.asyncAddData();
  // 同步添加多条数据
  // addData.syncAddData();

  
  // 删除指定的一条数据
  // delData.delOneDate(100);
  // 异步删除所有数据
  // delData.delAsyncData();
  // 同步删除所有数据
  // delData.delSyncData();

  // get Data
  getData.getData();
  
}

run()