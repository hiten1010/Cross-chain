'use client';

import { ChangeEvent } from 'react';
import { formatEther, parseEther } from 'viem';

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  balance?: bigint;
  symbol?: string;
  onMax?: () => void;
  error?: string;
}

export function TokenInput({ value, onChange, balance, symbol, onMax, error }: TokenInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onChange(value);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-full border ${
            error ? 'border-red-300' : 'border-gray-300'
          } pr-20`}
          placeholder="0.0"
        />
        {balance && symbol && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <button
              onClick={onMax}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              MAX
            </button>
            <span className="text-gray-500">{symbol}</span>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {balance && (
        <p className="mt-1 text-sm text-gray-500">
          Available: {formatEther(balance)} {symbol}
        </p>
      )}
    </div>
  );
} 