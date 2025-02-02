'use client';

import { useEffect, useState } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { Address } from 'viem'

export function useTokenBalance(chainId: number) {
  const { address } = useAccount()
  const [tokenBalance, setTokenBalance] = useState<bigint | null>(null)

  const { data: balance } = useBalance({
    address: address as Address,
    chainId,
  })

  useEffect(() => {
    if (balance) {
      setTokenBalance(balance.value)
    }
  }, [balance])

  return { tokenBalance }
} 