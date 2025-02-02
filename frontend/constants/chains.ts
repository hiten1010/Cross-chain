export const CHAIN_IDS = {
  AMOY: 80001,
  SEPOLIA: 11155111,
} as const;

export const RPC_URLS = {
  [CHAIN_IDS.AMOY]: 
    process.env.NEXT_PUBLIC_AMOY_RPC_URL || 
    'https://rpc-mumbai.maticvigil.com',
  [CHAIN_IDS.SEPOLIA]: 
    process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 
    'https://rpc.sepolia.org',
} as const;

export const FALLBACK_RPC_URLS = {
  [CHAIN_IDS.AMOY]: [
    'https://rpc-mumbai.maticvigil.com',
    'https://matic-mumbai.chainstacklabs.com',
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
  [CHAIN_IDS.AMOY]: 'ETH',
  [CHAIN_IDS.SEPOLIA]: 'ETH',
} as const; 