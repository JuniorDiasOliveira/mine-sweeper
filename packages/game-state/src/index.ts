import { CORE_PACKAGE_NAME } from '@mine-sweeper/core';

// Proof-of-resolution export for the workspace foundation task; remove once
// IMPLEMENT_GAME_STATE replaces it with the real observable store and hooks.
export const GAME_STATE_PACKAGE_NAME = '@mine-sweeper/game-state' as const;
export const GAME_STATE_CORE_DEPENDENCY = CORE_PACKAGE_NAME;
