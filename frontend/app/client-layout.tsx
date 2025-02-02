'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '../config/wagmi';
import { BridgeProvider } from '../contexts/BridgeContext';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BridgeProvider>
          {children}
          <Toaster />
        </BridgeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 