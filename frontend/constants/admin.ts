export const ADMIN_ROLES = {
  ADMIN: 'ADMIN_ROLE',
  OPERATOR: 'OPERATOR_ROLE',
  VALIDATOR: 'VALIDATOR_ROLE',
} as const;

export const BRIDGE_ACTIONS = {
  PAUSE: 'pause',
  RESUME: 'resume',
  EMERGENCY: 'emergency',
} as const;

export const POLL_INTERVALS = {
  BRIDGE_STATE: 30000, // 30 seconds
  STATS: 60000, // 1 minute
} as const;

export const CHAIN_IDS = {
  AMOY: 80001,
  SEPOLIA: 11155111,
} as const; 