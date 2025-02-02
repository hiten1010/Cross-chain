"use client"

import { useState,useEffect} from "react"
import Head from "next/head"
import { FaInfoCircle, FaArrowRight, FaWallet } from "react-icons/fa"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAccount, useConnect } from 'wagmi'
import { useChainId, useSwitchChain } from 'wagmi'
import { useWriteContract } from 'wagmi'
import bridgeABI from '../../abi/bridge.json'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { injected } from '@wagmi/connectors'
import {ethers} from "ethers";

// Add bridge address constant
const bridgeAddress = '0xYourContractAddressHere' // Replace with actual contract address

// Mock function for wallet connection
const connectWallet = async () => {
  // Implement actual wallet connection logic here
  return "0x1234...5678"
}

const GET_TRANSACTIONS = gql`
  query GetTransactions($address: String!) {
    locks(where: { sender: $address }) {
      id
      amount
      token
      timestamp
    }
  }
`;

export default function Transfer() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [transferDirection, setTransferDirection] = useState<"AtoB" | "BtoA">("AtoB")
  const [selectedToken, setSelectedToken] = useState("")
  const [amount, setAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [isApproved, setIsApproved] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null)
  const pathname = usePathname()
  const chainId = useChainId()
  const { chains, error, switchChain } = useSwitchChain()
  const { writeContract } = useWriteContract()


   // Automatically set walletAddress if already connected
   useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address)
    }
  }, [isConnected, address])

  const handleConnectWallet = async () => {
    try {
      connect({
        connector: injected({ target: "metaMask" }), // MetaMask connection
      })
    } catch (error) {
      console.error("Wallet connection error:", error)
      alert("Failed to connect wallet.")
    }
  }


  const handleTransfer = async () => {
    setTransactionStatus("Waiting for Wallet Confirmation...")
    try {
      writeContract({
        address: bridgeAddress,
        abi: bridgeABI,
        functionName: 'lockTokens',
        args: [amount, recipientAddress, selectedToken],
      }, {
        onSuccess: (hash: string) => {
          setTransactionStatus(`Transaction Successful! Hash: ${hash}`)
        },
        onError: (error : unknown) => {
          if (error instanceof Error) {
            setTransactionStatus(`Error: ${error.message}`)
          } else {
            setTransactionStatus("Unknown error occurred.")
          }
          
        }
      })
    } catch (error) {
      if (error instanceof Error) {
        setTransactionStatus(`Error: ${error.message}`)
      } else {
        setTransactionStatus("Unknown error occurred.")
      }
    }
  }

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 font-sans text-gray-800">
      <Head>
        <title>Cross-Chain Transfer | DApp Name</title>
        <meta name="description" content="Transfer assets across chains securely" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
          <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Cross-Chain Transfer
          </h1>
          <p className="text-xl text-gray-600 mb-8">Lock & Mint, or Burn & Unlock your assets across chains</p>
          {!walletAddress && (
            <button
              onClick={handleConnectWallet}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:from-indigo-700 hover:to-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              <FaWallet className="inline-block mr-2" /> Connect Wallet
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Transfer Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-indigo-800">Transfer Your Assets</h2>

            {/* Chain Direction Toggle */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Direction</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setTransferDirection("AtoB")}
                  className={`flex-1 px-4 py-3 rounded-full font-semibold transition-all duration-300 ${
                    transferDirection === "AtoB"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Chain A <FaArrowRight className="inline-block mx-2" /> Chain B
                </button>
                <button
                  onClick={() => setTransferDirection("BtoA")}
                  className={`flex-1 px-4 py-3 rounded-full font-semibold transition-all duration-300 ${
                    transferDirection === "BtoA"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Chain B <FaArrowRight className="inline-block mx-2" /> Chain A
                </button>
              </div>
            </div>

            {/* Select Token */}
            <div className="mb-6">
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                Select Token
              </label>
              <select
                id="token"
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-full"
              >
                <option value="">Choose an ERC-20 or ERC-721 asset</option>
                <option value="ETH">ETH</option>
                <option value="USDC">AMOY</option>
                {/* Add more token options here */}
              </select>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter the amount"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Recipient Address */}
            <div className="mb-6">
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
                Recipient (on Destination Chain)
              </label>
              <input
                type="text"
                id="recipient"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="Enter recipient address"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Approve & Transfer Buttons */}
            <div className="flex flex-col space-y-4">
              {!isApproved && (
                <button
                  onClick={() => setIsApproved(true)}
                  className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-3 px-6 rounded-full hover:from-green-500 hover:to-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Approve
                </button>
              )}
              <button
                onClick={handleTransfer}
                disabled={!isApproved}
                className={`w-full font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg ${
                  isApproved
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {transferDirection === "AtoB" ? "Lock & Mint" : "Burn & Unlock"}
              </button>
            </div>

            {/* Transaction Status */}
            {transactionStatus && (
              <div
                className={`mt-6 p-4 rounded-xl ${
                  transactionStatus.includes("Successful") ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                }`}
              >
                <p className="font-semibold">{transactionStatus}</p>
              </div>
            )}
          </div>

          {/* Transaction Summary / Side Panel */}
          <div className="bg-white p-8 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-indigo-800">Transfer Summary</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center">
                <span className="font-medium mr-2">Direction:</span>
                <span className="bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full">
                  {transferDirection === "AtoB" ? "Chain A to Chain B" : "Chain B to Chain A"}
                </span>
              </li>
              <li className="flex items-center">
                <span className="font-medium mr-2">Token:</span>
                <span className="bg-purple-100 text-purple-800 py-1 px-3 rounded-full">
                  {selectedToken || "Not selected"}
                </span>
              </li>
              <li className="flex items-center">
                <span className="font-medium mr-2">Amount:</span>
                <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full">{amount || "Not specified"}</span>
              </li>
              <li className="flex items-center">
                <span className="font-medium mr-2">Recipient:</span>
                <span className="bg-pink-100 text-pink-800 py-1 px-3 rounded-full truncate max-w-xs">
                  {recipientAddress || "Not specified"}
                </span>
              </li>
            </ul>
            <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3 text-indigo-800">How it works</h3>
              <p className="text-gray-700">
                When you lock tokens on one chain, an equivalent amount is minted on the destination chain. This process
                ensures that the total supply remains constant across both chains.
              </p>
            </div>
            <div className="mt-8">
              <button className="text-indigo-600 hover:text-indigo-800 transition duration-300 flex items-center font-medium">
                <FaInfoCircle className="mr-2" />
                Learn more about cross-chain transfers
              </button>
            </div>
          </div>
        </div>

        {/* Call-to-Action for History */}
        <div className="mt-12 text-center">
          <a
            href="/history"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:from-indigo-700 hover:to-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            View Your Transfer History
          </a>
        </div>

        {/* After transfer success message */}
        {transactionStatus === "Transaction Successful!" && (
          <div className="mt-4 text-center">
            <Link
              href="/proof"
              className="text-indigo-600 hover:text-indigo-800 flex items-center justify-center"
            >
              <FaInfoCircle className="mr-2" />
              Verify Transaction Proof
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

