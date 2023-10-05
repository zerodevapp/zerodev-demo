import React from "react";
import {
  WagmiConfig,
  configureChains,
  createConfig,
} from "wagmi";
import { infuraProvider } from 'wagmi/providers/infura'
import { polygonMumbai } from 'wagmi/chains'
import { Auth0WalletConnector } from "@zerodev/wagmi";

export const projectId = 'b5486fa4-e3d9-450b-8428-646e757c10f6'

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [infuraProvider({apiKey: 'f36f7f706a58477884ce6fe89165666c'})]
)

const config = createConfig({
  autoConnect: true,
  connectors: [
    new Auth0WalletConnector({chains, options: {
      projectId,
      shimDisconnect: true
    }})
  ],
  publicClient,
  webSocketPublicClient
})

function ZeroDevWrapper({children}: {children: React.ReactNode}) {
  return (
    <WagmiConfig config={config}>
      {children}
    </WagmiConfig>
  )
}

export default ZeroDevWrapper