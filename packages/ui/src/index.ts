import { CORE_PACKAGE_NAME } from '@mine-sweeper/core';

// Proof-of-resolution export for the workspace foundation task; remove once
// IMPLEMENT_GAME_BOARD_UI replaces it with real presentational components.
export const UI_PACKAGE_NAME = '@mine-sweeper/ui' as const;
export const UI_CORE_DEPENDENCY = CORE_PACKAGE_NAME;
