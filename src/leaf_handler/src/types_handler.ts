import { u64a_to_u8a, u8a_to_u64a } from "rescue"
const BN = require("bn.js");

// helper function -- help convert Uint8array to BigUint64Array (using buffer), this method should be used to handle UUID
export function U8a_to_BU64a_buffer(
  u8a: Uint8Array
): BigUint64Array {
  // if the u8a's length is not a multiple of 8, padding it
  let biguint64 = u8a_to_u64a(u8a)
  return biguint64
}

// helper function -- help convert Uint8array to BigUint64Array (convert every u8 to u64), this method should be used to handle RLP
export function U8a_to_BU64a_convert(
  u8a: Uint8Array
): BigUint64Array {
  // convert each u8 to u64, so the resule array should have the same length
  var biguint64 = new BigUint64Array(u8a.length);
  u8a.forEach((val, idx) => {
    biguint64[idx] = BigInt(val)
  });

  return biguint64
}

// Used to concat two BigUint64Array into one
export function concat_BU64a(
  concat_1: BigUint64Array,
  concat_2: BigUint64Array
): BigUint64Array {
  var concat_result = new BigUint64Array(concat_1.length + concat_2.length);
  concat_result.set(concat_1);
  concat_result.set(concat_2, concat_1.length);
  return concat_result
}

// Used to concat two Uint8Array into one
export function concat_U8a(
  concat_1: Uint8Array,
  concat_2: Uint8Array
): Uint8Array {
  var concat_result = new Uint8Array(concat_1.length + concat_2.length);
  concat_result.set(concat_1);
  concat_result.set(concat_2, concat_1.length);
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