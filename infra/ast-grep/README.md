# @liry-k/infra-ast-grep

基于 [`@ast-grep/napi`](https://ast-grep.github.io/guide/api-usage/js-api.html) 的 AST 搜索与改写工具，提供 **JavaScript API** 与 **CLI** 两种调用方式。

## 安装

在 monorepo 根目录执行 `pnpm install` 后即可使用。

## CLI

```bash
pnpm --filter @liry-k/infra-ast-grep build
pnpm exec liry-sg find -l typescript -p 'function $NAME' apps/luna
```

### 子命令

| 命令      | 说明                                |
| --------- | ----------------------------------- |
| `find`    | 按 AST 模式搜索文件或目录           |
| `rewrite` | 按 AST 模式改写；加 `-U` 写回文件   |
| `parse`   | 解析单文件，可选附带模式匹配        |
| `kind`    | 查询语法节点 kind 名称对应的数值 id |

内置语言：`typescript`、`tsx`、`javascript`、`html`、`css`。

## JavaScript API

```ts
import {
  findInSource,
  findInFiles,
  rewriteInSource,
  rewriteInFiles,
  parseSource,
  resolveLang
} from '@liry-k/infra-ast-grep';

const lang = resolveLang('typescript');
const { matches } = findInSource({
  lang,
  source: 'export function foo() {}',
  pattern: 'function $NAME'
});

const rewritten = rewriteInSource({
  lang,
  source: 'function foo() { return 1; }',
  pattern: 'function $NAME($$$) { $$$BODY }',
  rewrite: 'const $NAME = ($$$) => { $$$BODY }'
});
```

## 与 `pnpm sg` 的关系

根目录的 `@ast-grep/cli`（`pnpm sg`）是官方命令行；本包基于 **NAPI** 在 Node.js 内嵌 ast-grep，适合脚本、CI 与程序化改写，无需 `spawn` 子进程。
