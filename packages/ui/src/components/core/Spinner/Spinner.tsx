'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';
import { cn } from '../../../lib/cn';

const spinnerVariants = cva('inline-flex items-center justify-center text-cast-accent', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(spinnerVariants({ size }), className)}
      aria-hidden="true"
      {...props}
    >
      <LoaderCircle className="h-full w-full animate-spin" />
    </span>
  ),
);

Spinner.displayName = 'Spinner';

