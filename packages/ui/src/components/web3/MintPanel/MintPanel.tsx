'use client';

import * as React from 'react';
import * as Progress from '@radix-ui/react-progress';
import type { Abi } from 'viem';
import { Minus, Plus } from 'lucide-react';
import { parseEther } from 'viem';
import { useMint, useNetwork, useWallet } from '@castkit/core';
import { Button } from '../../core/Button/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../core/Card/Card';
import { ConnectWalletButton } from '../ConnectWalletButton/ConnectWalletButton';
import { TxStatus } from '../TxStatus/TxStatus';

const defaultMintAbi = [
  {
    type: 'function',
    name: 'mint',
    stateMutability: 'payable',
    inputs: [{ name: 'quantity', type: 'uint256' }],
    outputs: [],
  },
] as const satisfies Abi;

export interface MintPanelProps {
  contractAddress: `0x${string}`;
  title: string;
  description?: string;
  price: number;
  maxSupply: number;
  mintedCount: number;
  maxPerWallet?: number;
  imageSrc?: string;
  className?: string;
}

export const MintPanel = React.forwardRef<HTMLDivElement, MintPanelProps>(
  (
    {
      contractAddress,
      title,
      description,
      price,
      maxSupply,
      mintedCount,
      maxPerWallet = 3,
      imageSrc,
      className,
    },
    ref,
  ) => {
    const { isConnected } = useWallet();
    const { explorer } = useNetwork();
    const [quantity, setQuantity] = React.useState(1);
    const { mint, totalCost, canMint, txState, hash } = useMint({
      contractAddress,
      abi: defaultMintAbi,
      price: parseEther(String(price)),
      maxPerWallet,
    });
    const progress = Math.min((mintedCount / maxSupply) * 100, 100);

    return (
      <Card ref={ref} className={className}>
        <CardHeader className="grid gap-6 md:grid-cols-[260px,1fr] md:items-center">
          <div className="overflow-hidden rounded-[28px] border border-cast-border bg-gradient-to-br from-cast-primary/30 via-cast-darker to-cast-accent/20">
            {imageSrc ? (
              <img src={imageSrc} alt={title} className="aspect-square w-full object-cover" />
            ) : (
              <div className="flex aspect-square items-center justify-center bg-cast-grid text-lg font-semibold text-white/80">
                NFT Preview
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <CardTitle className="text-3xl">{title}</CardTitle>
              {description ? <CardDescription className="mt-3 max-w-2xl">{description}</CardDescription> : null}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Mint Progress</span>
                <span>
                  {mintedCount} / {maxSupply}
                </span>
              </div>
              <Progress.Root className="h-3 overflow-hidden rounded-full bg-white/10">
                <Progress.Indicator
                  className="h-full bg-gradient-to-r from-cast-primary to-cast-accent transition-all"
                  style={{ width: `${progress}%` }}
                />
              </Progress.Root>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 rounded-3xl border border-cast-border bg-white/[0.03] p-5 md:grid-cols-[1fr,auto] md:items-center">
            <div>
              <p className="text-sm text-slate-400">Quantity</p>
              <div className="mt-3 inline-flex items-center gap-3 rounded-2xl border border-cast-border bg-cast-darker p-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setQuantity((current) => Math.max(current - 1, 1))}
                  aria-label="Decrease quantity"
                  data-testid="mint-quantity-decrease"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-8 text-center text-lg font-semibold">{quantity}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setQuantity((current) => Math.min(current + 1, maxPerWallet))}
                  aria-label="Increase quantity"
                  data-testid="mint-quantity-increase"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="rounded-2xl border border-cast-border bg-cast-darker p-4 text-right">
              <p className="text-sm text-slate-400">Total Cost</p>
              <p className="mt-2 text-2xl font-semibold text-white">{price * quantity} ETH</p>
              <p className="mt-1 font-mono text-xs text-slate-500">{totalCost.toString()} wei</p>
            </div>
          </div>
          {isConnected ? (
            <Button
              fullWidth
              size="lg"
              loading={txState === 'pending'}
              disabled={!canMint && txState !== 'error'}
              onClick={() => void mint(quantity)}
              data-testid="mint-panel-submit"
            >
              {txState === 'pending'
                ? 'Minting...'
                : txState === 'success'
                  ? 'Minted!'
                  : txState === 'error'
                    ? 'Failed - Retry'
                    : `Mint ${quantity} NFT`}
            </Button>
          ) : (
            <ConnectWalletButton />
          )}
          <TxStatus hash={hash} state={txState} explorerUrl={explorer ?? undefined} onRetry={() => void mint(quantity)} />
        </CardContent>
      </Card>
    );
  },
);

MintPanel.displayName = 'MintPanel';

