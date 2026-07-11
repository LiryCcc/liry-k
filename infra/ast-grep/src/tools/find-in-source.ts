import { parse } from '@ast-grep/napi';

import { serializeMatch } from '../match/serialize-node.js';
import type { FindInSourceOptions, FindInSourceResult } from '../types.js';

/** 在单个源码字符串中按 AST 模式搜索。 */
const findInSource = (options: FindInSourceOptions): FindInSourceResult => {
  const root = parse(options.lang, options.source).root();
  const nodes = root.findAll(options.pattern);

  return {
    matches: nodes.map((node) => serializeMatch(node, 'anonymous'))
  };
};

export { findInSource };
