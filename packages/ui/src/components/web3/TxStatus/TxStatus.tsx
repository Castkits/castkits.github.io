'use client';

import * as React from 'react';
import { AlertTriangle, ArrowUpRight, CheckCircle2, Clock3 } from 'lucide-react';
import type { TxState } from '@castkit/core';
import { cn } from '../../../lib/cn';
import { Button } from '../../core/Button/Button';
import { Badge } from '../../core/Badge/Badge';

export interface TxStatusProps {
  hash: `0x${string}` | null;
  state: TxState;
  explorerUrl?: string;
  showHash?: boolean;
  onRetry?: () => void;
  className?: string;
}

const stateMeta: Record<TxState, { icon: React.ReactNode; badge: 'default' | 'success' | 'warning' | 'danger'; label: string }> =
  {
    idle: { icon: <Clock3 className="h-4 w-4" />, badge: 'default', label: 'Ready' },
    pending: { icon: <Clock3 className="h-4 w-4 animate-pulse" />, badge: 'warning', label: 'Pending' },
    success: { icon: <CheckCircle2 className="h-4 w-4" />, badge: 'success', label: 'Success' },
    error: { icon: <AlertTriangle className="h-4 w-4" />, badge: 'danger', label: 'Error' },
  };

function shortenHash(hash: `0x${string}`) {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

export const TxStatus = React.forwardRef<HTMLDivElement, TxStatusProps>(
  ({ hash, state, explorerUrl, showHash = true, onRetry, className }, ref) => {
    const meta = stateMeta[state];
    const href = hash && explorerUrl ? `${explorerUrl}/tx/${hash}` : null;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap items-center gap-3 rounded-2xl border border-cast-border bg-white/[0.03] p-4 text-sm text-slate-200 transition-all duration-200',
          className,
        )}
        data-testid="tx-status"
      >
        <Badge variant={meta.badge}>
          {meta.icon}
          {meta.label}
        </Badge>
        {showHash && hash ? (
          href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-cast-accent hover:text-white"
            >
              {shortenHash(hash)}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="font-mono text-xs text-slate-400">{shortenHash(hash)}</span>
          )
        ) : null}
        {state === 'error' && onRetry ? (
          <Button size="sm" variant="ghost" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </div>
    );
  },
);

TxStatus.displayName = 'TxStatus';

