import { defineChain } from 'viem';
import { CHAIN_IDS } from '@/constants/chains';

// Define Amoy testnet (Local)
export const amoy = defineChain({
  id: CHAIN_IDS.AMOY,
  name: 'Amoy',
  nativeCurrency: {
    name: 'AMOY',
    symbol: 'AMOY',
    decimals: 18,
  },
  rpcUrls: {
    default: { 
      http: [
        'http://localhost:8002', // Local development RPC
      ],
    },
    public: { 
      http: [
        'http://localhost:8002',
      ],
    },
  },
  blockExplorers: {
    default: { name: 'Local Explorer', url: 'http://localhost:8002' },
  },
  testnet: true,
});

// Using sepolia from wagmi/chains directly 