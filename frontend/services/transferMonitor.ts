import { ProofService } from './proofService';
import type { TransferData } from './proofService';
import { createPublicClient, http, Address, Hash, PublicClient } from 'viem';
import { bridgeABI } from '../abi/bridge';
import { chainConfigs } from '../types/contracts';
import { amoy } from '../config/chains';
import { sepolia } from 'wagmi/chains';
import type { Transfer } from '@/types/transfer';
import { CHAIN_IDS, RPC_URLS } from '@/constants/chains';

export class TransferMonitor {
  private proofService: ProofService;
  private clients: Record<number, PublicClient>;

  constructor() {
    this.proofService = new ProofService();
    this.clients = {
      [CHAIN_IDS.AMOY]: createPublicClient({
        chain: amoy,
        transport: http(RPC_URLS[CHAIN_IDS.AMOY]),
      }),
      [CHAIN_IDS.SEPOLIA]: createPublicClient({
        chain: sepolia,
        transport: http(RPC_URLS[CHAIN_IDS.SEPOLIA]),
      }),
    };
  }

  async monitorTransfer(transfer: Transfer): Promise<void> {
    const client = this.clients[transfer.sourceChain];
    if (!client) {
      throw new Error(`No client found for chain ${transfer.sourceChain}`);
    }

    try {
      const receipt = await client.waitForTransactionReceipt({
        hash: transfer.txHash,
      });

      // Handle receipt
      console.log('Transfer receipt:', receipt);
    } catch (error) {
      console.error('Error monitoring transfer:', error);
      throw error;
    }
  }

  async getTransactionStatus(chainId: number, txHash: string): Promise<'success' | 'failed' | 'pending'> {
    const client = this.clients[chainId];
    if (!client) {
      throw new Error(`No client found for chain ${chainId}`);
    }

    try {
      const receipt = await client.getTransactionReceipt({
        hash: txHash as `0x${string}`,
      });

      if (!receipt) return 'pending';
      return receipt.status === 'success' ? 'success' : 'failed';
    } catch (error) {
      console.error('Error getting transaction status:', error);
      throw error;
    }
  }
} 