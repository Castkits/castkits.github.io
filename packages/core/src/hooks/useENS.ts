import { useEffect, useState } from 'react';
import { useCastKitConfigContext } from '../context/CastKitConfigContext';
import { useWallet } from './useWallet';

/**
 * Resolves the current wallet to an ENS profile when a resolver is configured.
 */
export function useENS() {
  const { address } = useWallet();
  const { services } = useCastKitConfigContext();
  const [state, setState] = useState({
    name: null as string | null,
    avatar: null as string | null,
    isLoading: Boolean(address && services?.resolveENS),
  });

  useEffect(() => {
    if (!address || !services?.resolveENS) {
      setState({
        name: null,
        avatar: null,
        isLoading: false,
      });
      return;
    }

    setState((current) => ({
      ...current,
      isLoading: true,
    }));

    void services.resolveENS(address).then((profile) => {
      setState({
        name: profile.name,
        avatar: profile.avatar,
        isLoading: false,
      });
    });
  }, [address, services]);

  return state;
}

