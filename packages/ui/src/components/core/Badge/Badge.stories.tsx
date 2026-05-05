import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Core/Badge',
  component: Badge,
  args: {
    children: 'Connected',
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Success: Story = { args: { variant: 'success' } };

