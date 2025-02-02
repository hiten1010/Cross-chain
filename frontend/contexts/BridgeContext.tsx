'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { Address, Hash } from 'viem';
import { toast } from 'react-hot-toast';
import { ProofService } from '../services/proofService';
import { TransferMonitor } from '../services/transferMonitor';
import { CHAIN_IDS } from '@/constants/chains'

interface BridgeContextType {
  pendingTransfers: Transfer[];
  transferHistory: Transfer[];
  balances: { [key: string]: bigint };
  updateBalances: () => Promise<void>;
  addPendingTransfer: (transfer: Transfer) => void;
  completePendingTransfer: (txHash: Hash) => void;
  verifyTransfer: (txHash: Hash) => Promise<boolean>;
}

interface Transfer {
  txHash: Hash;
  timestamp: number;
  sender: Address;
  receiver: Address;
  amount: bigint;
  token: Address;
  sourceChain: number;
  targetChain: number;
  status: 'pending' | 'completed' | 'failed';
  proof?: Hash[];
}

const BridgeContext = createContext<BridgeContextType | undefined>(undefined);

const proofService = new ProofService();
const transferMonitor = new TransferMonitor();

export function BridgeProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();
  const chainId = useChainId();
  const [pendingTransfers, setPendingTransfers] = useState<Transfer[]>([]);
  const [transferHistory, setTransferHistory] = useState<Transfer[]>([]);
  const [balances, setBalances] = useState<{ [key: string]: bigint }>({});

  const supportedChains = [CHAIN_IDS.AMOY, CHAIN_IDS.SEPOLIA]

  const updateBalances = async () => {
    if (!address) return;
    
    try {
      // Implement balance checking for both chains
      const chainABalance = await transferMonitor.getBalance(address, chainId);
      setBalances(prev => ({
        ...prev,
        [chainId]: chainABalance
      }));
    } catch (error) {
      console.error('Error updating balances:', error);
      toast.error('Failed to update balances');
    }
  };

  const addPendingTransfer = (transfer: Transfer) => {
    setPendingTransfers(prev => [...prev, transfer]);
    toast.loading(`Transfer pending: ${transfer.amount} tokens`);
  };

  const completePendingTransfer = (txHash: Hash) => {
    setPendingTransfers(prev => 
      prev.filter(transfer => transfer.txHash !== txHash)
    );
    setTransferHistory(prev => [
      ...prev,
      ...pendingTransfers
        .filter(t => t.txHash === txHash)
        .map(t => ({ ...t, status: 'completed' as const }))
    ]);
    toast.success('Transfer completed successfully');
  };

  const verifyTransfer = async (txHash: Hash): Promise<boolean> => {
    try {
      const transfer = transferHistory.find(t => t.txHash === txHash);
      if (!transfer) throw new Error('Transfer not found');

      const proof = await transferMonitor.monitorTransfer(txHash, transfer.sourceChain);
      return proofService.verifyProof(proof.proof, proof.transfer);
    } catch (error) {
      console.error('Verification failed:', error);
      toast.error('Failed to verify transfer');
      return false;
    }
  };

  useEffect(() => {
    if (address) {
      updateBalances();
    }
  }, [address, chainId]);

  const value = {
    pendingTransfers,
    transferHistory,
    balances,
    updateBalances,
    addPendingTransfer,
    completePendingTransfer,
    verifyTransfer
  };

  return (
    <BridgeContext.Provider value={value}>
      {children}
    </BridgeContext.Provider>
  );
}

export function useBridge() {
  const context = useContext(BridgeContext);
  if (context === undefined) {
    throw new Error('useBridge must be used within a BridgeProvider');
  }
  return context;
} 