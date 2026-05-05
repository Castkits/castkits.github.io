export const SUPPORTED_CHAINS = {
  1: { name: 'Ethereum', rpc: 'https://eth.llamarpc.com', explorer: 'https://etherscan.io' },
  10: {
    name: 'Optimism',
    rpc: 'https://optimism.llamarpc.com',
    explorer: 'https://optimistic.etherscan.io',
  },
  137: { name: 'Polygon', rpc: 'https://polygon.llamarpc.com', explorer: 'https://polygonscan.com' },
  8453: { name: 'Base', rpc: 'https://base.llamarpc.com', explorer: 'https://basescan.org' },
  42161: { name: 'Arbitrum', rpc: 'https://arbitrum.llamarpc.com', explorer: 'https://arbiscan.io' },
} as const;

export type SupportedChainId = keyof typeof SUPPORTED_CHAINS;

export function isSupportedChain(chainId: number | null): chainId is SupportedChainId {
  return Boolean(chainId && chainId in SUPPORTED_CHAINS);
}

export function getChainInfo(chainId: number | null) {
  if (!chainId || !isSupportedChain(chainId)) {
    return null;
  }

  return SUPPORTED_CHAINS[chainId];
}

