import { render, screen } from '@testing-library/react';
import { MintPanel } from './MintPanel';
import { TestWrapper } from '../../../test/TestWrapper';

describe('MintPanel', () => {
  it('renders mint panel content', () => {
    render(
      <TestWrapper>
        <MintPanel
          contractAddress="0x1111111111111111111111111111111111111111"
          title="Genesis Mint"
          price={0.05}
          maxSupply={5000}
          mintedCount={1000}
        />
      </TestWrapper>,
    );

    expect(screen.getByText('Genesis Mint')).toBeInTheDocument();
  });
});

