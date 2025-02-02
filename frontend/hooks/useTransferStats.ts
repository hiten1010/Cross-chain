'use client';

import { useCallback, useEffect, useState } from 'react';
import { useBridgeContract } from './useBridgeContract';
import { amoy, sepolia } from '@/config/chains';
import type { BridgeStats, NetworkStats } from '@/types/admin';

export function useTransferStats() {
  const [stats, setStats] = useState<{
    amoy: NetworkStats;
    sepolia: NetworkStats;
  }>();
  const [isLoading, setIsLoading] = useState(true);
  const bridgeContract = useBridgeContract();

  const fetchStats = useCallback(async () => {
    try {
      const [amoyStats, sepoliaStats] = await Promise.all([
        bridgeContract(amoy.id).getBridgeStats(),
        bridgeContract(sepolia.id).getBridgeStats(),
      ]);

      setStats({
        amoy: {
          chainId: amoy.id,
          name: 'Amoy',
          stats: amoyStats,
        },
        sepolia: {
          chainId: sepolia.id,
          name: 'Sepolia',
          stats: sepoliaStats,
        },
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [bridgeContract]);

  useEffect(() => {
    fetchStats();
    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    refetch: fetchStats,
  };
} 