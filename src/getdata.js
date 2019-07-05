const {JsonRpc} = require('eosjs');
const fetch = require('node-fetch');
const rpc = new JsonRpc('http://jungle2.cryptolions.io:80', { fetch })

const contract = 'iloveeosio11';

const Excel = require('exceljs');

exports.getData = function () {
  rpc.get_table_rows({
    json: true,         
    code: contract,        // 合约账户名
    scope: contract,       // 查表的 scope
    table: 'data',               // 表名
    limit: -1,                   // 显示数据的条数，-1 表示显示所有数据
  }).then(res => {
    console.log(res)             // 打印结果
    if (res.rows != null) {
      var start_time = new Date();
      var workbook = new Excel.stream.xlsx.WorkbookWriter({
        filename: './iloveeosio11.xlsx' // 写入 Excel 表格的文件名称
      });
      var worksheet = workbook.addWorksheet('Sheet');

      worksheet.columns = [
        { header: 'id', key: 'id' },  // header 可以自定义, 但是 key 必须对应 data 中的 key 
        { header: 'index', key: 'index' }  
      ];
      data = res.rows;
      var length = data.length;

      // 当前进度
      var current_num = 0;

      console.log('开始添加数据');
      // 开始添加数据
      for (let i in data) {
        worksheet.addRow(data[i]).commit();
        current_num = i;
        
        // 显示完成进度百分比
        console.log((current_num / length * 100).toFixed(2) + '%');
      }
      // console.log('添加数据完毕：', (Date.now() - start_time));
      console.log('添加数据完毕')
      workbook.commit();

      var end_time = new Date();
      var duration = end_time - start_time;

      console.log('用时：' + duration);
      console.log("程序执行完毕");

    }
  });
} 