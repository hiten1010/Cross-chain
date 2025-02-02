import { MerkleTree } from 'merkletreejs';
import { Address, Hash, encodePacked, keccak256 } from 'viem';

export interface TransferData {
  sender: Address;
  receiver: Address;
  amount: bigint;
  token: Address;
  timestamp: number;
  nonce: Hash;
}

export class ProofService {
  private tree: MerkleTree;
  private transfers: TransferData[] = [];

  constructor() {
    this.tree = new MerkleTree([], keccak256);
  }

  addTransfer(transfer: TransferData): Hash {
    const leaf = this.hashTransfer(transfer);
    this.transfers.push(transfer);
    
    const leaves = this.transfers.map(t => this.hashTransfer(t));
    this.tree = new MerkleTree(leaves, keccak256);
    
    return leaf;
  }

  getProof(transfer: TransferData): Hash[] {
    const leaf = this.hashTransfer(transfer);
    return this.tree.getProof(leaf).map(x => x.data as Hash);
  }

  verifyProof(proof: Hash[], transfer: TransferData): boolean {
    const leaf = this.hashTransfer(transfer);
    return this.tree.verify(proof, leaf, this.tree.getRoot());
  }

  getRoot(): Hash {
    return this.tree.getRoot() as Hash;
  }

  private hashTransfer(transfer: TransferData): Hash {
    return keccak256(
      encodePacked(
        ['address', 'address', 'uint256', 'address', 'uint256', 'bytes32'],
        [
          transfer.sender,
          transfer.receiver,
          transfer.amount,
          transfer.token,
          BigInt(transfer.timestamp),
          transfer.nonce
        ]
      )
    );
  }
} 