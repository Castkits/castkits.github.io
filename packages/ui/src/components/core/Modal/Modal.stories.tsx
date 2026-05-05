import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';

const meta = {
  title: 'Core/Modal',
  component: Modal,
  render: () => (
    <Modal open onOpenChange={() => undefined} title="Wallet Control" description="Preview modal content">
      <div className="text-sm text-slate-300">Modal body</div>
    </Modal>
  ),
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

