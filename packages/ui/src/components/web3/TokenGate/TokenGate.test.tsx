import { render, screen } from '@testing-library/react';
import { TokenGate } from './TokenGate';
import { TestWrapper } from '../../../test/TestWrapper';

describe('TokenGate', () => {
  it('renders children when access is granted', async () => {
    render(
      <TestWrapper>
        <TokenGate
          contractAddress="0x1111111111111111111111111111111111111111"
          fallback={<div>Denied</div>}
        >
          <div>Protected</div>
        </TokenGate>
      </TestWrapper>,
    );

    expect(await screen.findByText('Protected')).toBeInTheDocument();
  });
});

