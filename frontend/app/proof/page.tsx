"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FaUpload, FaCheck, FaTimes, FaExternalLinkAlt, FaInfoCircle } from "react-icons/fa"
import { MerkleTree } from 'merkletreejs'
import { ethers } from 'ethers'

type VerificationResult = {
  isValid: boolean
  message: string
  details?: {
    merkleRoot?: string
    leaf?: string
    path?: string[]
    signature?: string
    txHash?: string
  }
}

export default function ProofVerification() {
  const [proofData, setProofData] = useState("")
  const [verificationMode, setVerificationMode] = useState("off-chain")
  const [isVerifying, setIsVerifying] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result
        setProofData(text as string)
      }
      reader.readAsText(file)
    }
  }

  const handleVerify = async () => {
    setIsVerifying(true)
    try {
      // Mock verification - replace with actual verification logic
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const mockResult: VerificationResult = {
        isValid: true,
        message: "Proof successfully verified!",
        details: {
          merkleRoot: "0x1234...5678",
          leaf: "0xabcd...efgh",
          path: ["0x9876...5432", "0xfedc...ba98"],
          signature: "0x4321...8765",
          txHash: "0xaaaa...bbbb",
        },
      }
      setResult(mockResult)
    } catch (error) {
      setResult({
        isValid: false,
        message: "Failed to verify proof. Please check your input and try again.",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const generateMerkleProof = (txData: any) => {
    const leaves = [txData].map(x => ethers.keccak256(x));
    const tree = new MerkleTree(leaves, ethers.keccak256);
    return tree.getHexProof(leaves[0]);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Proof Verification
          </h1>
          <p className="text-xl text-gray-600">
            Verify your cross-chain transaction proofs and validate their authenticity
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Verification Section */}
          <div className="space-y-6">
            {/* Verification Mode Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Method</CardTitle>
                <CardDescription>Choose how you want to verify your proof</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  defaultValue="off-chain"
                  value={verificationMode}
                  onValueChange={setVerificationMode}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="off-chain" id="off-chain" />
                    <Label htmlFor="off-chain">Off-Chain Verification</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="on-chain" id="on-chain" />
                    <Label htmlFor="on-chain">On-Chain Verification</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Proof Input */}
            <Card>
              <CardHeader>
                <CardTitle>Proof Data</CardTitle>
                <CardDescription>Upload a file or paste your proof data</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="paste" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="paste">Paste Data</TabsTrigger>
                    <TabsTrigger value="upload">Upload File</TabsTrigger>
                  </TabsList>
                  <TabsContent value="paste">
                    <Textarea
                      placeholder="Paste your proof data here (JSON format)"
                      value={proofData}
                      onChange={(e) => setProofData(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </TabsContent>
                  <TabsContent value="upload">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                        <FaUpload className="h-12 w-12 text-gray-400 mb-4" />
                        <span className="text-sm text-gray-600">
                          {file ? file.name : "Drop your JSON file here, or click to select"}
                        </span>
                      </label>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button
                  className="w-full mt-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  onClick={handleVerify}
                  disabled={!proofData || isVerifying}
                >
                  {isVerifying ? "Verifying..." : "Verify Proof"}
                </Button>
              </CardContent>
            </Card>

            {/* Verification Result */}
            {result && (
              <Alert
                className={`${
                  result.isValid
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  {result.isValid ? (
                    <FaCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <FaTimes className="h-4 w-4 text-red-600" />
                  )}
                  <AlertTitle>{result.isValid ? "Verification Successful" : "Verification Failed"}</AlertTitle>
                </div>
                <AlertDescription>{result.message}</AlertDescription>
                {result.isValid && result.details && (
                  <div className="mt-4 space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Merkle Root:</span> {result.details.merkleRoot}
                    </div>
                    <div>
                      <span className="font-medium">Leaf:</span> {result.details.leaf}
                    </div>
                    <div>
                      <span className="font-medium">Transaction Hash:</span>{" "}
                      <a href="#" className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1">
                        {result.details.txHash} <FaExternalLinkAlt className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </Alert>
            )}
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaInfoCircle /> About Proof Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">What is a Merkle Proof?</h3>
                  <p className="text-gray-600">
                    A Merkle proof is a cryptographic verification method that proves a specific transaction or piece of
                    data is included in a larger dataset without needing to store the entire dataset.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Off-Chain vs On-Chain Verification</h3>
                  <p className="text-gray-600">
                    Off-chain verification happens in your browser and is free but less secure. On-chain verification
                    uses smart contracts and costs gas but provides stronger guarantees.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 rounded-full"
                  onClick={() => window.open("#", "_blank")}
                >
                  Read Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-4">
            All verifications are provided as-is. Always verify critical proofs on-chain.
          </p>
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

