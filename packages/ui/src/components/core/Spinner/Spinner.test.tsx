import { render } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders a hidden indicator', () => {
    render(<Spinner />);
    expect(document.querySelector('span[aria-hidden="true"]')).toBeInTheDocument();
  });
});
