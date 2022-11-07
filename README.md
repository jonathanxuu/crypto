# crypto

## Rescue Hash

In this construction, each leaf(`OriginLeaf`) should have 3 property:
- index: `number`
- rlp: `Uint8Array`
- uuid: `Uint8Array`

The rlp should be obtained by `RLP.encode` in '@ethereumjs/rlp'
The uuid should be obtained by `uuidv4()` in 'uuid' (A more secure implementation: for each leaf, we offer a uuid with 256 bits rather than the original 128 bits)

Use `leaf_handler` to calculate Roothash via `OriginLeaf[]` as shown in example of the `index.ts`