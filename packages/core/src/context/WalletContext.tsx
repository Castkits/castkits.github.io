import type { Dispatch, SetStateAction } from 'react';
import { createContext, useContext } from 'react';
import type { CastKitModalController } from '../types/config';
import type { WalletAdapter } from '../types/adapter';

export interface WalletRuntimeState {
  address: `0x${string}` | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
}

export interface WalletContextValue extends WalletRuntimeState {
  adapter: WalletAdapter;
  modal: CastKitModalController | null;
  persistKey: string;
  setState: Dispatch<SetStateAction<WalletRuntimeState>>;
}

export const defaultWalletRuntimeState: WalletRuntimeState = {
  address: null,
  chainId: null,
  isConnected: false,
  isConnecting: false,
  error: null,
};

export const WalletContext = createContext<WalletContextValue | null>(null);

export function useWalletContext(): WalletContextValue {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('CastKit hooks must be used inside a WalletProvider.');
  }

  return context;
}

