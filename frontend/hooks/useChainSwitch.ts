'use client';

import { useEffect } from 'react';
import { useChainId, useConfig } from 'wagmi';
import { toast } from 'react-hot-toast';
import { amoy, sepolia } from '../config/chains';

export function useChainSwitch(targetChainId: number) {
  const chainId = useChainId();
  const config = useConfig();

  useEffect(() => {
    if (chainId && chainId !== targetChainId) {
      toast.loading('Please switch networks in your wallet');
      
      // Request network switch
      const targetChain = targetChainId === amoy.id ? amoy : sepolia;
      window.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${targetChainId.toString(16)}`,
          chainName: targetChain.name,
          nativeCurrency: targetChain.nativeCurrency,
          rpcUrls: targetChain.rpcUrls.public.http,
          blockExplorerUrls: [targetChain.blockExplorers?.default.url],
        }],
      });
    }
  }, [chainId, targetChainId]);

  return {
    isCorrectChain: chainId === targetChainId,
    currentChainId: chainId,
  };
} 