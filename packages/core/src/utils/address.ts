import { isAddress as isViemAddress } from 'viem';

/**
 * Returns a shortened address such as 0x12ab...90ef.
 */
export function formatAddress(address: `0x${string}` | string, chars = 4): string {
  if (address.length <= chars * 2 + 2) {
    return address;
  }

  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function isAddress(value: string): value is `0x${string}` {
  return isViemAddress(value);
}

