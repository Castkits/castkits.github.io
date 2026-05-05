'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/cn';
import { Spinner } from '../Spinner/Spinner';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl border font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cast-accent disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'border-transparent bg-gradient-to-r from-cast-primary to-cast-accent text-white shadow-cast hover:translate-y-[-1px]',
        secondary:
          'border-cast-border bg-white/5 text-white hover:border-cast-primary/60 hover:bg-white/10',
        ghost: 'border-transparent bg-transparent text-slate-300 hover:bg-white/5 hover:text-white',
        danger: 'border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-sm',
        lg: 'h-12 px-5 text-base',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth,
      children,
      disabled,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner size={size === 'lg' ? 'md' : 'sm'} /> : leftIcon}
      <span>{children}</span>
      {!loading ? rightIcon : null}
    </button>
  ),
);

Button.displayName = 'Button';

