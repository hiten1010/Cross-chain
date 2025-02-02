import { Address, Hash } from 'viem';

export interface Transfer {
  txHash: Hash;
  timestamp: number;
  sender: Address;
  receiver: Address;
  amount: bigint;
  token: Address;
  sourceChain: number;
  targetChain: number;
  status: 'pending' | 'completed' | 'failed';
  proof?: Hash[];
  tokenSymbol?: string;
  gasUsed?: bigint;
  blockNumber?: number;
}

export interface TransferStatusProps {
  transfer: Transfer;
  onVerify?: (txHash: Hash) => Promise<void>;
  showDetails?: boolean;
} 