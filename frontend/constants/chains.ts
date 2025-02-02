export const CHAIN_IDS = {
  AMOY: 8002,
  SEPOLIA: 11155111,
} as const;

export const RPC_URLS = {
  [CHAIN_IDS.AMOY]: 
    process.env.NEXT_PUBLIC_AMOY_RPC_URL || 
    'http://localhost:8002',
  [CHAIN_IDS.SEPOLIA]: 
    process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 
    'https://rpc.sepolia.org',
} as const;

export const FALLBACK_RPC_URLS = {
  [CHAIN_IDS.AMOY]: [
    'http://localhost:8002',
  ],
  [CHAIN_IDS.SEPOLIA]: [
    'https://rpc.sepolia.org',
    'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  ],
} as const;

export const NETWORK_NAMES = {
  [CHAIN_IDS.AMOY]: 'Amoy',
  [CHAIN_IDS.SEPOLIA]: 'Sepolia',
} as const;

export const NETWORK_CURRENCIES = {
  [CHAIN_IDS.AMOY]: 'AMOY',
  [CHAIN_IDS.SEPOLIA]: 'ETH',
} as const;

// Contract addresses
export const CONTRACT_ADDRESSES = {
  [CHAIN_IDS.AMOY]: {
    bridge: '0x...' as `0x${string}`, // Your local bridge contract address
    token: '0x...' as `0x${string}`,  // Your local token contract address
  },
  [CHAIN_IDS.SEPOLIA]: {
    bridge: '0x...' as `0x${string}`, // Your Sepolia bridge contract address
    token: '0x...' as `0x${string}`,  // Your Sepolia token contract address
  },
} as const; 