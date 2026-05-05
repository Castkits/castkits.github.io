import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';

const meta = {
  title: 'Core/Card',
  component: Card,
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Genesis Mint</CardTitle>
        <CardDescription>Reusable card container for Web3 surfaces.</CardDescription>
      </CardHeader>
      <CardContent>Body content</CardContent>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

