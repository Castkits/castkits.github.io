import type { SupportedChainId } from '../utils/chain';

export type TokenGateType = 'ERC721' | 'ERC20' | 'ERC1155';
export type ChainMismatchStrategy = 'prompt-switch' | 'block' | 'warn';
export type CastKitTheme = 'dark' | 'light' | 'system';

export interface NFTMetadata {
  id: string;
  contractAddress: `0x${string}`;
  name: string;
  description?: string;
  image?: string;
  tokenId?: string;
}

export interface EnsProfile {
  name: string | null;
  avatar: string | null;
}

export interface TokenBalanceDetails {
  balance: bigint;
  symbol: string;
  decimals: number;
}

export interface CastKitServices {
  resolveENS?: (address: `0x${string}`) => Promise<EnsProfile>;
  getTokenBalance?: (params: {
    tokenAddress: `0x${string}`;
    address: `0x${string}`;
    chainId: number | null;
  }) => Promise<TokenBalanceDetails>;
  getNFTs?: (params: {
    address: `0x${string}`;
    contractAddress?: `0x${string}`;
  }) => Promise<NFTMetadata[]>;
  hasTokenAccess?: (params: {
    address: `0x${string}`;
    contractAddress: `0x${string}`;
    minBalance?: number;
    tokenType?: TokenGateType;
    tokenId?: number;
  }) => Promise<boolean>;
}

export interface CastKitConfig {
  allowedChains?: SupportedChainId[];
  onChainMismatch?: ChainMismatchStrategy;
  theme?: CastKitTheme;
  walletConnectProjectId?: string;
  storageKey?: string;
  services?: CastKitServices;
}

export interface CastKitModalController {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

