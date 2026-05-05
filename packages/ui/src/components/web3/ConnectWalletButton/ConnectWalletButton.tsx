'use client';

import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Avatar from '@radix-ui/react-avatar';
import { ChevronDown, LogOut, Wallet } from 'lucide-react';
import { useENS, useNetwork, useWallet, useWalletContext } from '@castkit/core';
import { cn } from '../../../lib/cn';
import { Badge } from '../../core/Badge/Badge';
import { Button, type ButtonProps } from '../../core/Button/Button';

export interface ConnectWalletButtonProps {
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  label?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const ConnectWalletButton = React.forwardRef<HTMLButtonElement, ConnectWalletButtonProps>(
  ({ variant = 'primary', size = 'md', label = 'Connect Wallet', onConnect, onDisconnect }, ref) => {
    const { modal } = useWalletContext();
    const { connect, disconnect, formattedAddress, isConnected, isConnecting } = useWallet();
    const { name, avatar } = useENS();
    const { chainName } = useNetwork();

    const handleConnect = async () => {
      if (modal) {
        modal.open();
        return;
      }

      await connect();
      onConnect?.();
    };

    const handleDisconnect = async () => {
      await disconnect();
      onDisconnect?.();
    };

    if (!isConnected) {
      return (
        <Button
          ref={ref}
          variant={variant}
          size={size}
          loading={isConnecting}
          leftIcon={<Wallet className="h-4 w-4" />}
          onClick={() => void handleConnect()}
          data-testid="connect-wallet"
          aria-label={label}
        >
          {label}
        </Button>
      );
    }

    return (
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button
            ref={ref}
            variant={variant}
            size={size}
            rightIcon={<ChevronDown className="h-4 w-4" />}
            data-testid="connect-wallet"
          >
            {name ?? formattedAddress}
          </Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="end"
            sideOffset={12}
            className={cn(
              'z-50 w-72 rounded-3xl border border-cast-border bg-cast-darker/95 p-4 text-white shadow-cast backdrop-blur-xl',
              'animate-fade-in',
            )}
          >
            <div className="flex items-center gap-3">
              <Avatar.Root className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-cast-border bg-white/5">
                {avatar ? <Avatar.Image src={avatar} alt={name ?? 'Wallet avatar'} className="h-full w-full" /> : null}
                <Avatar.Fallback className="text-sm font-semibold text-slate-300">
                  {(name ?? formattedAddress ?? 'W').slice(0, 2).toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>
              <div>
                <p className="font-medium">{name ?? 'Wallet Connected'}</p>
                <p className="font-mono text-xs text-slate-400">{formattedAddress}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="success">Connected</Badge>
              {chainName ? <Badge>{chainName}</Badge> : null}
            </div>
            <div className="mt-4">
              <Button
                variant="ghost"
                fullWidth
                leftIcon={<LogOut className="h-4 w-4" />}
                onClick={() => void handleDisconnect()}
                data-testid="disconnect-wallet"
              >
                Disconnect
              </Button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  },
);

ConnectWalletButton.displayName = 'ConnectWalletButton';

