import { GAME_STATE_PACKAGE_NAME } from '@mine-sweeper/game-state';
import { UI_PACKAGE_NAME } from '@mine-sweeper/ui';

// Minimal shell proving apps/web resolves the public entry points of
// game-state and ui; replaced by real composition in IMPLEMENT_WEB_COMPOSITION.
export function App() {
  return (
    <main>
      <h1>Mine Sweeper</h1>
      <p>Workspace foundation ready.</p>
      <p>Resolved: {GAME_STATE_PACKAGE_NAME}</p>
      <p>Resolved: {UI_PACKAGE_NAME}</p>
    </main>
  );
}
