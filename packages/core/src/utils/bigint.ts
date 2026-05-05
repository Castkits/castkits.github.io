import { formatUnits, parseEther } from 'viem';

export function parseEth(value: string): bigint {
  return parseEther(value);
}

export function formatBigInt(value: bigint | null, decimals = 18, precision = 4): string | null {
  if (value === null) {
    return null;
  }

  const formatted = formatUnits(value, decimals);
  const [integer, fraction = ''] = formatted.split('.');

  if (!fraction) {
    return integer;
  }

  return `${integer}.${fraction.slice(0, precision)}`.replace(/\.$/, '');
}

export function clampMinZero(value: bigint): bigint {
  return value < 0n ? 0n : value;
}

