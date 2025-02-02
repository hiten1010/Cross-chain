'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { metaMask } from 'wagmi/connectors'
import { FaWallet, FaSignOutAlt } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { sepolia } from 'wagmi/chains'
import { amoy } from '@/config/chains'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnect = async () => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true)
      await connect({
        connector: metaMask({
          chains: [amoy, sepolia],
          shimDisconnect: true,
        }),
      })
      toast.success('Wallet connected successfully')
    } catch (error) {
      console.error('Failed to connect:', error)
      toast.error('Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      router.push('/') // Redirect to home page after disconnect
      toast.success('Wallet disconnected')
    } catch (error) {
      console.error('Failed to disconnect:', error)
      toast.error('Failed to disconnect wallet')
    }
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          onClick={handleDisconnect}
          className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          <FaSignOutAlt className="w-4 h-4 mr-2" />
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FaWallet className="w-4 h-4 mr-2" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  )
} 