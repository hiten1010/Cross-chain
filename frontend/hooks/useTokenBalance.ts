'use client';

import { useEffect, useState } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { Address } from 'viem'
import { toast } from 'react-hot-toast'

export function useTokenBalance(chainId: number) {
  const { address } = useAccount()
  const [tokenBalance, setTokenBalance] = useState<bigint | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: balance, isError, isLoading: balanceLoading } = useBalance({
    address: address as Address,
    chainId,
    watch: true,
    onError: (err) => {
      console.error('Balance fetch error:', err)
      setError('Failed to fetch balance')
      toast.error('Failed to fetch balance. Please check your network connection.')
    },
  })

  useEffect(() => {
    setIsLoading(balanceLoading)
    if (balance && !isError) {
      setTokenBalance(balance.value)
      setError(null)
    }
  }, [balance, isError, balanceLoading])

  return { 
    tokenBalance, 
    isLoading, 
    error,
    refetch: () => {
      setError(null)
      return balance
    }
  }
} 