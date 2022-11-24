import * as Kilt from '@kiltprotocol/sdk-js'

// returns CTYPE from a schema
export function getCtypeSchema(): Kilt.CType {
  return Kilt.CType.fromSchema({
    $schema: 'http://kilt-protocol.org/draft-01/ctype#',
    title: 'passport',
    properties: {
      name: {
        type: 'string'
      },
      age: {
        type: 'integer'
      },
      birth:{
        type: 'string'
      },
      bool:{
        type: 'integer'
      }
    },
    type: 'object'
  })
}