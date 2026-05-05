import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders content', () => {
    render(<Card>Panel</Card>);
    expect(screen.getByText('Panel')).toBeInTheDocument();
  });
});

