import * as React from 'react';
import {
  CastKitConfigContext,
  WalletContext,
  defaultWalletRuntimeState,
  type CastKitConfig,
  type WalletAdapter,
} from '../index';

export function TestProvider({
  children,
  adapter,
  config,
}: {
  children: React.ReactNode;
  adapter: WalletAdapter;
  config?: CastKitConfig;
}) {
  const [state, setState] = React.useState({
    ...defaultWalletRuntimeState,
    address: adapter.getAddress(),
    chainId: adapter.getChainId(),
    isConnected: adapter.isConnected(),
  });

  return (
    <CastKitConfigContext.Provider value={config ?? {}}>
      <WalletContext.Provider
        value={{
          ...state,
          adapter,
          modal: null,
          persistKey: 'castkit.test.wallet',
          setState,
        }}
      >
        {children}
      </WalletContext.Provider>
    </CastKitConfigContext.Provider>
  );
}

