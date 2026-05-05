import { render, screen } from '@testing-library/react';
import { NFTGallery } from './NFTGallery';
import { TestWrapper } from '../../../test/TestWrapper';

describe('NFTGallery', () => {
  it('renders NFTs from the configured service', async () => {
    render(
      <TestWrapper>
        <NFTGallery address="0x1111111111111111111111111111111111111111" />
      </TestWrapper>,
    );

    expect(await screen.findByText('CastKit Genesis')).toBeInTheDocument();
  });
});

