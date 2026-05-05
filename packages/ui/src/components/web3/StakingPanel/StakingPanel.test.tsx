import { render, screen } from '@testing-library/react';
import { StakingPanel } from './StakingPanel';
import { TestWrapper } from '../../../test/TestWrapper';

describe('StakingPanel', () => {
  it('renders staking heading', () => {
    render(
      <TestWrapper>
        <StakingPanel
          stakingContract="0x1111111111111111111111111111111111111111"
          tokenContract="0x2222222222222222222222222222222222222222"
        />
      </TestWrapper>,
    );

    expect(screen.getByText('Staking Panel')).toBeInTheDocument();
  });
});

