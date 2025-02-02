import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from '@/providers/Web3Provider'
import { BridgeProvider } from '@/contexts/BridgeContext'
import { Toaster } from 'react-hot-toast'
import { ClientOnly } from '@/components/ClientOnly'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Cross-Chain Bridge",
  description: "Secure cross-chain asset transfer platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <Web3Provider>
          <BridgeProvider>
            <ClientOnly>
              {children}
              <Toaster position="bottom-right" />
            </ClientOnly>
          </BridgeProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
