import { defineChain } from 'viem';
import { CHAIN_IDS } from '@/constants/chains';

// Define Amoy testnet (previously called Amoy)
export const amoy = defineChain({
  id: CHAIN_IDS.AMOY,
  name: 'Amoy',
  network: 'amoy',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { 
      http: [
        'https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY',
        'https://rpc-mumbai.maticvigil.com',
      ],
    },
    public: { 
      http: [
        'https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY',
        'https://rpc-mumbai.maticvigil.com',
      ],
    },
  },
  blockExplorers: {
    default: { name: 'AmoyExplorer', url: 'https://mumbai.polygonscan.com' },
  },
  testnet: true,
});

// Using sepolia from wagmi/chains directly 