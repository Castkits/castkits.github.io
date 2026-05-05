import type { SendTransactionRequest, TransactionReceipt } from 'viem';

export type TxState = 'idle' | 'pending' | 'success' | 'error';

export interface TxParams extends SendTransactionRequest {
  timeoutMs?: number;
  retries?: number;
  confirmations?: number;
}

export interface TransactionSnapshot {
  state: TxState;
  hash: `0x${string}` | null;
  error: Error | null;
  receipt: TransactionReceipt | null;
}

