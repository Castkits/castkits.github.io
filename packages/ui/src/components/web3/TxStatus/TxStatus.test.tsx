import { render, screen } from '@testing-library/react';
import { TxStatus } from './TxStatus';

describe('TxStatus', () => {
  it('renders success state', () => {
    render(
      <TxStatus
        state="success"
        hash="0x1111111111111111111111111111111111111111111111111111111111111111"
      />,
    );

    expect(screen.getByText('Success')).toBeInTheDocument();
  });
});

