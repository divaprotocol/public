import '@rainbow-me/rainbowkit/styles.css'
import {
	AvatarComponent,
	connectorsForWallets,
	getDefaultWallets,
	RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import Jazzicon from 'react-jazzicon'
import { configureChains, WagmiConfig, createConfig } from 'wagmi'
import { argentWallet } from '@rainbow-me/rainbowkit/wallets';
import { mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import React from 'react'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [infuraProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const projectId = '3b71d8be5f6ba6ab0f5dcd6815d21d1c'

const { wallets } = getDefaultWallets({
	appName: 'DIVA App',
	projectId,
	chains,
})


const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({
        projectId,
        chains,
      }),
    ],
  },
]);

const wagmiClient = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
	return <Jazzicon diameter={88} seed={Number(address)} />
}

export const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
	return (
    <WagmiConfig config={wagmiClient}>
      <RainbowKitProvider avatar={CustomAvatar} chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

