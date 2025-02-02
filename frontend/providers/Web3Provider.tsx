'use client';

import { WagmiConfig, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'
import { http } from 'viem'
import { amoy } from '@/config/chains'
import { CHAIN_IDS, RPC_URLS } from '@/constants/chains'

// Configure chains and providers
const wagmiConfig = createConfig({
  chains: [amoy, sepolia],
  connectors: [
    metaMask({
      chains: [amoy, sepolia],
      shimDisconnect: true,
    }),
  ],
  transports: {
    [CHAIN_IDS.AMOY]: http(RPC_URLS[CHAIN_IDS.AMOY]),
    [CHAIN_IDS.SEPOLIA]: http(RPC_URLS[CHAIN_IDS.SEPOLIA]),
  },
  ssr: true,
})

interface Web3ProviderProps {
  children: React.ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      {children}
    </WagmiConfig>
  )
} 