import { findInFiles as napiFindInFiles } from '@ast-grep/napi';

import { serializeMatch } from '../match/serialize-node.js';
import type { FindInFilesOptions, FindInFilesResult } from '../types.js';

/** 在多个文件或目录中按 AST 模式搜索。 */
const findInFiles = async (options: FindInFilesOptions): Promise<FindInFilesResult> => {
  const matches = [] as ReturnType<typeof serializeMatch>[];

  const config = {
    paths: options.paths,
    matcher: {
      rule: {
        pattern: options.pattern
      }
    },
    ...(options.languageGlobs ? { languageGlobs: options.languageGlobs } : {})
  };

  const fileCount = await napiFindInFiles(options.lang, config, (error, nodes) => {
    if (error) {
      throw error;
    }

    if (nodes.length === 0) {
      return;
    }

    const first = nodes[0];
    if (!first) {
      return;
    }

    const file = first.getRoot().filename();
    for (const node of nodes) {
      matches.push(serializeMatch(node, file));
    }
  });

  return {
    fileCount,
    matches
  };
};

export { findInFiles };
