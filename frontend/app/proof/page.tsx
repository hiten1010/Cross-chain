"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaArrowLeft } from "react-icons/fa"
import Link from "next/link"
import { useTransferService } from '@/hooks/useTransferService'
import { useBridge } from '@/contexts/BridgeContext'
import { Address, Hash, formatEther } from 'viem'
import { amoy, sepolia } from '@/config/chains'

interface VerificationStepProps {
  title: string
  status: 'pending' | 'success' | 'error' | 'loading'
  details?: string
}

const VerificationStep = ({ title, status, details }: VerificationStepProps) => {
  const statusIcons = {
    pending: <FaSpinner className="animate-spin text-gray-400" />,
    success: <FaCheckCircle className="text-green-500" />,
    error: <FaTimesCircle className="text-red-500" />,
    loading: <FaSpinner className="animate-spin text-indigo-500" />,
  }

  return (
    <div className="flex items-start space-x-4 p-4 border-b border-gray-100 last:border-0">
      <div className="mt-1">{statusIcons[status]}</div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        {details && <p className="text-sm text-gray-500 mt-1">{details}</p>}
      </div>
    </div>
  )
}

export default function ProofVerification() {
  const searchParams = useSearchParams()
  const txHash = searchParams.get('txHash') as Hash
  const transferService = useTransferService()
  const { transferHistory } = useBridge()
  
  const [verificationStatus, setVerificationStatus] = useState<{
    proofCheck: 'pending' | 'success' | 'error' | 'loading';
    transferCheck: 'pending' | 'success' | 'error' | 'loading';
    chainCheck: 'pending' | 'success' | 'error' | 'loading';
  }>({
    proofCheck: 'pending',
    transferCheck: 'pending',
    chainCheck: 'pending',
  })

  const [transfer, setTransfer] = useState<{
    amount?: bigint;
    token?: Address;
    sourceChain?: number;
    targetChain?: number;
    proof?: Hash[];
    timestamp?: number;
  }>({})

  useEffect(() => {
    const verifyTransfer = async () => {
      if (!txHash) return

      try {
        // Find transfer details
        const transferDetails = transferHistory.find(t => t.txHash === txHash)
        if (!transferDetails) {
          setVerificationStatus(prev => ({ ...prev, transferCheck: 'error' }))
          return
        }

        setTransfer({
          amount: transferDetails.amount,
          token: transferDetails.token,
          sourceChain: transferDetails.sourceChain,
          targetChain: transferDetails.targetChain,
          proof: transferDetails.proof,
          timestamp: transferDetails.timestamp,
        })
        setVerificationStatus(prev => ({ ...prev, transferCheck: 'success' }))

        // Verify chain information
        setVerificationStatus(prev => ({ ...prev, chainCheck: 'loading' }))
        const sourceChainName = transferDetails.sourceChain === amoy.id ? 'Amoy' : 'Sepolia'
        const targetChainName = transferDetails.targetChain === amoy.id ? 'Amoy' : 'Sepolia'
        
        if (sourceChainName && targetChainName) {
          setVerificationStatus(prev => ({ ...prev, chainCheck: 'success' }))
        } else {
          setVerificationStatus(prev => ({ ...prev, chainCheck: 'error' }))
          return
        }

        // Verify proof
        setVerificationStatus(prev => ({ ...prev, proofCheck: 'loading' }))
        if (!transferDetails.proof) {
          setVerificationStatus(prev => ({ ...prev, proofCheck: 'error' }))
          return
        }

        const isValid = await transferService.verifyProof({
          transferId: txHash,
          proof: transferDetails.proof,
          chainId: transferDetails.targetChain,
        })

        setVerificationStatus(prev => ({
          ...prev,
          proofCheck: isValid ? 'success' : 'error',
        }))
      } catch (error) {
        console.error('Verification failed:', error)
        setVerificationStatus({
          proofCheck: 'error',
          transferCheck: 'error',
          chainCheck: 'error',
        })
      }
    }

    verifyTransfer()
  }, [txHash, transferHistory, transferService])

  if (!txHash) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-red-600">No transaction hash provided</p>
            <Link href="/history" className="text-indigo-600 hover:text-indigo-800 mt-4 inline-flex items-center">
              <FaArrowLeft className="mr-2" /> Back to History
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Transfer Verification</h2>
              <Link href="/history" className="text-indigo-600 hover:text-indigo-800 inline-flex items-center">
                <FaArrowLeft className="mr-2" /> Back to History
              </Link>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                Transaction Details
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Transaction Hash:</span>{' '}
                  <span className="font-mono">{txHash}</span>
                </p>
                {transfer.amount && (
                  <p className="text-sm">
                    <span className="font-medium">Amount:</span>{' '}
                    {formatEther(transfer.amount)}
                  </p>
                )}
                {transfer.timestamp && (
                  <p className="text-sm">
                    <span className="font-medium">Time:</span>{' '}
                    {new Date(transfer.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <VerificationStep
                title="Transfer Record Check"
                status={verificationStatus.transferCheck}
                details="Verifying transfer exists in history"
              />
              <VerificationStep
                title="Chain Information Check"
                status={verificationStatus.chainCheck}
                details={transfer.sourceChain && transfer.targetChain ? 
                  `From ${transfer.sourceChain === amoy.id ? 'Amoy' : 'Sepolia'} to ${transfer.targetChain === amoy.id ? 'Amoy' : 'Sepolia'}` :
                  'Verifying chain information'
                }
              />
              <VerificationStep
                title="Proof Verification"
                status={verificationStatus.proofCheck}
                details="Verifying transfer proof on-chain"
              />
            </div>

            {Object.values(verificationStatus).every(status => status === 'success') && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  Transfer has been successfully verified on-chain!
                </p>
              </div>
            )}

            {Object.values(verificationStatus).some(status => status === 'error') && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">
                  Transfer verification failed. Please check the details and try again.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

