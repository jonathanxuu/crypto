var crypto = require('crypto')

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
        // sha256 is dealing with u8a
        const element = leaves[key];
      
        let rlp_buffer = crypto.createHash('sha256').update(Buffer.from(element.rlp.buffer)).digest()
        let uuid_buffer = crypto.createHash('sha256').update(Buffer.from(element.uuid.buffer)).digest()

        let saltedhash_buffer = crypto.createHash('sha256').update(Buffer.concat([Buffer.from(rlp_buffer), Buffer.from(uuid_buffer)])).digest()
        let saltedhash_string = saltedhash_buffer.toString('hex');
        saltedhash_vec.push(saltedhash_string);
      }
    }
    return saltedhash_vec;

  }


  // helper function -- sortData, help sort leaves by the index
  function sortData(a:OriginLeaf, b:OriginLeaf) {
    return a.index - b.index
  }


