'use client';

import * as React from 'react';
import { MockAdapter } from '@castkit/adapter-mock';
import type { WalletAdapter } from '@castkit/core';
import { WalletProvider } from '../providers/WalletProvider';

export function TestWrapper({
  children,
  adapter = MockAdapter.presets.connected(),
}: {
  children: React.ReactNode;
  adapter?: WalletAdapter;
}) {
  return (
    <WalletProvider
      adapter={adapter}
      allowedChains={[1, 8453, 137]}
      theme="dark"
      services={{
        resolveENS: async () => ({
          name: 'caster.eth',
          avatar: null,
        }),
        getTokenBalance: async () => ({
          balance: 1_500_000_000_000_000_000n,
          symbol: 'CAST',
          decimals: 18,
        }),
        getNFTs: async () => [
          {
            id: '1',
            contractAddress: '0x1111111111111111111111111111111111111111',
            name: 'CastKit Genesis',
            description: 'Mock NFT for tests',
          },
        ],
        hasTokenAccess: async () => true,
      }}
    >
      {children}
    </WalletProvider>
  );
}

