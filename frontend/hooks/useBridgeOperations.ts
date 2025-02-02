'use client';

import { useState } from 'react';
import { useAccount, useContractWrite } from 'wagmi';
import { parseEther } from 'viem';
import { chainConfigs } from '../types/contracts';
import { useBridge } from '../contexts/BridgeContext';
import type { Hash } from 'viem';

export function useBridgeOperations() {
  const { address } = useAccount();
  const { addPendingTransfer, completePendingTransfer } = useBridge();
  const [isApproving, setIsApproving] = useState(false);

  const { writeContractAsync: lockTokens } = useContractWrite({
    abi: chainConfigs[80001].bridge.abi,
    functionName: 'lockTokens',
  });

  const { writeContractAsync: burnTokens } = useContractWrite({
    abi: chainConfigs[11155111].bridge.abi,
    functionName: 'burnTokens',
  });

  const handleTransfer = async (
    amount: string,
    recipient: string,
    token: string,
    sourceChain: number,
    targetChain: number
  ) => {
    try {
      const transferFunction = sourceChain === 80001 ? lockTokens : burnTokens;
      
      const result = await transferFunction({
        address: sourceChain === 80001 
          ? chainConfigs[80001].bridge.address 
          : chainConfigs[11155111].bridge.address,
        args: [parseEther(amount), recipient, token],
      });

      const transfer = {
        txHash: result as Hash,
        timestamp: Date.now(),
        sender: address!,
        receiver: recipient,
        amount,
        token,
        sourceChain: sourceChain.toString(),
        targetChain: targetChain.toString(),
        status: 'pending' as const,
      };

      addPendingTransfer(transfer);
      completePendingTransfer(result as Hash);

      return result;
    } catch (error) {
      console.error('Transfer failed:', error);
      throw error;
    }
  };

  return {
    handleTransfer,
    isApproving,
  };
} 