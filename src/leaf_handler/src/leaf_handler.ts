var crypto = require('crypto');
var MerkleTools = require('merkle-tools')

export interface OriginLeaf {
  index: number;
  rlp: Uint8Array;
  uuid: Uint8Array;
}

// compute saltedhashes and generate roothash
export function leaf_handler(leaves: OriginLeaf[]): String {
  leaves.sort(sortData);

  // `saltedhash_vec` -- used to contain saltedhashes
  var saltedhash_vec: Array<String> = new Array();
  for (const key in leaves) {
    if (Object.prototype.hasOwnProperty.call(leaves, key)) {
      // sha256 is dealing with u8a
      const element = leaves[key];

      let rlp_buffer = crypto.createHash('sha256').update(Buffer.from(element.rlp.buffer)).digest();
      let uuid_buffer = crypto
        .createHash('sha256')
        .update(Buffer.from(element.uuid.buffer))
        .digest();

      let saltedhash_buffer = crypto
        .createHash('sha256')
        .update(Buffer.concat([Buffer.from(rlp_buffer), Buffer.from(uuid_buffer)]))
        .digest();
      let saltedhash_string = saltedhash_buffer.toString('hex');
      saltedhash_vec.push(saltedhash_string);
    }
  }
  console.log(saltedhash_vec);
  var merkleTools = new MerkleTools('sha256');
  merkleTools.addLeaves(saltedhash_vec);
  merkleTools.makeTree();
  let roothash = rootAddZeros_64(merkleTools.getMerkleRoot().toString('hex'));
  return roothash;
}

// helper function -- sortData, help sort leaves by the index
function sortData(a: OriginLeaf, b: OriginLeaf) {
  return a.index - b.index;
}

// the roothash should be u64, if not, we need to add '0's at the beginning
function rootAddZeros_64(root: any): String {
  if (root.length < 64) {
    return rootAddZeros_64((root = '0' + root));
  } else {
    return root;
  }
}
