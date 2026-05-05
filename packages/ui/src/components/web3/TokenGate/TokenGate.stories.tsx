import type { Meta, StoryObj } from '@storybook/react';
import { TokenGate } from './TokenGate';

const meta = {
  title: 'Web3/TokenGate',
  component: TokenGate,
  args: {
    contractAddress: '0x1111111111111111111111111111111111111111',
    fallback: <div>Members only</div>,
    children: <div>Exclusive content</div>,
  },
} satisfies Meta<typeof TokenGate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

