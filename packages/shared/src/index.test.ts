import { describe, expect, it } from 'vitest';
import { SHARED_PACKAGE_NAME } from './index';

describe('shared public entry point', () => {
  it('exposes the package name for resolution checks', () => {
    expect(SHARED_PACKAGE_NAME).toBe('@mine-sweeper/shared');
  });
});
