import type { Meta, StoryObj } from '@storybook/react';
import { WalletStatus } from './WalletStatus';

const meta = {
  title: 'Web3/WalletStatus',
  component: WalletStatus,
} satisfies Meta<typeof WalletStatus>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
