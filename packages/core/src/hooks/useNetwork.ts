import { useState } from 'react';
import { useCastKitConfigContext } from '../context/CastKitConfigContext';
import { useWalletContext } from '../context/WalletContext';
import { getChainInfo, isSupportedChain } from '../utils/chain';

/**
 * Exposes chain metadata and switching utilities.
 */
export function useNetwork() {
  const { adapter, chainId, setState } = useWalletContext();
  const { allowedChains } = useCastKitConfigContext();
  const [isSwitching, setIsSwitching] = useState(false);

  const chainInfo = getChainInfo(chainId);
  const isSupported =
    chainId !== null &&
    (allowedChains?.length ? allowedChains.includes(chainId as (typeof allowedChains)[number]) : isSupportedChain(chainId));

  const switchChain = async (nextChainId: number) => {
    setIsSwitching(true);

    try {
      await adapter.switchChain(nextChainId);
      setState((current) => ({
        ...current,
        chainId: adapter.getChainId(),
        error: null,
      }));
    } catch (error: unknown) {
      setState((current) => ({
        ...current,
        error: error instanceof Error ? error : new Error('Chain switch failed.'),
      }));
      throw error;
    } finally {
      setIsSwitching(false);
    }
  };

  return {
    chainId,
    chainName: chainInfo?.name ?? null,
    isSupported,
    switchChain,
    isSwitching,
    explorer: chainInfo?.explorer ?? null,
  };
}
