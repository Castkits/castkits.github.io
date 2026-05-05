import { render, screen } from '@testing-library/react';
import { ConnectWalletButton } from './ConnectWalletButton';
import { TestWrapper } from '../../../test/TestWrapper';

describe('ConnectWalletButton', () => {
  it('renders connected identity', async () => {
    render(
      <TestWrapper>
        <ConnectWalletButton />
      </TestWrapper>,
    );

    expect(await screen.findByText('caster.eth')).toBeInTheDocument();
  });
});

