import { toast } from 'react-toastify';

// Use in transfer component:
const handleTransfer = () => {
  toast.promise(
    lockTokensAsync(),
    {
      pending: 'Processing transaction...',
      success: 'Transfer completed!',
      error: 'Transfer failed'
    }
  );
}; 