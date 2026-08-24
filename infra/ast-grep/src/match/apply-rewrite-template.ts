import type { SgNode } from '@ast-grep/napi';

const MULTI_METAVAR = /\$\$\$([A-Z_][A-Z0-9_]*)/g;
const SINGLE_METAVAR = /\$([A-Z_][A-Z0-9_]*)/g;

/** 将 ast-grep 改写模板中的元变量替换为匹配节点文本。 */
const applyRewriteTemplate = (template: string, node: SgNode): string => {
  const withMulti = template.replaceAll(MULTI_METAVAR, (_match, name: string) => {
    return node
      .getMultipleMatches(name)
      .map((item) => item.text())
      .join('');
  });

  return withMulti.replaceAll(SINGLE_METAVAR, (_match, name: string) => {
    return node.getMatch(name)?.text() ?? '';
  });
};

export { applyRewriteTemplate };
