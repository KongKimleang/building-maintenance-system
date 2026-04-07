import { render, screen } from '@testing-library/react';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';

test('renders login screen heading', () => {
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );

  const heading = screen.getByText(/sign in to continue/i);
  expect(heading).toBeInTheDocument();
});
