
var MerkleTools = require('../src/merkle-tools/merkletools.js');
import { OriginLeaf, leaf_handler} from "../src/leaf_handler/src/leaf_handler"

const BN = require("bn.js");

let random_u8a_1 = new Uint8Array([1,2,3,4,5]);
let random_u8a_2 = new Uint8Array([22,11,14,24,56]);

let originleaves: OriginLeaf[] = [
    // index -- start with 0
    {index:1, rlp: random_u8a_1, uuid: random_u8a_1},
    {index:0, rlp: random_u8a_2, uuid: random_u8a_2}
];
let saltedhashes = leaf_handler(originleaves);
console.log("saltedhashes are: ", saltedhashes)


var merkleTools = new MerkleTools("sha256");
merkleTools.addLeaves(saltedhashes, false);
merkleTools.makeTree();
let roothash = rootAddZeros_64(merkleTools.getMerkleRoot().toString('hex'));
console.log("roothash is : ",roothash)


// the roothash should be u64, if not, we need to add '0's at the beginning
function rootAddZeros_64(root: any): String {
    if (root.length < 64) {
      return rootAddZeros_64((root = '0' + root));
    } else {
      return root;
    }
  }