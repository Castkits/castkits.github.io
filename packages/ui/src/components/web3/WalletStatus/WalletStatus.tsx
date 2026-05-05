'use client';

import * as React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import { formatEther } from 'viem';
import { useENS, useNetwork, useWallet, useWalletContext } from '@castkit/core';
import { Badge } from '../../core/Badge/Badge';
import { Card } from '../../core/Card/Card';

export interface WalletStatusProps {
  showBalance?: boolean;
  showNetwork?: boolean;
  showAvatar?: boolean;
  compact?: boolean;
}

export const WalletStatus = React.forwardRef<HTMLDivElement, WalletStatusProps>(
  ({ showBalance = true, showNetwork = true, showAvatar = true, compact = false }, ref) => {
    const { adapter } = useWalletContext();
    const { address, formattedAddress, isConnected } = useWallet();
    const { name, avatar } = useENS();
    const { chainName } = useNetwork();
    const [balance, setBalance] = React.useState<string | null>(null);

    React.useEffect(() => {
      if (!address || !showBalance) {
        setBalance(null);
        return;
      }

      void adapter.getBalance(address).then((value) => {
        setBalance(formatEther(value));
      });
    }, [adapter, address, showBalance]);

    if (!isConnected) {
      return (
        <Card
          ref={ref}
          className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3"
          variant="subtle"
        >
          <p className="text-sm text-slate-400">Wallet disconnected</p>
          <Badge variant="warning">Offline</Badge>
        </Card>
      );
    }

    return (
      <Card
        ref={ref}
        className={compact ? 'flex items-center gap-3 rounded-2xl px-4 py-3' : 'rounded-3xl p-5'}
        variant="subtle"
      >
        <div className="flex items-center gap-3">
          {showAvatar ? (
            <Avatar.Root className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-cast-border bg-white/5">
              {avatar ? <Avatar.Image src={avatar} alt={name ?? 'ENS avatar'} className="h-full w-full" /> : null}
              <Avatar.Fallback className="font-semibold text-slate-300">
                {(name ?? formattedAddress ?? 'W').slice(0, 2).toUpperCase()}
              </Avatar.Fallback>
            </Avatar.Root>
          ) : null}
          <div>
            <p className="font-medium text-white">{name ?? formattedAddress}</p>
            {address ? <p className="font-mono text-xs text-slate-400">{address}</p> : null}
          </div>
        </div>
        <div className={compact ? 'ml-auto flex gap-2' : 'mt-4 flex flex-wrap gap-2'}>
          {showNetwork && chainName ? <Badge>{chainName}</Badge> : null}
          {showBalance && balance ? <Badge variant="success">{Number(balance).toFixed(3)} ETH</Badge> : null}
        </div>
      </Card>
    );
  },
);

WalletStatus.displayName = 'WalletStatus';

