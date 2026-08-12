import { describe, expect, it } from 'vitest';
import { GAME_STATE_CORE_DEPENDENCY, GAME_STATE_PACKAGE_NAME } from './index';

describe('game-state public entry point', () => {
  it('exposes the package name for resolution checks', () => {
    expect(GAME_STATE_PACKAGE_NAME).toBe('@mine-sweeper/game-state');
  });

  it('resolves @mine-sweeper/core through the allowed dependency edge', () => {
    expect(GAME_STATE_CORE_DEPENDENCY).toBe('@mine-sweeper/core');
  });
});
