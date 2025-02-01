"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FaTrash, FaPlus, FaExclamationTriangle } from "react-icons/fa"
import { usePathname } from "next/navigation"
import Link from "next/link"

// Mock data and functions
const mockTokens = [
  { address: "0x1234...5678", symbol: "ETH" },
  { address: "0xabcd...efgh", symbol: "USDC" },
]

const mockRoles = [
  { address: "0x9876...5432", role: "Admin" },
  { address: "0xfedc...ba98", role: "Relayer" },
]

const isAdmin = true // Replace with actual admin check
const bridgePaused = false // Replace with actual bridge state

export default function AdminPage() {
  const pathname = usePathname()
  const [newTokenAddress, setNewTokenAddress] = useState("")
  const [newTokenSymbol, setNewTokenSymbol] = useState("")
  const [bridgeFee, setBridgeFee] = useState("0.1")
  const [minDeposit, setMinDeposit] = useState("0.01")
  const [newRoleAddress, setNewRoleAddress] = useState("")
  const [newRole, setNewRole] = useState("")

  const handleAddToken = () => {
    // Implement token addition logic
    console.log("Adding token:", newTokenAddress, newTokenSymbol)
    setNewTokenAddress("")
    setNewTokenSymbol("")
  }

  const handleRemoveToken = (address: string) => {
    // Implement token removal logic
    console.log("Removing token:", address)
  }

  const handleUpdateBridgeParams = () => {
    // Implement bridge parameter update logic
    console.log("Updating bridge params:", { bridgeFee, minDeposit })
  }

  const handleAddRole = () => {
    // Implement role addition logic
    console.log("Adding role:", newRoleAddress, newRole)
    setNewRoleAddress("")
    setNewRole("")
  }

  const handleRemoveRole = (address: string) => {
    // Implement role removal logic
    console.log("Removing role:", address)
  }

  const handleToggleBridge = () => {
    // Implement bridge pause/unpause logic
    console.log("Toggling bridge state")
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">Admin privileges required to access this page.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
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
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className={`hover:text-indigo-600 transition-colors ${pathname === '/admin' ? 'text-indigo-600' : ''}`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#222222] mb-4">Admin Panel</h1>
        <p className="text-xl text-gray-600 mb-8">Manage bridging parameters, tokens, and emergency controls</p>

        <Tabs defaultValue="tokens" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tokens">Token Management</TabsTrigger>
            <TabsTrigger value="params">Bridge Parameters</TabsTrigger>
            <TabsTrigger value="roles">Role Management</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Controls</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens">
            <Card>
              <CardHeader>
                <CardTitle>Token Management</CardTitle>
                <CardDescription>Add or remove supported tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Token Address</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTokens.map((token) => (
                      <TableRow key={token.address}>
                        <TableCell>{token.address}</TableCell>
                        <TableCell>{token.symbol}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm" onClick={() => handleRemoveToken(token.address)}>
                            <FaTrash className="mr-2" /> Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newTokenAddress">Token Address</Label>
                    <Input
                      id="newTokenAddress"
                      value={newTokenAddress}
                      onChange={(e) => setNewTokenAddress(e.target.value)}
                      placeholder="0x..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newTokenSymbol">Token Symbol</Label>
                    <Input
                      id="newTokenSymbol"
                      value={newTokenSymbol}
                      onChange={(e) => setNewTokenSymbol(e.target.value)}
                      placeholder="ETH"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddToken} className="w-full">
                      <FaPlus className="mr-2" /> Add Token
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="params">
            <Card>
              <CardHeader>
                <CardTitle>Bridge Parameters</CardTitle>
                <CardDescription>Adjust bridging fees and minimum deposit thresholds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bridgeFee">Bridge Fee (%)</Label>
                    <Input
                      id="bridgeFee"
                      type="number"
                      value={bridgeFee}
                      onChange={(e) => setBridgeFee(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minDeposit">Minimum Deposit</Label>
                    <Input
                      id="minDeposit"
                      type="number"
                      value={minDeposit}
                      onChange={(e) => setMinDeposit(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handleUpdateBridgeParams} className="mt-6">
                  Update Parameters
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <CardTitle>Role Management</CardTitle>
                <CardDescription>Assign or revoke roles</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Address</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRoles.map((role) => (
                      <TableRow key={role.address}>
                        <TableCell>{role.address}</TableCell>
                        <TableCell>{role.role}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm" onClick={() => handleRemoveRole(role.address)}>
                            <FaTrash className="mr-2" /> Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newRoleAddress">Address</Label>
                    <Input
                      id="newRoleAddress"
                      value={newRoleAddress}
                      onChange={(e) => setNewRoleAddress(e.target.value)}
                      placeholder="0x..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newRole">Role</Label>
                    <Input
                      id="newRole"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      placeholder="Admin, Relayer, etc."
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddRole} className="w-full">
                      <FaPlus className="mr-2" /> Add Role
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Controls</CardTitle>
                <CardDescription>Pause or unpause the bridge in case of emergencies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="bridgeState">Bridge State</Label>
                    <p className="text-sm text-muted-foreground">
                      {bridgePaused ? "The bridge is currently paused" : "The bridge is currently active"}
                    </p>
                  </div>
                  <Switch id="bridgeState" checked={!bridgePaused} onCheckedChange={handleToggleBridge} />
                </div>
                {bridgePaused && (
                  <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md flex items-center">
                    <FaExclamationTriangle className="mr-2" />
                    <span>Warning: The bridge is currently paused. All transfers are halted.</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-4">Admin actions are logged and may require multi-sig approval.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-indigo-600 hover:text-indigo-800 transition-colors">
              Admin Documentation
            </a>
            <a href="#" className="text-indigo-600 hover:text-indigo-800 transition-colors">
              Security Guidelines
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

