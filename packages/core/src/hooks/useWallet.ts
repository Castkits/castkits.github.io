import { useEffect, useRef } from 'react';
import { useWalletContext } from '../context/WalletContext';
import { formatAddress } from '../utils/address';

function readWalletSnapshot(adapter: ReturnType<typeof useWalletContext>['adapter']) {
  return {
    address: adapter.getAddress(),
    chainId: adapter.getChainId(),
    isConnected: adapter.isConnected(),
  };
}

/**
 * Manages the active wallet connection lifecycle.
 */
export function useWallet() {
  const { adapter, persistKey, setState, ...state } = useWalletContext();
  const operationRef = useRef(0);
  const reconnectAttemptedRef = useRef(false);

  useEffect(() => {
    const sync = () => {
      const snapshot = readWalletSnapshot(adapter);
      setState((current) => ({
        ...current,
        ...snapshot,
        isConnecting: false,
        error: null,
      }));
    };

    const handleDisconnect = () => {
      setState((current) => ({
        ...current,
        address: null,
        chainId: null,
        isConnected: false,
        isConnecting: false,
      }));
    };

    adapter.on('accountsChanged', sync);
    adapter.on('chainChanged', sync);
    adapter.on('disconnect', handleDisconnect);

    sync();

    return () => {
      adapter.off('accountsChanged', sync);
      adapter.off('chainChanged', sync);
      adapter.off('disconnect', handleDisconnect);
    };
  }, [adapter, setState]);

  useEffect(() => {
    if (reconnectAttemptedRef.current || typeof window === 'undefined') {
      return;
    }

    reconnectAttemptedRef.current = true;

    if (window.localStorage.getItem(persistKey) !== 'true' || adapter.isConnected()) {
      return;
    }

    const sequence = ++operationRef.current;

    setState((current) => ({
      ...current,
      isConnecting: true,
      error: null,
    }));

    void adapter
      .connect()
      .then(() => {
        if (sequence !== operationRef.current) {
          return;
        }

        const snapshot = readWalletSnapshot(adapter);
        setState((current) => ({
          ...current,
          ...snapshot,
          isConnecting: false,
          error: null,
        }));
      })
      .catch((error: unknown) => {
        if (sequence !== operationRef.current) {
          return;
        }

        setState((current) => ({
          ...current,
          isConnecting: false,
          error: error instanceof Error ? error : new Error('Wallet reconnect failed.'),
        }));
      });
  }, [adapter, persistKey, setState]);

  const connect = async () => {
    const sequence = ++operationRef.current;

    setState((current) => ({
      ...current,
      isConnecting: true,
      error: null,
    }));

    try {
      await adapter.connect();

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(persistKey, 'true');
      }

      if (sequence !== operationRef.current) {
        return;
      }

      const snapshot = readWalletSnapshot(adapter);
      setState((current) => ({
        ...current,
        ...snapshot,
        isConnecting: false,
        error: null,
      }));
    } catch (error: unknown) {
      if (sequence !== operationRef.current) {
        return;
      }

      setState((current) => ({
        ...current,
        isConnecting: false,
        error: error instanceof Error ? error : new Error('Wallet connection failed.'),
      }));

      throw error;
    }
  };

  const disconnect = async () => {
    const sequence = ++operationRef.current;

    try {
      await adapter.disconnect();

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(persistKey);
      }

      if (sequence !== operationRef.current) {
        return;
      }

      setState((current) => ({
        ...current,
        address: null,
        chainId: null,
        isConnected: false,
        isConnecting: false,
        error: null,
      }));
    } catch (error: unknown) {
      setState((current) => ({
        ...current,
        error: error instanceof Error ? error : new Error('Wallet disconnect failed.'),
      }));
      throw error;
    }
  };

  return {
    address: state.address,
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    isDisconnected: !state.isConnected && !state.isConnecting,
    connect,
    disconnect,
    error: state.error,
    formattedAddress: state.address ? formatAddress(state.address) : null,
  };
}

