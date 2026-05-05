import { BaseWalletAdapter } from '../types/adapter';
import type { SendTransactionRequest, TransactionReceipt, TypedDataDomain, TypedDataField } from 'viem';
import { parseEther } from 'viem';

type CastKitEvent = 'accountsChanged' | 'chainChanged' | 'disconnect';

export interface TestAdapterOptions {
  connected?: boolean;
  chainId?: number;
  balance?: string;
  txBehavior?: 'success' | 'error' | 'timeout';
  switchBehavior?: 'success' | 'error';
}

function createEmitter() {
  const listeners = new Map<CastKitEvent, Set<(...args: unknown[]) => void>>();

  return {
    on(event: CastKitEvent, handler: (...args: unknown[]) => void) {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }

      listeners.get(event)?.add(handler);
    },
    off(event: string, handler: (...args: unknown[]) => void) {
      listeners.get(event as CastKitEvent)?.delete(handler);
    },
    emit(event: CastKitEvent, ...args: unknown[]) {
      listeners.get(event)?.forEach((handler) => handler(...args));
    },
  };
}

export class TestAdapter extends BaseWalletAdapter {
  public readonly name = 'test';

  private readonly emitter = createEmitter();
  private readonly txBehavior: 'success' | 'error' | 'timeout';
  private readonly switchBehavior: 'success' | 'error';
  private connected: boolean;
  private chainId: number;
  private balance: bigint;
  private address: `0x${string}` = '0x1111111111111111111111111111111111111111';

  public constructor(options: TestAdapterOptions = {}) {
    super();
    this.connected = options.connected ?? true;
    this.chainId = options.chainId ?? 1;
    this.balance = parseEther(options.balance ?? '2');
    this.txBehavior = options.txBehavior ?? 'success';
    this.switchBehavior = options.switchBehavior ?? 'success';
  }

  public async connect(): Promise<void> {
    this.connected = true;
    this.emitter.emit('accountsChanged', this.address);
  }

  public async disconnect(): Promise<void> {
    this.connected = false;
    this.emitter.emit('disconnect');
  }

  public getAddress(): `0x${string}` | null {
    return this.connected ? this.address : null;
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public getChainId(): number | null {
    return this.connected ? this.chainId : null;
  }

  public async getBalance(_address?: `0x${string}`): Promise<bigint> {
    return this.balance;
  }

  public async signMessage(_message: string): Promise<`0x${string}`> {
    return `0x${'1'.repeat(130)}` as `0x${string}`;
  }

  public async signTypedData(
    _domain: TypedDataDomain,
    _types: Record<string, TypedDataField[]>,
    _value: Record<string, unknown>,
  ): Promise<`0x${string}`> {
    return `0x${'2'.repeat(130)}` as `0x${string}`;
  }

  public async switchChain(chainId: number): Promise<void> {
    if (this.switchBehavior === 'error') {
      throw new Error('Switch failed');
    }

    this.chainId = chainId;
    this.emitter.emit('chainChanged', chainId);
  }

  public async sendTransaction(params: SendTransactionRequest): Promise<`0x${string}`> {
    if (this.txBehavior === 'error') {
      throw new Error('Transaction failed');
    }

    if (typeof params.value === 'bigint') {
      this.balance -= params.value;
    }

    return `0x${'3'.repeat(64)}` as `0x${string}`;
  }

  public async waitForTransaction(
    hash: `0x${string}`,
    _confirmations?: number,
  ): Promise<TransactionReceipt> {
    if (this.txBehavior === 'timeout') {
      return await new Promise<TransactionReceipt>(() => undefined);
    }

    return {
      blockHash: `0x${'a'.repeat(64)}`,
      blockNumber: 1n,
      contractAddress: null,
      cumulativeGasUsed: 21_000n,
      effectiveGasPrice: 1n,
      from: this.address,
      gasUsed: 21_000n,
      logs: [],
      logsBloom: `0x${'0'.repeat(512)}`,
      status: 'success',
      to: this.address,
      transactionHash: hash,
      transactionIndex: 0,
      type: 'legacy',
    } as TransactionReceipt;
  }

  public on(event: CastKitEvent, handler: (...args: unknown[]) => void): void {
    this.emitter.on(event, handler);
  }

  public off(event: string, handler: (...args: unknown[]) => void): void {
    this.emitter.off(event, handler);
  }
}
