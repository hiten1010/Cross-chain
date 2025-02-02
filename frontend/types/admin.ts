import { Address } from 'viem';

export interface BridgeStats {
  totalTransfers: number;
  totalVolume: bigint;
  activeValidators: number;
  averageTime: number;
}

export interface NetworkStats {
  chainId: number;
  name: string;
  stats: BridgeStats;
}

export interface AdminRole {
  role: string;
  account: Address;
  chainId: number;
}

export interface BridgeState {
  isPaused: boolean;
  isEmergencyStopped: boolean;
  lastUpdated: number;
}

export interface AdminError extends Error {
  code: string;
  action: string;
  chainId: number;
}

export type AdminActionResult = {
  success: boolean;
  error?: AdminError;
  data?: any;
};

export interface AdminActionParams {
  chainId?: number;
  action: keyof typeof BRIDGE_ACTIONS;
  params?: Record<string, unknown>;
} 