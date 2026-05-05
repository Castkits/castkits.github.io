'use client';

import * as React from 'react';
import { useNetwork, useWallet, useWalletContext } from '@castkit/core';
import { Badge } from '../../components/core/Badge/Badge';
import { Button } from '../../components/core/Button/Button';
import { Modal } from '../../components/core/Modal/Modal';

export const DefaultWalletModal = React.forwardRef<HTMLDivElement, Record<string, never>>((_, ref) => {
  const { modal, adapter } = useWalletContext();
  const { connect, disconnect, isConnected, isConnecting, formattedAddress, error } = useWallet();
  const { chainName } = useNetwork();

  if (!modal) {
    return null;
  }

  return (
    <Modal
      ref={ref}
      open={modal.isOpen}
      onOpenChange={(open) => (open ? modal.open() : modal.close())}
      title="Wallet Control"
      description="Use the default CastKit wallet modal for simple adapter-backed connection flows."
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isConnected ? 'success' : 'warning'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          <Badge>{adapter.name}</Badge>
          {chainName ? <Badge>{chainName}</Badge> : null}
        </div>
        <div className="rounded-2xl border border-cast-border bg-white/5 p-4">
          <p className="text-sm text-slate-400">Address</p>
          <p className="mt-1 font-mono text-sm text-white">{formattedAddress ?? 'No wallet connected'}</p>
        </div>
        {error ? <p className="text-sm text-rose-300">{error.message}</p> : null}
        <div className="flex gap-3">
          {isConnected ? (
            <Button variant="danger" onClick={() => void disconnect()} data-testid="wallet-modal-disconnect">
              Disconnect
            </Button>
          ) : (
            <Button
              onClick={() => void connect()}
              loading={isConnecting}
              data-testid="wallet-modal-connect"
            >
              Connect Wallet
            </Button>
          )}
          <Button variant="ghost" onClick={modal.close}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
});

DefaultWalletModal.displayName = 'DefaultWalletModal';
