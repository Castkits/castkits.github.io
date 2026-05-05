import { render, screen } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders title when open', () => {
    render(
      <Modal open onOpenChange={() => undefined} title="Wallet" description="Connect">
        <div>Body</div>
      </Modal>,
    );

    expect(screen.getByText('Wallet')).toBeInTheDocument();
  });
});

