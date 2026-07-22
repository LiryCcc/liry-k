export const supportedLocales = ['en', 'zh'] as const;

export type Locale = (typeof supportedLocales)[number];

export const LOCALE_STORAGE_KEY = 'page-qr-locale';

export const isLocale = (value: string | null | undefined): value is Locale => value === 'en' || value === 'zh';
