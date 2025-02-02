'use client';

import Link from "next/link"
import { useAccount } from 'wagmi'
import { FaExchangeAlt } from "react-icons/fa"
import { WalletConnect } from './WalletConnect'
import { usePathname } from 'next/navigation'

export function Header() {
  const { isConnected } = useAccount()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path ? 'text-indigo-600' : 'text-gray-600'

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <FaExchangeAlt className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-indigo-600">DApp Bridge</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/transfer" 
              className={`${isActive('/transfer')} hover:text-indigo-600 transition-colors`}
            >
              Transfer
            </Link>
            <Link 
              href="/history" 
              className={`${isActive('/history')} hover:text-indigo-600 transition-colors`}
            >
              History
            </Link>
            {isConnected && (
              <Link 
                href="/admin" 
                className={`${isActive('/admin')} hover:text-indigo-600 transition-colors`}
              >
                Admin
              </Link>
            )}
            <WalletConnect />
          </div>
        </div>
      </nav>
    </header>
  )
} 