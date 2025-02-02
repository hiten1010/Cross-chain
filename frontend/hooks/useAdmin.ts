'use client';

import { useAccount } from 'wagmi';
import { useCallback, useEffect, useState } from 'react';
import { Address } from 'viem';
import { useBridgeContract } from './useBridgeContract';
import { toast } from 'react-hot-toast';
import type { BridgeState, AdminRole } from '@/types/admin';
import { ADMIN_ROLES, POLL_INTERVALS, CHAIN_IDS } from '@/constants/admin';

export function useAdmin() {
  const { address, isConnected } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [bridgeState, setBridgeState] = useState<BridgeState>({
    isPaused: false,
    isEmergencyStopped: false,
    lastUpdated: 0,
  });
  const bridgeContract = useBridgeContract();

  const checkAdminStatus = useCallback(async () => {
    if (!address || !isConnected) {
      setIsAdmin(false);
      setRoles([]);
      setIsLoading(false);
      return;
    }

    try {
      const [isAdminRole, isOperator, bridgeStatus] = await Promise.all([
        bridgeContract(CHAIN_IDS.AMOY).hasRole(ADMIN_ROLES.ADMIN, address as Address),
        bridgeContract(CHAIN_IDS.AMOY).hasRole(ADMIN_ROLES.OPERATOR, address as Address),
        bridgeContract(CHAIN_IDS.AMOY).getBridgeState(),
      ]);
      
      const userRoles: AdminRole[] = [];
      if (isAdminRole) {
        userRoles.push({ role: ADMIN_ROLES.ADMIN, account: address as Address, chainId: CHAIN_IDS.AMOY });
      }
      if (isOperator) {
        userRoles.push({ role: ADMIN_ROLES.OPERATOR, account: address as Address, chainId: CHAIN_IDS.AMOY });
      }

      setIsAdmin(isAdminRole);
      setRoles(userRoles);
      setBridgeState({
        isPaused: bridgeStatus.isPaused,
        isEmergencyStopped: bridgeStatus.isEmergencyStopped,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      console.error('Failed to check admin status:', error);
      setIsAdmin(false);
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected, bridgeContract]);

  useEffect(() => {
    checkAdminStatus();
    const interval = setInterval(checkAdminStatus, POLL_INTERVALS.BRIDGE_STATE);
    return () => clearInterval(interval);
  }, [checkAdminStatus]);

  const executeAdminAction = useCallback(async (
    action: keyof typeof BRIDGE_ACTIONS,
    chainId: number = CHAIN_IDS.AMOY
  ) => {
    if (!isAdmin) {
      toast.error('Admin access required');
      return false;
    }

    try {
      const contract = bridgeContract(chainId);
      let tx;

      switch (action) {
        case 'PAUSE':
          tx = await contract.pauseBridge();
          break;
        case 'RESUME':
          tx = await contract.resumeBridge();
          break;
        case 'EMERGENCY':
          tx = await contract.emergencyStop();
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      await tx.wait();
      await checkAdminStatus();
      toast.success(`Bridge ${action.toLowerCase()} successful`);
      return true;
    } catch (error) {
      console.error(`Failed to execute ${action}:`, error);
      toast.error(`Failed to execute ${action.toLowerCase()}`);
      return false;
    }
  }, [isAdmin, bridgeContract, checkAdminStatus]);

  const pauseBridge = useCallback(async (chainId?: number) => {
    return executeAdminAction('PAUSE', chainId);
  }, [executeAdminAction]);

  const resumeBridge = useCallback(async (chainId?: number) => {
    return executeAdminAction('RESUME', chainId);
  }, [executeAdminAction]);

  const emergencyStop = useCallback(async (chainId?: number) => {
    return executeAdminAction('EMERGENCY', chainId);
  }, [executeAdminAction]);

  return {
    isAdmin,
    isLoading,
    bridgeState,
    roles,
    pauseBridge,
    resumeBridge,
    emergencyStop,
    refreshState: checkAdminStatus,
  };
} 