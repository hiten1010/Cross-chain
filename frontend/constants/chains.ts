export const CHAIN_IDS = {
  AMOY: 80001,
  SEPOLIA: 11155111,
} as const;

export const RPC_URLS = {
  [CHAIN_IDS.AMOY]: process.env.NEXT_PUBLIC_AMOY_RPC_URL || 'https://rpc.amoy.xyz',
  [CHAIN_IDS.SEPOLIA]: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://rpc.sepolia.org',
} as const; 