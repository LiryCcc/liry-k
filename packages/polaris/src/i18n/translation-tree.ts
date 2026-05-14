import { enResources } from '@/i18n/resources/en.js';
import { zhResources } from '@/i18n/resources/zh.js';
import type { TOptions } from 'i18next';

export type { LocaleCode, TranslationTree } from '@/i18n/translation-tree-shape.js';

/**
 * 从 `{{name}}` 片段递归收集占位符名。
 */
export type InterpolationKeys<S extends string> = S extends `${string}{{${infer K}}}${infer R}`
  ? K | InterpolationKeys<R>
  : never;

export type InterpolationParamsForString<S extends string> = [InterpolationKeys<S>] extends [never]
  ? Record<string, never>
  : { [K in InterpolationKeys<S>]: string };

/**
 * 同一 key 下中英文文案里出现的 `{{…}}` 占位符名的并集，再映射为插值参数字段。
 */
export type InterpolationParamsForLocalePair<S1 extends string, S2 extends string> = [
  InterpolationKeys<S1> | InterpolationKeys<S2>
] extends [never]
  ? Record<string, never>
  : { [K in InterpolationKeys<S1> | InterpolationKeys<S2>]: string };

type LeafAtPath<T, Path extends string> = Path extends `${infer Head}.${infer Tail}`
  ? Head extends keyof T
    ? LeafAtPath<T[Head], Tail>
    : never
  : Path extends keyof T
    ? T[Path]
    : never;

/**
 * 从文案树推导所有合法点号路径（如 app.greeting），与 `enResources` 结构一致。
 */
export type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends string ? `${K}` : T[K] extends object ? `${K}.${NestedKeyOf<T[K]>}` : never;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<typeof enResources>;

/**
 * `t(key)` 的第二参：由同一 key 在**中英文**文案里出现的 `{{…}}` 取并集后推导插值字段；无占位符时为可选 `TOptions`。
 */
export type TranslationTArgs<K extends TranslationKey> = [
  LeafAtPath<typeof enResources, K>,
  LeafAtPath<typeof zhResources, K>
] extends [infer E extends string, infer Z extends string]
  ? [InterpolationKeys<E> | InterpolationKeys<Z>] extends [never]
    ? [options?: TOptions]
    : [options: InterpolationParamsForLocalePair<E, Z> & TOptions]
  : [options?: TOptions];
