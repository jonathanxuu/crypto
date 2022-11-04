import {u64a_rescue} from "rescue"
import {U8a_to_BU64a, concat_BU64a, U64a_to_HexString} from "./types_handler"

export interface OriginLeaf {
    index: number;
    rlp: Uint8Array;
    uuid: Uint8Array;
  }

// compute saltedhashes 
export function leaf_handler(
    leaves: OriginLeaf[]
  ): String[] {
    leaves.sort(sortData);

    // `saltedhash_vec` -- used to contain saltedhashes
    var saltedhash_vec: Array<String> = new Array();
    for (const key in leaves) {
      if (Object.prototype.hasOwnProperty.call(leaves, key)) {
        const element = leaves[key];
        let rlp_rescue = u64a_rescue(U8a_to_BU64a(element.rlp));
        let uuid_BU64a = u64a_rescue(U8a_to_BU64a(element.uuid));
        let saltedhash = U64a_to_HexString(u64a_rescue(concat_BU64a(rlp_rescue, uuid_BU64a))); 
        saltedhash_vec.push(saltedhash);
      }
    }
    return saltedhash_vec;

  }


  // helper function -- sortData, help sort leaves by the index
  function sortData(a:OriginLeaf, b:OriginLeaf) {
    return a.index - b.index
  }


