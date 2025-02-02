'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatEther } from 'viem';
import { FaInfoCircle, FaExternalLinkAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import type { TransferStatusProps } from '@/types/transfer';
import { useBridge } from '@/contexts/BridgeContext';

export function TransferStatus({ transfer, onVerify, showDetails = false }: TransferStatusProps) {
  const { completePendingTransfer } = useBridge();
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  const bgColor = {
    pending: 'rgb(254 249 195)',
    completed: 'rgb(240 253 244)',
    failed: 'rgb(254 242 242)',
  };

  return (
    <div 
      className="p-4 rounded-lg mb-2 transition-all hover:shadow-md cursor-pointer" 
      style={{ background: bgColor[transfer.status] }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">
            {formatEther(transfer.amount)} {transfer.tokenSymbol || 'tokens'}
          </p>
          <p className="text-sm text-gray-600">
            To: {transfer.receiver.slice(0, 6)}...{transfer.receiver.slice(-4)}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(transfer.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[transfer.status]}`}>
            {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
          </span>
          {isExpanded ? <FaChevronUp className="mt-2" /> : <FaChevronDown className="mt-2" />}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">From Chain:</p>
              <p className="font-medium">{transfer.sourceChain}</p>
            </div>
            <div>
              <p className="text-gray-600">To Chain:</p>
              <p className="font-medium">{transfer.targetChain}</p>
            </div>
            {transfer.blockNumber && (
              <div>
                <p className="text-gray-600">Block Number:</p>
                <p className="font-medium">{transfer.blockNumber}</p>
              </div>
            )}
            {transfer.gasUsed && (
              <div>
                <p className="text-gray-600">Gas Used:</p>
                <p className="font-medium">{formatEther(transfer.gasUsed)} ETH</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center space-x-4">
            {transfer.status === 'completed' && (
              <>
                <Link
                  href={`/proof?txHash=${transfer.txHash}`}
                  className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaInfoCircle className="mr-1" /> View Proof
                </Link>
                {onVerify && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onVerify(transfer.txHash);
                    }}
                    className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                  >
                    <FaExternalLinkAlt className="mr-1" /> Verify On-Chain
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 