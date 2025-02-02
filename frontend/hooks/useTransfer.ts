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
import { useBridgeContract } from './useBridgeContract';

interface TransferParams {
  sourceChainId: number;
  targetChainId: number;
  token: Address;
  amount: bigint;
  recipient: Address;
}

export function useTransfer() {
  const { address } = useAccount();
  const transferService = useTransferService();
  const { addPendingTransfer, completePendingTransfer } = useBridge();
  const { bridgeContract } = useBridgeContract();
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
  }, [address, transferService, addPendingTransfer, completePendingTransfer]);

  const executeLockTokens = async (params: TransferParams) => {
    if (!address || !bridgeContract) {
      toast.error('Wallet not connected');
      return;
    }

    // Create token approval params
    const approvalParams = {
      token: params.token,
      spender: bridgeContract.address,
      amount: params.amount,
      chainId: params.sourceChainId,
      owner: address,
    };

    // Use token approval hook at component level
    const tokenApproval = useTokenApproval(approvalParams);

    try {
      if (!tokenApproval.hasApproval) {
        const approved = await tokenApproval.checkAndApprove();
        if (!approved) return;
      }

      setIsTransferring(true);
      const tx = await bridgeContract.write.lockTokens({
        args: [params.token, params.amount, params.recipient],
      });
      await tx.wait();
      toast.success('Tokens locked successfully');
    } catch (error) {
      console.error('Lock tokens failed:', error);
      toast.error('Failed to lock tokens');
    } finally {
      setIsTransferring(false);
    }
  };

  const executeMintTokens = async (params: TransferParams) => {
    if (!bridgeContract) {
      toast.error('Bridge contract not initialized');
      return;
    }

    try {
      const tx = await bridgeContract.write.mintTokens({
        args: [params.token, params.amount, params.recipient],
      });
      await tx.wait();
      toast.success('Tokens minted successfully');
    } catch (error) {
      console.error('Mint tokens failed:', error);
      toast.error('Failed to mint tokens');
    }
  };

  return {
    handleTransfer,
    executeLockTokens,
    executeMintTokens,
    isTransferring,
  };
} 