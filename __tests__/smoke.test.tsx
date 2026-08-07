import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('smoke', () => {
  it('renders the home page without crashing', () => {
    render(<Home />);
    expect(screen.getByText(/app\/page\.tsx/i)).toBeInTheDocument();
  });
});
