import { createContext, useContext } from 'react';
import type { CastKitConfig } from '../types/config';

export const defaultCastKitConfig: Required<Pick<CastKitConfig, 'theme' | 'onChainMismatch' | 'storageKey'>> =
  {
    theme: 'dark',
    onChainMismatch: 'prompt-switch',
    storageKey: 'castkit.wallet.connected',
  };

export const CastKitConfigContext = createContext<CastKitConfig>(defaultCastKitConfig);

export function useCastKitConfigContext(): CastKitConfig {
  return useContext(CastKitConfigContext);
}

