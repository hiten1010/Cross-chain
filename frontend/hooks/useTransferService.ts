'use client';

import { Address, Hash } from 'viem';
import { useCallback } from 'react';
import { useBridgeContract } from './useBridgeContract';
import { chainConfigs } from '../types/contracts';
import { ProofService } from '../services/proofService';
import { TransferMonitor } from '../services/transferMonitor';

const proofService = new ProofService();
const transferMonitor = new TransferMonitor();

export function useTransferService() {
  const getBridgeContract = useBridgeContract();

  const lockTokens = useCallback(async (params: {
    sourceChainId: number;
    targetChainId: number;
    token: Address;
    amount: bigint;
    recipient: Address;
  }) => {
    try {
      const bridgeContract = getBridgeContract(params.sourceChainId);
      
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
      const { transfer, proof } = await transferMonitor.monitorTransfer(
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
  }, [getBridgeContract]);

  const mintTokens = useCallback(async (params: {
    transferId: Hash;
    proof: Hash[];
    targetChainId: number;
    recipient: Address;
    amount: bigint;
    token: Address;
  }) => {
    try {
      const bridgeContract = getBridgeContract(params.targetChainId);
      return await bridgeContract.executeMintTokens(params);
    } catch (error) {
      console.error('Mint tokens failed:', error);
      throw error;
    }
  }, [getBridgeContract]);

  const burnTokens = useCallback(async (params: {
    sourceChainId: number;
    token: Address;
    amount: bigint;
    recipient: Address;
  }) => {
    try {
      const bridgeContract = getBridgeContract(params.sourceChainId);
      return await bridgeContract.executeBurnTokens(params);
    } catch (error) {
      console.error('Burn tokens failed:', error);
      throw error;
    }
  }, [getBridgeContract]);

  const unlockTokens = useCallback(async (params: {
    transferId: Hash;
    proof: Hash[];
    targetChainId: number;
    recipient: Address;
    amount: bigint;
    token: Address;
  }) => {
    try {
      const bridgeContract = getBridgeContract(params.targetChainId);
      return await bridgeContract.executeUnlockTokens(params);
    } catch (error) {
      console.error('Unlock tokens failed:', error);
      throw error;
    }
  }, [getBridgeContract]);

  const verifyProof = useCallback(async (params: {
    transferId: Hash;
    proof: Hash[];
    chainId: number;
  }): Promise<boolean> => {
    try {
      const bridgeContract = getBridgeContract(params.chainId);
      return await bridgeContract.verifyProof(params.transferId, params.proof);
    } catch (error) {
      console.error('Proof verification failed:', error);
      return false;
    }
  }, [getBridgeContract]);

  return {
    lockTokens,
    mintTokens,
    burnTokens,
    unlockTokens,
    verifyProof,
  };
} 