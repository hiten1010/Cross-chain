"use client"

import { useState, useCallback, useMemo } from "react"
import { useAccount } from 'wagmi'
import { Address, Hash, formatEther } from 'viem'
import { FaUserShield, FaExclamationTriangle, FaPause, FaPlay, FaCog, FaChartLine } from "react-icons/fa"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useBridgeContract } from '@/hooks/useBridgeContract'
import { useTransferService } from '@/hooks/useTransferService'
import { amoy, sepolia } from '@/config/chains'
import { toast } from 'react-hot-toast'
import { useAdmin } from '@/hooks/useAdmin'
import { useTransferStats } from '@/hooks/useTransferStats'

interface BridgeStats {
  totalTransfers: number
  totalVolume: bigint
  activeValidators: number
  averageTime: number
}

interface NetworkStats {
  chainId: number
  name: string
  stats: BridgeStats
}

const StatCard = ({ title, value, icon: Icon, change }: { 
  title: string
  value: string
  icon: React.ComponentType
  change?: { value: number; isPositive: boolean }
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        {change && (
          <p className={`mt-2 text-sm ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change.isPositive ? '↑' : '↓'} {change.value}% from last period
          </p>
        )}
      </div>
      <div className="p-3 bg-indigo-50 rounded-lg">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
    </div>
  </div>
)

const AdminActions = ({ 
  isPaused,
  onTogglePause,
  isLoading 
}: { 
  isPaused: boolean
  onTogglePause: () => Promise<void>
  isLoading: boolean
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Actions</h3>
    <div className="space-y-4">
      <button
        onClick={onTogglePause}
        disabled={isLoading}
        className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isPaused
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-red-600 hover:bg-red-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <FaCog className="animate-spin mr-2" />
        ) : isPaused ? (
          <FaPlay className="mr-2" />
        ) : (
          <FaPause className="mr-2" />
        )}
        {isPaused ? 'Resume Bridge' : 'Pause Bridge'}
      </button>

      <button
        onClick={() => toast.error('Not implemented yet')}
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <FaExclamationTriangle className="mr-2" />
        Emergency Stop
      </button>
    </div>
  </div>
)

const NetworkStatsCard = ({ stats }: { stats: NetworkStats }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900">{stats.name} Network</h3>
      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
        Chain ID: {stats.chainId}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium text-gray-600">Total Transfers</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">
          {stats.stats.totalTransfers}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">Total Volume</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">
          {formatEther(stats.stats.totalVolume)} ETH
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">Active Validators</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">
          {stats.stats.activeValidators}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">Avg. Transfer Time</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">
          {stats.stats.averageTime}s
        </p>
      </div>
    </div>
  </div>
)

export default function AdminPage() {
  const { isConnected } = useAccount()
  const { isAdmin, isLoading: isAdminLoading, pauseBridge, resumeBridge, emergencyStop } = useAdmin()
  const [isPaused, setIsPaused] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const pathname = usePathname()
  const { stats, isLoading: isStatsLoading } = useTransferStats()

  const handleTogglePause = useCallback(async () => {
    if (!isAdmin) {
      toast.error('Admin access required')
      return
    }

    setIsActionLoading(true)
    try {
      const success = isPaused ? await resumeBridge() : await pauseBridge()
      if (success) {
        setIsPaused(!isPaused)
      }
    } finally {
      setIsActionLoading(false)
    }
  }, [isAdmin, isPaused, pauseBridge, resumeBridge])

  const handleEmergencyStop = useCallback(async () => {
    if (!isAdmin) {
      toast.error('Admin access required')
      return
    }

    setIsActionLoading(true)
    try {
      await emergencyStop()
    } finally {
      setIsActionLoading(false)
    }
  }, [isAdmin, emergencyStop])

  if (isAdminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaCog className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    )
  }

  if (!isConnected || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaUserShield className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">Admin Access Required</h2>
          <p className="mt-1 text-sm text-gray-500">
            {!isConnected 
              ? "Please connect your wallet to access admin features."
              : "Your wallet does not have admin privileges."
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              DApp Bridge
            </Link>
            <div className="space-x-6">
              <Link 
                href="/transfer" 
                className={`hover:text-indigo-600 transition-colors ${pathname === '/transfer' ? 'text-indigo-600' : ''}`}
              >
                Transfer
              </Link>
              <Link 
                href="/history" 
                className={`hover:text-indigo-600 transition-colors ${pathname === '/history' ? 'text-indigo-600' : ''}`}
              >
                History
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Monitor and manage bridge operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Volume (24h)"
            value={`${formatEther(stats.amoy.stats.totalVolume + stats.sepolia.stats.totalVolume)} ETH`}
            icon={FaChartLine}
            change={{ value: 12.5, isPositive: true }}
          />
          <StatCard
            title="Total Transfers"
            value={(stats.amoy.stats.totalTransfers + stats.sepolia.stats.totalTransfers).toString()}
            icon={FaChartLine}
            change={{ value: 8.2, isPositive: true }}
          />
          <StatCard
            title="Average Time"
            value={`${Math.round((stats.amoy.stats.averageTime + stats.sepolia.stats.averageTime) / 2)}s`}
            icon={FaChartLine}
            change={{ value: 5.1, isPositive: false }}
          />
          <StatCard
            title="Active Validators"
            value={(stats.amoy.stats.activeValidators + stats.sepolia.stats.activeValidators).toString()}
            icon={FaUserShield}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NetworkStatsCard stats={stats.amoy} />
          <NetworkStatsCard stats={stats.sepolia} />
          <AdminActions
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            isLoading={isActionLoading}
          />
        </div>
      </main>
    </div>
  )
}

