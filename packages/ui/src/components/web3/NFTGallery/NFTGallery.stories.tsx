import type { Meta, StoryObj } from '@storybook/react';
import { NFTGallery } from './NFTGallery';

const meta = {
  title: 'Web3/NFTGallery',
  component: NFTGallery,
  args: {
    address: '0x1111111111111111111111111111111111111111',
  },
} satisfies Meta<typeof NFTGallery>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

