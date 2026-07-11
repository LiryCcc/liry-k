import { kind, parse } from '@ast-grep/napi';

import { serializeMatch } from '../match/serialize-node.js';
import type { ParseSourceOptions, ParseSourceResult, ResolveKindOptions, ResolveKindResult } from '../types.js';

/** 解析源码并可选地按模式列出匹配节点。 */
const parseSource = (options: ParseSourceOptions): ParseSourceResult => {
  const root = parse(options.lang, options.source).root();
  const pattern = options.pattern?.trim();

  if (!pattern) {
    return {
      rootKind: String(root.kind()),
      matchCount: 0,
      matches: []
    };
  }

  const nodes = root.findAll(pattern);

  return {
    rootKind: String(root.kind()),
    matchCount: nodes.length,
    matches: nodes.map((node) => serializeMatch(node, 'anonymous'))
  };
};

/** 将语法节点种类名称解析为 ast-grep 内部 kind id。 */
const resolveKind = (options: ResolveKindOptions): ResolveKindResult => {
  return {
    kindName: options.kindName,
    kindId: kind(options.lang, options.kindName as never)
  };
};

export { parseSource, resolveKind };
