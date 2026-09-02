# 仓库协作约定

面向在本仓库内改代码的自动化助手与人类协作者：先读本文与相关 `package.json` / `Cargo.toml`，再动手；若日后增加 `spec.md`，**以规格文档为需求准绳**，本文仅补充工程惯例。

## 仓库概览

- **包管理**：`pnpm` workspace monorepo；**Bazel**（`MODULE.bazel`、`tasks/`）编排 lint / test / build（npm、Rust、Java）。Node / Rust / JDK 仍由本机或 CI 工具链提供，Bazel 不下载这些运行时。
- **环境**：`node >= 24`、`pnpm >= 10`（见根目录 `readme.md`）；Bazel 由 `@bazel/bazelisk` 或系统 `bazelisk` 提供（见 `.bazelversion`）；Rust 由系统 `rustup` / `cargo` 管理；Java 由 Gradle toolchain 指定 JDK 21。
- **包命名**：见下文「npm 包命名」；代号权威列表见根目录 `readme.md` 中的「项目代号表」。
- **多语言**：Node.js / TypeScript（`apps/`、`packages/`、`infra/`、`demos/`）、Rust（`rust-packages/`、`apps/polaris/src-tauri/`）、Java（`mc-plugins/`）。更完整的环境说明见 `docs/development.md`。

## 技术栈与目录

| 技术栈               | 主要目录                                    | 说明                     |
| -------------------- | ------------------------------------------- | ------------------------ |
| TypeScript / Node.js | `apps/`、`packages/`、`infra/`、`demos/`    | 应用、库、基建、演示     |
| Rust                 | `rust-packages/`、`apps/polaris/src-tauri/` | 算法题包、Tauri 桌面后端 |
| Java                 | `mc-plugins/`                               | Paper / Minecraft 插件   |
| Protocol Buffers     | `infra/proto/`                              | `buf` 格式化 proto 定义  |

pnpm workspace 四区：

| 目录        | 放什么                                       |
| ----------- | -------------------------------------------- |
| `apps/`     | 可独立运行的应用 / 扩展 / Workers / CLI 工具 |
| `packages/` | 可被依赖的库与练习包                         |
| `infra/`    | 工程基建：共享配置、构建、协议、内部工具     |
| `demos/`    | 技术演示（含 SSR 示例）                      |

## 常用命令

### 根目录（全仓库）

| 命令                | 说明                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `pnpm install`      | 安装依赖；`postinstall` 会通过 Bazel 构建 npm 包                                         |
| `pnpm build`        | `bazel build //javascript:build`（按包输入/输出缓存，未改动包会跳过）                    |
| `pnpm test`         | `bazel test //tasks:all_test`（Vitest / Cargo / Gradle）                                 |
| `pnpm format`       | Prettier 格式化全仓库 + 各包自有 `format` 脚本（如 `infra/proto`）                       |
| `pnpm check-format` | 仅检查 Prettier 格式，不写入                                                             |
| `pnpm check:root`   | 并行执行 `check-format`、`check-spell`、`lint:style`                                     |
| `pnpm check-spell`  | cspell 拼写检查                                                                          |
| `pnpm lint:style`   | stylelint，范围 `apps/**/*.css`、`packages/**/*.css`、`infra/**/*.css`、`demos/**/*.css` |
| `pnpm pre-commit`   | **提交前完整检查**（等同 git pre-commit hook）                                           |
| `pnpm lint`         | 别名，指向 `pnpm pre-commit`                                                             |
| `pnpm lint:rust`    | `bazel test //tasks:rust_lint`                                                           |
| `pnpm lint:rustfmt` | `bazel test //tasks:rust_rustfmt`                                                        |
| `pnpm sg`           | ast-grep CLI（代码搜索与替换，见下文「ast-grep」）                                       |

`pnpm pre-commit` 依次执行：`check:root`（格式 / 拼写 / CSS 并行）→ `bazel test`（npm / Rust / Java lint targets）。

Bazel：**npm 构建**见各包 `BUILD.bazel` 与 `//javascript:build`（`tools/bazel/js_package.bzl`）；**lint / test / Rust / Java** 见 `tasks/BUILD.bazel` 与 `tools/bazel/run-in-workspace.sh`。新增带 `build` 脚本的包或调整 workspace 依赖后运行 `node tools/bazel/generate-js-builds.mjs`。

### 单包（TypeScript / Node.js）

```bash
# 构建
pnpm --filter @liry-k/luna build

# lint（多数包为 tsc + eslint）
pnpm --filter @liry-k/luna lint
```

各 TS 包常见脚本模式：

| 脚本        | 典型含义                            |
| ----------- | ----------------------------------- |
| `lint`      | 类型检查 + ESLint（或包内等价组合） |
| `lint:type` | `tsc -b`                            |
| `lint:code` | `eslint . --cache`                  |
| `build`     | 多数含 `lint:type`，再执行打包      |
| `dev`       | Vite / Wrangler 开发服务器          |

### 前端开发速查（Solid / React / Tauri）

#### SolidJS（Vite）

| 包                | 开发命令                            | 说明                          |
| ----------------- | ----------------------------------- | ----------------------------- |
| `@liry-k/luna`    | `pnpm --filter @liry-k/luna dev`    | 主 Solid 应用                 |
| `@liry-k/gomoku`  | `pnpm --filter @liry-k/gomoku dev`  | 五子棋 Solid 示例             |
| `@liry-k/polaris` | `pnpm --filter @liry-k/polaris dev` | 仅 Vite 前端（不含 Tauri 壳） |

预览构建产物：`pnpm --filter @liry-k/luna preview`。

#### React（Vite）

| 包                    | 开发命令                                | 说明                                      |
| --------------------- | --------------------------------------- | ----------------------------------------- |
| `@liry-k/adb-web-new` | `pnpm --filter @liry-k/adb-web-new dev` | ADB Web（新版）                           |
| `@liry-k/cv`          | `pnpm --filter @liry-k/cv dev`          | React PDF 简历                            |
| `adb-web`             | `pnpm --filter adb-web dev`             | ADB Web（旧版，包名无 `@liry-k/` 作用域） |

#### Tauri（Solid 前端 + Rust 后端）

| 命令                                        | 说明                               |
| ------------------------------------------- | ---------------------------------- |
| `pnpm --filter @liry-k/polaris tauri dev`   | 桌面应用完整开发（推荐）           |
| `pnpm --filter @liry-k/polaris tauri build` | 打包桌面应用                       |
| `pnpm --filter @liry-k/polaris dev`         | 仅跑 Web 前端，不启动 Tauri 运行时 |

Tauri 相关 Rust 检查见上文「Rust」小节中 polaris 封装命令。

#### 其它

| 包                         | 开发命令                                     | 说明               |
| -------------------------- | -------------------------------------------- | ------------------ |
| `@liry-k/liry-site-server` | `pnpm --filter @liry-k/liry-site-server dev` | Cloudflare Workers |
| `@liry-k/leetcode`         | `pnpm --filter @liry-k/leetcode test`        | Vitest 跑 TS 题解  |

### Rust

根目录 `.cargo/config.toml` 定义了别名：

| 命令                 | 等价 / 说明                                          |
| -------------------- | ---------------------------------------------------- |
| `cargo lint`         | `clippy --all-targets --all-features -- -D warnings` |
| `cargo lint-fix`     | clippy 自动修复                                      |
| `cargo format`       | `fmt --all`                                          |
| `cargo format-check` | `fmt --all --check`                                  |

`@liry-k/polaris` 额外封装：

```bash
pnpm --filter @liry-k/polaris lint:rust      # cd src-tauri && cargo lint
pnpm --filter @liry-k/polaris lint:rustfmt   # cd src-tauri && cargo format-check
pnpm --filter @liry-k/polaris format:rust    # cd src-tauri && cargo format
```

Workspace 成员：`rust-packages/leetcode`、`rust-packages/sirius`、`apps/polaris/src-tauri`。

### Java（Gradle）

```bash
./gradlew build          # 构建 mc-plugins
./gradlew test           # 运行测试
./gradlew dependencies   # 拉取 / 查看依赖
```

使用 Gradle Wrapper，无需单独安装 Gradle；JDK 21 由 toolchain 管理。

### Protocol Buffers

```bash
pnpm --filter @liry-k/proto format   # buf format -w ./protos
```

### ast-grep（代码搜索与替换）

根目录 `devDependencies` 含 `@ast-grep/cli`，通过 **`pnpm sg`** 调用（无需全局安装 `sg`）。程序化场景可使用 **`@liry-k/infra-ast-grep`**（`liry-sg` CLI + JS API，基于 `@ast-grep/napi`）。

**代码搜索**与**代码替换**场景下，**优先 ast-grep，而非 `grep` / `rg`**：前者按 AST 匹配语法结构，查准率更高，适合查找函数/类定义、`import` / `export`、按节点类型筛选等；后者仅做纯文本匹配，易在注释或字符串中误报，或因换行与格式差异漏报。

仍可用 `grep` / `rg` 的场景：配置文件字面量、日志、文档、以及不涉及语法结构的简单字符串搜索。

```bash
# 搜索：TypeScript 函数声明
pnpm sg run -p 'function $NAME($$$)' -l typescript apps/ packages/

# 搜索：来自特定模块的 import
pnpm sg run -p 'import $$$ from "$MODULE"' -l typescript apps/luna

# 替换：先不带 -U 预览匹配，确认后写回
pnpm sg run -p 'OLD' -r 'NEW' -l typescript packages/foo
pnpm sg run -p 'OLD' -r 'NEW' -l typescript packages/foo -U
```

常用选项：

| 选项                  | 说明                                                                   |
| --------------------- | ---------------------------------------------------------------------- |
| `-p <pattern>`        | AST 模式；`$VAR` 匹配单节点，`$$$` 匹配多节点                          |
| `-l <lang>`           | 语言（如 `typescript`、`tsx`、`rust`、`java`）；多语言仓库中应显式指定 |
| `-r <rewrite>`        | 替换模板，与 `-p` 配对使用                                             |
| `-U` / `--update-all` | 将替换写回文件；大范围改动前务必先预览                                 |
| `-i`                  | 交互式逐条确认替换                                                     |

模式语法与语言列表见 [ast-grep 文档](https://ast-grep.github.io/)。

## npm 包命名

- **作用域**：仓库内所有包的 `name` **必须**为 `@liry-k/...`。
- **业务/库存包**（对应 readme 中代号表的 `rigel`、`luna`、`astra` 等）：`name` **必须**为 **`@liry-k/<代号>`**，代号**仅限**该表内条目，**禁止**自造代号。
- **工具包**（共享 tsconfig、构建 CLI 等，不对应代号表）：`name` 为 **`@liry-k/<描述性名称>`**，**不必**出现在代号表中，但仍须在 `@liry-k/` 下。

## 包一览（当前）

### 应用（`apps/`）

| 路径                    | npm 名                     | 说明                                |
| ----------------------- | -------------------------- | ----------------------------------- |
| `apps/luna`             | `@liry-k/luna`             | Solid + Vite 前端应用               |
| `apps/polaris`          | `@liry-k/polaris`          | Tauri v2 桌面应用（Solid 前端）     |
| `apps/gomoku`           | `@liry-k/gomoku`           | Solid 五子棋示例                    |
| `apps/adb-web-new`      | `@liry-k/adb-web-new`      | ADB Web（React）                    |
| `apps/adb-web`          | `adb-web`                  | ADB Web 旧版（React，无作用域前缀） |
| `apps/liry-cv`          | `@liry-k/cv`               | React PDF 简历                      |
| `apps/liry-site-server` | `@liry-k/liry-site-server` | Cloudflare Workers + Hono           |
| `apps/page-qr`          | `@liry-k/page-qr`          | 浏览器扩展：页面 URL 二维码         |
| `apps/multi-downloader` | `@liry-k/multi-downloader` | 多源下载工具                        |

### 库 / 练习（`packages/`）

| 路径                  | npm 名               | 说明                             |
| --------------------- | -------------------- | -------------------------------- |
| `packages/rigel`      | `@liry-k/rigel`      | Lit Web Components 库            |
| `packages/astra`      | `@liry-k/astra`      | Solid UI 组件                    |
| `packages/stellar`    | `@liry-k/stellar`    | 共享类型 / 工具                  |
| `packages/ssr-server` | `@liry-k/ssr-server` | Hono + Vite SSR 服务端库         |
| `packages/leetcode`   | `@liry-k/leetcode`   | TypeScript 算法 / 练习（Vitest） |

### 基础设施（`infra/`）

| 路径                  | npm 名                   | 说明                 |
| --------------------- | ------------------------ | -------------------- |
| `infra/tsconfig`      | `@liry-k/tsconfig`       | 共享 TypeScript 配置 |
| `infra/build`         | `@liry-k/build`          | 构建 CLI / 打包辅助  |
| `infra/eslint-config` | `@liry-k/eslint-config`  | 共享 ESLint 配置     |
| `infra/core`          | `@liry-k/infra-core`     | 通用 TS 工具         |
| `infra/lc`            | `@liry-k/infra-lc`       | 解压等工具           |
| `infra/ast-grep`      | `@liry-k/infra-ast-grep` | ast-grep NAPI 工具   |
| `infra/proto`         | `@liry-k/proto`          | protobuf 定义与生成  |

### 演示（`demos/`）

| 路径               | npm 名       | 说明                   |
| ------------------ | ------------ | ---------------------- |
| `demos/r3f-d`      | `r3f-d`      | React Three Fiber demo |
| `demos/ssr-react`  | `ssr-react`  | React SSR 示例         |
| `demos/ssr-solid`  | `ssr-solid`  | Solid SSR 示例         |
| `demos/ssr-preact` | `ssr-preact` | Preact SSR 示例        |

### Rust / Java

| 路径                     | 说明                          |
| ------------------------ | ----------------------------- |
| `rust-packages/leetcode` | Rust 算法题实现               |
| `rust-packages/sirius`   | Rust HTTP 服务（Axum）        |
| `apps/polaris/src-tauri` | polaris Tauri 后端 crate      |
| `mc-plugins/vega`        | Paper 插件（`org.liry.vega`） |

## 模块导入与路径别名

- **优先别名，少用 `..`**：引用本包源码时，在 **`tsconfig` 的 `paths` 与构建工具（如 Vite `resolve.alias`）已共同声明**的前提下，**优先**使用这些别名，避免长串 `../`。
- **与配置一致**：别名须在类型检查与打包两侧都能解析；只使用**当前包**配置里已有的前缀，不凭空捏造路径。
- **跨包依赖**：引用其他 workspace 包时，使用其 **npm `name`**（如 `@liry-k/build`），不要用 `../../` 指向另一包的源码目录。

## 文件与目录命名

- **一律 kebab-case**：路径每一段仅使用 **小写字母**、数字与连字符 `-`（例如 `not-found-page`、`setup-i18n.ts`）。
- **禁止**文件名或目录名中出现 **大写字母**（`A`–`Z`）。
- **范围**：凡由本仓库**维护并提交**的源码、样式、脚本、文档、工作流配置等，均须遵守；**第三方目录**（如 `node_modules`）及机器生成且未手改的产物不在此列。
- **Rust 题解文件**：根目录下单题使用 `snake_case_<题号>.rs`（如 `two_sum_1.rs`）；Hot 100 等分组可放在子目录（如 `hot100/`），子模块内同样 `snake_case`。
- **Java 源文件**：类名 PascalCase，包名小写（如 `org.liry.vega`），路径与包名一致。

## CSS 类名与变量命名

- **CSS 类名一律 kebab-case**：`.css` 文件中所有类选择器、CSS Modules 中的类名，均使用小写字母与连字符 `-`，例如 `my-class-name`、`section-header`；**禁止**使用 camelCase（如 `myClassName`）或下划线分隔。
- **CSS 自定义属性（变量）亦用 kebab-case**：`--my-variable-name`、`--color-brand-foreground` 等。
- **例外**：来自第三方库或框架自带的类名/变量（如 Fluent UI、Tailwind 等）不受此限。
- **JS/TS 中访问 CSS Modules 类名**：使用 `styles['kebab-case-name']` 括号形式，而非 `styles.kebabCaseName`，以与 `noPropertyAccessFromIndexSignature` 约束对齐。

## TypeScript / JavaScript

### 工具链

- **格式化**：根目录 Prettier（`.prettierrc.json`），`pnpm format` / `pnpm check-format`。
- **Lint**：各包 `eslint.config.ts` 从 `@liry-k/eslint-config` 选用 preset（`NODE_LIB` / `WEB_LIB` / `ISOMORPHIC_LIB` / `SOLID_APP` / `REACT_APP` / `WORKER` / `LEETCODE`）；类型检查 `tsc -b`。
- **CSS Lint**：根目录 `pnpm lint:style`（stylelint）。
- **拼写**：根目录 `pnpm check-spell`（cspell）。

### 约束（与 ESLint / tsconfig 对齐）

- **禁止修改 tsconfig**：不得改动仓库内任何 `tsconfig*.json`（含 `infra/tsconfig` 与各包中的配置）。类型或编译问题应在**业务代码**中按现有严格选项解决；若确需调整编译策略，须由维护者单独决策，**不**作为常规助手任务。
- **禁止用注释压制检查代替修代码**：不得使用 `eslint-disable` / `eslint-disable-next-line` 等 ESLint 禁用注释，以及 `@ts-expect-error`、`@ts-ignore`、`@ts-nocheck` 等 TypeScript 忽略指令来「过关」；应修正类型、实现或合法 API 用法，消除根因。
- **禁止在非类型场景使用 `void` 运算符**：除 TypeScript **类型**中的 `void`（例如 `Promise<void>`、函数返回类型 `(): void`）外，**不得**书写 `void 表达式` 以丢弃值或规避告警。**不要**为此封装 `runPromise` 之类专用工具；在事件、副作用等场景**直接调用**异步函数即可（如 `foo()`、`(async () => { … })()`、`onMount(async () => { await … })`）。**不**为「暂时吞掉失败」而强行 `.catch` / `.then` 链；确需记录或恢复错误时再在业务处按需补充。
- **多行注释**：一段说明占多行时，**必须**使用以 **`/**`** 开头、以 **`*/`** 结尾的**块注释**，续行使用 `*` 前缀；**禁止**用连续多行 `//` 表达同一段多行说明。单行说明仍可用 `//`。
- **避免匿名 `export default`**：禁止直接 `export default function(…)` / `export default class` / `export default { … }` 等匿名形式；必须先声明具名 `const` / `function` / `class`，再单独 `export default <名称>`。
- **Zod**：**仅允许** `import { z } from 'zod/v4'`；禁止 `zod`、`zod/v4/...` 子路径等（见 `infra/eslint-config` 中 `no-restricted-imports`）。

### 外部输入与 Zod（运行时校验）

凡**在运行时由外部决定形状**、**编译器无法替你保证**的输入，须在**边界处**用 **Zod**（`parse` / `safeParse` 等）得到**已校验类型**后再进入业务逻辑；**禁止**仅靠 TypeScript 类型断言（如 `as`）或手写 `interface` 当作「已经合法」。

**须覆盖的典型来源**包括但不限于：

- **网络**：`fetch`、`XMLHttpRequest`、各类 HTTP 客户端返回的 **响应体**（JSON、表单等）。
- **跨文档消息**：`window.postMessage`、`MessageChannel`、`BroadcastChannel`；含**本页发送与接收**、**其它窗口/标签页/iframe/弹窗**发来的数据。
- **Worker**：`Worker` / `SharedWorker` 上 **`postMessage` 的收发载荷**（主线程 ↔ worker 两侧均视为边界，发送前与接收后都应与 schema 对齐）。
- **其它 IPC**：扩展、嵌入宿主、未来新增通道等，凡载荷结构不由本仓库单独编译产物决定的，同此要求。

**实践建议**：为每种协议定义**可复用的 `z` schema**（可集中在 `*.schema.ts` 等模块）；**发送前**可用同一 schema 校验后再 `postMessage`，**接收后**再解析，使类型定义与实际载荷**同源**于 schema，避免漂移。

## Rust

### 工具链

- **Lint**：`pnpm lint:rust`（Bazel `//tasks:rust_lint`）或 `cargo lint`（workspace 级 clippy，`-D warnings`）。
- **格式化**：`pnpm lint:rustfmt` 检查；`cargo format` 写入。`rust-packages/sirius` 使用 `rustfmt.toml`（`style_edition = "2024"`、`tab_spaces = 2`）。
- **编译**：根 `Cargo.toml` workspace；`.cargo/config.toml` 配置编译期 `-D warnings`，使警告视为错误。

### 约束

- **`lib.rs` 模块声明**：`pub mod …;` 须按**字母序**排列（`cargo fmt` / pre-commit 会校验）。
- **Workspace lints**（根 `Cargo.toml`）：Rust 警告 deny；Clippy 禁止 `unwrap_used`、`panic_in_result_fn`。
- **文档注释**：函数上方用 `/** … */` 块注释；**注释与函数之间不要空行**（否则 clippy `empty_line_after_doc_comments` 报错）。
- **题解组织**：单题可放 `src/` 根下；系列题（如 Hot 100）放子目录并在 `mod.rs` 中 `pub mod` 导出，再在 `lib.rs` 中 `pub mod hot100;`。
- **禁止用注释或 `#[allow(…)]` 绕过 lint**：与 TypeScript 侧相同，应修代码消除告警。

## Java

### 工具链

- **构建 / 测试**：`./gradlew build`、`./gradlew test`。
- **JDK**：21（根 `build.gradle.kts` 的 `JavaPluginExtension.toolchain`）。
- **依赖**：Paper API（`io.papermc.paper:paper-api`）；测试用 JUnit 5。

### 约束

- **包名**：`org.liry` 及其子包（如 `org.liry.vega`）。
- **插件入口**：继承 `JavaPlugin`，资源目录含 `plugin.yml`。
- **Gradle**：使用仓库内 Wrapper（`./gradlew`），勿假设全局 Gradle 版本。

## `@liry-k/luna`（前端）

### 技术栈

- **UI**：SolidJS，`vite-plugin-solid`。
- **路由**：`@tanstack/solid-router`，在 `src/routes.tsx` **手写路由表**（`createRootRoute` / `createRoute` / `addChildren`）；**不要用 `.map()` 动态生成子路由**，否则会削弱 path 字面量推断与 `Link` / `getRouteApi` 的类型。
- **校验**：路由 `validateSearch` 等可用 **Zod v4**（见上）；凡来自**外部边界**的载荷亦须用 Zod（见「外部输入与 Zod」）。
- **国际化**：`i18next` + `i18next-browser-languagedetector`；用 `@tanstack/store` 做 **桥接**（`language` + `revision`），在 `languageChanged` 时 `setState`，配合 `@tanstack/solid-store` 的 `useStore` 驱动 Solid 重渲染后再调用 `i18n.t()`。入口 `src/index.tsx` 先 `await init()`（`src/init.ts` 内 `setupI18n()`）再 `render`。

### 路径别名

- `@/*` → `apps/luna/src/*`
- `@@/*` → `apps/luna/*`（包根）

`vite.config.ts` 与 `tsconfig.app.json` 中已对齐上述别名；**业务代码优先** `import … from '@/…'`（或 `@@/`），**尽量不用** `../../../` 这类相对路径。导入扩展名与 `verbatimModuleSyntax` 对齐：业务代码中常见 `.js` 后缀指向 TS 源（由工具链解析）。

### 页面与样式

- 页面目录：`src/pages/<kebab-case>/`，通常 `index.tsx` + `index.module.css`。
- 共享 `tsconfig` 开启 `noPropertyAccessFromIndexSignature`：CSS Modules 宜用 **`styles['className']`** 等形式，避免 `styles.className` 触发类型问题。

## 质量与 Git

- **提交前**：根目录 `pnpm pre-commit`（Prettier、cspell、stylelint、各包 `lint`、Rust clippy + rustfmt）。
- **提交信息**：遵循 [Conventional Commits](https://www.conventionalcommits.org/)，由 `commitlint` 校验；**正文单行不超过 100 字符**（`body-max-line-length`），否则 hook 失败。
- **单包检查示例**：`pnpm --filter @liry-k/luna lint`、`pnpm --filter @liry-k/luna build`；改 Rust 题解后至少跑 `pnpm lint:rust` 与 `pnpm lint:rustfmt`。

## 协作原则（给助手）

- 遵守上文「文件与目录命名」：新建或重命名文件、文件夹时保持全小写 kebab-case（Rust/Java 文件名除外，见各语言小节），不出现大写字母（路径段）。
- 遵守上文「模块导入与路径别名」：在已有 paths / alias 下优先别名导入，少写 `..`；跨包用 workspace 包名。
- 遵守 TypeScript / Rust 约束：不改 tsconfig，不靠 disable / `@ts-*` / `#[allow(…)]` 掩盖问题；多行说明用 `/** … */`，不用多行 `//`；**非类型场景不写 `void` 运算符**。
- 新增 npm 包时：遵守上文「npm 包命名」与 `readme.md`「项目代号表」；应用放 `apps/`，库放 `packages/`，工程基建放 `infra/`，演示放 `demos/`；业务包勿用表外代号，工具包勿脱离 `@liry-k/`。
- 改动范围尽量贴合任务；不顺带大重构无关模块。
- 修改后在本包或根目录执行与改动相关的 **format / lint / build**，确认通过后再声称完成。
- 新增用户可见文案时：同步 `src/i18n/resources` 与 `translation-tree` 等类型定义，并走 `useTranslation` / `TypedT` 约定。
- 接入 **API、postMessage、Worker 消息** 等外部输入时：遵守「外部输入与 Zod」，在边界用 `zod/v4` 解析，勿用断言代替校验。
- **代码搜索与替换优先 ast-grep**：详见上文「ast-grep（代码搜索与替换）」；通过 **`pnpm sg`** 调用，在涉及语法结构的搜索与批量替换时优先于 `grep` / `rg`。若环境配置了 `tree-ast-grep-mcp`，亦可使用其 MCP 工具做结构化搜索。
