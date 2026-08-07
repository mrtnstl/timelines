import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthStatus } from '../features/auth';

describe('AuthStatus component', () => {
  it("renders 'signed out' if isAuthenticated or user is false/falsy", () => {
    render(<AuthStatus />);
    expect(screen.getByText('Signed out')).toBeInTheDocument();
  });

  it('increments the counter when button is clicked', async () => {
    render(<AuthStatus />);
    const button = screen.getByRole('button', { name: /Sign In/i });
    expect(button).toHaveTextContent('Sign In 0');
    await userEvent.click(button);
    expect(button).toHaveTextContent('Sign In 1');
  });
});
