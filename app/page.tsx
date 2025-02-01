"use client";

import { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { FaLock, FaBolt, FaExchangeAlt, FaWallet, FaChevronRight } from "react-icons/fa"
import ChatbotOverlay from "../components/ChatbotOverlay"
import { usePathname } from "next/navigation"

// Mock function for wallet connection
const connectWallet = async () => {
  // Implement actual wallet connection logic here
  return "0x1234...5678"
}

const truncateAddress = (address: string) => {
  if (address.length > 10) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }
  return address
}

const features = [
  {
    icon: <FaLock className="h-12 w-12" />,
    title: "Military-Grade Security",
    desc: "Zero-knowledge proofs and MPC protocols ensure maximum security"
  },
  {
    icon: <FaBolt className="h-12 w-12" />,
    title: "Instant Settlement",
    desc: "Sub-second finality across all supported chains"
  },
  {
    icon: <FaExchangeAlt className="h-12 w-12" />,
    title: "Multi-Chain Support",
    desc: "Seamless interoperability between EVM, Cosmos, and Solana chains"
  }
];

const stats = [
  { value: "$4.8B+", label: "Total Value Secured" },
  { value: "12.9M", label: "Transactions" },
  { value: "230K+", label: "Active Users" }
];

const footerSections = [
  {
    title: "Products",
    links: [
      { label: "Bridge", href: "/transfer" },
      { label: "History", href: "/history" },
      { label: "Proof", href: "/proof" },
      { label: "API", href: "/documentation" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Security", href: "/security" },
      { label: "Status", href: "/status" },
      { label: "GitHub", href: "https://github.com" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" }
    ]
  }
];

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const pathname = usePathname()
  const isAdmin = true // Replace with actual admin check

  const handleConnectWallet = async () => {
    const address = await connectWallet()
    setWalletAddress(address)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-sans">
      <Head>
        <title>Quantum Bridge - Cross-Chain Interoperability</title>
        <meta name="description" content="Seamless cross-chain asset transfers with enterprise security" />
      </Head>

      {/* Floating Chatbot Trigger */}
      <div className="fixed bottom-8 right-8 z-50">
        <ChatbotOverlay />
      </div>

      {/* Glossy Header */}
      <header className="sticky top-0 backdrop-blur-lg bg-white/80 shadow-sm z-50">
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="group relative">
              <span className="text-2xl font-bold text-indigo-700 hover:text-indigo-800 transition-colors">
                QuantumBridge
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-700 group-hover:w-full transition-all duration-300" />
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              {['transfer', 'history', 'proof', ...(isAdmin ? ['admin'] : [])].map((path) => (
                <Link
                  key={path}
                  href={`/${path}`}
                  className={`relative text-sm font-medium hover:text-indigo-700 transition-colors ${
                    pathname === `/${path}` ? 'text-indigo-700' : 'text-gray-700'
                  }`}
                >
                  {path.charAt(0).toUpperCase() + path.slice(1)}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-700 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>
            
            <button
              onClick={handleConnectWallet}
              className="group relative flex items-center space-x-2 bg-gradient-to-r from-indigo-700 to-purple-600 hover:from-indigo-800 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-noise opacity-10" />
              <FaWallet className="h-4 w-4" />
              <span>{walletAddress ? truncateAddress(walletAddress) : 'Connect Wallet'}</span>
              <div className="absolute inset-0 border border-indigo-400/30 rounded-xl pointer-events-none" />
            </button>
          </div>
        </nav>
      </header>

      {/* Animated Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 blur-3xl -z-10" />
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-float">
            <span className="bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
              Cross-Chain
            </span>
            <br />
            <span className="text-4xl md:text-5xl font-semibold text-gray-800">
              Interoperability Redefined
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-10">
            Bridge assets across 25+ chains with military-grade security and instant settlement
          </p>

          <div className="flex justify-center space-x-5">
            <Link
              href="/transfer"
              className="group relative flex items-center space-x-2 bg-gradient-to-r from-indigo-700 to-purple-600 hover:from-indigo-800 hover:to-purple-700 text-white px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5"
            >
              <span>Start Bridging</span>
              <FaChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 border border-indigo-400/30 rounded-xl pointer-events-none" />
            </Link>
            <Link
              href="/documentation"
              className="group relative flex items-center space-x-2 border-2 border-indigo-700 text-indigo-700 hover:bg-indigo-50 px-8 py-4 rounded-xl transition-all"
            >
              <span>Developer API</span>
              <div className="absolute inset-0 border border-indigo-400/30 rounded-xl pointer-events-none" />
            </Link>
          </div>
        </div>

        {/* Elevated Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="group relative bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative">
                <div className="mb-6 text-indigo-700 text-4xl">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Glowing Stats Section */}
        <div className="mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 blur-3xl -z-10" />
          <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-200">
            <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">Network Supremacy</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, i) => (
                <div 
                  key={i} 
                  className="p-8 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 hover:border-indigo-200 transition-colors"
                >
                  <div className="text-4xl font-bold text-indigo-700 mb-3">{stat.value}</div>
                  <div className="text-lg text-gray-700 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Royal CTA Section */}
        <div className="relative bg-gradient-to-r from-indigo-700 to-purple-600 rounded-2xl p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-10" />
          <div className="relative">
            <h2 className="text-4xl font-bold text-white mb-6">Ready for Sovereign Bridging?</h2>
            <p className="text-indigo-100 mb-10 max-w-xl mx-auto text-lg">
              Join the elite network of cross-chain pioneers
            </p>
            <button
              onClick={handleConnectWallet}
              className="group relative inline-flex items-center bg-white hover:bg-gray-50 text-indigo-700 px-14 py-4 rounded-xl font-bold transition-all shadow-2xl hover:-translate-y-0.5"
            >
              {walletAddress ? 'Launch Console' : 'Connect Royal Wallet'}
              <FaChevronRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </main>

      {/* Luxurious Footer */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-lg mt-20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">QuantumBridge</h3>
              <p className="text-gray-700 text-sm leading-relaxed pr-10">
                The pinnacle of cross-chain interoperability solutions
              </p>
            </div>
            {footerSections.map((section, i) => (
              <div key={i} className="space-y-5">
                <h4 className="text-gray-900 font-semibold text-lg">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link 
                        href={link.href} 
                        className="text-gray-700 hover:text-indigo-700 transition-colors flex items-center group"
                      >
                        <span>{link.label}</span>
                        <FaChevronRight className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-12 text-center">
            <div className="text-gray-600 text-sm">
              © {new Date().getFullYear()} QuantumBridge. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

