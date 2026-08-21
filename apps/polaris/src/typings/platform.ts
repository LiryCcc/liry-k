import type { platform } from '@tauri-apps/plugin-os';

export type PolarisPlatform = ReturnType<typeof platform> | 'web';
