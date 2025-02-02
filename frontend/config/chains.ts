import { defineChain } from 'viem';
import { CHAIN_IDS, RPC_URLS } from '@/constants/chains';

export const amoy = defineChain({
  id: CHAIN_IDS.AMOY,
  name: 'Amoy',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: [RPC_URLS[CHAIN_IDS.AMOY]] },
    public: { http: [RPC_URLS[CHAIN_IDS.AMOY]] },
  },
  blockExplorers: {
    default: { name: 'AmoyExplorer', url: 'https://explorer.amoy.xyz' },
  },
  testnet: true,
});

// Using sepolia from wagmi/chains directly 