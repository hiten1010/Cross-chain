'use client';

import { useCallback } from 'react';
import { useContractRead, useContractWrite } from 'wagmi';
import { bridgeABI } from '../abi/bridge';
import { chainConfigs } from '../types/contracts';
import { Address, Hash } from 'viem';
import { BridgeStats } from '../types/admin';

interface BridgeContractMethods {
  executeLockTokens: (params: { amount: bigint; recipient: Address; token: Address }) => Promise<{ hash: Hash }>;
  executeMintTokens: (params: { 
    transferId: Hash;
    recipient: Address;
    amount: bigint;
    token: Address;
    proof: Hash[];
  }) => Promise<{ hash: Hash }>;
  executeBurnTokens: (params: { amount: bigint; recipient: Address; token: Address }) => Promise<{ hash: Hash }>;
  executeUnlockTokens: (params: {
    transferId: Hash;
    recipient: Address;
    amount: bigint;
    token: Address;
    proof: Hash[];
  }) => Promise<{ hash: Hash }>;
  verifyProof: (transferId: Hash, proof: Hash[]) => Promise<boolean>;
  hasRole: (role: string, account: Address) => Promise<boolean>;
  pauseBridge: () => Promise<{ hash: Hash }>;
  resumeBridge: () => Promise<{ hash: Hash }>;
  emergencyStop: () => Promise<{ hash: Hash }>;
  getBridgeStats: () => Promise<BridgeStats>;
}

export function useBridgeContract() {
  const getContractConfig = useCallback((chainId: number) => {
    const config = chainConfigs[chainId];
    if (!config) throw new Error(`Chain ${chainId} not supported`);
    return {
      address: config.bridge.address,
      abi: bridgeABI,
    };
  }, []);

  return useCallback((chainId: number): BridgeContractMethods => {
    const config = getContractConfig(chainId);

    const { writeAsync: lockTokens } = useContractWrite({
      ...config,
      functionName: 'lockTokens',
    });

    const { writeAsync: mintTokens } = useContractWrite({
      ...config,
      functionName: 'mintTokens',
    });

    const { writeAsync: burnTokens } = useContractWrite({
      ...config,
      functionName: 'burnTokens',
    });

    const { writeAsync: unlockTokens } = useContractWrite({
      ...config,
      functionName: 'unlockTokens',
    });

    const { data: verifyProofResult } = useContractRead({
      ...config,
      functionName: 'verifyProof',
    });

    const { data: hasRoleResult } = useContractRead({
      ...config,
      functionName: 'hasRole',
    });

    const { writeAsync: pauseBridge } = useContractWrite({
      ...config,
      functionName: 'pause',
    });

    const { writeAsync: resumeBridge } = useContractWrite({
      ...config,
      functionName: 'unpause',
    });

    const { writeAsync: emergencyStop } = useContractWrite({
      ...config,
      functionName: 'emergencyStop',
    });

    const { data: bridgeStats } = useContractRead({
      ...config,
      functionName: 'getBridgeStats',
    });

    return {
      executeLockTokens: async (params) => {
        return lockTokens({
          args: [params.amount, params.recipient, params.token],
        });
      },
      executeMintTokens: async (params) => {
        return mintTokens({
          args: [params.transferId, params.recipient, params.amount, params.token, params.proof],
        });
      },
      executeBurnTokens: async (params) => {
        return burnTokens({
          args: [params.amount, params.recipient, params.token],
        });
      },
      executeUnlockTokens: async (params) => {
        return unlockTokens({
          args: [params.transferId, params.recipient, params.amount, params.token, params.proof],
        });
      },
      verifyProof: async (transferId, proof) => {
        const result = await verifyProofResult;
        return Boolean(result);
      },
      hasRole: async (role: string, account: Address) => {
        const result = await hasRoleResult?.({
          args: [role, account],
        });
        return Boolean(result);
      },
      pauseBridge: async () => pauseBridge(),
      resumeBridge: async () => resumeBridge(),
      emergencyStop: async () => emergencyStop(),
      getBridgeStats: async () => bridgeStats as BridgeStats,
    };
  }, [getContractConfig]);
} 