import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the minimal shell and resolves game-state and ui', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Mine Sweeper' })).toBeTruthy();
    expect(screen.getByText('Resolved: @mine-sweeper/game-state')).toBeTruthy();
    expect(screen.getByText('Resolved: @mine-sweeper/ui')).toBeTruthy();
  });
});
