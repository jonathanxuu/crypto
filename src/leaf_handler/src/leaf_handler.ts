import { assert } from "console";
import { u64a_rescue } from "rescue"
import { U8a_to_BU64a_buffer, concat_BU64a, U64a_to_HexString, U8a_to_BU64a_convert } from "./types_handler"
var MerkleTools = require('../../merkle-tools/merkletools.js');

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
  let roothash = rootAddZeros_64(merkleTools.getMerkleRoot().toString('hex'));
  return roothash
}


