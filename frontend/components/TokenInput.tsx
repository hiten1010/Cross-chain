'use client';

import { ChangeEvent } from 'react';
import { formatEther, parseEther } from 'viem';

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  balance: bigint | null;
  symbol?: string;
  onMax?: () => void;
  error?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export function TokenInput({
  value,
  onChange,
  balance,
  symbol,
  onMax,
  error,
  disabled,
  isLoading
}: TokenInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onChange(value);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Amount
        {isLoading ? (
          <span className="ml-2 text-gray-500">Loading balance...</span>
        ) : balance ? (
          <span className="ml-2 text-gray-500">
            Balance: {formatEther(balance)} {symbol}
          </span>
        ) : null}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled || isLoading}
          className={`w-full px-4 py-3 rounded-full border ${
            error ? 'border-red-300' : 'border-gray-300'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          placeholder="0.0"
        />
        {onMax && (
          <button
            onClick={onMax}
            disabled={disabled || isLoading}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            MAX
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
} 