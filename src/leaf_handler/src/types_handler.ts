import {u64a_to_u8a} from "rescue"
const BN = require("bn.js");

  // helper function -- help convert Uint8array to BigUint64Array
export function U8a_to_BU64a(
    u8a: Uint8Array
    ): BigUint64Array{
      // if the u8a's length is not a multiple of 8, padding it
      var u8a_extend: Uint8Array;
      if (u8a.byteLength % 8 == 0 ){
        u8a_extend = u8a;
      }else {
        let extend_length = 8 - u8a.byteLength % 8;
        u8a_extend = new Uint8Array(u8a.byteLength + extend_length);
        u8a_extend.set(u8a);
      }

      let biguint64 = new BigUint64Array(u8a_extend.buffer);

    return biguint64
  }

export function concat_BU64a(
    concat_1: BigUint64Array,
    concat_2: BigUint64Array
  ): BigUint64Array{
    var concat_result = new BigUint64Array(8);
    concat_result.set(concat_1);
    concat_result.set(concat_2, 4);
    return concat_result
  }

  // convert U64array to HexString
export function U64a_to_HexString(
    u64a: BigUint64Array
  ): String {
    let u8a = u64a_to_u8a(u64a);
    let bn = new BN(u8a);
    let hex_string = rootAddZeros(bn.toString("hex"));
    return hex_string
  }

  function rootAddZeros(
    root: String
  ): String {
    if (root.length < 64) {
      return rootAddZeros((root = "0" + root));
    } else {
      return root;
    }
  }