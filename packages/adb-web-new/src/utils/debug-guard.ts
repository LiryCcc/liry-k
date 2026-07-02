let unlocked = false;

export const unlockDebug = (): void => {
  unlocked = true;
};

export const isDebugUnlocked = (): boolean => unlocked;
