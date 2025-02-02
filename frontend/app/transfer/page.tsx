"use client"

import { useState, useCallback } from "react"
import { FaArrowRight, FaExchangeAlt, FaInfoCircle } from "react-icons/fa"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAccount } from 'wagmi'
import { parseEther, Address, formatEther } from 'viem'
import { useTransfer } from '@/hooks/useTransfer'
import { useBridge } from '@/contexts/BridgeContext'
import { chainConfigs } from '@/types/contracts'
import { amoy } from '@/config/chains'
import { CHAIN_IDS } from '@/constants/chains'
import { toast } from 'react-hot-toast'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useChainSwitch } from '@/hooks/useChainSwitch'
import { TokenInput } from '@/components/TokenInput'
import { TransferStatus } from '@/components/TransferStatus'
import { useTransferService } from '@/hooks/useTransferService'
import type { Transfer } from '@/types/transfer'
import { NetworkBadge } from '@/components/NetworkBadge'

// Components
const InfoBanner = () => (
  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
    <div className="flex items-start">
      <FaInfoCircle className="text-indigo-500 mt-1 mr-3" />
      <div>
        <h4 className="font-medium text-indigo-800">Important Information</h4>
        <p className="text-sm text-indigo-600 mt-1">
          Transfers typically take 2-5 minutes to complete. Make sure you have enough funds to cover gas fees on both chains.
        </p>
      </div>
    </div>
  </div>
)

interface ChainSelectorProps {
  direction: "AtoB" | "BtoA"
  onChange: (dir: "AtoB" | "BtoA") => void
  disabled?: boolean
}

const ChainSelector = ({ direction, onChange, disabled }: ChainSelectorProps) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Direction</label>
    <div className="flex space-x-4">
      <button
        onClick={() => !disabled && onChange("AtoB")}
        disabled={disabled}
        className={`flex-1 px-4 py-3 rounded-full font-semibold transition-all ${
          direction === "AtoB"
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <NetworkBadge chainId={CHAIN_IDS.AMOY} />
        <FaArrowRight className="inline-block mx-2" />
        <NetworkBadge chainId={CHAIN_IDS.SEPOLIA} />
      </button>
      <button
        onClick={() => !disabled && onChange("BtoA")}
        disabled={disabled}
        className={`flex-1 px-4 py-3 rounded-full font-semibold transition-all ${
          direction === "BtoA"
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <NetworkBadge chainId={CHAIN_IDS.SEPOLIA} />
        <FaArrowRight className="inline-block mx-2" />
        <NetworkBadge chainId={CHAIN_IDS.AMOY} />
      </button>
    </div>
  </div>
)

interface TokenSelectProps {
  value: string
  onChange: (value: string) => void
  tokens: Array<{ address: string; symbol: string }>
  chainId: number
  disabled?: boolean
  error?: string
}

const TokenSelect = ({ value, onChange, tokens, chainId, disabled, error }: TokenSelectProps) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Select Token
      <NetworkBadge chainId={chainId} />
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-full border ${
          error ? 'border-red-300' : 'border-gray-300'
        } appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <option value="">Select a token</option>
        {tokens.map((token) => (
          <option key={token.address} value={token.address}>
            {token.symbol}
          </option>
        ))}
      </select>
      <FaExchangeAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
)

interface AddressInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
}

const AddressInput = ({ value, onChange, error, disabled }: AddressInputProps) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Recipient Address
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-4 py-3 rounded-full border ${
        error ? 'border-red-300' : 'border-gray-300'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      placeholder="0x..."
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
)

type TransferDirection = "AtoB" | "BtoA"

export default function TransferPage() {
  const [amount, setAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [transferDirection, setTransferDirection] = useState<TransferDirection>("AtoB")
  const [selectedToken, setSelectedToken] = useState("")
  const [inputError, setInputError] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)

  const { address, isConnected } = useAccount()
  const { pendingTransfers, transferHistory } = useBridge()
  const pathname = usePathname()

  const sourceChainId = transferDirection === "AtoB" ? CHAIN_IDS.AMOY : CHAIN_IDS.SEPOLIA
  const targetChainId = transferDirection === "AtoB" ? CHAIN_IDS.SEPOLIA : CHAIN_IDS.AMOY

  const { isCorrectChain } = useChainSwitch(sourceChainId)
  const { tokenBalance } = useTokenBalance(sourceChainId)
  const { executeLockTokens, executeMintTokens } = useTransfer()
  const transferService = useTransferService()

  const sourceTokens = chainConfigs[sourceChainId]?.supportedTokens || []
  const selectedTokenInfo = sourceTokens.find(t => t.address === selectedToken)

  const validateInput = useCallback(() => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return false
    }

    if (!isCorrectChain) {
      toast.error('Please switch to the correct network')
      return false
    }

    if (!selectedToken) {
      setInputError('Please select a token')
      return false
    }

    if (!amount || parseFloat(amount) <= 0) {
      setInputError('Please enter a valid amount')
      return false
    }

    try {
      const transferAmount = parseEther(amount)
      if (tokenBalance && transferAmount > tokenBalance) {
        setInputError('Insufficient balance')
        return false
      }
    } catch (error) {
      setInputError('Invalid amount format')
      return false
    }

    if (!recipientAddress || !/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
      setInputError('Invalid recipient address')
      return false
    }

    setInputError('')
    return true
  }, [isConnected, isCorrectChain, selectedToken, amount, recipientAddress, tokenBalance])

  const handleSubmit = useCallback(async () => {
    if (!validateInput()) return

    try {
      const transferAmount = parseEther(amount)
      await executeLockTokens({
        sourceChainId,
        targetChainId,
        token: selectedToken as Address,
        amount: transferAmount,
        recipient: recipientAddress as Address,
      })
      
      setAmount('')
      setRecipientAddress('')
    } catch (error) {
      console.error('Transfer failed:', error)
      toast.error('Transfer failed. Please try again.')
    }
  }, [validateInput, amount, executeLockTokens, sourceChainId, targetChainId, selectedToken, recipientAddress])

  const handleVerifyTransfer = useCallback(async (txHash: string) => {
    try {
      const transfer = transferHistory.find(t => t.txHash === txHash as Address)
      if (!transfer?.proof) {
        toast.error('No proof found for this transfer')
        return
      }

      const isValid = await transferService.verifyProof({
        transferId: txHash as `0x${string}`,
        proof: transfer.proof,
        chainId: sourceChainId,
      })
      toast.success(isValid ? 'Transfer verified!' : 'Transfer verification failed')
    } catch (error) {
      console.error('Verification failed:', error)
      toast.error('Verification failed')
    }
  }, [transferService, sourceChainId, transferHistory])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              DApp Bridge
            </Link>
            <div className="space-x-6">
              <Link 
                href="/" 
                className={`hover:text-indigo-600 transition-colors ${pathname === '/' ? 'text-indigo-600' : ''}`}
              >
                Home
              </Link>
              <Link 
                href="/history" 
                className={`hover:text-indigo-600 transition-colors ${pathname === '/history' ? 'text-indigo-600' : ''}`}
              >
                History
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Cross-Chain Transfer
          </h1>
          <p className="text-xl text-gray-600">
            Lock & Mint, or Burn & Unlock your assets across chains
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <InfoBanner />
            
            <ChainSelector 
              direction={transferDirection} 
              onChange={setTransferDirection}
              disabled={isTransferring} 
            />

            <TokenSelect
              value={selectedToken}
              onChange={setSelectedToken}
              tokens={sourceTokens}
              chainId={sourceChainId}
              disabled={isTransferring}
              error={inputError && !selectedToken ? 'Please select a token' : undefined}
            />

            <TokenInput
              value={amount}
              onChange={setAmount}
              balance={tokenBalance}
              symbol={selectedTokenInfo?.symbol}
              onMax={() => tokenBalance && setAmount(formatEther(tokenBalance))}
              error={inputError}
              disabled={isTransferring}
            />

            <AddressInput
              value={recipientAddress}
              onChange={setRecipientAddress}
              error={inputError && !recipientAddress ? 'Please enter a valid address' : undefined}
              disabled={isTransferring}
            />

            <button
              onClick={handleSubmit}
              disabled={!isConnected || isTransferring || !!inputError}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!isConnected 
                ? "Connect Wallet" 
                : isTransferring 
                  ? "Processing..." 
                  : "Transfer"
              }
            </button>
          </div>

          <div className="space-y-6">
            {pendingTransfers.length > 0 && (
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <h3 className="text-xl font-bold mb-4">Pending Transfers</h3>
                {pendingTransfers.map((transfer) => (
                  <TransferStatus 
                    key={transfer.txHash} 
                    transfer={transfer}
                  />
                ))}
              </div>
            )}

            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold mb-4">Recent Transfers</h3>
              {transferHistory.length > 0 ? (
                transferHistory.slice(0, 5).map((transfer) => (
                  <TransferStatus 
                    key={transfer.txHash} 
                    transfer={transfer}
                    onVerify={handleVerifyTransfer}
                    showDetails
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No transfer history yet
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

