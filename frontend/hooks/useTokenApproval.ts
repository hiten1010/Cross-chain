'use client';

import { useCallback, useState } from 'react';
import { Address } from 'viem';
import { useContractWrite, erc20ABI } from 'wagmi';
import { toast } from 'react-hot-toast';

export function useTokenApproval() {
  const [isApproving, setIsApproving] = useState(false);

  const { writeAsync: approve } = useContractWrite({
    abi: erc20ABI,
    functionName: 'approve',
  });

  const approveToken = useCallback(async (params: {
    token: Address;
    spender: Address;
    amount: bigint;
  }) => {
    setIsApproving(true);
    try {
      const tx = await approve({
        address: params.token,
        args: [params.spender, params.amount],
      });
      await tx.wait();
      toast.success('Token approved successfully');
      return true;
    } catch (error) {
      console.error('Token approval failed:', error);
      toast.error('Token approval failed');
      return false;
    } finally {
      setIsApproving(false);
    }
  }, [approve]);

  return {
    approveToken,
    isApproving,
  };
} 