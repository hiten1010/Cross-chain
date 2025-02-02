'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { metaMask } from 'wagmi/connectors'
import { FaWallet, FaSignOutAlt } from 'react-icons/fa'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const handleConnect = async () => {
    try {
      await connect({ connector: metaMask() })
    } catch (error) {
      console.error('Failed to connect:', error)
    }
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
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
      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
    >
      <FaWallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </button>
  )
} 