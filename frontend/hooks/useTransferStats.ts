'use client';

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { amoy } from '@/config/chains'
import { CHAIN_IDS } from '@/constants/chains'
import { useBridgeContract } from './useBridgeContract'
import { toast } from 'react-hot-toast'

interface TransferStats {
  totalTransfers: number
  totalVolume: bigint
  uniqueUsers: number
  averageAmount: bigint
}

export function useTransferStats() {
  const { address } = useAccount()
  const { bridgeContract } = useBridgeContract()
  const [stats, setStats] = useState<TransferStats>({
    totalTransfers: 0,
    totalVolume: 0n,
    uniqueUsers: 0,
    averageAmount: 0n,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      if (!bridgeContract || !address) return

      try {
        setIsLoading(true)
        setError(null)

        // Fetch stats from both chains
        const [amoyStats, sepoliaStats] = await Promise.all([
          bridgeContract.read.getStats([CHAIN_IDS.AMOY]),
          bridgeContract.read.getStats([CHAIN_IDS.SEPOLIA]),
        ])

        // Combine stats
        const totalTransfers = amoyStats.totalTransfers + sepoliaStats.totalTransfers
        const totalVolume = amoyStats.totalVolume + sepoliaStats.totalVolume
        const uniqueUsers = new Set([...amoyStats.users, ...sepoliaStats.users]).size
        const averageAmount = totalTransfers > 0 ? totalVolume / BigInt(totalTransfers) : 0n

        setStats({
          totalTransfers,
          totalVolume,
          uniqueUsers,
          averageAmount,
        })
      } catch (err) {
        console.error('Failed to fetch transfer stats:', err)
        setError('Failed to fetch transfer statistics')
        toast.error('Failed to load transfer statistics')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [bridgeContract, address])

  return {
    stats,
    isLoading,
    error,
  }
} 