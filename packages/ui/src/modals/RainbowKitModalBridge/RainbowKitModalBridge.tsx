'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../../components/core/Modal/Modal';
import { Button } from '../../components/core/Button/Button';
import { useWalletContext } from '@castkit/core';

export const RainbowKitModalBridge = React.forwardRef<HTMLDivElement, Record<string, never>>((_, ref) => {
  const { modal } = useWalletContext();

  if (!modal) {
    return null;
  }

  return (
    <Modal
      ref={ref}
      open={modal.isOpen}
      onOpenChange={(open) => (open ? modal.open() : modal.close())}
      title="RainbowKit Bridge"
      description="Attach your own RainbowKit modal controller here when you need a branded wallet picker."
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            This bridge keeps the provider contract stable, but expects host apps to wire RainbowKit
            externally.
          </p>
        </div>
        <Button variant="secondary" onClick={modal.close}>
          Dismiss
        </Button>
      </div>
    </Modal>
  );
});

RainbowKitModalBridge.displayName = 'RainbowKitModalBridge';

