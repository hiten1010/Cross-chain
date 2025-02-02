import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from './client-layout';
import { Web3Provider } from '@/providers/Web3Provider'
import { Toaster } from 'react-hot-toast'

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <Web3Provider>
          <ClientLayout>{children}</ClientLayout>
          <Toaster position="bottom-right" />
        </Web3Provider>
      </body>
    </html>
  );
}
