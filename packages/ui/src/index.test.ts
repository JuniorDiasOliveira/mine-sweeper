import { describe, expect, it } from 'vitest';
import { UI_CORE_DEPENDENCY, UI_PACKAGE_NAME } from './index';

describe('ui public entry point', () => {
  it('exposes the package name for resolution checks', () => {
    expect(UI_PACKAGE_NAME).toBe('@mine-sweeper/ui');
  });

  it('resolves @mine-sweeper/core through the allowed dependency edge', () => {
    expect(UI_CORE_DEPENDENCY).toBe('@mine-sweeper/core');
  });
});
