# 仓库协作约定

面向在本仓库内改代码的自动化助手与人类协作者：先读本文与相关 `package.json`，再动手；若日后增加 `spec.md`，**以规格文档为需求准绳**，本文仅补充工程惯例。

## 仓库概览

- **包管理**：`pnpm` workspace monorepo；根目录脚本会做格式、拼写与各包 `lint`。
- **环境**：`node >= 24`、`pnpm >= 10`（见根目录 `readme.md`）。
- **包命名**：见下文「npm 包命名」；代号权威列表见根目录 `readme.md` 中的「项目代号表」。

## npm 包命名

- **作用域**：仓库内所有包的 `name` **必须**为 `@liry-k/...`。
- **业务/库存包**（对应 readme 中代号表的 `rigel`、`luna`、`astra` 等）：`name` **必须**为 **`@liry-k/<代号>`**，代号**仅限**该表内条目，**禁止**自造代号。
- **工具包**（共享 tsconfig、构建 CLI 等，不对应代号表）：`name` 为 **`@liry-k/<描述性名称>`**，**不必**出现在代号表中，但仍须在 `@liry-k/` 下。

## 包一览（当前）

| 路径                | 说明                                                |
| ------------------- | --------------------------------------------------- |
| `packages/luna`     | `@liry-k/luna`：Solid + Vite 前端应用               |
| `packages/rigel`    | `@liry-k/rigel`：基于 Lit 的库，构建走 `liry-build` |
| `packages/build`    | `@liry-k/build`：提供 `liry-build` CLI              |
| `packages/tsconfig` | `@liry-k/tsconfig`：共享 TypeScript 严格配置        |

## 模块导入与路径别名

- **优先别名，少用 `..`**：引用本包源码时，在 **`tsconfig` 的 `paths` 与构建工具（如 Vite `resolve.alias`）已共同声明**的前提下，**优先**使用这些别名，避免长串 `../`。
- **与配置一致**：别名须在类型检查与打包两侧都能解析；只使用**当前包**配置里已有的前缀，不凭空捏造路径。
- **跨包依赖**：引用其他 workspace 包时，使用其 **npm `name`**（如 `@liry-k/build`），不要用 `../../` 指向另一包的源码目录。

## 文件与目录命名

- **一律 kebab-case**：路径每一段仅使用 **小写字母**、数字与连字符 `-`（例如 `not-found-page`、`setup-i18n.ts`）。
- **禁止**文件名或目录名中出现 **大写字母**（`A`–`Z`）。
- **范围**：凡由本仓库**维护并提交**的源码、样式、脚本、文档、工作流配置等，均须遵守；**第三方目录**（如 `node_modules`）及机器生成且未手改的产物不在此列。

## `@liry-k/luna`（前端）

### 技术栈

- **UI**：SolidJS，`vite-plugin-solid`。
- **路由**：`@tanstack/solid-router`，在 `src/routes.tsx` **手写路由表**（`createRootRoute` / `createRoute` / `addChildren`）；**不要用 `.map()` 动态生成子路由**，否则会削弱 path 字面量推断与 `Link` / `getRouteApi` 的类型。
- **校验**：路由 `validateSearch` 等可用 **Zod v4**（见下）；凡来自**外部边界**的载荷亦须用 Zod（见「外部输入与 Zod」）。
- **国际化**：`i18next` + `i18next-browser-languagedetector`；用 `@tanstack/store` 做 **桥接**（`language` + `revision`），在 `languageChanged` 时 `setState`，配合 `@tanstack/solid-store` 的 `useStore` 驱动 Solid 重渲染后再调用 `i18n.t()`。入口 `src/index.tsx` 先 `await init()`（`src/init.ts` 内 `setupI18n()`）再 `render`。

### 路径别名

- `@/*` → `packages/luna/src/*`
- `@@/*` → `packages/luna/*`（包根）

`vite.config.ts` 与 `tsconfig.app.json` 中已对齐上述别名；**业务代码优先** `import … from '@/…'`（或 `@@/`），**尽量不用** `../../../` 这类相对路径。导入扩展名与 `verbatimModuleSyntax` 对齐：业务代码中常见 `.js` 后缀指向 TS 源（由工具链解析）。

### 页面与样式

- 页面目录：`src/pages/<kebab-case>/`，通常 `index.tsx` + `index.module.css`。
- 共享 `tsconfig` 开启 `noPropertyAccessFromIndexSignature`：CSS Modules 宜用 **`styles['className']`** 等形式，避免 `styles.className` 触发类型问题。

### Zod

- **仅允许** `import { z } from 'zod/v4'`；禁止 `zod`、`zod/v4/...` 子路径等（见 `packages/luna/eslint.config.ts` 中 `no-restricted-imports`）。

### 外部输入与 Zod（运行时校验）

凡**在运行时由外部决定形状**、**编译器无法替你保证**的输入，须在**边界处**用 **Zod**（`parse` / `safeParse` 等）得到**已校验类型**后再进入业务逻辑；**禁止**仅靠 TypeScript 类型断言（如 `as`）或手写 `interface` 当作「已经合法」。

**须覆盖的典型来源**包括但不限于：

- **网络**：`fetch`、`XMLHttpRequest`、各类 HTTP 客户端返回的 **响应体**（JSON、表单等）。
- **跨文档消息**：`window.postMessage`、`MessageChannel`、`BroadcastChannel`；含**本页发送与接收**、**其它窗口/标签页/iframe/弹窗**发来的数据。
- **Worker**：`Worker` / `SharedWorker` 上 **`postMessage` 的收发载荷**（主线程 ↔ worker 两侧均视为边界，发送前与接收后都应与 schema 对齐）。
- **其它 IPC**：扩展、嵌入宿主、未来新增通道等，凡载荷结构不由本仓库单独编译产物决定的，同此要求。

**实践建议**：为每种协议定义**可复用的 `z` schema**（可集中在 `*.schema.ts` 等模块）；**发送前**可用同一 schema 校验后再 `postMessage`，**接收后**再解析，使类型定义与实际载荷**同源**于 schema，避免漂移。

## 质量与 Git

- **提交前**：根目录 `pnpm pre-commit`（Prettier、cspell、**`pnpm lint:comment-style`** 校验各包注释风格、`pnpm -r lint`）。
- **提交信息**：遵循 [Conventional Commits](https://www.conventionalcommits.org/)，由 `commitlint` 校验；**正文单行不超过 100 字符**（`body-max-line-length`），否则 hook 失败。
- **单包检查示例**：`pnpm --filter @liry-k/luna lint`、`pnpm --filter @liry-k/luna build`。

## TypeScript、ESLint 与 tsconfig（约束）

- **禁止修改 tsconfig**：不得改动仓库内任何 `tsconfig*.json`（含 `packages/tsconfig` 与各包中的配置）。类型或编译问题应在**业务代码**中按现有严格选项解决；若确需调整编译策略，须由维护者单独决策，**不**作为常规助手任务。
- **禁止用注释压制检查代替修代码**：不得使用 `eslint-disable` / `eslint-disable-next-line` 等 ESLint 禁用注释，以及 `@ts-expect-error`、`@ts-ignore`、`@ts-nocheck` 等 TypeScript 忽略指令来「过关」；应修正类型、实现或合法 API 用法，消除根因。
- **多行注释**：一段说明占多行时，**必须**使用以 **`/**`** 开头、以 **`_/`** 结尾的**块注释**，续行使用 ` _ `前缀；**禁止**用连续多行`//`表达同一段多行说明。单行说明仍可用`//`。全仓库 `packages/\*` 由根目录 **`pnpm lint:comment-style`**（已纳入 `pre-commit`）对源码统一校验该条。

## 协作原则（给助手）

- 遵守上文「文件与目录命名」：新建或重命名文件、文件夹时保持全小写 kebab-case，不出现大写字母。
- 遵守上文「模块导入与路径别名」：在已有 paths / alias 下优先别名导入，少写 `..`；跨包用 workspace 包名。
- 遵守上文「TypeScript、ESLint 与 tsconfig（约束）」：不改 tsconfig，不靠 disable / `@ts-*` 注释掩盖问题；多行说明用 `/** … */`，不用多行 `//`。
- 新增 npm 包时：遵守上文「npm 包命名」与 `readme.md`「项目代号表」；业务包勿用表外代号，工具包勿脱离 `@liry-k/`。
- 改动范围尽量贴合任务；不顺带大重构无关模块。
- 修改后在本包或根目录执行与改动相关的 **lint / typecheck / build**，确认通过后再声称完成（含根目录 **`pnpm lint:comment-style`** 所覆盖的各包源码）。
- 新增用户可见文案时：同步 `src/i18n/resources` 与 `translation-tree` 等类型定义，并走 `useTranslation` / `TypedT` 约定。
- 接入 **API、postMessage、Worker 消息** 等外部输入时：遵守「外部输入与 Zod」，在边界用 `zod/v4` 解析，勿用断言代替校验。
