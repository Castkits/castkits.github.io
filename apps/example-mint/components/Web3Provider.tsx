'use client';

import * as React from 'react';
import { MockAdapter } from '@castkit/adapter-mock';
import { WagmiAdapter, createCastKitWagmiConfig } from '@castkit/adapter-wagmi';
import { WalletProvider } from '@castkit/ui';

const adapter =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
    ? new WagmiAdapter({
        wagmiConfig: createCastKitWagmiConfig({
          walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        }),
      })
    : MockAdapter.presets.connected();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider
      adapter={adapter}
      allowedChains={[1, 8453, 137]}
      theme="dark"
      services={{
        resolveENS: async (address) => ({
          name: address === '0x1111111111111111111111111111111111111111' ? 'caster.eth' : null,
          avatar: null,
        }),
      }}
    >
      {children}
    </WalletProvider>
  );
}

