import { createConfig, http } from '@wagmi/core'
import { mainnet } from 'wagmi/chains'
import { injected } from '@wagmi/connectors'

export const config = createConfig({
  chains: [mainnet],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
  },
}) 