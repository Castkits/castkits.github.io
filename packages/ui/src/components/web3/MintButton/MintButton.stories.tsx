import type { Meta, StoryObj } from '@storybook/react';
import { MintButton } from './MintButton';

const meta = {
  title: 'Web3/MintButton',
  component: MintButton,
  args: {
    contractAddress: '0x1111111111111111111111111111111111111111',
    price: 0.05,
  },
} satisfies Meta<typeof MintButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

