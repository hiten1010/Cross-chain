'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { chainConfigs } from '../types/contracts';

export function ProofVerification({ txHash }: { txHash: string }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [proof, setProof] = useState<any>(null);

  const verifyProof = async () => {
    setIsVerifying(true);
    try {
      // Implement Merkle proof verification logic here
      const receipt = await fetch(`/api/proofs/${txHash}`);
      const proofData = await receipt.json();
      
      // Verify the proof on-chain
      // This would call the bridge contract's verify function
      
      setProof(proofData);
    } catch (error) {
      console.error('Proof verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Transfer Proof</h3>
      <button
        onClick={verifyProof}
        disabled={isVerifying}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        {isVerifying ? 'Verifying...' : 'Verify Proof'}
      </button>
      {proof && (
        <div className="mt-4">
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(proof, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 