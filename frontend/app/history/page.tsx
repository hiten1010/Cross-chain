"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FaSearch, FaExternalLinkAlt, FaChevronDown, FaChevronUp, FaInfoCircle } from "react-icons/fa"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Mock transaction data
const transactions = [
  {
    id: 1,
    hash: "0x1234...5678",
    asset: "ETH",
    amount: "1.5",
    fromChain: "Chain A",
    toChain: "Chain B",
    timestamp: "2024-01-31T12:00:00",
    status: "success",
    details: {
      gasUsed: "0.005 ETH",
      blockNumber: "12345678",
      proof: "0xabcd...efgh",
    },
  },
  // Add more mock transactions as needed
]

type Transaction = (typeof transactions)[0]

export default function History() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const pathname = usePathname()

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100"
      case "pending":
        return "text-amber-600 bg-amber-100"
      case "failed":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Transaction History
          </h1>
          <p className="text-xl text-gray-600">
            View your past cross-chain transfers, including transaction details and statuses
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by Tx Hash or Token..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-[300px] rounded-full"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex flex-wrap gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] rounded-full">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px] rounded-full">
                <SelectValue placeholder="Filter by Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Past week</SelectItem>
                <SelectItem value="30d">Past month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-2xl shadow-xl">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Tx Hash</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <>
                    <TableRow key={tx.id} className="cursor-pointer hover:bg-gray-50" onClick={() => toggleRow(tx.id)}>
                      <TableCell>
                        {expandedRows.includes(tx.id) ? (
                          <FaChevronUp className="text-gray-500" />
                        ) : (
                          <FaChevronDown className="text-gray-500" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <span>{tx.hash}</span>
                          <Link
                            href={`/transaction/${tx.id}`}
                            className="text-indigo-600 hover:text-indigo-800"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaExternalLinkAlt size={14} />
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>{tx.asset}</TableCell>
                      <TableCell>{tx.amount}</TableCell>
                      <TableCell>
                        {tx.fromChain} → {tx.toChain}
                      </TableCell>
                      <TableCell>{formatDate(tx.timestamp)}</TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            tx.status,
                          )}`}
                        >
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                    {expandedRows.includes(tx.id) && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-gray-50">
                          <div className="p-4 space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <span className="font-medium">Gas Used:</span> {tx.details.gasUsed}
                              </div>
                              <div>
                                <span className="font-medium">Block Number:</span> {tx.details.blockNumber}
                              </div>
                              <div>
                                <span className="font-medium">Proof:</span> {tx.details.proof}
                              </div>
                            </div>
                            <div className="mt-4">
                              <Link
                                href={`/proof?txHash=${tx.details.proof}`}
                                className="text-indigo-600 hover:text-indigo-800 flex items-center"
                              >
                                <FaInfoCircle className="mr-2" />
                                Verify this proof
                              </Link>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-8 flex justify-end">
          <Button variant="outline" className="rounded-full hover:bg-indigo-600 hover:text-white transition-colors">
            Export to CSV
          </Button>
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

