import { render, screen } from '@testing-library/react';
import { MintButton } from './MintButton';
import { TestWrapper } from '../../../test/TestWrapper';

describe('MintButton', () => {
  it('renders default mint label', () => {
    render(
      <TestWrapper>
        <MintButton contractAddress="0x1111111111111111111111111111111111111111" price={0.05} />
      </TestWrapper>,
    );

    expect(screen.getByRole('button', { name: /Mint \(0.05 ETH\)/i })).toBeInTheDocument();
  });
});

