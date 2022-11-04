
var MerkleTools = require('../src/merkle-tools/merkletools.js');
import { randomAsU8a } from '@polkadot/util-crypto';
import { OriginLeaf, leaf_handler} from "../src/leaf_handler/src/leaf_handler"
import { concat_BU64a, U64a_to_HexString} from "../src/leaf_handler/src/types_handler"

import {u64a_rescue, u8a_to_u64a} from "rescue"
const BN = require("bn.js");

let random_u8a_1 = randomAsU8a();
let random_u8a_2 = randomAsU8a();

let originleaves: OriginLeaf[] = [
    // index -- start with 0
    {index:1, rlp: random_u8a_1, uuid: random_u8a_1},
    {index:0, rlp: random_u8a_2, uuid: random_u8a_2}
];
let saltedhashes = leaf_handler(originleaves);
console.log(saltedhashes)
console.log("111")

var merkleTools = new MerkleTools();
merkleTools.addLeaves(saltedhashes);
merkleTools.makeTree();
let roothash = rootAddZeros_64(merkleTools.getMerkleRoot().toString('hex'));
console.log(roothash)
console.log("222")


let test1 = "a292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb";
let test2 = "cb4990b9a8936bbc137ddeb6dcab4620897b099a450ecdc5f3e86ef4b3a7135c";
console.log(test1,test2)
var temp1_u8a = new BN(test1,"hex").toArray();
var temp2_u8a = new BN(test2,"hex").toArray();
let test1_u64a = u8a_to_u64a(temp1_u8a);
let test2_u64a = u8a_to_u64a(temp2_u8a);
let concat = concat_BU64a(test1_u64a, test2_u64a);
let saltedhash =  u64a_rescue(concat);
let res = U64a_to_HexString(saltedhash); 

console.log(res)

// console.log(rescue(test12));
// let test_result = new BN(string_to_u8array(rescue(test12).toString()));
// console.log(test_result.toString("hex"));




// the roothash should be u64, if not, we need to add '0's at the beginning
function rootAddZeros_64(root: any): String {
    if (root.length < 64) {
      return rootAddZeros_64((root = '0' + root));
    } else {
      return root;
    }
  }