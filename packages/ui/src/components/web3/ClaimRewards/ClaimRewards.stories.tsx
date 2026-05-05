import type { Meta, StoryObj } from '@storybook/react';
import { ClaimRewards } from './ClaimRewards';

const meta = {
  title: 'Web3/ClaimRewards',
  component: ClaimRewards,
  args: {
    contractAddress: '0x1111111111111111111111111111111111111111',
  },
} satisfies Meta<typeof ClaimRewards>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

