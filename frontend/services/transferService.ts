'use client';

import { Address, Hash } from 'viem';
import { ProofService } from './proofService';
import { TransferMonitor } from './transferMonitor';
import { useBridgeContract } from '../hooks/useBridgeContract';
import { chainConfigs } from '../types/contracts';
import { toast } from 'react-hot-toast';

export class TransferService {
  private proofService: ProofService;
  private transferMonitor: TransferMonitor;

  constructor() {
    this.proofService = new ProofService();
    this.transferMonitor = new TransferMonitor();
  }

  async lockTokens(params: {
    sourceChainId: number;
    targetChainId: number;
    token: Address;
    amount: bigint;
    recipient: Address;
  }) {
    try {
      const bridgeContract = useBridgeContract(params.sourceChainId);
      
      // First approve token transfer
      const tokenContract = chainConfigs[params.sourceChainId].supportedTokens.find(
        t => t.address === params.token
      );
      if (!tokenContract) throw new Error('Token not supported');

      // Execute lock transaction
      const tx = await bridgeContract.executeLockTokens({
        amount: params.amount,
        recipient: params.recipient,
        token: params.token,
      });

      // Monitor for event and generate proof
      const { transfer, proof } = await this.transferMonitor.monitorTransfer(
        tx.hash as Hash,
        params.sourceChainId
      );

      return {
        txHash: tx.hash,
        proof,
        transfer,
      };
    } catch (error) {
      console.error('Lock tokens failed:', error);
      throw error;
    }
  }

  async mintTokens(params: {
    transferId: Hash;
    proof: Hash[];
    targetChainId: number;
    recipient: Address;
    amount: bigint;
    token: Address;
  }) {
    try {
      const bridgeContract = useBridgeContract(params.targetChainId);

      const tx = await bridgeContract.executeMintTokens({
        transferId: params.transferId,
        proof: params.proof,
        recipient: params.recipient,
        amount: params.amount,
        token: params.token,
      });

      return tx;
    } catch (error) {
      console.error('Mint tokens failed:', error);
      throw error;
    }
  }

  async burnTokens(params: {
    sourceChainId: number;
    token: Address;
    amount: bigint;
    recipient: Address;
  }) {
    try {
      const bridgeContract = useBridgeContract(params.sourceChainId);

      const tx = await bridgeContract.executeBurnTokens({
        amount: params.amount,
        recipient: params.recipient,
        token: params.token,
      });

      return tx;
    } catch (error) {
      console.error('Burn tokens failed:', error);
      throw error;
    }
  }

  async unlockTokens(params: {
    transferId: Hash;
    proof: Hash[];
    targetChainId: number;
    recipient: Address;
    amount: bigint;
    token: Address;
  }) {
    try {
      const bridgeContract = useBridgeContract(params.targetChainId);

      const tx = await bridgeContract.executeUnlockTokens({
        transferId: params.transferId,
        proof: params.proof,
        recipient: params.recipient,
        amount: params.amount,
        token: params.token,
      });

      return tx;
    } catch (error) {
      console.error('Unlock tokens failed:', error);
      throw error;
    }
  }

  async verifyProof(params: {
    transferId: Hash;
    proof: Hash[];
    chainId: number;
  }): Promise<boolean> {
    try {
      const bridgeContract = useBridgeContract(params.chainId);
      const isValid = await bridgeContract.verifyProof(params.transferId, params.proof);
      return isValid;
    } catch (error) {
      console.error('Proof verification failed:', error);
      return false;
    }
  }
} 