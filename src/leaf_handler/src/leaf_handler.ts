import { assert } from "console";
import { string_to_u64array, u64a_rescue,u8a_to_u64a } from "rescue"
import { U8a_to_BU64a_buffer, concat_BU64a, U64a_to_HexString, U8a_to_BU64a_convert } from "./types_handler"
var MerkleTools = require('../../merkle-tools/merkletools.js');
const BN = require("bn.js");

export interface OriginLeaf {
  index: number;
  rlp: Uint8Array;
  uuid: Uint8Array;
}

// compute saltedhashes 
export function leaf_handler(
  leaves: OriginLeaf[]
): String {
  leaves.sort(sortData);
  // `saltedhash_vec` -- used to contain saltedhashes
  var saltedhash_vec: Array<String> = new Array();
  for (const key in leaves) {
    if (Object.prototype.hasOwnProperty.call(leaves, key)) {
      const element = leaves[key];
      
      let rlp_rescue = u64a_rescue(U8a_to_BU64a_convert(element.rlp));
      assert(element.uuid.length == 32, "The UUID is not valid")
      let uuid_BU64a = U8a_to_BU64a_buffer(element.uuid);

      let saltedhash = U64a_to_HexString(u64a_rescue(concat_BU64a(rlp_rescue, uuid_BU64a)));
      saltedhash_vec.push(saltedhash);
      
    }
  }
  for (const key in saltedhash_vec) {
    if (Object.prototype.hasOwnProperty.call(saltedhash_vec, key)) {
      const element = saltedhash_vec[key];
      
    }
  }
  let roothash = calcRoothash(saltedhash_vec);
  return roothash;
}

// helper function -- sortData, help sort leaves by the index
function sortData(a: OriginLeaf, b: OriginLeaf) {
  return a.index - b.index
}

// the roothash should be u64, if not, we need to add '0's at the beginning
function rootAddZeros_64(root: any): String {
  if (root.length < 64) {
    return rootAddZeros_64((root = '0' + root));
  } else {
    return root;
  }
}

function calcRoothash(
  saltedhashes: String[]
): String{
  var treeOptions = {
    // optional, defaults to 'SHA256', we should set it to RESCUE
    hashType: 'RESCUE'
  }

  var merkleTools = new MerkleTools(treeOptions);
  merkleTools.addLeaves(saltedhashes);
  merkleTools.makeTree();


  let auth_path = merkleTools.getProof(1);

  for (const key in auth_path) {
    if (Object.hasOwnProperty.call(auth_path, key)) {
        const element = auth_path[key];
        let per_auth_node = element.right? element.right : element.left;

        let temp1 = new BN(per_auth_node, "hex").toArray().toString();
        let temp1_vec = temp1.split(",");
        while (temp1_vec.length < 32) {
            temp1_vec.unshift(0);
        }
        temp1 = temp1_vec.toString();
        let per_auth_node_u64vec = string_to_u64array(temp1);
    }
}



  let roothash = rootAddZeros_64(merkleTools.getMerkleRoot().toString('hex'));
  return roothash
}


