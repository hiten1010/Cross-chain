'use client';

import { useContractWrite, useContractRead } from 'wagmi'
import { Address } from 'viem'
import { toast } from 'react-hot-toast'
import { ERC20_ABI } from '@/types/contracts'

interface TokenApprovalParams {
  token: Address
  spender: Address
  amount: bigint
  chainId: number
  owner: Address
}

export function useTokenApproval(params?: TokenApprovalParams) {
  const { data: allowance } = useContractRead(
    params ? {
      address: params.token,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [params.owner, params.spender],
      chainId: params.chainId,
      watch: true,
    } : undefined
  )

  const { writeAsync: approve } = useContractWrite(
    params ? {
      address: params.token,
      abi: ERC20_ABI,
      functionName: 'approve',
      chainId: params.chainId,
    } : undefined
  )

  const checkAndApprove = async () => {
    if (!params || !approve) return false

    try {
      if (!allowance || allowance < params.amount) {
        const tx = await approve({
          args: [params.spender, params.amount],
        })
        await tx.wait()
        toast.success('Token approval successful')
        return true
      }
      return true
    } catch (error) {
      console.error('Token approval failed:', error)
      toast.error('Token approval failed')
      return false
    }
  }

  return {
    checkAndApprove,
    hasApproval: allowance ? allowance >= (params?.amount || 0n) : false,
    allowance,
  }
} 