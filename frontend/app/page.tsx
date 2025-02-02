"use client";

import { useAccount } from 'wagmi'
import { FaExchangeAlt, FaHistory, FaShieldAlt, FaChartLine } from "react-icons/fa"
import { useBridge } from '@/contexts/BridgeContext'
import { formatEther } from 'viem'
import { amoy } from '@/config/chains'
import { CHAIN_IDS } from '@/constants/chains'
import { FeatureCard } from '@/components/home/FeatureCard'
import { StatsCard } from '@/components/home/StatsCard'
import { NetworkBadge } from '@/components/NetworkBadge'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function Home() {
  const { isConnected } = useAccount()
  const { transferHistory, pendingTransfers } = useBridge()

  const stats = {
    totalTransfers: transferHistory.length,
    totalVolume: transferHistory.reduce((acc, tx) => acc + tx.amount, 0n),
    pendingTransfers: pendingTransfers.length,
    uniqueUsers: new Set(transferHistory.map(tx => tx.sender)).size,
  }

  const features = [
    {
      title: "Transfer Assets",
      description: "Lock assets on one chain and mint them on another with secure proof verification.",
      icon: FaExchangeAlt,
      href: "/transfer"
    },
    {
      title: "View History",
      description: "Track all your cross-chain transfers and verify their status.",
      icon: FaHistory,
      href: "/history"
    },
    {
      title: "Verify Proofs",
      description: "Check the validity of transfer proofs and confirm transactions.",
      icon: FaShieldAlt,
      href: "/proof"
    },
    {
      title: "Monitor Stats",
      description: "View bridge statistics and monitor network activity.",
      icon: FaChartLine,
      href: "/admin"
    }
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Cross-Chain Bridge
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Securely transfer assets between {' '}
            <NetworkBadge chainId={CHAIN_IDS.AMOY} /> and {' '}
            <NetworkBadge chainId={CHAIN_IDS.SEPOLIA} />
          </p>
          {!isConnected && (
            <p className="text-gray-500">
              Connect your wallet to start transferring assets
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Total Transfers"
            value={stats.totalTransfers.toString()}
          />
          <StatsCard
            title="Total Volume"
            value={`${formatEther(stats.totalVolume)} ETH`}
          />
          <StatsCard
            title="Pending Transfers"
            value={stats.pendingTransfers.toString()}
          />
          <StatsCard
            title="Unique Users"
            value={stats.uniqueUsers.toString()}
          />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature.href}
              {...feature}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

