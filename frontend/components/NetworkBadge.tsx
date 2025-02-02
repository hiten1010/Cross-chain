'use client';

import { CHAIN_IDS, NETWORK_NAMES } from '@/constants/chains'

interface NetworkBadgeProps {
  chainId: number
  className?: string
}

export function NetworkBadge({ chainId, className = '' }: NetworkBadgeProps) {
  const getNetworkColor = (chainId: number) => {
    switch (chainId) {
      case CHAIN_IDS.AMOY:
        return 'bg-purple-100 text-purple-800'
      case CHAIN_IDS.SEPOLIA:
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const networkName = NETWORK_NAMES[chainId as keyof typeof NETWORK_NAMES] || 'Unknown'

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNetworkColor(
        chainId
      )} ${className}`}
    >
      {networkName}
    </span>
  )
} 