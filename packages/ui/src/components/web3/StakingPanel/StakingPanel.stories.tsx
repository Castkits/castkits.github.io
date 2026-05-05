import type { Meta, StoryObj } from '@storybook/react';
import { StakingPanel } from './StakingPanel';

const meta = {
  title: 'Web3/StakingPanel',
  component: StakingPanel,
  args: {
    stakingContract: '0x1111111111111111111111111111111111111111',
    tokenContract: '0x2222222222222222222222222222222222222222',
  },
} satisfies Meta<typeof StakingPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
