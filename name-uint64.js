const serialize = require('eosjs/dist/eosjs-serialize')
const numeric = require('eosjs/dist/eosjs-numeric')
const { TextEncoder, TextDecoder } = require('util');   
const buffer1 = new serialize.SerialBuffer({ textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })
const buffer2 = new serialize.SerialBuffer({ textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })

// eosio name to uint64
buffer1.pushName('eosio')
var nameToUint64 = numeric.binaryToDecimal(buffer1.getUint8Array())
console.log('\'eosio\' to uint64_t is: ', nameToUint64)

// uint64 to eosio name
var Uint8 = numeric.decimalToBinary(64, '6138663577826885632');
buffer2.pushArray(Uint8)
var uint64ToName = buffer2.getName();
console.log('6138663577826885632 to name is: ', uint64ToName)
