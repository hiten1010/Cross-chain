import { Address } from 'viem';
import { bridgeABI } from '../abi/bridge';

export interface BridgeContract {
  address: Address;
  abi: typeof bridgeABI;
}

export interface ChainConfig {
  chainId: number;
  bridge: BridgeContract;
  supportedTokens: {
    address: Address;
    symbol: string;
    decimals: number;
  }[];
}

export const chainConfigs: Record<number, ChainConfig> = {
  80001: {
    chainId: 80001,
    bridge: {
      address: '0x1234567890123456789012345678901234567890' as Address,
      abi: bridgeABI,
    },
    supportedTokens: [
      {
        address: '0x2345678901234567890123456789012345678901' as Address,
        symbol: 'AMOY',
        decimals: 18,
      },
    ],
  },
  11155111: {
    chainId: 11155111,
    bridge: {
      address: '0x3456789012345678901234567890123456789012' as Address,
      abi: bridgeABI,
    },
    supportedTokens: [
      {
        address: '0x4567890123456789012345678901234567890123' as Address,
        symbol: 'TEST',
        decimals: 18,
      },
    ],
  },
}; 