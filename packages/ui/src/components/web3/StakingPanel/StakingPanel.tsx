'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { useNetwork, useTransaction } from '@castkit/core';
import { Button } from '../../core/Button/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../core/Card/Card';
import { ClaimRewards } from '../ClaimRewards/ClaimRewards';
import { TxStatus } from '../TxStatus/TxStatus';

export interface StakingPanelProps {
  stakingContract: `0x${string}`;
  tokenContract: `0x${string}`;
  apy?: number;
  lockPeriod?: string;
  className?: string;
}

export const StakingPanel = React.forwardRef<HTMLDivElement, StakingPanelProps>(
  ({ stakingContract, tokenContract, apy = 18.5, lockPeriod = '30 days', className }, ref) => {
    const { explorer } = useNetwork();
    const transaction = useTransaction();
    const [amount, setAmount] = React.useState('100');

    return (
      <Card ref={ref} className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cast-accent" />
            Staking Panel
          </CardTitle>
          <CardDescription>
            Stake the token contract {tokenContract} against {stakingContract} with a lock period of {lockPeriod}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-cast-border bg-white/[0.03] p-4">
              <p className="text-sm text-slate-400">Projected APY</p>
              <p className="mt-2 text-2xl font-semibold text-white">{apy}%</p>
            </div>
            <div className="rounded-2xl border border-cast-border bg-white/[0.03] p-4">
              <p className="text-sm text-slate-400">Lock Period</p>
              <p className="mt-2 text-2xl font-semibold text-white">{lockPeriod}</p>
            </div>
          </div>
          <label className="block space-y-2">
            <span className="text-sm text-slate-400">Stake Amount</span>
            <input
              className="w-full rounded-2xl border border-cast-border bg-cast-darker px-4 py-3 text-white outline-none transition focus:border-cast-accent"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              inputMode="decimal"
              aria-label="Stake amount"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <Button
              loading={transaction.state === 'pending'}
              onClick={() =>
                void transaction.send({
                  to: stakingContract,
                  data: '0x',
                })
              }
            >
              Stake {amount}
            </Button>
            <Button variant="ghost">Unstake</Button>
          </div>
          <TxStatus hash={transaction.hash} state={transaction.state} explorerUrl={explorer ?? undefined} />
          <ClaimRewards contractAddress={stakingContract} />
        </CardContent>
      </Card>
    );
  },
);

StakingPanel.displayName = 'StakingPanel';

