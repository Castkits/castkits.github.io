import type { SendTransactionRequest, TransactionReceipt, TypedDataDomain, TypedDataField } from 'viem';

/**
 * Runtime contract for wallet backends used by CastKit hooks and UI.
 */
export interface WalletAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getAddress(): `0x${string}` | null;
  isConnected(): boolean;
  getChainId(): number | null;
  getBalance(address?: `0x${string}`): Promise<bigint>;
  signMessage(message: string): Promise<`0x${string}`>;
  signTypedData(
    domain: TypedDataDomain,
    types: Record<string, TypedDataField[]>,
    value: Record<string, unknown>,
  ): Promise<`0x${string}`>;
  switchChain(chainId: number): Promise<void>;
  sendTransaction(params: SendTransactionRequest): Promise<`0x${string}`>;
  waitForTransaction(hash: `0x${string}`, confirmations?: number): Promise<TransactionReceipt>;
  on(
    event: 'accountsChanged' | 'chainChanged' | 'disconnect',
    handler: (...args: unknown[]) => void,
  ): void;
  off(event: string, handler: (...args: unknown[]) => void): void;
  readonly name: string;
  readonly icon?: string;
}

/**
 * Helper base class for adapters that want shared address formatting.
 */
export abstract class BaseWalletAdapter implements WalletAdapter {
  public abstract readonly name: string;
  public readonly icon?: string;

  public formatAddress(address: string, chars = 4): string {
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
  }

  public abstract connect(): Promise<void>;
  public abstract disconnect(): Promise<void>;
  public abstract getAddress(): `0x${string}` | null;
  public abstract isConnected(): boolean;
  public abstract getChainId(): number | null;
  public abstract getBalance(address?: `0x${string}`): Promise<bigint>;
  public abstract signMessage(message: string): Promise<`0x${string}`>;
  public abstract signTypedData(
    domain: TypedDataDomain,
    types: Record<string, TypedDataField[]>,
    value: Record<string, unknown>,
  ): Promise<`0x${string}`>;
  public abstract switchChain(chainId: number): Promise<void>;
  public abstract sendTransaction(params: SendTransactionRequest): Promise<`0x${string}`>;
  public abstract waitForTransaction(
    hash: `0x${string}`,
    confirmations?: number,
  ): Promise<TransactionReceipt>;
  public abstract on(
    event: 'accountsChanged' | 'chainChanged' | 'disconnect',
    handler: (...args: unknown[]) => void,
  ): void;
  public abstract off(event: string, handler: (...args: unknown[]) => void): void;
}

