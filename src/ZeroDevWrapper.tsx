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
} from '@zerodevapp/wagmi/rainbowkit'
import { KernelAccountAPI } from "@zerodevapp/sdk/dist/src/KernelAccountAPI";
import { ZeroDevWeb3AuthOptions } from "@zerodevapp/web3auth";

const defaultProjectId = process.env.REACT_APP_ZERODEV_PROJECT_ID || 'b5486fa4-e3d9-450b-8428-646e757c10f6'

const { chains, provider, webSocketProvider } = configureChains(
  [polygonMumbai],
  [publicProvider()],
)

const ZERO_DEV_PROJECT_ID = defaultProjectId
const WEB3AUTH_CLIENT_ID = process.env.REACT_APP_ZEROKIT_WEB3AUTH_CLIENT_ID ?? 'BEjNZMt6TPboj3TfHM06MP8Yxz7cKQX6eK3KZzVhrIMi7jALcZHxJv5o3fDLM7EL4QfPlf2AV_qe155vyR3QxiU'
const FACTORY_ADDRESS = '0x4E4946298614FC299B50c947289F4aD0572CB9ce'


const zeroDevWeb3AuthOptions: ZeroDevWeb3AuthOptions = {
  adapterSettings: {
    network: 'mainnet',
  },
  web3authOptions: {
    clientId: WEB3AUTH_CLIENT_ID,
  },
};

let zeroDevSocialOptions = {
  projectId: ZERO_DEV_PROJECT_ID,
  ...zeroDevWeb3AuthOptions,
  implementation: {
    factoryAddress: FACTORY_ADDRESS,
    accountAPIClass: KernelAccountAPI,
  },
};

const connectors = connectorsForWallets([
  {
    groupName: 'Social',
      wallets: [
        googleWallet({options: zeroDevSocialOptions}),
        facebookWallet({options: zeroDevSocialOptions}),
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