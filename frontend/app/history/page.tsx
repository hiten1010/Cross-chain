"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FaSearch, FaExternalLinkAlt, FaChevronDown, FaChevronUp, FaInfoCircle, FaDownload } from "react-icons/fa"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useBridge } from "@/contexts/BridgeContext"
import { formatEther, Address, Hash } from "viem"
import { amoy, sepolia } from "@/config/chains"
import { CSVLink } from "react-csv"
import type { Transfer } from "@/types/transfer"

interface FilterProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  dateFilter: string
  onDateChange: (value: string) => void
}

interface TransactionRowProps {
  tx: Transfer
  isExpanded: boolean
  onToggle: () => void
}

const Filters = ({ searchTerm, onSearchChange, statusFilter, onStatusChange, dateFilter, onDateChange }: FilterProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div className="relative">
      <Input
        type="text"
        placeholder="Search by hash or address..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    </div>
    
    <Select value={statusFilter} onValueChange={onStatusChange}>
      <SelectTrigger>
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
        <SelectItem value="failed">Failed</SelectItem>
      </SelectContent>
    </Select>

    <Select value={dateFilter} onValueChange={onDateChange}>
      <SelectTrigger>
        <SelectValue placeholder="Filter by date" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Time</SelectItem>
        <SelectItem value="24h">Last 24 Hours</SelectItem>
        <SelectItem value="7d">Last 7 Days</SelectItem>
        <SelectItem value="30d">Last 30 Days</SelectItem>
      </SelectContent>
    </Select>
  </div>
)

const TransactionRow = ({ tx, isExpanded, onToggle }: TransactionRowProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100"
      case "pending":
        return "text-amber-600 bg-amber-100"
      case "failed":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const formatAddress = (address: Address) => `${address.slice(0, 6)}...${address.slice(-4)}`
  const getChainName = (chainId: number) => chainId === amoy.id ? 'Amoy' : 'Sepolia'
  const getExplorerUrl = (chainId: number, hash: Hash) => {
    const chain = chainId === amoy.id ? amoy : sepolia
    return `${chain.blockExplorers?.default.url}/tx/${hash}`
  }

  return (
    <>
      <TableRow className="cursor-pointer hover:bg-gray-50" onClick={onToggle}>
        <TableCell className="font-mono text-sm">
          {formatAddress(tx.txHash)}
        </TableCell>
        <TableCell>{formatEther(tx.amount)} {tx.tokenSymbol}</TableCell>
        <TableCell>
          {getChainName(tx.sourceChain)} → {getChainName(tx.targetChain)}
        </TableCell>
        <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
        <TableCell className="text-right">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tx.status)}`}>
            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
          </span>
          {isExpanded ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={5} className="bg-gray-50">
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="font-medium">From:</span>{' '}
                  {formatAddress(tx.sender)}
                </div>
                <div>
                  <span className="font-medium">To:</span>{' '}
                  {formatAddress(tx.receiver)}
                </div>
                {tx.gasUsed && (
                  <div>
                    <span className="font-medium">Gas Used:</span>{' '}
                    {formatEther(tx.gasUsed)} ETH
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <Link
                  href={`/proof?txHash=${tx.txHash}`}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <FaInfoCircle className="mr-2" />
                  View Proof Details
                </Link>
                {tx.status === 'completed' && (
                  <a
                    href={getExplorerUrl(tx.sourceChain, tx.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    View on Explorer
                  </a>
                )}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

export default function History() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [expandedRows, setExpandedRows] = useState<Hash[]>([])
  const pathname = usePathname()
  const { transferHistory } = useBridge()

  const toggleRow = (hash: Hash) => {
    setExpandedRows(prev => 
      prev.includes(hash) ? prev.filter(h => h !== hash) : [...prev, hash]
    )
  }

  const filteredTransactions = useMemo(() => {
    let filtered = [...transferHistory]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(tx => 
        tx.txHash.toLowerCase().includes(term) ||
        tx.sender.toLowerCase().includes(term) ||
        tx.receiver.toLowerCase().includes(term)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter)
    }

    // Date filter
    const now = Date.now()
    switch (dateFilter) {
      case '24h':
        filtered = filtered.filter(tx => now - tx.timestamp < 24 * 60 * 60 * 1000)
        break
      case '7d':
        filtered = filtered.filter(tx => now - tx.timestamp < 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        filtered = filtered.filter(tx => now - tx.timestamp < 30 * 24 * 60 * 60 * 1000)
        break
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp)
  }, [transferHistory, searchTerm, statusFilter, dateFilter])

  const csvData = filteredTransactions.map(tx => ({
    Hash: tx.txHash,
    Status: tx.status,
    Amount: formatEther(tx.amount),
    Token: tx.tokenSymbol,
    From: tx.sender,
    To: tx.receiver,
    SourceChain: tx.sourceChain === amoy.id ? 'Amoy' : 'Sepolia',
    TargetChain: tx.targetChain === amoy.id ? 'Amoy' : 'Sepolia',
    Timestamp: new Date(tx.timestamp).toLocaleString(),
    ...(tx.gasUsed && { GasUsed: formatEther(tx.gasUsed) }),
  }))

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Add consistent header */}
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
                href="/transfer" 
                className={`hover:text-indigo-600 transition-colors ${pathname === '/transfer' ? 'text-indigo-600' : ''}`}
              >
                Transfer
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Transfer History</h2>
            <CSVLink 
              data={csvData}
              filename="transfer-history.csv"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaDownload className="mr-2" />
              Export CSV
            </CSVLink>
          </div>

          <Filters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            dateFilter={dateFilter}
            onDateChange={setDateFilter}
          />

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction Hash</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TransactionRow
                    key={tx.txHash}
                    tx={tx}
                    isExpanded={expandedRows.includes(tx.txHash)}
                    onToggle={() => toggleRow(tx.txHash)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-4">All bridging is at your own risk.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-indigo-600 hover:text-indigo-800 transition-colors">
              GitHub
            </a>
            <a href="#" className="text-indigo-600 hover:text-indigo-800 transition-colors">
              Documentation
            </a>
            <a href="#" className="text-indigo-600 hover:text-indigo-800 transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

