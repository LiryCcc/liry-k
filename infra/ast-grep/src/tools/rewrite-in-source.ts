import { parse } from '@ast-grep/napi';

import { applyRewriteTemplate } from '../match/apply-rewrite-template.js';
import type { RewriteInSourceOptions, RewriteInSourceResult } from '../types.js';

/** 在单个源码字符串中按 AST 模式改写。 */
const rewriteInSource = (options: RewriteInSourceOptions): RewriteInSourceResult => {
  const ast = parse(options.lang, options.source);
  const root = ast.root();
  const nodes = root.findAll(options.pattern);

  if (nodes.length === 0) {
    return {
      source: options.source,
      changed: false,
      matchCount: 0
    };
  }

  const sorted = [...nodes].sort((left, right) => right.range().start.index - left.range().start.index);

  const edits = sorted.map((node) => node.replace(applyRewriteTemplate(options.rewrite, node)));

  const anchor = sorted[0];
  if (!anchor) {
    return {
      source: options.source,
      changed: false,
      matchCount: 0
    };
  }

  const nextSource = anchor.commitEdits(edits);

  return {
    source: nextSource,
    changed: nextSource !== options.source,
    matchCount: nodes.length
  };
};

export { rewriteInSource };
