import { u64a_rescue } from 'rescue';

var data = require('./credential.json');
// field: claim{contents }, contentDataHash, claimNonceMap, saltedHashMap, legitimations, delegationId, rootHash
const rescue = require('rescue');
const BN = require('bn.js');
const rlp = require('rlp');
var MerkleTools = require('../src/merkle-tools/merkletools.js');
var types_handler = require('../src/leaf_handler/src/types_handler');
const { getCtypeSchema } = require('./ctypeSchema');
const ctype = getCtypeSchema().schema.properties;

// Indexes represent which leaf need to be parsed, and calculate in the VM
// Here, [1,2,3,4,5] means 5 leaves need to be parsed.
const indexes = [1, 1];
let result = convertCreToBN(data, indexes);
console.log('The parsing result is :', result);

function convertCreToBN(data: any, leaves: any) {
  const contents = data.claim.contents;
  const nonces = data.nonces;
  let contents_data: any = [];
  for (const key in contents) {
    if (Object.prototype.hasOwnProperty.call(contents, key)) {
      const element = contents[key];
      contents_data.push(element);
    }
  }

  let new_contentData = [];
  for (const key in ctype) {
    if (Object.hasOwnProperty.call(ctype, key)) {
      const element_type = ctype[key].type;
      const element = contents_data.shift();
      switch (element_type) {
        case 'string':
          new_contentData.push(Array.from(rlp.encode(element)));
          break;
        case 'integer':
          new_contentData.push(Array.from(rlp.encode(element)));

          //   new_contentData.push([Number(element)])
          break;
        case 'number':
          new_contentData.push([Number(element)]);
          break;
        case 'timestamp':
          new_contentData.push([Number(element)]);
          break;
        case 'string_array':
          let string_arr = element
            .slice(1, element.length - 1)
            .split('"')
            .join('')
            .split(',');
          new_contentData.push(Array.from(rlp.encode(string_arr)));
          break;
        case 'integer_array':
          let string_array = element.slice(1, element.length - 1).split(',');
          let int_array = [];
          for (let i = 0; i < string_array.length; i++) {
            int_array.push(parseInt(string_array[i]));
          }
          let res = [];
          res.push(int_array.length);
          res = res.concat(int_array);
          new_contentData.push(res);
          break;
        case 'boolean':
          if (element == 'true') {
            new_contentData.push([Number(1)]);
          } else if (element == 'false') {
            new_contentData.push([Number(0)]);
          } else throw Error('boolean invalid');
          break;
        default:
          throw Error('Datatype invalid encoding....');
      }
    }
  }

  const contentData = new_contentData; // ContentData - RLP code
  var i = 0;
  for (i; i < contentData.length; i++) {
    if (contentData[i].length < 8) {
      contentData[i].push(1);
      while (contentData[i].length < 8) {
        contentData[i].push(0);
      }
    } else if (contentData[i].length % 4 == 3) {
      contentData[i].push(1);
    } else if (contentData[i].length % 4 == 0) {
      continue;
    } else {
      contentData[i].push(1);
      while (contentData[i].length % 4 != 0) {
        contentData[i].push(0);
      }
    }
  }

  // handle the auth path first, we need to generate the merkle tree via saltedhashes.
  let saltedhash: any[] = [];
  i = 0;
  new_contentData.forEach((v: any, i: any) => {
    let content_hash = u64a_rescue(types_handler.U8a_to_BU64a_convert(v));
    let uuid = types_handler.U8a_to_BU64a_buffer(new BN(nonces[i].substr(2), 'hex').toArray());
    let saltedhash_each = u64a_rescue(types_handler.concat_BU64a(content_hash, uuid));
    i = i + 1;
    saltedhash.push(types_handler.U64a_to_HexString(saltedhash_each));
  });

  var treeOptions = {
    // optional, defaults to 'SHA256', we should set it to RESCUE
    hashType: 'RESCUE'
  };
  var merkleTools = new MerkleTools(treeOptions);
  merkleTools.addLeaves(saltedhash);
  merkleTools.makeTree();

  // First input，the rlp code of the element
  // Sec input, the uuid of the element
  i = 0;
  let final_parse_result = '';
  let roothash = data.rootHash.substr(2);
  var roothash_u64vec = rescue.u8a_to_u64a(new BN(roothash, 'hex').toArray());
  final_parse_result = final_parse_result.concat(roothash_u64vec);

  for (i; i < leaves.length; i++) {
    let k = leaves[i];
    let uuid = [];

    final_parse_result = final_parse_result.concat(',', contentData[k].toString());
    let uuid_single = types_handler.U8a_to_BU64a_buffer(
      new BN(nonces[k].substr(2), 'hex').toArray()
    );
    uuid.push(uuid_single.toString());

    final_parse_result = final_parse_result.concat(',', uuid.toString());
    // and the corresponding authpath
    let auth_path = merkleTools.getProof(leaves[i]);

    for (const key in auth_path) {
      if (Object.hasOwnProperty.call(auth_path, key)) {
        const element = auth_path[key];
        let per_auth_node = element.right ? element.right : element.left;
        let per_auth_node_u64vec = rescue.u8a_to_u64a(new BN(per_auth_node, 'hex').toArray());
        final_parse_result = final_parse_result.concat(',', per_auth_node_u64vec.toString());
      }
    }
  }
  return final_parse_result;
}

// the roothash should be u64, if not, we need to add '0's at the beginning
function rootAddZeros_64(root: any): String {
  if (root.length < 64) {
    return rootAddZeros_64((root = '0' + root));
  } else {
    return root;
  }
}
