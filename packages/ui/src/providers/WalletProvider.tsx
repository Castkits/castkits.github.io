'use client';

import * as React from 'react';
import {
  CastKitConfigContext,
  WalletContext,
  defaultCastKitConfig,
  defaultWalletRuntimeState,
  type CastKitConfig,
  type CastKitServices,
  type ChainMismatchStrategy,
  type SupportedChainId,
  type WalletAdapter,
} from '@castkit/core';
import { DefaultWalletModal } from '../modals/DefaultWalletModal/DefaultWalletModal';
import { RainbowKitModalBridge } from '../modals/RainbowKitModalBridge/RainbowKitModalBridge';

export interface WalletProviderProps {
  adapter: WalletAdapter;
  allowedChains?: SupportedChainId[];
  onChainMismatch?: ChainMismatchStrategy;
  modalType?: 'default' | 'rainbowkit';
  theme?: 'dark' | 'light' | 'system';
  storageKey?: string;
  services?: CastKitServices;
  walletConnectProjectId?: string;
  children: React.ReactNode;
}

/**
 * Top-level provider that wires adapter state into CastKit hooks and UI.
 */
export function WalletProvider({
  adapter,
  allowedChains,
  onChainMismatch = defaultCastKitConfig.onChainMismatch,
  modalType = 'default',
  theme = defaultCastKitConfig.theme,
  storageKey = defaultCastKitConfig.storageKey,
  services,
  walletConnectProjectId,
  children,
}: WalletProviderProps) {
  const [walletState, setWalletState] = React.useState({
    ...defaultWalletRuntimeState,
    address: adapter.getAddress(),
    chainId: adapter.getChainId(),
    isConnected: adapter.isConnected(),
  });
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    const sync = () => {
      setWalletState((current) => ({
        ...current,
        address: adapter.getAddress(),
        chainId: adapter.getChainId(),
        isConnected: adapter.isConnected(),
        isConnecting: false,
      }));
    };

    const reset = () => {
      setWalletState((current) => ({
        ...current,
        address: null,
        chainId: null,
        isConnected: false,
        isConnecting: false,
      }));
    };

    adapter.on('accountsChanged', sync);
    adapter.on('chainChanged', sync);
    adapter.on('disconnect', reset);

    sync();

    return () => {
      adapter.off('accountsChanged', sync);
      adapter.off('chainChanged', sync);
      adapter.off('disconnect', reset);
    };
  }, [adapter]);

  React.useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.dataset.castkitTheme = theme;
  }, [theme]);

  const configValue: CastKitConfig = {
    allowedChains,
    onChainMismatch,
    theme,
    storageKey,
    services,
    walletConnectProjectId,
  };

  return (
    <CastKitConfigContext.Provider value={configValue}>
      <WalletContext.Provider
        value={{
          ...walletState,
          adapter,
          persistKey: storageKey,
          modal: {
            open: () => setIsModalOpen(true),
            close: () => setIsModalOpen(false),
            isOpen: isModalOpen,
          },
          setState: setWalletState,
        }}
      >
        {children}
        {modalType === 'default' ? <DefaultWalletModal /> : null}
        {modalType === 'rainbowkit' ? <RainbowKitModalBridge /> : null}
      </WalletContext.Provider>
    </CastKitConfigContext.Provider>
  );
}

