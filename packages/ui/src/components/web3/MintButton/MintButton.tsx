'use client';

import * as React from 'react';
import type { Abi } from 'viem';
import { CheckCircle2, RefreshCcw } from 'lucide-react';
import { parseEther } from 'viem';
import { useMint } from '@castkit/core';
import { Button, type ButtonProps } from '../../core/Button/Button';

const defaultMintAbi = [
  {
    type: 'function',
    name: 'mint',
    stateMutability: 'payable',
    inputs: [{ name: 'quantity', type: 'uint256' }],
    outputs: [],
  },
] as const satisfies Abi;

export interface MintButtonProps {
  contractAddress: `0x${string}`;
  abi?: Abi;
  price: number;
  quantity?: number;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  onSuccess?: (hash: `0x${string}`) => void;
  onError?: (error: Error) => void;
}

export const MintButton = React.forwardRef<HTMLButtonElement, MintButtonProps>(
  (
    {
      contractAddress,
      abi = defaultMintAbi,
      price,
      quantity = 1,
      variant = 'primary',
      size = 'md',
      onSuccess,
      onError,
    },
    ref,
  ) => {
    const { mint, canMint, txState, hash, error } = useMint({
      contractAddress,
      abi,
      price: parseEther(String(price)),
    });
    const successHashRef = React.useRef<`0x${string}` | null>(null);
    const errorMessageRef = React.useRef<string | null>(null);

    React.useEffect(() => {
      if (txState === 'success' && hash && successHashRef.current !== hash) {
        successHashRef.current = hash;
        onSuccess?.(hash);
      }
    }, [hash, onSuccess, txState]);

    React.useEffect(() => {
      if (txState === 'error' && error && error.message !== errorMessageRef.current) {
        errorMessageRef.current = error.message;
        onError?.(error);
      }
    }, [error, onError, txState]);

    const label =
      txState === 'pending'
        ? 'Minting...'
        : txState === 'success'
          ? 'Minted!'
          : txState === 'error'
            ? 'Failed - Retry'
            : `Mint (${price} ETH)`;

    const icon = txState === 'success' ? <CheckCircle2 className="h-4 w-4" /> : txState === 'error' ? <RefreshCcw className="h-4 w-4" /> : undefined;

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        loading={txState === 'pending'}
        disabled={!canMint && txState !== 'error'}
        leftIcon={icon}
        onClick={() => void mint(quantity)}
        data-testid="mint-button"
      >
        {label}
      </Button>
    );
  },
);

MintButton.displayName = 'MintButton';

