import { describe, expect, it } from 'vitest';
import { CORE_PACKAGE_NAME } from './index';

describe('core public entry point', () => {
  it('exposes the package name for resolution checks', () => {
    expect(CORE_PACKAGE_NAME).toBe('@mine-sweeper/core');
  });
});
