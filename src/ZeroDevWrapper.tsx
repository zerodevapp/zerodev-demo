import React from "react";
import {
  WagmiConfig,
  configureChains,
  createClient,
} from "wagmi";
import { publicProvider } from 'wagmi/providers/public'
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

const defaultProjectId = process.env.REACT_APP_ZERODEV_PROJECT_ID || 'b5486fa4-e3d9-450b-8428-646e757c10f6'

const { chains, provider, webSocketProvider } = configureChains(
  [polygonMumbai],
  [publicProvider()],
)

const connectors = connectorsForWallets([
  {
    groupName: 'Social',
      wallets: [
        googleWallet({chains, options: { projectId: defaultProjectId }}),
        facebookWallet({options: { projectId: defaultProjectId}}),
        githubWallet({options: { projectId: defaultProjectId }}),
        discordWallet({options: { projectId: defaultProjectId }}),
        twitchWallet({options: { projectId: defaultProjectId }}),
        twitterWallet({options: { projectId: defaultProjectId }}),
    ],
  },
]);

const client = createClient({
  autoConnect: false,
  connectors,
  provider,
  webSocketProvider,
})

function ZeroDevWrapper({children}: {children: React.ReactNode}) {
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider theme={darkTheme()} chains={chains} modalSize="compact">
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default ZeroDevWrapper