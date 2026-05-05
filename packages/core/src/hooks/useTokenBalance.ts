import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { useCastKitConfigContext } from '../context/CastKitConfigContext';
import { useWalletContext } from '../context/WalletContext';
import { useWallet } from './useWallet';

export interface UseTokenBalanceConfig {
  tokenAddress: `0x${string}`;
  address?: `0x${string}`;
  watch?: boolean;
}

/**
 * Fetches ERC20-style balances through an injected CastKit balance service.
 */
export function useTokenBalance(config: UseTokenBalanceConfig) {
  const { chainId } = useWalletContext();
  const { address: connectedAddress } = useWallet();
  const { services } = useCastKitConfigContext();
  const [state, setState] = useState({
    balance: null as bigint | null,
    formatted: null as string | null,
    symbol: null as string | null,
    decimals: null as number | null,
    isLoading: true,
  });

  useEffect(() => {
    const address = config.address ?? connectedAddress;
    if (!address || !services?.getTokenBalance) {
      setState({
        balance: null,
        formatted: null,
        symbol: null,
        decimals: null,
        isLoading: false,
      });
      return;
    }

    let intervalId: ReturnType<typeof globalThis.setInterval> | undefined;

    const load = async () => {
      setState((current) => ({
        ...current,
        isLoading: true,
      }));

      const result = await services.getTokenBalance({
        tokenAddress: config.tokenAddress,
        address,
        chainId,
      });

      setState({
        balance: result.balance,
        formatted: formatUnits(result.balance, result.decimals),
        symbol: result.symbol,
        decimals: result.decimals,
        isLoading: false,
      });
    };

    void load();

    if (config.watch) {
      intervalId = globalThis.setInterval(() => {
        void load();
      }, 12_000);
    }

    return () => {
      if (intervalId) {
        globalThis.clearInterval(intervalId);
      }
    };
  }, [chainId, config.address, config.tokenAddress, config.watch, connectedAddress, services]);

  return state;
}
