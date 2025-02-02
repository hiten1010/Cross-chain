declare module 'merkletreejs' {
  export class MerkleTree {
    constructor(leaves: Buffer[], hashFn: (data: Buffer) => Buffer, options?: { hashLeaves?: boolean })
    getRoot(): Buffer
    getHexRoot(): string
    getProof(leaf: Buffer): { position: 'left' | 'right', data: Buffer }[]
    verify(proof: { position: 'left' | 'right', data: Buffer }[], targetNode: Buffer, root: Buffer): boolean
  }
} 