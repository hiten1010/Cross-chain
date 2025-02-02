import { http } from 'viem'
import { sepolia } from 'viem/chains'
import { createConfig } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'

// Define Amoy testnet
const amoy = {
  id: 80001,
  name: 'Amoy',
  network: 'amoy',
  nativeCurrency: {
    decimals: 18,
    name: 'AMOY',
    symbol: 'AMOY',
  },
  rpcUrls: {
    default: { http: ['https://rpc.amoy.xyz'] },
    public: { http: ['https://rpc.amoy.xyz'] },
  },
} as const;

export const config = createConfig({
  chains: [amoy, sepolia],
  transports: {
    [amoy.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    }),
  ],
})

// Chain constants for the app
export const CHAIN_A = amoy;
export const CHAIN_B = sepolia; 