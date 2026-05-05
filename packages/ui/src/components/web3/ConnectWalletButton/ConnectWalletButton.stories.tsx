import type { Meta, StoryObj } from '@storybook/react';
import { ConnectWalletButton } from './ConnectWalletButton';

const meta = {
  title: 'Web3/ConnectWalletButton',
  component: ConnectWalletButton,
} satisfies Meta<typeof ConnectWalletButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

