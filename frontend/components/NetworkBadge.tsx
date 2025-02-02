'use client';

import { CHAIN_IDS } from '@/constants/chains';

interface NetworkBadgeProps {
  chainId: number
}

export function NetworkBadge({ chainId }: NetworkBadgeProps) {
  const network = chainId === CHAIN_IDS.AMOY ? 'Amoy' : 'Sepolia'
  const color = chainId === CHAIN_IDS.AMOY ? 'purple' : 'indigo'
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
      {network}
    </span>
  )
} 