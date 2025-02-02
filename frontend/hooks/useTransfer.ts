'use client';

import { useState, useCallback } from 'react';
import { Address, Hash } from 'viem';
import { useAccount } from 'wagmi';
import { useTransferService } from './useTransferService';
import { useBridge } from '../contexts/BridgeContext';
import { useChainSwitch } from './useChainSwitch';
import { useTokenApproval } from './useTokenApproval';
import { chainConfigs } from '../types/contracts';
import { toast } from 'react-hot-toast';

export function useTransfer() {
  const { address } = useAccount();
  const transferService = useTransferService();
  const { addPendingTransfer, completePendingTransfer } = useBridge();
  const { approveToken, isApproving } = useTokenApproval();
  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = useCallback(async (params: {
    sourceChainId: number;
    targetChainId: number;
    token: Address;
    amount: bigint;
    recipient: Address;
  }) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsTransferring(true);
    try {
      // Switch to source chain if needed
      const { isCorrectChain } = useChainSwitch(params.sourceChainId);
      if (!isCorrectChain) {
        toast.error('Please switch to the correct network');
        return;
      }

      // Approve token transfer first
      const bridgeAddress = chainConfigs[params.sourceChainId].bridge.address;
      const approved = await approveToken({
        token: params.token,
        spender: bridgeAddress,
        amount: params.amount,
      });

      if (!approved) {
        throw new Error('Token approval failed');
      }

      // Lock tokens on source chain
      const { txHash, proof, transfer } = await transferService.lockTokens(params);
      
      addPendingTransfer({
        txHash: txHash as Hash,
        timestamp: Date.now(),
        sender: address as Address,
        receiver: params.recipient,
        amount: params.amount,
        token: params.token,
        sourceChain: params.sourceChainId,
        targetChain: params.targetChainId,
        status: 'pending',
        proof,
      });

      // Switch to target chain
      const { isCorrectChain: isTargetChain } = useChainSwitch(params.targetChainId);
      if (!isTargetChain) {
        toast.error('Please switch to the target network');
        return;
      }

      // Mint tokens on target chain
      await transferService.mintTokens({
        transferId: txHash as Hash,
        proof,
        targetChainId: params.targetChainId,
        recipient: params.recipient,
        amount: params.amount,
        token: params.token,
      });

      completePendingTransfer(txHash as Hash);
      toast.success('Transfer completed successfully');
    } catch (error) {
      console.error('Transfer failed:', error);
      toast.error('Transfer failed');
    } finally {
      setIsTransferring(false);
    }
  }, [address, transferService, addPendingTransfer, completePendingTransfer, approveToken]);

  return {
    handleTransfer,
    isTransferring: isTransferring || isApproving,
  };
} 