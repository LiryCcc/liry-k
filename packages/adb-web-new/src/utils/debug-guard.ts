import { Store } from '@tanstack/react-store';

type DebugState = {
  unlocked: boolean;
};

export const debugStore = new Store<DebugState>({
  unlocked: false
});

export const unlockDebug = (): void => {
  debugStore.setState(() => ({ unlocked: true }));
};

export const isDebugUnlocked = (): boolean => debugStore.state.unlocked;
