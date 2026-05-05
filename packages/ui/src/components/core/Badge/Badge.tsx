'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em]',
  {
    variants: {
      variant: {
        default: 'border-cast-border bg-cast-dark/70 text-white',
        success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
        warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
        danger: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  ),
);

Badge.displayName = 'Badge';

