import type { Meta, StoryObj } from '@storybook/react';
import { MintPanel } from './MintPanel';

const meta = {
  title: 'Web3/MintPanel',
  component: MintPanel,
  args: {
    contractAddress: '0x1111111111111111111111111111111111111111',
    title: 'Genesis Mint',
    description: 'Full mint flow surface with progress and transaction feedback.',
    price: 0.05,
    maxSupply: 5000,
    mintedCount: 1280,
  },
} satisfies Meta<typeof MintPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

