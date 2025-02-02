'use client';

import { WagmiConfig, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'
import { http } from 'viem'
import { amoy } from '@/config/chains'
import { CHAIN_IDS, RPC_URLS } from '@/constants/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

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
    [CHAIN_IDS.AMOY]: http(RPC_URLS[CHAIN_IDS.AMOY], {
      retryCount: 3,
      retryDelay: 1000,
      timeout: 10000,
    }),
    [CHAIN_IDS.SEPOLIA]: http(RPC_URLS[CHAIN_IDS.SEPOLIA], {
      retryCount: 3,
      retryDelay: 1000,
      timeout: 10000,
    }),
  },
  ssr: true,
})

interface Web3ProviderProps {
  children: React.ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  )
} 