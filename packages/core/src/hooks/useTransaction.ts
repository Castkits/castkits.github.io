import { useState } from 'react';
import type { TransactionSnapshot, TxParams, TxState } from '../types/transaction';
import { useWalletContext } from '../context/WalletContext';

const DEFAULT_TIMEOUT_MS = 60_000;
const DEFAULT_RETRIES = 3;

const transitions: Record<TxState, TxState[]> = {
  idle: ['pending'],
  pending: ['success', 'error'],
  success: ['idle', 'pending'],
  error: ['idle', 'pending'],
};

function toError(error: unknown, fallback: string): Error {
  return error instanceof Error ? error : new Error(fallback);
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return await new Promise<T>((resolve, reject) => {
    const timeoutId = globalThis.setTimeout(() => {
      reject(new Error(message));
    }, timeoutMs);

    promise
      .then((value) => {
        globalThis.clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        globalThis.clearTimeout(timeoutId);
        reject(error);
      });
  });
}

/**
 * Controlled transaction state machine with timeout and retry semantics.
 */
export function useTransaction() {
  const { adapter } = useWalletContext();
  const [snapshot, setSnapshot] = useState<TransactionSnapshot>({
    state: 'idle',
    hash: null,
    error: null,
    receipt: null,
  });

  const transition = (nextState: TxState, patch?: Partial<TransactionSnapshot>) => {
    setSnapshot((current) => {
      if (!transitions[current.state].includes(nextState)) {
        return current;
      }

      return {
        ...current,
        ...patch,
        state: nextState,
      };
    });
  };

  const reset = () => {
    setSnapshot((current) => {
      if (current.state === 'pending') {
        return current;
      }

      return {
        state: 'idle',
        hash: null,
        error: null,
        receipt: null,
      };
    });
  };

  const send = async (params: TxParams) => {
    if (snapshot.state === 'pending') {
      throw new Error('A transaction is already pending.');
    }

    transition('pending', {
      hash: null,
      error: null,
      receipt: null,
    });

    const timeoutMs = params.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const maxAttempts = Math.min(params.retries ?? DEFAULT_RETRIES, DEFAULT_RETRIES);
    let hash: `0x${string}` | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        if (!hash) {
          hash = await withTimeout(
            adapter.sendTransaction(params),
            timeoutMs,
            'Transaction submission timed out.',
          );

          setSnapshot((current) => ({
            ...current,
            hash,
          }));
        }

        const receipt = await withTimeout(
          adapter.waitForTransaction(hash, params.confirmations),
          timeoutMs,
          'Transaction confirmation timed out.',
        );

        transition('success', {
          hash,
          receipt,
          error: null,
        });
        return;
      } catch (error: unknown) {
        const normalized = toError(error, 'Transaction failed.');

        if (attempt === maxAttempts) {
          transition('error', {
            hash,
            error: normalized,
            receipt: null,
          });
          throw normalized;
        }
      }
    }
  };

  return {
    state: snapshot.state,
    hash: snapshot.hash,
    error: snapshot.error,
    send,
    reset,
    receipt: snapshot.receipt,
  };
}
