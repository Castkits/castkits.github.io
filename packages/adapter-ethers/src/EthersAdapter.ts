import { BrowserProvider, JsonRpcProvider } from 'ethers';
import { BaseWalletAdapter } from '@castkit/core';
import type { Eip1193Provider } from 'ethers';
import type { SendTransactionRequest, TransactionReceipt, TypedDataDomain, TypedDataField } from 'viem';

type CastKitEvent = 'accountsChanged' | 'chainChanged' | 'disconnect';
type EventedEip1193Provider = Eip1193Provider & {
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
};

export interface EthersAdapterOptions {
  injectedProvider?: EventedEip1193Provider;
  rpcUrl?: string;
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

/**
 * Adapter that exposes an ethers.js v6 wallet through the CastKit adapter interface.
 */
export class EthersAdapter extends BaseWalletAdapter {
  public readonly name = 'ethers';

  private readonly emitter = createEmitter();
  private readonly injectedProvider?: EventedEip1193Provider;
  private readonly browserProvider?: BrowserProvider;
  private readonly publicProvider?: JsonRpcProvider;
  private address: `0x${string}` | null = null;
  private chainId: number | null = null;

  public constructor(options: EthersAdapterOptions = {}) {
    super();
    this.injectedProvider = options.injectedProvider;
    this.browserProvider = options.injectedProvider ? new BrowserProvider(options.injectedProvider) : undefined;
    this.publicProvider = options.rpcUrl ? new JsonRpcProvider(options.rpcUrl) : undefined;

    if (this.injectedProvider?.on) {
      this.injectedProvider.on('accountsChanged', (accounts: string[]) => {
        this.address = (accounts[0] as `0x${string}` | undefined) ?? null;
        this.emitter.emit('accountsChanged', this.address);
      });

      this.injectedProvider.on('chainChanged', (value: string) => {
        this.chainId = normalizeChainId(value);
        this.emitter.emit('chainChanged', this.chainId);
      });

      this.injectedProvider.on('disconnect', () => {
        this.address = null;
        this.chainId = null;
        this.emitter.emit('disconnect');
      });
    }
  }

  public async connect(): Promise<void> {
    if (!this.browserProvider) {
      throw new Error('No injected wallet provider configured.');
    }

    const accounts = await this.browserProvider.send('eth_requestAccounts', []);
    this.address = (accounts[0] as `0x${string}` | undefined) ?? null;
    this.chainId = Number((await this.browserProvider.getNetwork()).chainId);
    this.emitter.emit('accountsChanged', this.address);
  }

  public async disconnect(): Promise<void> {
    this.address = null;
    this.chainId = null;
    this.emitter.emit('disconnect');
  }

  public getAddress(): `0x${string}` | null {
    return this.address;
  }

  public isConnected(): boolean {
    return Boolean(this.address);
  }

  public getChainId(): number | null {
    return this.chainId;
  }

  public async getBalance(address?: `0x${string}`): Promise<bigint> {
    const targetAddress = address ?? this.address;
    if (!targetAddress) {
      return 0n;
    }

    const provider = this.browserProvider ?? this.publicProvider;
    if (!provider) {
      throw new Error('No provider available for balance lookups.');
    }

    return await provider.getBalance(targetAddress);
  }

  public async signMessage(message: string): Promise<`0x${string}`> {
    const signer = await this.getSigner();
    return (await signer.signMessage(message)) as `0x${string}`;
  }

  public async signTypedData(
    domain: TypedDataDomain,
    types: Record<string, TypedDataField[]>,
    value: Record<string, unknown>,
  ): Promise<`0x${string}`> {
    const signer = await this.getSigner();
    return (await signer.signTypedData(domain, types, value)) as `0x${string}`;
  }

  public async switchChain(chainId: number): Promise<void> {
    if (!this.injectedProvider?.request) {
      throw new Error('Injected provider does not support chain switching.');
    }

    await this.injectedProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });

    this.chainId = chainId;
    this.emitter.emit('chainChanged', chainId);
  }

  public async sendTransaction(params: SendTransactionRequest): Promise<`0x${string}`> {
    const signer = await this.getSigner();
    const response = await signer.sendTransaction({
      to: params.to,
      data: params.data,
      value: params.value,
      gasLimit: params.gas,
      nonce: params.nonce,
    });

    return response.hash as `0x${string}`;
  }

  public async waitForTransaction(
    hash: `0x${string}`,
    confirmations = 1,
  ): Promise<TransactionReceipt> {
    const provider = this.browserProvider ?? this.publicProvider;
    if (!provider) {
      throw new Error('No provider available for receipt lookups.');
    }

    const receipt = await provider.waitForTransaction(hash, confirmations);
    if (!receipt) {
      throw new Error('Transaction receipt not found.');
    }

    return receipt.toJSON() as unknown as TransactionReceipt;
  }

  public on(event: CastKitEvent, handler: (...args: unknown[]) => void): void {
    this.emitter.on(event, handler);
  }

  public off(event: string, handler: (...args: unknown[]) => void): void {
    this.emitter.off(event, handler);
  }

  private async getSigner() {
    if (!this.browserProvider) {
      throw new Error('No browser wallet configured.');
    }

    return await this.browserProvider.getSigner();
  }
}

function normalizeChainId(value: string): number {
  return Number.parseInt(value, 16);
}
