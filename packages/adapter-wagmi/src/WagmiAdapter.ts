import {
  connect,
  disconnect,
  getAccount,
  getBalance,
  sendTransaction,
  signMessage,
  signTypedData,
  switchChain,
  waitForTransactionReceipt,
  watchAccount,
  watchChainId,
  type Config as WagmiCoreConfig,
} from '@wagmi/core';
import { BaseWalletAdapter, SUPPORTED_CHAINS, type SupportedChainId } from '@castkit/core';
import type { SendTransactionRequest, TransactionReceipt, TypedDataDomain, TypedDataField } from 'viem';
import { createConfig, http } from 'wagmi';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

type CastKitEvent = 'accountsChanged' | 'chainChanged' | 'disconnect';

export interface WagmiAdapterOptions {
  wagmiConfig: WagmiCoreConfig;
  defaultConnectorId?: string;
}

export interface CreateCastKitWagmiConfigOptions {
  walletConnectProjectId: string;
  chains?: SupportedChainId[];
}

function normalizeChainId(value: string): number {
  return Number.parseInt(value, 16);
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
      listeners.get(event)?.forEach((handler) => {
        handler(...args);
      });
    },
  };
}

/**
 * Creates a sensible wagmi config with CastKit defaults and common connectors.
 */
export function createCastKitWagmiConfig(options: CreateCastKitWagmiConfigOptions) {
  const chains = (options.chains ?? [1, 8453, 137]).map((chainId) => {
    const chain = SUPPORTED_CHAINS[chainId];

    return {
      id: chainId,
      name: chain.name,
      nativeCurrency: {
        name: chain.name,
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: [chain.rpc],
        },
      },
      blockExplorers: {
        default: {
          name: `${chain.name} Explorer`,
          url: chain.explorer,
        },
      },
    };
  });

  return createConfig({
    chains,
    connectors: [
      injected({ target: 'metaMask' }),
      coinbaseWallet({ appName: 'CastKit' }),
      walletConnect({ projectId: options.walletConnectProjectId }),
    ],
    transports: Object.fromEntries(
      chains.map((chain) => [chain.id, http(chain.rpcUrls.default.http[0])]),
    ) as Record<number, ReturnType<typeof http>>,
  });
}

/**
 * Default CastKit adapter backed by wagmi core actions.
 */
export class WagmiAdapter extends BaseWalletAdapter {
  public readonly name = 'wagmi';

  private readonly config: WagmiCoreConfig;
  private readonly defaultConnectorId?: string;
  private readonly emitter = createEmitter();
  private readonly cleanup: Array<() => void> = [];

  public constructor(options: WagmiAdapterOptions) {
    super();
    this.config = options.wagmiConfig;
    this.defaultConnectorId = options.defaultConnectorId;

    this.cleanup.push(
      watchAccount(this.config, {
        onChange: (account) => {
          this.emitter.emit('accountsChanged', account.address ?? null);
          if (!account.isConnected) {
            this.emitter.emit('disconnect');
          }
        },
      }),
    );

    this.cleanup.push(
      watchChainId(this.config, {
        onChange: (chainId) => {
          this.emitter.emit('chainChanged', chainId);
        },
      }),
    );
  }

  public async connect(): Promise<void> {
    const connector = this.defaultConnectorId
      ? this.config.connectors.find((item) => item.id === this.defaultConnectorId)
      : undefined;

    await connect(this.config, connector ? { connector } : undefined);
  }

  public async disconnect(): Promise<void> {
    await disconnect(this.config);
    this.emitter.emit('disconnect');
  }

  public getAddress(): `0x${string}` | null {
    return getAccount(this.config).address ?? null;
  }

  public isConnected(): boolean {
    return Boolean(getAccount(this.config).isConnected);
  }

  public getChainId(): number | null {
    return getAccount(this.config).chainId ?? null;
  }

  public async getBalance(address?: `0x${string}`): Promise<bigint> {
    const targetAddress = address ?? this.getAddress();
    if (!targetAddress) {
      return 0n;
    }

    const balance = await getBalance(this.config, { address: targetAddress });
    return balance.value;
  }

  public async signMessage(message: string): Promise<`0x${string}`> {
    return await signMessage(this.config, { message });
  }

  public async signTypedData(
    domain: TypedDataDomain,
    types: Record<string, TypedDataField[]>,
    value: Record<string, unknown>,
  ): Promise<`0x${string}`> {
    return await signTypedData(this.config, {
      domain,
      types,
      primaryType: Object.keys(types)[0] ?? 'Message',
      message: value,
    });
  }

  public async switchChain(chainId: number): Promise<void> {
    await switchChain(this.config, { chainId });
  }

  public async sendTransaction(params: SendTransactionRequest): Promise<`0x${string}`> {
    return await sendTransaction(this.config, params);
  }

  public async waitForTransaction(
    hash: `0x${string}`,
    confirmations = 1,
  ): Promise<TransactionReceipt> {
    return await waitForTransactionReceipt(this.config, {
      hash,
      confirmations,
    });
  }

  public on(event: CastKitEvent, handler: (...args: unknown[]) => void): void {
    this.emitter.on(event, handler);
  }

  public off(event: string, handler: (...args: unknown[]) => void): void {
    this.emitter.off(event, handler);
  }

  public destroy(): void {
    this.cleanup.forEach((dispose) => dispose());
  }
}

