import React from "react";
import {
  WagmiConfig,
  configureChains,
  createConfig,
} from "wagmi";
import { publicProvider } from 'wagmi/providers/public'
import { infuraProvider } from 'wagmi/providers/infura'
import { polygonMumbai } from 'wagmi/chains'
import { connectorsForWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { 
  googleWallet,
  facebookWallet,
  githubWallet,
  discordWallet,
  twitchWallet,
  twitterWallet,
} from '@zerodevapp/wagmi/rainbowkit'

export const defaultProjectId = process.env.REACT_APP_ZERODEV_PROJECT_ID || 'b5486fa4-e3d9-450b-8428-646e757c10f6'

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  // USE YOUR OWN PROVIDER, THE PUBLIC PROVIDER IS UNRELIABLE
  // [publicProvider()],
  [infuraProvider({apiKey: 'f36f7f706a58477884ce6fe89165666c'})]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Social',
      wallets: [
        googleWallet({chains, options: { projectId: defaultProjectId}}),
        facebookWallet({chains, options: { projectId: defaultProjectId}}),
        githubWallet({chains, options: { projectId: defaultProjectId }}),
        discordWallet({chains, options: { projectId: defaultProjectId }}),
        twitchWallet({chains, options: { projectId: defaultProjectId }}),
        twitterWallet({chains, options: { projectId: defaultProjectId }}),
    ],
  },
]);

const config = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient
})

function ZeroDevWrapper({children}: {children: React.ReactNode}) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider theme={darkTheme()} chains={chains} modalSize="compact">
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default ZeroDevWrapper