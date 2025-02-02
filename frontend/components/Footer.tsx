'use client';

import Link from "next/link"
import { FaGithub, FaBook, FaQuestionCircle } from "react-icons/fa"

interface FooterLink {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  external?: boolean
}

const footerLinks: FooterLink[] = [
  {
    href: "https://github.com/yourusername/bridge",
    label: "GitHub",
    icon: FaGithub,
    external: true
  },
  {
    href: "/docs",
    label: "Documentation",
    icon: FaBook
  },
  {
    href: "/support",
    label: "Support",
    icon: FaQuestionCircle
  }
]

export function Footer() {
  return (
    <footer className="bg-white mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-600 mb-4">
          All bridging is at your own risk. Please verify all transactions.
        </p>
        <div className="flex justify-center space-x-6">
          {footerLinks.map(({ href, label, icon: Icon, external }) => (
            external ? (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Link>
            )
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} DApp Bridge. All rights reserved.
        </p>
      </div>
    </footer>
  )
} 