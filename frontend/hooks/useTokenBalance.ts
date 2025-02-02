'use client';

import { useState, useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { Address } from 'viem'
import { toast } from 'react-hot-toast'

interface UseTokenBalanceOptions {
  watch?: boolean
  pollingInterval?: number
  retry?: boolean
  retryDelay?: number
  onSuccess?: (balance: bigint) => void
  onError?: (error: Error) => void
}

export function useTokenBalance(
  chainId: number,
  options: UseTokenBalanceOptions = {}
) {
  const { address } = useAccount()
  const [tokenBalance, setTokenBalance] = useState<bigint | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const {
    data: balance,
    isError,
    isLoading: balanceLoading,
    refetch
  } = useBalance({
    address: address as Address,
    chainId,
    watch: options.watch ?? true,
    pollingInterval: options.pollingInterval ?? 4000,
    enabled: !!address,
    onSuccess: (data) => {
      setTokenBalance(data.value)
      setError(null)
      setRetryCount(0)
      options.onSuccess?.(data.value)
    },
    onError: (err) => {
      console.error('Balance fetch error:', err)
      setError('Failed to fetch balance')
      
      if (options.retry && retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          refetch()
        }, options.retryDelay ?? 2000)
      } else {
        toast.error('Failed to fetch balance. Please check your network connection.')
        options.onError?.(err)
      }
    },
  })

  useEffect(() => {
    setIsLoading(balanceLoading)
  }, [balanceLoading])

  useEffect(() => {
    if (isError) {
      setError('Failed to fetch balance')
    }
  }, [isError])

  // Reset state when chain or address changes
  useEffect(() => {
    setTokenBalance(null)
    setError(null)
    setRetryCount(0)
  }, [chainId, address])

  const forceRefresh = async () => {
    setError(null)
    setRetryCount(0)
    try {
      await refetch()
      return true
    } catch (err) {
      console.error('Force refresh failed:', err)
      toast.error('Failed to refresh balance')
      return false
    }
  }

  return {
    tokenBalance,
    isLoading,
    error,
    refetch: forceRefresh,
    isError: !!error,
  }
} 