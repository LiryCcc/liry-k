import type { SgNode } from '@ast-grep/napi';

type SerializedRange = {
  start: { line: number; column: number; index: number };
  end: { line: number; column: number; index: number };
};

type SerializedMatch = {
  text: string;
  kind: string;
  range: SerializedRange;
  file: string;
  lines: string;
};

/** 将 SgNode 匹配结果序列化为可 JSON 化的结构。 */
const serializeMatch = (node: SgNode, file: string): SerializedMatch => {
  const range = node.range();
  const startLine = range.start.line;
  const endLine = range.end.line;
  const root = node.getRoot();
  const source = root.root().text();
  const lineSlice = source
    .split('\n')
    .slice(startLine, endLine + 1)
    .join('\n');

  return {
    text: node.text(),
    kind: String(node.kind()),
    range: {
      start: {
        line: range.start.line,
        column: range.start.column,
        index: range.start.index
      },
      end: {
        line: range.end.line,
        column: range.end.column,
        index: range.end.index
      }
    },
    file,
    lines: lineSlice
  };
};

export { serializeMatch };
export type { SerializedMatch, SerializedRange };
