var MerkleTools = require('../src/merkle-tools/merkletools.js');
import { OriginLeaf, leaf_handler } from '../src/leaf_handler/src/leaf_handler';
import { concat_U8a } from '../src/leaf_handler/src/types_handler';
import { RLP } from '@ethereumjs/rlp';
import { v4 as uuidv4, parse as uuidParse } from 'uuid';
import { u8a_to_u64a, u64a_rescue } from 'rescue';
const BN = require('bn.js');

// =================== example data ==========================
// the rlp_code of "zcloak" is  [134, 122, 99, 108, 111, 97, 107]
let r1 = RLP.encode('zCloak');
let r2 = RLP.encode(19);
let r3 = RLP.encode('2022.10.31');
let r4 = RLP.encode(1);

// generated by uuidv4()
let uuid_1 = '357d50aac640931f9976477de30b3b476be4a14ae367b045496670d7a23c457d';
let uuid_2 = 'd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97';
let uuid_3 = 'de121244bbf715927542ee94a87ee5f2e338093f58c71ad7f5ed25bec73d5939';
let uuid_4 = '186474372ad7b8dd8e22d42832424b5d7a7b26390f4fd60918a43dbb45dc127b';

//==========================================================
let originleaves: OriginLeaf[] = [
  // index -- start with 0
  { index: 0, rlp: r1, uuid: new BN(uuid_1, 'hex').toArray() },
  { index: 1, rlp: r2, uuid: new BN(uuid_2, 'hex').toArray() },
  { index: 2, rlp: r3, uuid: new BN(uuid_3, 'hex').toArray() },
  { index: 3, rlp: r4, uuid: new BN(uuid_4, 'hex').toArray() }
];

let roothash = leaf_handler(originleaves);

console.log('roothash is: ', roothash);

let para_1 = '0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a';
var temp1 = u8a_to_u64a(new BN(para_1, 'hex').toArray());
console.log(temp1);
