import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Mint Now</Button>);
    expect(screen.getByRole('button', { name: 'Mint Now' })).toBeInTheDocument();
  });
});

