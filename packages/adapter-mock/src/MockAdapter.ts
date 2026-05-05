import { BaseWalletAdapter } from '@castkit/core';
import type { SendTransactionRequest, TransactionReceipt, TypedDataDomain, TypedDataField } from 'viem';
import { parseEther } from 'viem';

type CastKitEvent = 'accountsChanged' | 'chainChanged' | 'disconnect';
type TxResult = 'success' | 'error' | 'timeout';

export interface MockAdapterConfig {
  address?: `0x${string}`;
  chainId?: number;
  balance?: string;
  txDelay?: number;
  txResult?: TxResult;
  signResult?: `0x${string}` | 'reject';
  switchChainBehavior?: 'success' | 'error';
  autoConnect?: boolean;
}

export interface MockTransactionHistoryItem {
  hash: `0x${string}`;
  params: SendTransactionRequest;
  createdAt: number;
  result: TxResult;
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

function delay(ms: number) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

/**
 * Deterministic wallet adapter for tests, Storybook, docs playgrounds, and local demos.
 */
export class MockAdapter extends BaseWalletAdapter {
  public readonly name = 'mock';

  public static presets = {
    connected: () =>
      new MockAdapter({
        autoConnect: true,
        chainId: 1,
        balance: '2',
      }),
    disconnected: () =>
      new MockAdapter({
        autoConnect: false,
      }),
    wrongChain: () =>
      new MockAdapter({
        autoConnect: true,
        chainId: 137,
        balance: '2',
      }),
    lowBalance: () =>
      new MockAdapter({
        autoConnect: true,
        chainId: 1,
        balance: '0.001',
      }),
    txError: () =>
      new MockAdapter({
        autoConnect: true,
        chainId: 1,
        balance: '2',
        txResult: 'error',
      }),
    txPending: () =>
      new MockAdapter({
        autoConnect: true,
        chainId: 1,
        balance: '2',
        txResult: 'timeout',
      }),
  };

  private readonly emitter = createEmitter();
  private readonly txDelay: number;
  private readonly txResult: TxResult;
  private readonly signResult: `0x${string}` | 'reject';
  private readonly switchChainBehavior: 'success' | 'error';
  private history: MockTransactionHistoryItem[] = [];
  private isWalletConnected: boolean;
  private address: `0x${string}`;
  private chainId: number;
  private balance: bigint;

  public constructor(config: MockAdapterConfig = {}) {
    super();
    this.txDelay = config.txDelay ?? 250;
    this.txResult = config.txResult ?? 'success';
    this.signResult = config.signResult ?? (`0x${'1'.repeat(130)}` as `0x${string}`);
    this.switchChainBehavior = config.switchChainBehavior ?? 'success';
    this.address = config.address ?? '0x1111111111111111111111111111111111111111';
    this.chainId = config.chainId ?? 1;
    this.balance = parseEther(config.balance ?? '1.5');
    this.isWalletConnected = Boolean(config.autoConnect);
  }

  public async connect(): Promise<void> {
    this.isWalletConnected = true;
    this.emitter.emit('accountsChanged', this.address);
    this.emitter.emit('chainChanged', this.chainId);
  }

  public async disconnect(): Promise<void> {
    this.isWalletConnected = false;
    this.emitter.emit('disconnect');
  }

  public getAddress(): `0x${string}` | null {
    return this.isWalletConnected ? this.address : null;
  }

  public isConnected(): boolean {
    return this.isWalletConnected;
  }

  public getChainId(): number | null {
    return this.isWalletConnected ? this.chainId : null;
  }

  public async getBalance(_address?: `0x${string}`): Promise<bigint> {
    return this.balance;
  }

  public async signMessage(_message: string): Promise<`0x${string}`> {
    if (this.signResult === 'reject') {
      throw new Error('User rejected the signature request.');
    }

    return this.signResult;
  }

  public async signTypedData(
    _domain: TypedDataDomain,
    _types: Record<string, TypedDataField[]>,
    _value: Record<string, unknown>,
  ): Promise<`0x${string}`> {
    if (this.signResult === 'reject') {
      throw new Error('User rejected the typed data request.');
    }

    return this.signResult;
  }

  public async switchChain(chainId: number): Promise<void> {
    if (this.switchChainBehavior === 'error') {
      throw new Error('Mock switchChain error.');
    }

    this.chainId = chainId;
    this.emitter.emit('chainChanged', chainId);
  }

  public async sendTransaction(params: SendTransactionRequest): Promise<`0x${string}`> {
    if (!this.isWalletConnected) {
      throw new Error('Wallet is not connected.');
    }

    await delay(this.txDelay);

    if (this.txResult === 'error') {
      throw new Error('Mock transaction failed.');
    }

    const hash = (`0x${this.history.length.toString(16).padStart(64, '0')}`) as `0x${string}`;

    this.history = [
      ...this.history,
      {
        hash,
        params,
        createdAt: Date.now(),
        result: this.txResult,
      },
    ];

    if (typeof params.value === 'bigint') {
      this.balance -= params.value;
    }

    return hash;
  }

  public async waitForTransaction(
    hash: `0x${string}`,
    confirmations = 1,
  ): Promise<TransactionReceipt> {
    const record = this.history.find((item) => item.hash === hash);
    if (!record) {
      throw new Error(`Unknown transaction hash: ${hash}`);
    }

    if (record.result === 'timeout') {
      return await new Promise<TransactionReceipt>(() => undefined);
    }

    await delay(this.txDelay * confirmations);

    return {
      blockHash: `0x${'a'.repeat(64)}`,
      blockNumber: BigInt(this.history.length),
      contractAddress: null,
      cumulativeGasUsed: 21_000n,
      effectiveGasPrice: 1n,
      from: this.address,
      gasUsed: 21_000n,
      logs: [],
      logsBloom: `0x${'0'.repeat(512)}`,
      status: 'success',
      to: (record.params.to ?? this.address) as `0x${string}`,
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

  public getHistory(): MockTransactionHistoryItem[] {
    return [...this.history];
  }

  public setBalance(value: string | bigint): void {
    this.balance = typeof value === 'bigint' ? value : parseEther(value);
  }

  public setAddress(address: `0x${string}`): void {
    this.address = address;
    if (this.isWalletConnected) {
      this.emitter.emit('accountsChanged', address);
    }
  }

  public setConnected(value: boolean): void {
    this.isWalletConnected = value;
    if (!value) {
      this.emitter.emit('disconnect');
      return;
    }

    this.emitter.emit('accountsChanged', this.address);
  }
}
