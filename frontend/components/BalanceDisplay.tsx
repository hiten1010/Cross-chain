'use client';

import { useTokenBalance } from '@/hooks/useTokenBalance'
import { formatEther } from 'viem'
import { NETWORK_CURRENCIES } from '@/constants/chains'

interface BalanceDisplayProps {
  chainId: number
}

export function BalanceDisplay({ chainId }: BalanceDisplayProps) {
  const { tokenBalance, isLoading, error } = useTokenBalance(chainId)
  const currency = NETWORK_CURRENCIES[chainId]

  if (isLoading) return <div>Loading balance...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>
  if (!tokenBalance) return <div>No balance available</div>

  return (
    <div>
      Balance: {formatEther(tokenBalance)} {currency}
    </div>
  )
} 