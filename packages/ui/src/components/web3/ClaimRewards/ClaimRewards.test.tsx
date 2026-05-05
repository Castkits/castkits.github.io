import { render, screen } from '@testing-library/react';
import { ClaimRewards } from './ClaimRewards';
import { TestWrapper } from '../../../test/TestWrapper';

describe('ClaimRewards', () => {
  it('renders claim button', () => {
    render(
      <TestWrapper>
        <ClaimRewards contractAddress="0x1111111111111111111111111111111111111111" />
      </TestWrapper>,
    );

    expect(screen.getByRole('button', { name: /Claim TOKEN/i })).toBeInTheDocument();
  });
});

