export default function GlobalFooter() {
  return (
    <footer className="bg-gray-800 text-white py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xl mb-4">Powered by DApp Bridge</p>
        <div className="flex justify-center space-x-6">
          <Link href="/documentation" className="text-gray-300 hover:text-white transition-colors">
            Documentation
          </Link>
          <Link href="/history" className="text-gray-300 hover:text-white transition-colors">
            Transaction History
          </Link>
          <Link href="/proof" className="text-gray-300 hover:text-white transition-colors">
            Proof Verification
          </Link>
          <Link href="/support" className="text-gray-300 hover:text-white transition-colors">
            Support
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-4">
          Secure cross-chain bridging powered by zero-knowledge proofs
        </p>
      </div>
    </footer>
  )
} 