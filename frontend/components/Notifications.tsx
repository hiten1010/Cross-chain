'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useBridge } from '@/contexts/BridgeContext';

export function Notifications() {
  const { pendingTransfers, transferHistory } = useBridge();

  useEffect(() => {
    const lastTransfer = transferHistory[0];
    if (lastTransfer) {
      toast.success(`Transfer completed: ${lastTransfer.amount} ${lastTransfer.token}`);
    }
  }, [transferHistory]);

  useEffect(() => {
    const lastPending = pendingTransfers[0];
    if (lastPending) {
      toast.loading(`Transfer pending: ${lastPending.amount} ${lastPending.token}`);
    }
  }, [pendingTransfers]);

  return null;
} 