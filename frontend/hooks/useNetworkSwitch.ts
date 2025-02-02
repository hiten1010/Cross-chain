'use client';

import { useChainId, useSwitchChain } from 'wagmi'
import { toast } from 'react-hot-toast'

const CHAIN_IDS = {
  AMOY: 80001,
  SEPOLIA: 11155111,
} as const

export function useNetworkSwitch() {
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  const switchToNetwork = async (targetChainId: number) => {
    try {
      await switchChain({ chainId: targetChainId })
      return true
    } catch (error) {
      console.error('Failed to switch network:', error)
      toast.error('Failed to switch network')
      return false
    }
  }

  const ensureNetwork = async (requiredChainId: number) => {
    if (chainId !== requiredChainId) {
      return switchToNetwork(requiredChainId)
    }
    return true
  }

  return {
    currentChainId: chainId,
    isLoading: isPending,
    switchToNetwork,
    ensureNetwork,
    switchToAmoy: () => switchToNetwork(CHAIN_IDS.AMOY),
    switchToSepolia: () => switchToNetwork(CHAIN_IDS.SEPOLIA),
  }
} 