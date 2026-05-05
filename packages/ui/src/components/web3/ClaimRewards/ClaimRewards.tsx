'use client';

import * as React from 'react';
import { Gift } from 'lucide-react';
import { useNetwork, useTransaction } from '@castkit/core';
import { Button } from '../../core/Button/Button';
import { TxStatus } from '../TxStatus/TxStatus';

export interface ClaimRewardsProps {
  contractAddress: `0x${string}`;
  tokenSymbol?: string;
  onClaim?: (hash: `0x${string}`) => void;
}

export const ClaimRewards = React.forwardRef<HTMLDivElement, ClaimRewardsProps>(
  ({ contractAddress, tokenSymbol = 'TOKEN', onClaim }, ref) => {
    const { explorer } = useNetwork();
    const transaction = useTransaction();

    React.useEffect(() => {
      if (transaction.state === 'success' && transaction.hash) {
        onClaim?.(transaction.hash);
      }
    }, [onClaim, transaction.hash, transaction.state]);

    return (
      <div ref={ref} className="space-y-3">
        <Button
          variant="secondary"
          leftIcon={<Gift className="h-4 w-4" />}
          loading={transaction.state === 'pending'}
          onClick={() =>
            void transaction.send({
              to: contractAddress,
              data: '0x',
            })
          }
        >
          Claim {tokenSymbol}
        </Button>
        <TxStatus hash={transaction.hash} state={transaction.state} explorerUrl={explorer ?? undefined} />
      </div>
    );
  },
);

ClaimRewards.displayName = 'ClaimRewards';

