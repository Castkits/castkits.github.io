'use client';

import * as React from 'react';
import { useCastKitConfigContext, type NFTMetadata } from '@castkit/core';
import { Card } from '../../core/Card/Card';
import { Spinner } from '../../core/Spinner/Spinner';

export interface NFTGalleryProps {
  address: `0x${string}`;
  contractAddress?: `0x${string}`;
  columns?: 2 | 3 | 4;
  onSelect?: (nft: NFTMetadata) => void;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
}

const columnClassMap = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
} as const;

export const NFTGallery = React.forwardRef<HTMLDivElement, NFTGalleryProps>(
  (
    {
      address,
      contractAddress,
      columns = 3,
      onSelect,
      emptyState = <p className="text-sm text-slate-400">No NFTs found for this wallet.</p>,
      loadingState,
    },
    ref,
  ) => {
    const { services } = useCastKitConfigContext();
    const [nfts, setNfts] = React.useState<NFTMetadata[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
      if (!services?.getNFTs) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      void services
        .getNFTs({ address, contractAddress })
        .then((result) => setNfts(result))
        .finally(() => setIsLoading(false));
    }, [address, contractAddress, services]);

    if (isLoading) {
      return (
        <div ref={ref} className="flex min-h-40 items-center justify-center rounded-3xl border border-cast-border bg-white/[0.03]">
          {loadingState ?? <Spinner size="lg" />}
        </div>
      );
    }

    if (!nfts.length) {
      return (
        <Card ref={ref} className="rounded-3xl p-8 text-center" variant="subtle">
          {emptyState}
        </Card>
      );
    }

    return (
      <div ref={ref} className={`grid gap-4 ${columnClassMap[columns]} grid-cols-1`}>
        {nfts.map((nft) => (
          <button
            key={`${nft.contractAddress}-${nft.id}`}
            type="button"
            className="overflow-hidden rounded-3xl border border-cast-border bg-cast-darker text-left transition hover:-translate-y-1 hover:border-cast-accent"
            onClick={() => onSelect?.(nft)}
          >
            <div className="aspect-square bg-gradient-to-br from-cast-primary/20 via-cast-darker to-cast-accent/20">
              {nft.image ? <img src={nft.image} alt={nft.name} className="h-full w-full object-cover" /> : null}
            </div>
            <div className="space-y-2 p-4">
              <p className="font-medium text-white">{nft.name}</p>
              {nft.description ? <p className="text-sm text-slate-400">{nft.description}</p> : null}
            </div>
          </button>
        ))}
      </div>
    );
  },
);

NFTGallery.displayName = 'NFTGallery';

