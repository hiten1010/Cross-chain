'use client';

import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { amoy } from '@/config/chains'
import { toast } from 'react-hot-toast'

export function useChainSwitch(requiredChainId: number) {
  const chainId = useChainId()
  const { switchChainAsync, isPending } = useSwitchChain()

  const isCorrectChain = chainId === requiredChainId

  const switchToRequiredChain = async () => {
    if (!switchChainAsync) {
      toast.error('Network switching not supported')
      return false
    }

    if (!isCorrectChain) {
      try {
        await switchChainAsync({ chainId: requiredChainId })
        return true
      } catch (error) {
        console.error('Failed to switch network:', error)
        toast.error('Failed to switch network')
        return false
      }
    }

    return true
  }

  return {
    isCorrectChain,
    isLoading: isPending,
    switchToRequiredChain
  }
} 