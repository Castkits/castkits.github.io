import type { Meta, StoryObj } from '@storybook/react';
import { TxStatus } from './TxStatus';

const meta = {
  title: 'Web3/TxStatus',
  component: TxStatus,
  args: {
    state: 'pending',
    hash: '0x1111111111111111111111111111111111111111111111111111111111111111',
    explorerUrl: 'https://etherscan.io',
  },
} satisfies Meta<typeof TxStatus>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Pending: Story = {};
export const Success: Story = { args: { state: 'success' } };

