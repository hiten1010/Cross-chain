import { createConfig, http } from '@wagmi/core'
import { mainnet, sepolia } from 'viem/chains'
import { injected } from '@wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http()
  },
}) 