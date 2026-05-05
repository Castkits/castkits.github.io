'use client';

import * as React from 'react';
import { useCastKitConfigContext, useWallet } from '@castkit/core';
import type { TokenGateType } from '@castkit/core';
import { Spinner } from '../../core/Spinner/Spinner';

export interface TokenGateProps {
  contractAddress: `0x${string}`;
  minBalance?: number;
  tokenType?: TokenGateType;
  tokenId?: number;
  fallback: React.ReactNode;
  children: React.ReactNode;
}

export const TokenGate = React.forwardRef<HTMLDivElement, TokenGateProps>(
  ({ contractAddress, minBalance, tokenType = 'ERC721', tokenId, fallback, children }, ref) => {
    const { services } = useCastKitConfigContext();
    const { address } = useWallet();
    const [hasAccess, setHasAccess] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
      if (!address || !services?.hasTokenAccess) {
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      void services
        .hasTokenAccess({
          address,
          contractAddress,
          minBalance,
          tokenType,
          tokenId,
        })
        .then((result) => setHasAccess(result))
        .finally(() => setIsLoading(false));
    }, [address, contractAddress, minBalance, services, tokenId, tokenType]);

    if (isLoading) {
      return (
        <div ref={ref} className="flex min-h-28 items-center justify-center rounded-3xl border border-cast-border bg-white/[0.03]">
          <Spinner />
        </div>
      );
    }

    return <div ref={ref}>{hasAccess ? children : fallback}</div>;
  },
);

TokenGate.displayName = 'TokenGate';

