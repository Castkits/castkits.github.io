import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders text', () => {
    render(<Badge>Connected</Badge>);
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });
});

