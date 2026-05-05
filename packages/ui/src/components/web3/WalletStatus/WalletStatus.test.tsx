import { render, screen } from '@testing-library/react';
import { WalletStatus } from './WalletStatus';
import { TestWrapper } from '../../../test/TestWrapper';

describe('WalletStatus', () => {
  it('renders connected wallet info', async () => {
    render(
      <TestWrapper>
        <WalletStatus />
      </TestWrapper>,
    );

    expect(await screen.findByText('caster.eth')).toBeInTheDocument();
  });
});

